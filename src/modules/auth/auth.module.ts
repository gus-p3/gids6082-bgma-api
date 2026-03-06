import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma.serive';
import { pgProvider } from '../../common/providers/pg.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, pgProvider[0]],
})
export class AuthModule {}
