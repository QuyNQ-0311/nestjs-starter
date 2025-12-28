import { PrismaService } from '../../database/prisma/prisma.service';

export abstract class BaseRepository {
  constructor(protected prisma: PrismaService) {}
}
