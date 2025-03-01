import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperatorService {
  constructor(private readonly prisma: PrismaService) {}

  async getOperators() {
    const operators = await this.prisma.user.findMany({
      where: { role: 'OPERATOR' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return operators;
  }
}
