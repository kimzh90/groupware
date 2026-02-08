import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Create a default SUPER_ADMIN user
    const admin = await prisma.user.upsert({
        where: { email: 'admin' },
        update: {
            password: hashedPassword,
        },
        create: {
            email: 'admin',
            password: hashedPassword,
            name: '최고관리자',
            employeeId: 'ADMIN001',
            position: '대표이사',
            role: Role.SUPER_ADMIN,
        },
    });

    console.log('Seed data created:');
    console.log(`- Admin account: admin / admin`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
