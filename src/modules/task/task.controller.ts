import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  @Get()
  public async getTask(): Promise<Task[]> {
    return await this.taskSvc.getTasks();
  }

  @Get(':id')
  @HttpCode(200)
  public async getTaskById(@Param("id", ParseIntPipe) id: number): Promise<Task> {
    const task = await this.taskSvc.getTaskById(id);
    console.log("Resultado:", task);

    if (task == undefined) {
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    return await this.taskSvc.getTaskById(id);
  }

  @Post()
  public insertTask(@Body() task: CreateTaskDto) {
    const result = this.taskSvc.insertTask(task)

    if (result == undefined)
      throw new HttpException("Tarea no registrada", HttpStatus.INTERNAL_SERVER_ERROR)
    return result;
  }
  
  @Put(":id")
  public updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto) {
    return this.taskSvc.updateTask(id, task);
  }

  @Delete(':id')
  public deleteTask(@Param("id", ParseIntPipe) id: number) {
    return this.taskSvc.deleteTask(id);
  }
}
