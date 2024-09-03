import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { Public } from 'src/decorator/customize';
import { TranslateDTO } from 'src/modules/translate/dto/translate.dto';
import { TranslateService } from 'src/modules/translate/translate.service';
@Controller('translation')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Get()
  get(@Request() req) {
    return this.translateService.getTranslations(req.user);
  }

  @Get('suggestion')
  @Public()
  getTextSuggesstion(@Query('text') text: string) {
    return this.translateService.getTranslationSuggestion(text);
  }

  @Post()
  create(@Request() req, @Body() body: TranslateDTO) {
    return this.translateService.createTranslation(req.user, body);
  }

  @Patch()
  update(@Request() req, @Body() body: TranslateDTO) {
    return this.translateService.updateTranslation(req.user, body);
  }

  @Delete(':userId/:translationId')
  async delete(
    @Param('userId') userId: string,
    @Param('translationId') translationId: string,
  ) {
    return this.translateService.deleteTranslation(userId, translationId);
  }
}
