import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../../prisma.serive';

@Injectable()
export class TaskService {

  constructor(@Inject('PG_CONNECTION') private db: any, private prisma: PrismaService) { }

  private tasks: any[] = [];

  async getTasks() {
    const tasks = await this.prisma.task.findMany();
    return tasks;
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (task == undefined) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return task;
  }

  async insertTask(task: CreateTaskDto): Promise<Task> {
    //Agregar el query
    const newTask = await this.prisma.task.create({ data: task });

    return newTask;
  }

  async updateTask(id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.update({ where: { id }, data: taskUpdate });

    return task;
  }

  async deleteTask(id: number): Promise<boolean> {
  const deletedTask = await this.prisma.task.delete({ where: { id } });

  return deletedTask ? true : false;
  }
}