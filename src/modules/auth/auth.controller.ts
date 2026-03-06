import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { User } from './entities/user.entitie';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) { }

  // @Get('/o')
  // public login(): string {
  //   return this.authSvc.login();
  // }


  @Get()
  public async getUser(): Promise<User[]> {
    return await this.authSvc.getUsers();
  }

  @Get(':id')
  @HttpCode(200)

  public async getUserById(@Param("id", ParseIntPipe) id: number): Promise<User> {
    const user = await this.authSvc.getUserById(id);
    console.log("Resultado:", user);

    if (user == undefined) {
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    return await this.authSvc.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Insert a user in the db' })
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
    const result = await this.authSvc.insertUser(user)

    if (result == undefined)
      throw new HttpException("Tarea no registrada", HttpStatus.INTERNAL_SERVER_ERROR)
    return result;
  }

  @Put(":id")
  public async updateUser(@Param("id", ParseIntPipe) id: number, @Body() user: UpdateUserDto): Promise<User> {
    return await this.authSvc.updateUser(id, user);
  }

  @Delete(':id')
  public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<boolean> {
    try {
      const result = await this.authSvc.deleteUser(id);
    } catch (error) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);

    }
    return true;
  }
}
