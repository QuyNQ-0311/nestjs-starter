import type { PrismaClient } from '@prisma/client';
import { ROLES } from './seed.constants';

export async function seedRoles(prisma: PrismaClient, platformId: number) {
  for (const r of ROLES) {
    const role = await prisma.authServiceRole.upsert({
      where: { platformId_code: { platformId, code: r.code } },
      update: { name: r.name, isActive: true },
      create: { platformId, code: r.code, name: r.name, isActive: true },
    });

    // idempotent: reset mapping
    await prisma.authServiceRolePermission.deleteMany({
      where: { roleId: role.id },
    });

    if (!r.permissions.length) {
      continue;
    }

    const perms = await prisma.authServicePermission.findMany({
      where: { code: { in: r.permissions as unknown as string[] } },
      select: { id: true },
    });

    await prisma.authServiceRolePermission.createMany({
      data: perms.map((p) => ({ roleId: role.id, permissionId: p.id })),
      skipDuplicates: true,
    });
  }
}
