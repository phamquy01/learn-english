import { z } from 'zod';

export const TranslationBody = z
  .object({
    fromText: z.string(),
    from: z.string(),
    toText: z.string(),
    to: z.string(),
  })
  .strict();

export type TranslationBodyType = z.TypeOf<typeof TranslationBody>;

export const TranslationSchema = z
  .object({
    id: z.string(),
    fromText: z.string(),
    from: z.string(),
    toText: z.string(),
    to: z.string(),
    timestamp: z.date(),
  })
  .strict();

export const TranslationRes = z.object({
  translations: TranslationSchema,
  message: z.string(),
});

export type TranslationResType = z.TypeOf<typeof TranslationRes>;
