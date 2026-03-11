import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { User } from './entities/user.entitie';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { Task } from '../task/entities/task.entity';
import { UtilService } from '../../services/util.service';

@Injectable()
export class AuthService {


  constructor(@Inject('PG_CONNECTION') private db: any, private prisma: PrismaService, private readonly utilSvc: UtilService) { }
  login(): string {
    return 'Autenticación correcta';
  }


}
