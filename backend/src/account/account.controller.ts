import { Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountService } from 'src/account/account.service';
import { Request as RequestType } from 'express';
import { JwtAuthGuard } from 'src/auth/guard';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private configService: ConfigService,
  ) {}

  @Get()
  getAccounts() {
    return this.accountService.getAccounts();
  }

  @Get('me')
  async getMe(@Req() request: RequestType) {
    const sessionToken =
      this.configService.get('COOKIE_MODE') === 'true'
        ? request.cookies?.sessionToken
        : request.headers.authorization?.split(' ')[1];

    const account = await this.accountService.getMe(sessionToken);

    delete account.hashedPassword;
    return { message: 'Lấy thông tin thành công', data: account };
  }

  @Put()
  updateAccount() {
    return this.accountService.updateAccount();
  }
}
