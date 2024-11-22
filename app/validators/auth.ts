import vine from '@vinejs/vine';

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().trim(),
  }),
);

export const signupValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().trim(),
    name: vine
      .string()
      .trim()
      .maxLength(60)
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/),
  }),
);
