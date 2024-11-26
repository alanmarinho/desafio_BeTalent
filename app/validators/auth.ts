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
    password: vine
      .string()
      .trim()
      .maxLength(100)
      .regex(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/), // senha forte min 6 caracteres e pelomenos: 1 letra minúscula, 1 maiúscula, 1 numero, um caractere especial. by: https://regexpattern.com/strong-password/
    name: vine
      .string()
      .trim()
      .maxLength(60)
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/), //somente letas e espaços
  }),
);
