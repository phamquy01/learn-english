import z from 'zod';

export const RegisterBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
  message: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
  message: z.string(),
  data: z.object({
    user: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
    }),
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

export const VerifyCodeBody = z.object({
  id: z.string(),
  code: z.string(),
});
export type VerifyCodeBodyType = z.TypeOf<typeof VerifyCodeBody>;

export const VerifyCodeRes = z
  .object({
    message: z.string(),
  })
  .strict();
export type VerifyCodeResType = z.TypeOf<typeof VerifyCodeRes>;

export type LoginResType = z.TypeOf<typeof LoginRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = RegisterRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;
