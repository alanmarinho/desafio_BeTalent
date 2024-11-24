import vine from '@vinejs/vine';

import { isCPF } from '#validators/schema/customShemas';

export const showValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  }),
);

export const storeValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .maxLength(60)
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/),

    CPF: new isCPF(),
  }),
);

const updateValidatorBody = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .maxLength(60)
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/)
      .optional(),

    CPF: new isCPF().optional(),
  }),
);

const updateValidatorParameters = vine.compile(
  vine.object({
    id: vine.number().positive(),
  }),
);

export const updateValidator = {
  updateValidatorBody,
  updateValidatorParameters,
};

export const deleteValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  }),
);
