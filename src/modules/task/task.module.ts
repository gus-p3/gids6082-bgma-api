import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { pgProvider } from '../../common/providers/pg.provider';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, pgProvider[0]],
})
export class TaskModule { }
