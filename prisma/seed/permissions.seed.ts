import type { PrismaClient } from '@prisma/client';
import { PERMISSIONS } from './seed.constants';

export async function seedPermissions(prisma: PrismaClient) {
  for (const p of PERMISSIONS) {
    await prisma.authServicePermission.upsert({
      where: { code: p.code },
      update: { name: p.name, description: p.description, isActive: true },
      create: { code: p.code, name: p.name, description: p.description, isActive: true },
    });
  }
}
