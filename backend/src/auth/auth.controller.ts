import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() authDTO: AuthDTO) {
    return this.authService.register(authDTO);
  }
  @Post('login')
  async login(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }
}
