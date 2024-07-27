import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomErrorException extends HttpException {
  constructor(errors: { field: string; message: string }[]) {
    super(
      {
        message: 'Lỗi xác thực dữ liệu... ',
        errors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
