import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import { Session } from 'src/auth/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
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

  async getMe(token: string): Promise<User> {
    const session = await this.sessionRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!session) {
      throw new UnauthorizedException('Session không tồn tại');
    }
    return session.user;
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
