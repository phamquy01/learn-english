import { Controller } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guard';
// import { GetAccount } from 'src/decorator';
// import { TranslateDTO } from 'src/modules/translate/dto/translate.dto';
// import { TranslateService } from 'src/modules/translate/translate.service';

@Controller('translation')
// @UseGuards(JwtAuthGuard)
export class TranslateController {
  // constructor(private readonly translateService: TranslateService) {}
  // @Post()
  // async createTranslate(
  //   @GetAccount('id') accountId: number,
  //   @Body() body: TranslateDTO,
  // ) {
  //   const responseTranslate = await this.translateService.createTranslate(
  //     accountId,
  //     body,
  //   );
  //   return {
  //     message: 'Tạo bản dịch thành công',
  //     translations: responseTranslate,
  //   };
  // }
}
