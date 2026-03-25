import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { pgProvider } from '../../common/providers/pg.provider';
import { PrismaService } from '../../services/prisma.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UtilService } from '../../services/util.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, pgProvider[0], AuthGuard, UtilService],
})
export class TaskModule { }
