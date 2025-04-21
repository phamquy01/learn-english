import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDTO } from 'src/modules/user/dto/update-user.dto';
import { UserService } from 'src/modules/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.userService.getUsers(query, +current, +pageSize);
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.createUser(createUserDTO);
  }

  @Patch()
  async updateUser(@Body() updateUserDTO: UpdateUserDTO) {
    return await this.userService.updateUser(updateUserDTO);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
