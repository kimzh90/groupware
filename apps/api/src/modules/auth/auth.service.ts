import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, ipAddress?: string, userAgent?: string) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    // Log successful login
    await this.auditService.createLog({
      userId: user.id,
      action: 'LOGIN',
      ipAddress,
      userAgent,
    });

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: "1h" }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: "7d" }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) throw new UnauthorizedException();

      const newPayload = { email: user.email, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: "1h" }),
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
