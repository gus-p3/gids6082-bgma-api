import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { User } from './entities/user.entitie';
import { UpdateUserDto } from './dto/update-user.dto';
import { Task } from '../task/entities/task.entity';
import { UtilService } from '../../services/util.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {

  constructor(
    @Inject('PG_CONNECTION') private db: any,
    private prisma: PrismaService,
    private readonly utilSvc: UtilService
  ) { }

  login(): string {
    return 'Autenticación correcta';
  }

  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        password: true,
        created_dt: true,
      },
    });
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        password: false,
        created_dt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async insertUser(user: CreateUserDto) {
    const { username, password, ...restOfUser } = user;

    // Verificar si el username ya existe
    const sameUser = await this.prisma.user.findUnique({ where: { username } });
    if (sameUser) {
      throw new ConflictException(`El usuario con el username '${username}' ya existe`);
    }

    const encryptedPassword = await this.utilSvc.hash(password);

    // Buscar el rol "user" (por defecto), si no existe, crear el registro del rol
    let defaultRol = await this.prisma.rol.findFirst({
      where: { description: 'user' },
    });


    const newUser = await this.prisma.user.create({
      data: {
        ...restOfUser,
        username,
        password: encryptedPassword,
        // Asignar rol 'user' por defecto si no se especifica otro
        rol_id: defaultRol?.id,
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_dt: true,
      },
    });

    return newUser;
  }

  async updateUser(id: number, userUpdate: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userUpdate,
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        password: false,
        created_dt: true,
      },
    });

    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deletedUser = await this.prisma.user.delete({ where: { id } });
    return deletedUser ? true : false;
  }

  async getTaskByUser(id: number): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { user_id: id },
    });
    return tasks;
  }
}
