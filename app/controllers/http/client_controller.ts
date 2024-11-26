import type { HttpContext } from '@adonisjs/core/http';
import { errors } from '@vinejs/vine';

import Client from '#models/client';
import Address from '#models/address';

import { ErrorReturn } from '#utils/errorReturn';
import { FieldError } from '#utils/fieldErrorPatern';
import { SuccessReturn } from '#utils/successReturn';

import { storeValidator, deleteValidator, updateValidator, showValidator } from '#validators/client';
import { ParameterError } from '#utils/parameterErrorPatern';
import Phone from '#models/phone';
import parsePhoneNumberFromString from 'libphonenumber-js/mobile';

interface IIndexClient {
  id: number;
  name: string;
  created_at: Date;
}

export default class ClientController {
  public async index({ response, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { remove_token: true } });
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
  public async show({ request, response, params, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { remove_token: true } });
      }
      const parameters = await showValidator.showValidatorParameters.validate(params);
      const inputs = await showValidator.showValidatorInputs.validate(request.qs());

      const clientQuery = Client.query()
        .where({ id: parameters.id, user_id: authPayload.user_id })
        .preload('address', (query) => {
          query.orderBy('id', 'desc');
        })
        .preload('phone', (query) => {
          query.orderBy('id', 'desc');
        });
      console.log('inputs', inputs);
      if (inputs.all_sales || inputs.sales_year) {
        console.log('caiu no input');
        clientQuery.preload('sales', (query) => {
          if (inputs.all_sales) {
            query.orderBy('sale_date', 'desc');
          } else {
            if (inputs.sales_year) {
              query.andWhereRaw('YEAR(sale_date) = ?', [inputs.sales_year]);
            }
            if (inputs.sales_month) {
              query.andWhereRaw('MONTH(sale_date) = ?', [inputs.sales_month]);
            }
          }
        });
      }
      const existingClient = await clientQuery.first();

      if (!existingClient) {
        return ErrorReturn({
          res: response,
          status: 404,
          msg: 'Client not found',
          parameters: [{ parameter: 'id', message: 'Client not found' }],
        });
      }
      let sales;
      if (inputs.all_sales || inputs.sales_year) {
        sales = existingClient.sales.map((sale) => {
          return {
            id: sale.id,
            unit_price: sale.unit_price,
            quantity: sale.quantity,
            total_price: sale.total_price,
            sale_date: sale.sale_date,
          };
        });
      }

      const addresses = existingClient.address.map((address) => {
        return {
          id: address.id,
          city: address.city,
          road: address.road,
          number: address.number,
        };
      });

      const phones = existingClient.phone.map((phone) => {
        return {
          id: phone.id,
          number: phone.number,
        };
      });

      const showClientReturn = {
        id: existingClient.id,
        name: existingClient.name,
        sales: sales,
        addresses: addresses,
        phones: phones,
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
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { remove_token: true } });
      }

      const data = await request.validateUsing(storeValidator);

      const existingClientCPF = await Client.query().where({ CPF: data.CPF, user_id: authPayload.user_id }).first();

      const existingClientPhone = await Phone.query()
        .where({ number: data.phone.number, user_id: authPayload.user_id })
        .first();

      if (existingClientCPF || existingClientPhone) {
        let fields = [];
        existingClientCPF &&
          fields.push({
            field: 'CPF',
            message: 'CPF já cadastrado!',
          });

        existingClientPhone &&
          fields.push({
            field: 'phone.number',
            message: 'Numero de telefone já cadastrado!',
          });

        return ErrorReturn({
          res: response,
          status: 409,
          msg: 'CPF already registered',
          fields: fields,
        });
      }

      const newClientPayload = {
        name: data.name,
        user_id: authPayload.user_id,
        CPF: data.CPF,
      };
      const newClient = await Client.create(newClientPayload);

      const newClientAddressPayload = {
        client_id: newClient.id,
        user_id: authPayload.user_id,
        road: data.address.road,
        number: data.address.number,
        complement: data.address.complement,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        country: data.address.country,
        zip_code: data.address.zip_code,
      };

      const newAddress = await Address.create(newClientAddressPayload);
      const normalizeNumber = parsePhoneNumberFromString(data.phone.number, 'BR');

      const newClientPhonePayload = {
        user_id: authPayload.user_id,
        client_id: newClient.id,
        number: normalizeNumber ? normalizeNumber.formatInternational() : data.phone.number,
      };

      const newPhone = await Phone.create(newClientPhonePayload);

      const newClientAddressResponse = {
        id: newAddress.id,
        zip_code: newAddress.zip_code,
        city: newAddress.city,
        road: newAddress.road,
        number: newAddress.number,
      };

      const newClientPhoneResponse = {
        id: newPhone.id,
        number: newPhone.number,
      };

      const newClientResponse = {
        id: newClient.id,
        name: newClient.name,
        address: newClientAddressResponse,
        Phone: newClientPhoneResponse,
      };
      if (!!newClient) {
        return SuccessReturn({ status: 201, msg: 'Success create client', res: response, data: newClientResponse });
      } else {
        return ErrorReturn({ status: 500, msg: 'Create client error', res: response });
      }
    } catch (err) {
      console.log('erro', err);
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
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { remove_token: true } });
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

      if (data.phone) {
        const anotherClientUsingSameCpf = await Phone.query()
          .where({ number: data.phone.number, user_id: authPayload.user_id })
          .whereNot({ client_id: parameters.id })
          .first();

        if (anotherClientUsingSameCpf) {
          return ErrorReturn({
            status: 409,
            msg: 'Phone number already in use',
            res: response,
            fields: [{ field: 'CPF', message: 'Número de telefone já em uso' }],
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
      const { address, phone, ...clientData } = data;

      let savedAddress = null;
      let savedClient = null;
      let savedPhone = null;

      if (phone) {
        const existingPhone = await Phone.query()
          .where({
            id: phone.id,
            user_id: authPayload.user_id,
            client_id: parameters.id,
          })
          .first();
        console.log('existingPhone', existingPhone);
        if (!existingPhone) {
          return ErrorReturn({
            res: response,
            msg: 'Phone not found',
            status: 404,
            fields: [{ field: 'phone.id', message: 'Telefone não encontrado' }],
          });
        }
        const normalizeNumber = parsePhoneNumberFromString(phone.number, 'BR');
        existingPhone.merge({ number: normalizeNumber ? normalizeNumber.formatInternational() : phone.number });
        savedPhone = await existingPhone.save();
      }
      if (clientData) {
        const existingClient = await Client.query().where({ id: parameters.id, user_id: authPayload.user_id }).first();
        if (!existingClient) {
          return ErrorReturn({
            res: response,
            msg: 'Client not found',
            status: 404,
            fields: [{ field: 'address.id', message: 'Cliente não encontrado' }],
          });
        }
        existingClient.merge(clientData);
        savedClient = await existingClient.save();
      }

      if (address && address.id) {
        const existingAddress = await Address.query()
          .where({ id: address.id, user_id: authPayload.user_id, client_id: parameters.id })
          .first();
        if (!existingAddress) {
          return ErrorReturn({
            res: response,
            msg: 'Address not found',
            status: 404,
            fields: [{ field: 'address.id', message: 'Endereço não encontrado' }],
          });
        }
        const { id, ...addressData } = address; //remover o id para evitar a mudança dele.
        existingAddress.merge(addressData);
        savedAddress = await existingAddress.save();
      }

      let updateClietReturn = {};

      if (savedPhone) {
        updateClietReturn = {
          ...updateClietReturn,
          phone: {
            id: savedPhone.id,
            number: savedPhone.number,
          },
        };
      }

      if (savedClient) {
        updateClietReturn = {
          ...updateClietReturn,
          id: savedClient.id,
          ...clientData,
        };
      }

      if (savedAddress) {
        updateClietReturn = {
          ...updateClietReturn,
          address: {
            address,
          },
        };
      }
      if (updateClietReturn) {
        return SuccessReturn({ status: 200, msg: 'Success update client', res: response, data: updateClietReturn });
      } else {
        return ErrorReturn({ status: 500, msg: 'Update client error', res: response });
      }
    } catch (err) {
      console.log('errr', err);
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
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { remove_token: true } });
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

      const deleteClientReturn = {
        id: parameters.id,
      };

      return SuccessReturn({ status: 200, msg: 'Success delete client', res: response, data: deleteClientReturn });
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
