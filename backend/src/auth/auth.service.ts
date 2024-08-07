import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CustomErrorException } from 'src/exception';
import { Account, Session } from 'src/entities';
import { AuthDTO } from 'src/dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Register method
  async register(body: AuthDTO) {
    const hashedPassword = await bcrypt.hash(
      body.password,
      bcrypt.genSaltSync(10),
    );

    const existingAccount = await this.accountRepository.findOne({
      where: { email: body.email },
      select: ['id', 'name', 'email'],
    });

    if (existingAccount) {
      throw new CustomErrorException([
        {
          field: 'email',
          message: 'email đã được sử dụng',
        },
      ]);
    }

    const account = this.accountRepository.create({
      email: body.email,
      hashedPassword: hashedPassword,
      name: body.firstName ?? '',
    });

    const savedAccount = await this.accountRepository.save(account);
    const { accessToken, refreshToken } = await this.signJwtToken(
      savedAccount.id,
      savedAccount.email,
    );

    const expiresAt = await this.generateExpiresAt(365 * 24 * 60);

    const session = this.sessionRepository.create({
      account: account,
      token: accessToken,
      refreshToken,
      expiresAt,
    });

    const savedSession = await this.sessionRepository.save(session);

    return {
      account: savedAccount,
      session: savedSession,
    };
  }

  // Login method
  async login(body: AuthDTO) {
    const responseAccount = await this.accountRepository.findOne({
      where: { email: body.email },
    });
    if (!responseAccount) {
      throw new CustomErrorException([
        {
          field: 'email',
          message: 'Email không tồn tại',
        },
      ]);
    }

    const isCheckedPassword =
      responseAccount &&
      bcrypt.compareSync(body.password, responseAccount.hashedPassword);
    if (!isCheckedPassword) {
      throw new CustomErrorException([
        {
          field: 'password',
          message: 'Email hoặc mật khẩu không đúng',
        },
      ]);
    }

    const { accessToken, refreshToken } = isCheckedPassword
      ? await this.signJwtToken(responseAccount.id, responseAccount.email)
      : null;
    const expiresAt = await this.generateExpiresAt(365 * 24 * 60);

    const session = this.sessionRepository.create({
      account: responseAccount,
      token: accessToken,
      refreshToken,
      expiresAt,
    });

    const savedSession = await this.sessionRepository.save(session);

    return {
      account: responseAccount,
      session: savedSession,
    };
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const checkExitToken = await this.sessionRepository.findOne({
        where: { refreshToken: refresh_token },
      });

      if (!checkExitToken) {
        throw new HttpException('Token không hợp lệ', 401);
      }

      return this.signJwtToken(verify.sub, verify.email);
    } catch (error) {
      throw new HttpException('Token không hợp lệ', 401);
    }
  }

  async logout(sessionToken: string) {
    const session = await this.sessionRepository.findOne({
      where: { token: sessionToken },
    });

    if (!session) {
      throw new UnauthorizedException('Session không tồn tại');
    }

    await this.sessionRepository.delete({
      token: sessionToken,
    });

    return {
      message: 'Đăng xuất thành công',
    };
  }

  // Sign JWT token method
  async signJwtToken(
    id: number,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: id, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    await this.sessionRepository.update(
      {
        account: { id },
      },
      {
        token: accessToken,
        refreshToken,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // Generate expiresAt method
  async generateExpiresAt(durationInMinutes: number): Promise<Date> {
    const now = new Date();
    now.setMinutes(now.getMinutes() + durationInMinutes);
    return now;
  }
}
