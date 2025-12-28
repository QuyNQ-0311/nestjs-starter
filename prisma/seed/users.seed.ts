import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DEFAULT_ADMIN } from './seed.constants';

export async function seedUsers(prisma: PrismaClient, platformId: number) {
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

  const admin = await prisma.authServiceUser.upsert({
    where: { platformId_email: { platformId, email: DEFAULT_ADMIN.email } },
    update: {
      passwordHash,
      isActive: true,
      phone: DEFAULT_ADMIN.phone,
      avatar: DEFAULT_ADMIN.avatar,
    },
    create: {
      platformId,
      email: DEFAULT_ADMIN.email,
      passwordHash,
      phone: DEFAULT_ADMIN.phone,
      avatar: DEFAULT_ADMIN.avatar,
      isActive: true,
    },
  });

  const role = await prisma.authServiceRole.findUniqueOrThrow({
    where: { platformId_code: { platformId, code: DEFAULT_ADMIN.roleCode } },
    select: { id: true },
  });

  await prisma.authServiceUserRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: role.id } },
    update: {},
    create: { userId: admin.id, roleId: role.id },
  });

  return {
    adminEmail: DEFAULT_ADMIN.email,
    adminPassword: DEFAULT_ADMIN.password,
  };
}
