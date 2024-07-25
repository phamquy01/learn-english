import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getUsers() {
    const users = this.userRepository.find();
    users.then((data) => {
      data.map((user) => {
        delete user.hashedPassword;
      });
    });
    return users;
  }

  async getDetailUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return new ForbiddenException('User not found');
    }
    delete user.hashedPassword;
    return user;
  }

  updateUser() {
    return 'This action updates a user';
  }

  removeUser() {
    return 'This action removes a user';
  }
}
