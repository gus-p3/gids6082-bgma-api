import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.serive';
import { User } from './entities/user.entitie';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {


  constructor(@Inject('PG_CONNECTION') private db: any, private prisma: PrismaService) { }
  login(): string {
    return 'Autenticación correcta';
  }



  private users: any[] = [];

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (user == undefined) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrada`);
    }

    return user;
  }

  async insertUser(user: CreateUserDto): Promise<User> {
    const username = user.username;
    const sameUser = await this.prisma.user.findUnique({
      where: { username }
    });

    if(sameUser != undefined){
        throw new NotFoundException(`Usuario con ID ${id} no encontrada`);
    }
    const newUser = await this.prisma.user.create({ data: user });

    return newUser;
  }

  async updateUser(id: number, userUpdate: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({ where: { id }, data: userUpdate });

    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deletedUser = await this.prisma.user.delete({ where: { id } });

    return deletedUser ? true : false;
  }
}
