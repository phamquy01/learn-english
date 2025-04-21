import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/auth/passport/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { Public } from 'src/decorator/customize';
import { CreateAuthDTO } from 'src/auth/dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CodeAuthDTO } from 'src/auth/dto/code-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() registerDTO: CreateAuthDTO) {
    return this.authService.register(registerDTO);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() codeAuthDTO: CodeAuthDTO) {
    return this.authService.checCode(codeAuthDTO);
  }

  @Post('resend-code')
  @Public()
  resendCode(@Body('email') email: string) {
    return this.authService.resendCode(email);
  }

  @Post('logout')
  @Public()
  logout(accessToken: string) {
    return this.authService.logout(accessToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('mail')
  @Public()
  mail() {
    this.mailerService.sendMail({
      to: 'taolaquy69@gmail.com',
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
      template: 'register',
      context: {
        name: 'taolaquy',
        activationCode: 123456,
      },
    });

    return 'ok';
  }
}
