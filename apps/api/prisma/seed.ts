import { PrismaClient, Role, BoardType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('admin', 10);
    const userPassword = await bcrypt.hash('user', 10);

    // ========== 부서 생성 ==========
    const deptHQ = await prisma.department.upsert({
        where: { code: 'HQ' },
        update: {},
        create: { name: '본사', code: 'HQ' },
    });

    const deptMgmt = await prisma.department.upsert({
        where: { code: 'MGMT' },
        update: {},
        create: { name: '경영지원팀', code: 'MGMT', parentId: deptHQ.id },
    });

    const deptDev = await prisma.department.upsert({
        where: { code: 'DEV' },
        update: {},
        create: { name: '개발팀', code: 'DEV', parentId: deptHQ.id },
    });

    const deptSales = await prisma.department.upsert({
        where: { code: 'SALES' },
        update: {},
        create: { name: '영업팀', code: 'SALES', parentId: deptHQ.id },
    });

    // ========== 사용자 생성 ==========
    // 최고관리자
    const admin = await prisma.user.upsert({
        where: { email: 'admin' },
        update: { password: adminPassword },
        create: {
            email: 'admin',
            password: adminPassword,
            name: '최고관리자',
            employeeId: 'ADMIN001',
            position: '대표이사',
            role: Role.SUPER_ADMIN,
            departmentId: deptHQ.id,
        },
    });

    // 일반 사용자
    const user = await prisma.user.upsert({
        where: { email: 'user' },
        update: { password: userPassword },
        create: {
            email: 'user',
            password: userPassword,
            name: '홍길동',
            employeeId: 'USER001',
            position: '사원',
            role: Role.USER,
            departmentId: deptDev.id,
        },
    });

    // ========== 게시판 생성 ==========
    await prisma.board.upsert({
        where: { id: 'board-notice' },
        update: {},
        create: {
            id: 'board-notice',
            name: '공지사항',
            type: BoardType.NOTICE,
        },
    });

    await prisma.board.upsert({
        where: { id: 'board-general' },
        update: {},
        create: {
            id: 'board-general',
            name: '자유게시판',
            type: BoardType.GENERAL,
        },
    });

    await prisma.board.upsert({
        where: { id: 'board-dept' },
        update: {},
        create: {
            id: 'board-dept',
            name: '부서게시판',
            type: BoardType.DEPARTMENT,
        },
    });

    console.log('========== 시드 데이터 생성 완료 ==========');
    console.log(`- 관리자 계정: admin / admin`);
    console.log(`- 사용자 계정: user / user`);
    console.log(`- 부서: 본사, 경영지원팀, 개발팀, 영업팀`);
    console.log(`- 게시판: 공지사항, 자유게시판, 부서게시판`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
