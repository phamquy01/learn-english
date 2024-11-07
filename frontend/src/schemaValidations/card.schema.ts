import { z } from 'zod';

export const CardBody = z
  .object({
    answer: z.string(),
    translation: z.string(),
  })
  .strict()
  .superRefine(({ translation, answer }, ctx) => {
    if (translation == '') {
      ctx.addIssue({
        code: 'custom',
        message: 'bạn cần nhập câu tả lời',
        path: ['translation'],
      });
    }
  });

export type CardBodyType = z.TypeOf<typeof CardBody>;

export const WordsSchema = z.object({
  id: z.number(),
  word: z.string(),
  type: z.string(),
  pronounce: z.string(),
  meaning: z.string(),
});

export const WordsList = z.array(WordsSchema);

export type WordsListType = z.TypeOf<typeof WordsList>;

export const WordsRes = z.object({
  words: WordsList,
  message: z.string(),
  totalItems: z.number(),
  totalPages: z.number(),
});

export type WordsResType = z.TypeOf<typeof WordsRes>;
