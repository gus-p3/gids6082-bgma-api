import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { request } from 'http';

@Controller('api/task')
@ApiTags("Tareas")
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  @Get()
  public async getTask(@Req() request: any): Promise<Task[]> {
    const user = request['user'];
    return await this.taskSvc.getTasks(user.id);
  }

  @Get(':id')
  @HttpCode(200)
  public async getTaskById(@Req() request: any, @Param("id", ParseIntPipe) id: number): Promise<Task> {
    const user = request['user'];
    const task = await this.taskSvc.getTaskById(id, user.id);

    if (task == undefined) {
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    return await this.taskSvc.getTaskById(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Insert a task in the db' })
  public async insertTask(@Req() request: any, @Body() task: CreateTaskDto): Promise<Task> {
    const user = request['user'];
    const result = await this.taskSvc.insertTask(task, user.id)

    if (result == undefined)
      throw new HttpException("Tarea no registrada", HttpStatus.INTERNAL_SERVER_ERROR)
    return result;
  }

  @Put(":id")
  public async updateTask(@Req() request: any, @Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto): Promise<Task> {
    const user = request['user'];
    return await this.taskSvc.updateTask(id, user.id, task);
  }

  @Delete(':id')
  public async deleteTask(@Req() request: any, @Param("id", ParseIntPipe) id: number): Promise<boolean> {
    try {
      const user = request['user'];
      const result = await this.taskSvc.deleteTask(id, user.id);
    } catch (error) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);

    }
    return true;
  }
}