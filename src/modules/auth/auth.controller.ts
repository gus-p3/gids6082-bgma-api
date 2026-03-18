import {
  Controller,
  Post,
  Body,
  HttpCode
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';


@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: AuthDto): Promise<any> {
    return this.authSvc.login(loginDto);
  }
}