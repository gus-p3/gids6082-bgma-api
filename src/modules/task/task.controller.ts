import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

/**
 * Todas las rutas de tareas requieren autenticación (AuthGuard).
 * El servicio filtra las tareas por user_id del token,
 * por lo que cada usuario solo puede ver/modificar sus propias tareas.
 */
@Controller('api/task')
@ApiTags('Tareas')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  /** Obtener todas las tareas del usuario en sesión. */
  @Get()
  public async getTask(@Req() request: any): Promise<Task[]> {
    const user = request['user'];
    return await this.taskSvc.getTasks(user.id);
  }

  /** Obtener una tarea por ID (solo si pertenece al usuario en sesión). */
  @Get(':id')
  @HttpCode(200)
  public async getTaskById(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<Task> {
    const user = request['user'];
    const task = await this.taskSvc.getTaskById(id, user.id);

    if (!task) {
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    return task;
  }

  /** Crear una nueva tarea para el usuario en sesión. */
  @Post()
  @ApiOperation({ summary: 'Crear una tarea para el usuario autenticado' })
  public async insertTask(@Req() request: any, @Body() task: CreateTaskDto): Promise<Task> {
    const user = request['user'];
    const result = await this.taskSvc.insertTask(task, user.id);

    if (!result) {
      throw new HttpException('Tarea no registrada', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
  }

  /** Actualizar una tarea (solo si pertenece al usuario en sesión). */
  @Put(':id')
  public async updateTask(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
  ): Promise<Task> {
    const user = request['user'];
    return await this.taskSvc.updateTask(id, user.id, task);
  }

  /**
   * Eliminar una tarea.
   * - Un 'user' puede eliminar solo sus propias tareas (el servicio filtra por user_id).
   * - Un 'admin' puede eliminar cualquier tarea (se pasa 0 para ignorar el filtro de usuario).
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  public async deleteTask(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<boolean> {
    try {
      const user = request['user'];
      // Los administradores pueden eliminar cualquier tarea (user_id=0 ignora el filtro)
      const ownerId = user.role === Role.ADMIN ? 0 : user.id;
      await this.taskSvc.deleteTask(id, ownerId);
    } catch (error) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}