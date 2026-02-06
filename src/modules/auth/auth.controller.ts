import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  @Get('/o')
  public login(): string {
    return this.authSvc.login();
  }
}
