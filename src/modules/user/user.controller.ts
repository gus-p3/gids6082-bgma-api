import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entitie';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/user')
@ApiTags('Users')
export class UserController {
  constructor(private userSvc: UserService) { }

  /**
   * Listar todos los usuarios — solo ADMIN.
   */
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public async getUser(): Promise<User[]> {
    try {
      return await this.userSvc.getUsers();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la lista de usuarios');
    }
  }

  /**
   * Obtener un usuario por ID — cualquier usuario autenticado.
   * (Útil para que el propio usuario vea su perfil desde la app móvil.)
   */
  @Get(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      const user = await this.userSvc.getUserById(id);

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Ocurrió un error al buscar el usuario ${id}`);
    }
  }

  /**
   * Crear un nuevo usuario — ruta pública (registro).
   * El rol 'user' se asigna automáticamente si no se especifica.
   */
  @Post()
  @ApiOperation({ summary: 'Registrar un usuario nuevo (rol "user" por defecto)' })
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
    try {
      const result = await this.userSvc.insertUser(user);
      if (!result) {
        throw new InternalServerErrorException('El usuario no pudo ser registrado');
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error interno al registrar el usuario');
    }
  }

  /**
   * Actualizar perfil — solo el propio usuario autenticado.
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    try {
      const existing = await this.userSvc.getUserById(id);

      if (!existing) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return await this.userSvc.updateUser(id, user);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Error al actualizar el usuario con ID ${id}`);
    }
  }

  /**
   * Eliminar usuario — solo ADMIN.
   */
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const result = await this.userSvc.deleteUser(id);

    if (!result) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}