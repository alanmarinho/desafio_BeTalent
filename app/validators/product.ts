import vine from '@vinejs/vine';

export const showValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  }),
);

export const storeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(80),
    unit_price: vine.number().positive(),
    description: vine.string().trim().maxLength(600).optional(),
  }),
);

const updateValidatorBody = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(80).optional(),
    unit_price: vine.number().positive().optional(),
    description: vine.string().trim().maxLength(600).optional(),
    deleted_in: vine.boolean().optional(),
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
