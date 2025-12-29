import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DEFAULT_ADMIN, USERS } from './seed.constants';

export async function seedUsers(prisma: PrismaClient, platformId: number) {
  const seededUsers: Array<{ email: string; password: string; role: string }> = [];

  for (const userData of USERS) {
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = await prisma.authServiceUser.upsert({
      where: { platformId_email: { platformId, email: userData.email } },
      update: {
        passwordHash,
        isActive: true,
        phone: userData.phone,
        avatar: userData.avatar,
      },
      create: {
        platformId,
        email: userData.email,
        passwordHash,
        phone: userData.phone,
        avatar: userData.avatar,
        isActive: true,
      },
    });

    const role = await prisma.authServiceRole.findUniqueOrThrow({
      where: { platformId_code: { platformId, code: userData.roleCode } },
      select: { id: true },
    });

    await prisma.authServiceUserRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    });

    seededUsers.push({
      email: userData.email,
      password: userData.password,
      role: userData.roleCode,
    });
  }

  return {
    adminEmail: DEFAULT_ADMIN.email,
    adminPassword: DEFAULT_ADMIN.password,
    users: seededUsers,
  };
}
