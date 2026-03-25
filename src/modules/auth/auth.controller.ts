import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';


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

  public refreshToken() { }

  public logout() { }
}