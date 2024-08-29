import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { TranslateDTO } from 'src/modules/translate/dto/translate.dto';
import { TranslateService } from 'src/modules/translate/translate.service';
@Controller('translation')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Get()
  get(@Request() req) {
    return this.translateService.getTranslations(req.user);
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
