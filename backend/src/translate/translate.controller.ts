import {
  Body,
  Controller,
  Post,
  Patch,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetAccount } from 'src/decorator';
import { TranslateDTO } from 'src/dto/translate.dto';
import { TranslateService } from 'src/translate/translate.service';

@Controller('translation')
@UseGuards(JwtAuthGuard)
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}
  @Post()
  async createTranslate(
    @GetAccount('id') accountId: number,
    @Body() body: TranslateDTO,
  ) {
    const responseTranslate = await this.translateService.createTranslate(
      accountId,
      body,
    );

    return {
      message: 'Tạo bản dịch thành công',
      translations: responseTranslate,
    };
  }
}
