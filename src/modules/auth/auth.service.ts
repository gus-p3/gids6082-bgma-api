import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    console.log(`Intento de login con username: "${username}", password length: ${password?.length}`);

    // Incluir la relación Rol para que el payload tenga el role del usuario
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { rol: true },
    });

    if (!user) {
      console.log('Login fallido: Usuario no existe en DB');
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const isPasswordValid = await this.utilSvc.checkPassword(password, user.password);

    if (!isPasswordValid) {
      console.log('Login fallido: Contraseña incorrecta');
      throw new UnauthorizedException('Credenciales invalidas');
    }

    console.log('Login exitoso para:', username);

    // getPayload ahora incluye user.rol.description como campo "role"
    const payload = await this.utilSvc.getPayload(user);

    const refreshToken = await this.utilSvc.generateToken(payload, '7d');
    const hash = await this.utilSvc.hash(refreshToken);
    await this.updateHash(user.id, hash);
    payload.hash = hash;

    const accessToken = await this.utilSvc.generateToken(payload, '1h');

    await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken: refreshToken } });

    return {
      accessToken,
      refreshToken: hash,
    };
  }

  public async getUserById(id: number): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { rol: true },
    });
  }

  public async updateHash(user_id: number, hash: string | null): Promise<any> {
    return await this.prisma.user.update({
      where: { id: user_id },
      data: { hash }
    });
  }
}