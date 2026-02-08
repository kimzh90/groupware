import { Controller, Post, Body, UnauthorizedException, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("login")
  async login(@Body() body: any, @Req() req: Request) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(user, req.ip, req.headers['user-agent']);
  }

  @Post("refresh")
  async refresh(@Body("refresh_token") refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
