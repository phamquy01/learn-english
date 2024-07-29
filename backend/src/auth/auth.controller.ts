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
    const { user, session } = await this.authService.register(authDTO);
    if (this.configService.get('COOKIE_MODE') === 'true') {
      response.cookie('sessionToken', session.token, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
      return {
        message: 'Đăng ký thành công',
        data: {
          token: session.token,
          expiresAt: session.expiresAt,
          user,
        },
      };
    }

    return {
      message: 'Đăng ký thành công',
      data: {
        token: session.token,
        expiresAt: session.expiresAt,
        user,
      },
    };
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: ResponseType,
    @Body() authDTO: AuthDTO,
  ) {
    const { user, session } = await this.authService.login(authDTO);
    if (this.configService.get('COOKIE_MODE') === 'true') {
      response.cookie('sessionToken', session.token, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
      return {
        message: 'Đăng nhập thành công',
        data: {
          token: session.token,
          expiresAt: session.expiresAt,
          user,
        },
      };
    }
    return {
      message: 'Đăng nhập thành công',
      data: {
        token: session.token,
        expiresAt: session.expiresAt,
        user,
      },
    };
  }
}
