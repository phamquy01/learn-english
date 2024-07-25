import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const cookieMode = this.configService.get('COOKIE_MODE') === 'false';
    if (cookieMode) res.cookie('sessionToken', '');
    next();
  }
}
