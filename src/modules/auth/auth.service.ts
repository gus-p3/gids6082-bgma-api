import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entitie';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly utilSvc: UtilService,
    private readonly jwtService: JwtService
  ) { }


  async login(loginDto: AuthDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const isPasswordValid = await this.utilSvc.checkPassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }
    const payload = await this.utilSvc.getPayload(user);

    //Generar un token por 60 segundos (id, name, lastname, created_at)
    //2 metodos para: Obtener el payload, y otro para generar el token enviando el payload y la fecha de expiración
    //Generar un refresh token por 7 dias (Guardarlo en la Base de datos)
    const refreshToken = await this.utilSvc.generateToken(payload, '7d');
    const hash = await this.utilSvc.hash(refreshToken);
    await this.updateHash(user.id, hash);
    payload.hash = hash;

    const accessToken = await this.utilSvc.generateToken(payload, '1h');




    //Retornar access token y el refresh token.
    await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken: refreshToken } });

    return {
      accessToken,
      refreshToken:hash
    };
  }

  public async getUserById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  public async updateHash(user_id: number, hash: string | null): Promise<User> {
    return await this.prisma.user.update({
      where: { id: user_id },
      data: { hash }
    })
  }

}