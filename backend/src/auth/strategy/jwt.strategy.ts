import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Request as RequestType } from 'express';
import { Account } from 'src/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extracJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static extracJWTFromCookie(request: RequestType) {
    if (
      request.cookies &&
      'sessionToken' in request.cookies &&
      request.cookies.sessionToken.length > 0
    ) {
      return request.cookies.sessionToken;
    }
  }

  async validate(payload: { sub: number; email: string }) {
    const account = await this.accountRepository.findOne({
      where: {
        id: payload.sub,
      },
    });
    delete account.hashedPassword;
    return account;
  }
}
