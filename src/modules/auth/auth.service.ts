import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';


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

    //Generar un token por 60 segundos (id, name, lastname, created_at)
    //2 metodos para: Obtener el playload, y otro para generar el token enviando el playload y la fecha de expiración
    const playload = await this.utilSvc.getPayload(user);

    const accessToken = await this.utilSvc.generateToken(playload, '60000s');

    //Generar un refresh token por 7 dias (Guardarlo en la Base de datos)
    const refreshToken = await this.utilSvc.generateToken(playload, '7d');


    //Retornar access token y el refresh token.
    await this.prisma.user.update({where:{id:user.id}, data:{refreshToken: refreshToken}});

    return {
      accessToken,
      refreshToken
    };
  }

}