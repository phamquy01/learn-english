import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { CodeAuthDTO } from 'src/auth/dto/code-auth.dto';
import { CreateAuthDTO } from 'src/auth/dto/create-auth.dto';
import { CustomErrorException } from 'src/exception';
import { comparePasswordHelper } from 'src/helper/utils';
import { Token } from 'src/modules/token/entities/token.entity';
import { UserService } from 'src/modules/user/user.service';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.finByEmail(email);
    if (!user) {
      throw new CustomErrorException([
        { field: 'email', message: 'Email does not exist' },
      ]);
    }
    const isCheckedPassword = await comparePasswordHelper(pass, user.password);
    if (!isCheckedPassword) return null;

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
    });

    const token = this.tokenRepository.create({
      user: user,
      accessToken,
      refreshToken,
      expiresAt: dayjs().add(7, 'days').toDate(),
    });

    await this.tokenRepository.save(token);

    const { id, name, email } = user;
    return {
      message: 'Login success',
      data: {
        user: { id, name, email },
        accessToken,
        refreshToken,
      },
    };
  }

  async register(registerDTO: CreateAuthDTO) {
    return await this.usersService.register(registerDTO);
  }

  async checCode(codeAuthDTO: CodeAuthDTO) {
    return await this.usersService.checCode(codeAuthDTO);
  }

  async resendCode(email: string) {
    return await this.usersService.resendCode(email);
  }

  async logout(accessToken: string) {
    const token = await this.tokenRepository.findOne({
      where: { accessToken },
    });

    if (!token) {
      throw new BadRequestException('Token không tồn tại hoặc đã hết hạn');
    }

    await this.tokenRepository.delete(token.id);

    return {
      message: 'Logout success',
    };
  }
}
