import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/decorator/customize';
import { TranslateService } from 'src/modules/translate/translate.service';
// import { JwtAuthGuard } from 'src/auth/guard';
// import { GetAccount } from 'src/decorator';
// import { TranslateDTO } from 'src/modules/translate/dto/translate.dto';
// import { TranslateService } from 'src/modules/translate/translate.service';

@Controller('api')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Get('suggestions')
  @Public()
  async getSuggestions(@Query('text') text: string) {
    return await this.translateService.getSuggestions(text);
  }
}
