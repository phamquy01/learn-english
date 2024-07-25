import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/entities';
import { Repository } from 'typeorm';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
    });
    delete user.hashedPassword;
    return user;
  }
}
