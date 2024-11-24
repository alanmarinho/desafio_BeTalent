import type { FieldOptions, Validation } from '@vinejs/vine/types';
import { BaseLiteralType } from '@vinejs/vine';
import { dateFormat, notInFuture, dateRange } from '#validators/rules/dateRules';
import { validCPF } from '#validators/rules/cpfRules';

export class isCPF extends BaseLiteralType<string, string, string> {
  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [validCPF()]);
  }

  clone() {
    return new isCPF(this.cloneOptions(), this.cloneValidations()) as this;
  }
}

class notInFutureClass extends BaseLiteralType<string, string, string> {
  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [notInFuture()]);
  }

  clone() {
    return new notInFutureClass(this.cloneOptions(), this.cloneValidations()) as this;
  }
}
interface IRangeDate {
  min: number;
  max?: number;
}
class dateRangeClass extends BaseLiteralType<string, string, string> {
  constructor(range: IRangeDate, options?: FieldOptions, validations?: Validation<any>[]) {
    const { min, max } = range;
    super(options, validations || [dateRange({ min, max })]);
  }

  clone() {
    return new dateRangeClass({ min: 1900, max: 2050 }, this.cloneOptions(), this.cloneValidations()) as this;
  }
}

export class isISO8601Format extends BaseLiteralType<string, string, string> {
  public notInFuture: () => notInFutureClass;
  public dateRange: (range: IRangeDate) => dateRangeClass;

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [dateFormat()]);
    this.notInFuture = () => {
      return new notInFutureClass();
    };
    this.dateRange = (range) => {
      return new dateRangeClass(range as IRangeDate);
    };
  }

  clone() {
    return new isISO8601Format(this.cloneOptions(), this.cloneValidations()) as this;
  }
}
