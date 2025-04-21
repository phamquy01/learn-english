import z from 'zod';

export const UserRes = z
  .object({
    data: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
    }),
    message: z.string(),
  })
  .strict();

export type UserResType = z.TypeOf<typeof UserRes>;

export const ResendEmailBody = z.object({
  email: z.string(),
});

export type ResendEmailBodyType = z.TypeOf<typeof ResendEmailBody>;

export const UpdateMeBody = z.object({
  name: z.string().trim().min(2).max(256),
});

export const ResendEmailRes = z
  .object({
    id: z.string(),
    message: z.string(),
  })
  .strict();

export type ResendEmailResType = z.TypeOf<typeof ResendEmailRes>;

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
