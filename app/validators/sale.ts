import vine from '@vinejs/vine';
import { isValidDate } from '#validators/schema/customShemas';

export const showValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  }),
);

export const storeValidator = vine.compile(
  vine.object({
    client_id: vine.number().positive().withoutDecimals(),
    product_id: vine.number().positive().withoutDecimals(),
    quantity: vine.number().positive().withoutDecimals(),
    sale_date: new isValidDate({ min: 2000 }).optional(),
  }),
);
