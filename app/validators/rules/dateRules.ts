import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';

import { DateTime } from 'luxon';

interface IRangeDate {
  min: number;
  max?: number;
}

//ISO 8601 regex.
const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})$/;

// a inesistencia no max indica que a data não deve ser no futuro
const dateFormat = vine.createRule((value: unknown, { min, max }: IRangeDate, field: FieldContext) => {
  if (typeof value !== 'string') {
    field.report('The {{ field }} field value must be a string', 'dateFormat', field);
    return;
  }

  if (isoRegex.test(value) === false) {
    field.report(
      'The {{ field }} field value is not a valid date, use full ISO 8601: YYYY-MM-DDThh:mm:ss.sss±hh:mm',
      'dateFormat',
      field,
    );
    return false;
  }

  const formatedDate = DateTime.fromISO(value);

  if (!formatedDate) {
    field.report('Not valid date', 'dateFormat', field);
    return;
  }
  if (!max && formatedDate > DateTime.now()) {
    field.report('Not valid date, the date is in the future', 'dateRange', field);
    return;
  }

  if (max && formatedDate.year > DateTime.fromISO(max.toString()).year) {
    field.report(`Invalid date, too far in the future. Use dates from ${max} or less`, 'dateRange', field);
    return;
  }

  if (formatedDate.year < DateTime.fromISO(min.toString()).year) {
    field.report(`Invalid date, too far in the past. Use dates from ${min} or higher`, 'dateRange', field);
    return;
  }

  field.mutate(formatedDate, field);
});

export { dateFormat };
