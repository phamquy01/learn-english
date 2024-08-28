import { Body, Controller, Post, Request } from '@nestjs/common';
import { TranslateDTO } from 'src/modules/translate/dto/translate.dto';
import { TranslateService } from 'src/modules/translate/translate.service';
@Controller('translation')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post()
  createOrUpdate(@Request() req, @Body() body: TranslateDTO) {
    return this.translateService.createOrUpdate(req.user, body);
  }
}
