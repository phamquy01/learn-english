import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities';
import { Repository } from 'typeorm';
import { AuthDTO } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Register method
  async register(authDTO: AuthDTO) {
    const hashedPassword = await bcrypt.hash(
      authDTO.password,
      bcrypt.genSaltSync(10),
    );

    const existingUser = await this.userRepository.findOne({
      where: { email: authDTO.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const user = this.userRepository.create({
      email: authDTO.email,
      hashedPassword: hashedPassword,
      firstName: authDTO.firstName ?? '',
      lastName: authDTO.lastName ?? '',
    });

    const savedUser = await this.userRepository.save(user);
    const token = await this.signJwtToken(savedUser.id, savedUser.email);
    delete savedUser.hashedPassword;

    return {
      user: savedUser,
      token,
    };
  }

  // Login method
  async login(authDTO: AuthDTO) {
    const responseUser = await this.userRepository.findOne({
      where: { email: authDTO.email },
    });
    if (!responseUser) {
      throw new BadRequestException('User not found');
    }

    const isCheckedPassword =
      responseUser &&
      bcrypt.compareSync(authDTO.password, responseUser.hashedPassword);
    if (!isCheckedPassword) {
      throw new BadRequestException('Iscorrect password');
    }

    const token = isCheckedPassword
      ? await this.signJwtToken(responseUser.id, responseUser.email)
      : null;

    delete responseUser.hashedPassword;

    return {
      user: responseUser,
      token,
    };
  }

  // Sign JWT token method
  async signJwtToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '2d',
      secret: this.configService.get('JWT_SECRET'),
    });
    return jwtString;
  }
}
