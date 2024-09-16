import { z } from 'zod';

export const CardBody = z
  .object({
    answer: z.string(),
    translation: z.string(),
  })
  .strict()
  .superRefine(({ translation, answer }, ctx) => {
    if (translation !== answer) {
      ctx.addIssue({
        code: 'custom',
        message: 'cầu trả lời chưa chính xác',
        path: ['translation'],
      });
    }
  });

export type CardBodyType = z.TypeOf<typeof CardBody>;
