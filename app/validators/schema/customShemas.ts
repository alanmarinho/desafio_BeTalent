import type { FieldOptions, Validation } from '@vinejs/vine/types';
import { BaseLiteralType } from '@vinejs/vine';
import { dateFormat } from '#validators/rules/dateRules';
import { validCPF } from '#validators/rules/cpfRules';

export class isCPF extends BaseLiteralType<string, string, string> {
  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [validCPF()]);
  }

  clone() {
    return new isCPF(this.cloneOptions(), this.cloneValidations()) as this;
  }
}

interface IRangeDate {
  min: number;
  max?: number;
}

export class isValidDate extends BaseLiteralType<string, string, string> {
  constructor(range: IRangeDate, options?: FieldOptions, validations?: Validation<any>[]) {
    const { min, max } = range;
    super(options, validations || [dateFormat({ min, max })]);
  }

  clone() {
    return new isValidDate({ min: 1900, max: 2050 }, this.cloneOptions(), this.cloneValidations()) as this;
  }
}
