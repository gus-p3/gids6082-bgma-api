import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../services/prisma.service';
import { pgProvider } from '../../common/providers/pg.provider';
import { UtilService } from '../../services/util.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, pgProvider[0], UtilService],
})
export class UserModule {}
