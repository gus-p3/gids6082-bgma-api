import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../../services/prisma.service';


@Injectable()
export class TaskService {

  constructor(@Inject('PG_CONNECTION') private db: any, private prisma: PrismaService) { }

  private tasks: any[] = [];

  async getTasks(user_id: number): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        user_id
      }
    });
    return tasks;
  }

  async getTaskById(id: number, user_id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id, user_id },
    });

    if (task == undefined) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return task;
  }

  async insertTask(task: CreateTaskDto, user_id: number): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: {
        ...task,
        user_id
      }
    });

    return newTask;
  }

  async updateTask(id: number, user_id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.update({ where: { id, user_id }, data: taskUpdate });

    return task;
  }

  async deleteTask(id: number, user_id:number): Promise<boolean> {
    const deletedTask = await this.prisma.task.delete({ where: { id, user_id } });

    return deletedTask ? true : false;
  }
}