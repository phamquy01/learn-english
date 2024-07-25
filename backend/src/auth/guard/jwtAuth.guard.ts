import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestType>();
    const cookieMode = this.configService.get('COOKIE_MODE') === 'true';

    const sessionToken = cookieMode
      ? request.cookies?.sessionToken
      : request.headers.authorization?.split(' ')[1];

    if (!sessionToken) {
      throw new UnauthorizedException('Không nhận được session token');
    }

    return super.canActivate(context);
  }
}
