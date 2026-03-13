import {
  Controller,
  Post,
  Body,
  HttpCode
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';


@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authSvc.login(loginDto);
  }
}