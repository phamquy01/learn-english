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

export const TranslationRes = z.array(TranslationSchema);

export type TranslationResType = z.TypeOf<typeof TranslationRes>;
