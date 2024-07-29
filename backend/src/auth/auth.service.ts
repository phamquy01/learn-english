import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities';
import { Repository } from 'typeorm';
import { AuthDTO } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CustomErrorException } from 'src/exception';
import { Session } from 'src/auth/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
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
      throw new CustomErrorException([
        {
          field: 'email',
          message: 'email đã được sử dụng',
        },
      ]);
    }

    const user = this.userRepository.create({
      email: authDTO.email,
      hashedPassword: hashedPassword,
      firstName: authDTO.firstName ?? '',
      lastName: authDTO.lastName ?? '',
    });

    const savedUser = await this.userRepository.save(user);
    const token = await this.signJwtToken(savedUser.id, savedUser.email);
    const expiresAt = await this.generateExpiresAt(365 * 24 * 60);

    const session = this.sessionRepository.create({
      user: user,
      token,
      expiresAt,
    });

    const savedSession = await this.sessionRepository.save(session);
    delete savedUser.hashedPassword;

    return {
      user: savedUser,
      session: savedSession,
    };
  }

  // Login method
  async login(authDTO: AuthDTO) {
    const responseUser = await this.userRepository.findOne({
      where: { email: authDTO.email },
    });
    if (!responseUser) {
      throw new CustomErrorException([
        {
          field: 'email',
          message: 'Email không tồn tại',
        },
      ]);
    }

    const isCheckedPassword =
      responseUser &&
      bcrypt.compareSync(authDTO.password, responseUser.hashedPassword);
    if (!isCheckedPassword) {
      throw new CustomErrorException([
        {
          field: 'password',
          message: 'Email hoặc mật khẩu không đúng',
        },
      ]);
    }

    const token = isCheckedPassword
      ? await this.signJwtToken(responseUser.id, responseUser.email)
      : null;
    const expiresAt = await this.generateExpiresAt(365 * 24 * 60);

    const session = this.sessionRepository.create({
      user: responseUser,
      token,
      expiresAt,
    });

    const savedSession = await this.sessionRepository.save(session);

    delete responseUser.hashedPassword;
    return {
      user: responseUser,
      session: savedSession,
    };
  }

  logout() {
    return {
      message: 'Đăng xuất thành công',
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

  async generateExpiresAt(durationInMinutes: number): Promise<Date> {
    const now = new Date();
    now.setMinutes(now.getMinutes() + durationInMinutes);
    return now;
  }
}
