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
  HttpStatus
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { User } from './entities/user.entitie';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/user')
export class UserController {
  constructor(private userSvc: UserService) { }

  @Get()
  public async getUser(): Promise<User[]> {
    try {
      return await this.userSvc.getUsers();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la lista de usuarios');
    }
  }

  @Get(':id')
  @HttpCode(200)
  public async getUserById(@Param("id", ParseIntPipe) id: number): Promise<User> {
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

  @Post()
  @ApiOperation({ summary: 'Insert a user in the db' })
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
    try {
      
      const result = await this.userSvc.insertUser(user);
      if (!result) {
        throw new InternalServerErrorException("El usuario no pudo ser registrado");
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error interno al registrar el usuario");
    }
  }

  @Put(":id")
  public async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() user: UpdateUserDto
  ): Promise<User> {
    try {
      const result = await this.userSvc.getUserById(id);

       if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return await this.userSvc.updateUser(id, user);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Error al actualizar el usuario con ID ${id}`);
    }
  }

  @Delete(':id')
  public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<boolean> {
    const result = await this.userSvc.deleteUser(id);


    // FIXME: Verificar si el usuario tiene tareas
    if (!result) {
      throw new HttpException(``, HttpStatus.NOT_FOUND);
    }
    return true;
  }
}