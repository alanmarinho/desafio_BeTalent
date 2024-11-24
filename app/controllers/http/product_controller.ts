import { HttpContext } from '@adonisjs/core/http';
import { errors } from '@vinejs/vine';

import { DateTime } from 'luxon';

import Product from '#models/product';

import { ErrorReturn } from '#utils/errorReturn';
import { SuccessReturn } from '#utils/successReturn';
import { FieldError } from '#utils/fieldErrorPatern';
import { ParameterError } from '#utils/parameterErrorPatern';

import { storeValidator, showValidator, updateValidator } from '#validators/product';
import { deleteValidator } from '#validators/client';

interface IIndexProduct {
  id: number;
  name: string;
  created_at: Date;
}

export default class ProductController {
  public async index({ response, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { logout: true } });
      }
      const existingProducts = await Product.query()
        .where({ user_id: authPayload.user_id })
        .orderBy('name', 'asc')
        .whereNull('deleted_in');

      const products = existingProducts.map((product) => product.$attributes);

      let returnData: IIndexProduct[] = [];

      products.map((product) => {
        returnData.push({
          id: product.id,
          name: product.name,
          created_at: product.created_at,
        });
      });

      return SuccessReturn({ res: response, status: 200, msg: 'Success get products', data: returnData });
    } catch (err) {
      return ErrorReturn({
        res: response,
        status: 500,
        msg: 'Internal Serveer error',
      });
    }
  }
  public async show({ response, authPayload, params }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { logout: true } });
      }
      const parameters = await showValidator.validate(params);
      const existingProduct = await Product.query()
        .where({ id: parameters.id, user_id: authPayload.user_id })
        .whereNull('deleted_in')
        .first();

      if (!existingProduct) {
        return ErrorReturn({
          res: response,
          status: 404,
          msg: 'Product not found',
          parameters: [{ parameter: 'id', message: 'Produto não encontrado' }],
        });
      }

      const productReturn = {
        id: existingProduct.id,
        name: existingProduct.name,
        description: existingProduct.description,
        created_at: existingProduct.created_at,
        updated_at: existingProduct.updated_at,
      };

      return SuccessReturn({
        res: response,
        msg: 'Success get product ',
        status: 200,
        data: productReturn,
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
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { logout: true } });
      }

      const data = await request.validateUsing(storeValidator);

      const newProductPayload = {
        name: data.name,
        user_id: authPayload.user_id,
        description: data.description,
        unit_price: data.unit_price,
      };

      const newProduct = await Product.create(newProductPayload);

      const newSaleResponse = {
        id: newProduct.id,
        name: newProduct.name,
      };

      if (!!newProduct) {
        return SuccessReturn({
          status: 201,
          msg: 'Success create product',
          res: response,
          data: newSaleResponse,
        });
      } else {
        return ErrorReturn({ status: 500, msg: 'Create product error', res: response });
      }
    } catch (err) {
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
  public async update({ response, request, params, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { logout: true } });
      }
      const data = await request.validateUsing(updateValidator.updateValidatorBody);
      const parameters = await updateValidator.updateValidatorParameters.validate(params);

      if (Object.keys(data).length === 0) {
        return ErrorReturn({ status: 400, msg: 'Data not send', res: response });
      }
      const existingProduct = await Product.query().where({ id: parameters.id, user_id: authPayload.user_id }).first();

      if (!existingProduct) {
        return ErrorReturn({
          status: 404,
          msg: 'Product not found',
          res: response,
          parameters: [{ message: 'Produto não encontradao', parameter: 'id' }],
        });
      }

      existingProduct.merge(data);
      const savedProduct = await existingProduct.save();

      const updateProductReturn = {
        id: savedProduct.id,
      };

      if (!!savedProduct) {
        return SuccessReturn({ status: 200, msg: 'Success update product', res: response, data: updateProductReturn });
      } else {
        return ErrorReturn({ status: 500, msg: 'Update product error', res: response });
      }
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return ErrorReturn({
          res: response,
          status: 400,
          msg: 'Validation Error',
          parameters: err.messages[0].field == 'id' ? ParameterError(err.messages) : undefined, //case seja um parametro
          fields: err.messages[0].field != 'id' ? FieldError(err.messages) : undefined, //caso seja um campo do body
        });
      }
      return ErrorReturn({
        res: response,
        status: 500,
        msg: 'Internal Serveer error',
      });
    }
  }
  public async delete({ response, params, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { logout: true } });
      }
      const parameters = await deleteValidator.validate(params);

      const existingProduct = await Product.findBy({ id: parameters.id });

      if (!existingProduct) {
        return ErrorReturn({
          status: 404,
          msg: 'Product not found',
          res: response,
          parameters: [{ message: 'Produto não encontradao', parameter: 'id' }],
        });
      }
      const now = DateTime.now();
      const softDeletdProduct = await existingProduct.merge({ deleted_in: now }).save();

      const softDeletdProductReturn = {
        id: softDeletdProduct.id,
      };

      if (!!softDeletdProduct) {
        return SuccessReturn({
          status: 200,
          msg: 'Success delete product',
          res: response,
          data: softDeletdProductReturn,
        });
      } else {
        return ErrorReturn({ status: 500, msg: 'Delete product error', res: response });
      }
    } catch (err) {
      console.log('erro', err);
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
}
