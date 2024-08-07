import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Response as ResponseType, Request as RequestType } from 'express';
import { AuthDTO } from 'src/dto';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: ResponseType,
    @Body() body: AuthDTO,
  ) {
    const { account, session } = await this.authService.register(body);
    if (this.configService.get('COOKIE_MODE') === 'true') {
      response.cookie('sessionToken', session.token, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
      return {
        data: {
          token: session.token,
          refreshToken: session.refreshToken,
          expiresAt: session.expiresAt,
          account: {
            id: account.id,
            name: account.name,
            email: account.email,
          },
        },
        message: 'Đăng ký thành công',
      };
    }
    return {
      data: {
        token: session.token,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        account: {
          id: account.id,
          name: account.name,
          email: account.email,
        },
      },
      message: 'Đăng ký thành công',
    };
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: ResponseType,
    @Body() body: AuthDTO,
  ) {
    const { account, session } = await this.authService.login(body);
    if (this.configService.get('COOKIE_MODE') === 'true') {
      response.cookie('sessionToken', session.token, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
      return {
        data: {
          token: session.token,
          refreshToken: session.refreshToken,
          expiresAt: session.expiresAt,
          account: {
            id: account.id,
            name: account.name,
            email: account.email,
          },
        },
        message: 'Đăng nhập thành công',
      };
    }
    return {
      data: {
        token: session.token,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        account: {
          id: account.id,
          name: account.name,
          email: account.email,
        },
      },
      message: 'Đăng nhập thành công',
    };
  }

  @Post('logout')
  async logout(
    @Req() request: RequestType,
    @Res({ passthrough: true }) response: ResponseType,
  ) {
    const sessionToken =
      this.configService.get('COOKIE_MODE') === 'true'
        ? request.cookies?.sessionToken
        : request.headers.authorization?.split(' ')[1];

    const message = await this.authService.logout(sessionToken);
    if (this.configService.get('COOKIE_MODE') === 'true') {
      response.clearCookie('sessionToken', {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
      return {
        message,
      };
    }
    return {
      message,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() { refresh_token }): Promise<any> {
    const result = await this.authService.refreshToken(refresh_token);
    return {
      data: result,
      message: 'Refresh token thành công',
    };
  }
}
