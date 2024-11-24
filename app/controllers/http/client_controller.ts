import type { HttpContext } from '@adonisjs/core/http';
import { errors } from '@vinejs/vine';

import Client from '#models/client';

import { ErrorReturn } from '#utils/errorReturn';
import { FieldError } from '#utils/fieldErrorPatern';
import { SuccessReturn } from '#utils/successReturn';

import { storeValidator, deleteValidator, updateValidator, showValidator } from '#validators/client';
import { ParameterError } from '#utils/parameterErrorPatern';

interface IIndexClient {
  id: number;
  name: string;
  created_at: Date;
}

export default class ClientController {
  public async index({ response, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { logout: true } });
      }

      const existingClients = await Client.query().where({ user_id: authPayload.user_id }).orderBy('id', 'asc');
      const clients = existingClients.map((client) => client.$attributes);
      let returnData: IIndexClient[] = [];

      clients.map((client) => {
        returnData.push({
          id: client.id,
          name: client.name,
          created_at: client.created_at,
        });
      });

      return SuccessReturn({ res: response, status: 200, msg: 'Success get clients', data: returnData });
    } catch (err) {
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
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { logout: true } });
      }

      const parameters = await showValidator.validate(params);

      const existingClient = await Client.query()
        .where({ id: parameters.id, user_id: authPayload.user_id })
        .preload('sales', (query) => {
          query.orderBy('sale_date', 'desc');
        })
        .first();

      if (!existingClient) {
        return ErrorReturn({
          res: response,
          status: 404,
          msg: 'Client not found',
          parameters: [{ parameter: 'id', message: 'Client not found' }],
        });
      }

      const sales = existingClient.sales.map((sale) => {
        return {
          id: sale.id,
          sale_date: sale.sale_date,
        };
      });

      const showClientReturn = {
        id: existingClient.id,
        name: existingClient.name,
        sales: sales,
        created_at: existingClient.created_at,
        updated_at: existingClient.updated_at,
      };
      return SuccessReturn({
        res: response,
        msg: 'Success get client',
        status: 200,
        data: showClientReturn,
      });
    } catch (err) {
      console.log('error', err);
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

      const existingClient = await Client.query().where({ CPF: data.CPF, user_id: authPayload.user_id }).first();

      if (existingClient) {
        return ErrorReturn({
          res: response,
          status: 409,
          msg: 'CPF already registered',
          fields: [{ field: 'CPF', message: 'CPF já cadastrado!' }],
        });
      }

      const newClientPayload = {
        name: data.name,
        user_id: authPayload.user_id,
        CPF: data.CPF,
      };

      const newClient = await Client.create(newClientPayload);

      const newClientResponse = {
        id: newClient.id,
        name: newClient.name,
      };

      if (!!newClient) {
        return SuccessReturn({ status: 201, msg: 'Success create client', res: response, data: newClientResponse });
      } else {
        return ErrorReturn({ status: 500, msg: 'Create client error', res: response });
      }
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return ErrorReturn({
          res: response,
          status: 400,
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

      if (data.CPF) {
        const anotherClientUsingSameCpf = await Client.query()
          .where({ CPF: data.CPF, user_id: authPayload.user_id })
          .whereNot('id', parameters.id)
          .first();

        if (anotherClientUsingSameCpf) {
          return ErrorReturn({
            status: 409,
            msg: 'CPF already in use',
            res: response,
            fields: [{ field: 'CPF', message: 'CPF já em uso' }],
          });
        }
      }

      const existingClient = await Client.query().where({ id: parameters.id, user_id: authPayload.user_id }).first();

      if (!existingClient) {
        return ErrorReturn({
          status: 404,
          msg: 'Client not found',
          res: response,
          parameters: [{ message: 'Cliente não encontradao', parameter: 'id' }],
        });
      }

      existingClient.merge(data);
      const savedClient = await existingClient.save();

      const updateClientReturn = {
        id: savedClient.id,
      };

      if (!!savedClient) {
        return SuccessReturn({ status: 200, msg: 'Success update client', res: response, data: updateClientReturn });
      } else {
        return ErrorReturn({ status: 500, msg: 'Update client error', res: response });
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

      const existingClient = await Client.query().where({ id: parameters.id, user_id: authPayload.user_id }).first();

      if (!existingClient) {
        return ErrorReturn({
          status: 404,
          msg: 'Client not found',
          res: response,
          parameters: [{ message: 'Cliente não encontrado', parameter: 'id' }],
        });
      }
      await existingClient.delete();

      return SuccessReturn({ status: 200, msg: 'Success delete client', res: response });
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
}
