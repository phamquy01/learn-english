import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { ConfigService } from '@nestjs/config';
import { Response as ResponseType } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: ResponseType,
    @Body() authDTO: AuthDTO,
  ) {
    const { user, token } = await this.authService.register(authDTO);
    if (this.configService.get('COOKIE_MODE')) {
      response.cookie('sessionToken', token, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
      return {
        data: {
          token,
          user,
        },
        message: 'Đăng ký thành công',
      };
    }
    return {
      data: {
        token,
        user,
      },
      message: 'Đăng ký thành công',
    };
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: ResponseType,
    @Body() authDTO: AuthDTO,
  ) {
    const { user, token } = await this.authService.login(authDTO);
    if (this.configService.get('COOKIE_MODE')) {
      response.cookie('sessionToken', token, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
      return {
        data: {
          token,
          user,
        },
        message: 'Đăng nhập thành công',
      };
    }
    return {
      data: {
        token,
        user,
      },
      message: 'Đăng nhập thành công',
    };
  }
}
