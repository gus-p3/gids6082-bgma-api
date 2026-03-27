import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
  HttpStatus,
  Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { request } from 'http';
import { AppException } from '../../common/exceptions/app.exception';
import { access } from 'fs';


@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: AuthDto): Promise<any> {
    return this.authSvc.login(loginDto);
  }
  @Get("me")
  @ApiOperation({ summary: "Extrae el id del usuario desde el token y busca la imformacion" })
  @UseGuards(AuthGuard)

  @ApiOperation({ summary: "Extrae el ID del usuario desde el token y busca la informacion" })
  public getProfile() { }


  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async refreshToken(@Req() request: any) {
    //TODO Obtener el usuario en sesion
    const userSession = request.user;
    const user = await this.authSvc.getUserById(userSession.id);

    if (!user || !user.hash) throw new AppException('Acceso denegado', HttpStatus.FORBIDDEN, '0');
    //Todo Comprar el token recibido con el guardado
    if (userSession.hash != user.hash) throw new AppException('Token invalido', HttpStatus.FORBIDDEN, '1');

    //FIXME: Si el token es válido genera nuevos tokens
    return {
      access_token: '',
      refreshToken: ''
    }
  }
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any) {
    const userSession = request.user;
    const user = await this.authSvc.updateHash(userSession.id, null);

    //Todo Si el token es valido se genera un nuevo token
    return user;
  }
}