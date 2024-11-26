import { HttpContext } from '@adonisjs/core/http';
import { errors } from '@vinejs/vine';

import { DateTime } from 'luxon';

import { ErrorReturn } from '#utils/errorReturn';
import { FieldError } from '#utils/fieldErrorPatern';
import { SuccessReturn } from '#utils/successReturn';

import Product from '#models/product';
import Client from '#models/client';

import { showValidator, storeValidator } from '#validators/sale';
import Sale from '#models/sale';
import { ParameterError } from '#utils/parameterErrorPatern';

interface IIndexSale {
  id: number;
  total_price: number;
  product_id: number;
  created_at: Date;
}
const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})$/;

export default class SaleController {
  public async index({ response, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { remove_token: true } });
      }
      const existingSales = await Sale.query()
        .where({ user_id: authPayload.user_id })
        .orderBy('sale_date', 'desc')
        .whereHas('product', (builder) => {
          builder.whereNull('deleted_in');
        });

      const sales = existingSales.map((sale) => sale.$attributes);

      let returnData: IIndexSale[] = [];

      sales.map((sale) => {
        returnData.push({
          id: sale.id,
          total_price: sale.total_price,
          product_id: sale.product_id,
          created_at: sale.created_at,
        });
      });

      return SuccessReturn({ res: response, status: 200, msg: 'Success get sales', data: returnData });
    } catch (err) {
      console.log('errro', err);
      return ErrorReturn({
        res: response,
        status: 500,
        msg: 'Internal Serveer error',
      });
    }
  }
  public async show({ response, params, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { remove_token: true } });
      }
      const parameters = await showValidator.validate(params);

      const existingSale = await Sale.query()
        .where({ id: parameters.id, user_id: authPayload.user_id })
        .preload('client')
        .preload('product')
        .whereHas('product', (builder) => {
          builder.whereNull('deleted_in');
        })
        .first();

      if (!existingSale) {
        return ErrorReturn({
          res: response,
          status: 404,
          msg: 'Sale not found',
          parameters: [{ parameter: 'id', message: 'Sale not found' }],
        });
      }

      const saleReturn = {
        id: existingSale.id,
        product: {
          id: existingSale.product.id,
          name: existingSale.product.name,
        },
        client: {
          id: existingSale.client.id,
          name: existingSale.client.name,
        },
        quantity: existingSale.quantity,

        unit_price: existingSale.unit_price,
        total_price: existingSale.total_price,
        sale_date: existingSale.sale_date,
      };

      return SuccessReturn({
        res: response,
        msg: 'Success get product',
        status: 200,
        data: saleReturn,
      });
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return ErrorReturn({
          res: response,
          status: 400,
          msg: 'Validation Error',
          parameters: ParameterError(err.messages),
        });
      }
      return ErrorReturn({
        res: response,
        status: 500,
        msg: 'Internal Serveer error',
      });
    }
  }
  public async store({ response, request, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { remove_token: true } });
      }

      const data = await request.validateUsing(storeValidator);

      if (data.quantity < 1) {
        return ErrorReturn({
          res: response,
          msg: 'Not valid quantity',
          status: 400,
          fields: [{ field: 'quantity', message: 'Not valid quantity' }],
        });
      }

      const productExists = await Product.query()
        .where({ id: data.product_id, user_id: authPayload.user_id })
        .whereNull('deleted_in')
        .first();

      if (!productExists) {
        return ErrorReturn({
          msg: 'Not found product',
          status: 404,
          res: response,
          fields: [{ field: 'product_id', message: 'Produto não encontrado' }],
        });
      }
      const clientExists = await Client.query().where({ id: data.client_id, user_id: authPayload.user_id }).first();

      if (!clientExists) {
        return ErrorReturn({
          msg: 'Not found client',
          status: 404,
          res: response,
          fields: [{ field: 'client_id', message: 'Cliente não encontrado' }],
        });
      }

      const newSalePayload = {
        user_id: authPayload.user_id,
        client_id: clientExists.id,
        product_id: productExists.id,
        unit_price: productExists.unit_price,
        quantity: data.quantity,
        total_price: data.quantity * productExists.unit_price,
        sale_date: data.sale_date ? DateTime.fromISO(data.sale_date) : DateTime.now(),
      };

      const newSale = await Sale.create(newSalePayload);

      const newSaleReturn = {
        id: newSale.id,
        client_id: newSale.client_id,
        product_id: newSale.product_id,
        unit_price: newSale.unit_price,
        quantity: newSale.quantity,
        total_price: newSale.total_price,
        sale_date: newSale.sale_date,
      };

      if (!!newSale) {
        return SuccessReturn({ status: 201, msg: 'Success create sale', res: response, data: newSaleReturn });
      } else {
        return ErrorReturn({ status: 500, msg: 'Create sale error', res: response });
      }
    } catch (err) {
      console.log('errro', err);
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return ErrorReturn({
          res: response,
          status: 401,
          msg: 'Validation Error',
          fields: FieldError(err.messages),
        });
      }
      return ErrorReturn({
        res: response,
        status: 500,
        msg: 'Internal Serveer error',
      });
    }
  }
}
