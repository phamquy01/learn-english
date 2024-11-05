import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/decorator/customize';

@Controller()
export class AppController {
  @Get()
  @Public()
  getHello(): string {
    return 'Hello World!';
  }
}
