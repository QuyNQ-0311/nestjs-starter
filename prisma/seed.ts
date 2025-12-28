import { seedPermissions } from './seed/permissions.seed';
import { seedRoles } from './seed/roles.seed';
import { PLATFORM } from './seed/seed.constants';
import { seedUsers } from './seed/users.seed';

import 'dotenv/config';
import { prisma } from '../src/database/prisma/prisma';

async function main() {
  // Platform (nếu bạn có bảng platform)
  const platform = await prisma.authServicePlatform.upsert({
    where: { code: PLATFORM.code },
    update: { name: PLATFORM.name },
    create: PLATFORM,
  });

  await seedPermissions(prisma);
  await seedRoles(prisma, platform.id);
  const admin = await seedUsers(prisma, platform.id);

  console.log('Seed done.');
  console.log(`Admin: ${admin.adminEmail} / ${admin.adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
