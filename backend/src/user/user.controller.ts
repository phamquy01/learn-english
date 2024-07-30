import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { Request as RequestType } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('me')
  async getMe(@Req() request: RequestType) {
    const sessionToken =
      this.configService.get('COOKIE_MODE') === 'true'
        ? request.cookies?.sessionToken
        : request.headers.authorization?.split(' ')[1];

    const user = await this.userService.getMe(sessionToken);

    delete user.hashedPassword;
    return { message: 'Lấy thông tin thành công', data: user };
  }

  @Get(':id')
  getDetailUser(@Param('id') userId: number) {
    return this.userService.getDetailUser(userId);
  }

  @Put()
  updateUser() {
    return this.userService.updateUser();
  }

  @Delete()
  removeUser() {
    return this.userService.removeUser();
  }
}
