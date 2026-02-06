import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('api/task')
export class TaskController {
  constructor(private taskSvc: TaskService) {}

  @Get()
  public getTask(): string {
    return this.taskSvc.getTasks();
  }
}
