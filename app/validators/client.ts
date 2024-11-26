import vine from '@vinejs/vine';

import { isCPF } from '#validators/schema/customShemas';
import { DateTime } from 'luxon';

const showValidatorInputs = vine.compile(
  vine.object({
    sales_year: vine.number().min(2000).max(DateTime.now().year).optional().requiredIfExists(['sales_month']),
    sales_month: vine.number().positive().min(1).max(12).optional(),
    all_sales: vine.boolean().optional(),
  }),
);

const showValidatorParameters = vine.compile(
  vine.object({
    id: vine.number().positive(),
  }),
);
export const showValidator = {
  showValidatorInputs,
  showValidatorParameters,
};

const phoneStorevalidator = vine.object({
  number: vine.string().mobile(),
});

const phoneUploadvalidator = vine
  .object({
    id: vine.number().positive(),
    number: vine.string().mobile(),
  })
  .optional();

const addressStoreValidator = vine.object({
  road: vine.string().trim().maxLength(60),

  number: vine.number().positive(),

  complement: vine.string().trim().maxLength(50).optional(),

  neighborhood: vine.string().trim().maxLength(50),

  city: vine.string().trim().maxLength(50),

  zip_code: vine.string().postalCode(),

  state: vine.string().trim().maxLength(60),

  country: vine.string().trim().maxLength(30),
});

export const storeValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .maxLength(60)
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/),

    CPF: new isCPF(),
    address: addressStoreValidator,
    phone: phoneStorevalidator,
  }),
);

const addressUpdateValidator = vine
  .object({
    id: vine
      .number()
      .positive()
      .optional()
      .requiredIfAnyExists(['road', 'number', 'complement', 'neighborhood', 'city', 'zip_code', 'state', 'country']),

    road: vine.string().trim().maxLength(60).optional(),

    number: vine.number().positive().optional(),

    complement: vine.string().trim().maxLength(50).optional(),

    neighborhood: vine.string().trim().maxLength(50).optional(),

    city: vine.string().trim().maxLength(50).optional(),

    zip_code: vine.string().postalCode().optional(),

    state: vine.string().trim().maxLength(60).optional(),

    country: vine.string().trim().maxLength(30).optional(),
  })
  .optional();

const updateValidatorBody = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .maxLength(60)
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/)
      .optional(),

    CPF: new isCPF().optional(),
    address: addressUpdateValidator,
    phone: phoneUploadvalidator,
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
