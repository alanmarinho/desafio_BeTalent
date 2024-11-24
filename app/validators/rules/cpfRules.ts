import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';

import { cpf } from 'cpf-cnpj-validator';

const validCPF = vine.createRule((value: unknown, _: undefined, field: FieldContext) => {
  const fullCPFRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;

  if (typeof value !== 'string') {
    field.report('The {{ field }} field value must be a string', 'validCPF', field);
    return;
  }

  if (!value.match(fullCPFRegex) && !/^\d{11}$/.test(value)) {
    field.report('Not valid CPF', 'validCPF', field);
    return;
  }

  const onlyNumbers = value.replace(/\D/g, '');

  if (!cpf.isValid(onlyNumbers)) {
    field.report('Not valid CPF', 'validCPF', field);
    return;
  }
  field.mutate(onlyNumbers, field);
});

export { validCPF };
