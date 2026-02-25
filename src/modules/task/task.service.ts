import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {

  constructor(@Inject('PG_CONNECTION') private db: any) { }

  private tasks: any[] = [];

  async getTasks() {
    const query = 'SELECT * FROM tasks';
    const result = await this.db.query(query);
    return result.rows;
  }

  async getTaskById(id: number): Promise<Task> {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await this.db.query(query, [id]);

    if (result == undefined) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return result.rows[0];
  }

  async insertTask(task: CreateTaskDto): Promise<Task> {
    //Agregar el query
    const sql = `INSERT INTO tasks (name, description, priority, user_id) VALUES ('${task.name}', '${task.description}', ${task.priority}, ${task.user_id}) RETURNING *`;
    const result = await this.db.query(sql);

    const insertid = result.rows[0].id;

    const row = await this.getTaskById(insertid);
    return row;
  }

  async updateTask(id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    console.log("Tarea encontrada:", taskUpdate);

    task.name = taskUpdate.name ? taskUpdate.name : task.name;
    task.description = taskUpdate.description ? taskUpdate.description : task.description;
    task.priority = taskUpdate.priority !== undefined ? taskUpdate.priority : task.priority;

    //Convertir el objeto a un set
    //{name: 'abc', description: 'desc'}
    // name = '', description = 'desc'"

    // const sets = Object.keys(taskUpdate).map(key => `${key} = '${taskUpdate[key]}'`).join(', ');

    // const sql = `UPDATE tasks SET ${sets} WHERE id = ${id} RETURNING *`;
    // const result = await this.db.query(sql);
    // return result.rows[0];

    return task;

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
