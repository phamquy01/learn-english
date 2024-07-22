import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
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
