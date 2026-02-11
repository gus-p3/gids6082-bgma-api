import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {

  private tasks: any[] = [];

  getTasks() {
    return this.tasks;
  }

  getTaskById(id: number): any {
    var task = this.tasks.find(task => task.id === id);
    return task;
  }

  insertTask(task: CreateTaskDto): CreateTaskDto {
    const id = this.tasks.length + 1;
    this.tasks.push({...task, id });


    return this.tasks[id];
  }

  updateTask(id: number, task: any): any {
    const taskUpdate = this.tasks.map(t => {
      if (t.id === id) {
        if (task.name) t.name = task.name;
        if (task.description) t.description = task.description;
        if (task.priority) t.priority = task.priority;

        return t;
      }
      return t;
    });

    return taskUpdate;
  }

  deleteTask(id: number): string {
    const initialLength = this.tasks.length;

    this.tasks = this.tasks.filter(task => task.id !== id);

    if (this.tasks.length < initialLength) {
      return "Tarea eliminada correctamente";
    } else {
      return "Tarea no encontrada";
    }
  }
}
