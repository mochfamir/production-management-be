import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperatorService {
  constructor(private readonly prisma: PrismaService) {}

  async getOperators() {
    const totalOperators = await this.prisma.user.count({
      where: { role: 'OPERATOR' },
    });
    const operators = await this.prisma.user.findMany({
      where: { role: 'OPERATOR' },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      data: operators,
      total: totalOperators,
    };
  }
}
