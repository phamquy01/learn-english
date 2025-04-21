import { z } from 'zod';

export const TranslationBody = z
  .object({
    id: z.string(),
    fromText: z.string(),
    from: z.string(),
    toText: z.string(),
    to: z.string(),
    timestamp: z.date(),
    save: z.boolean(),
  })
  .strict();

export type TranslationBodyType = z.TypeOf<typeof TranslationBody>;

const Translations = z.object({
  text: z.string(),
  to: z.string(),
});

const TranslationSchema = z
  .object({
    detectedLanguage: z.object({
      language: z.string(),
      score: z.number(),
    }),
    translations: z.array(Translations),
  })
  .strict();

export const TranslationListRes = z.object({
  data: z.object({
    userId: z.string(),
    translations: z.array(TranslationBody),
  }),
  message: z.string(),
});

export const SaveTranslationBody = z.object({
  id: z.string(),
  userId: z.string(),
  saved: z.boolean(),
});
export type SaveTranslationBodyType = z.TypeOf<typeof SaveTranslationBody>;

export type TranslationListResType = z.TypeOf<typeof TranslationListRes>;

export const TranslationRes = z.array(TranslationSchema);

export type TranslationResType = z.TypeOf<typeof TranslationRes>;
