import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    // Keep Supabase not paused
    const data = await this.prisma.user.count();
    console.log(data);
    return 'Hello World!';
  }
}
