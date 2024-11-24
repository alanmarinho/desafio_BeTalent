import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';

import { DateTime } from 'luxon';

interface IRangeDate {
  min: number;
  max?: number;
}

//ISO 8601 regex. fonte:https://stackoverflow.com/questions/12756159/regex-and-iso8601-formatted-datetime
const isoRegex =
  /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

const dateFormat = vine.createRule((value: unknown, _: undefined, field: FieldContext) => {
  if (typeof value !== 'string') {
    field.report('The {{ field }} field value must be a string', 'dateFormat', field);
    return;
  }

  if (!isoRegex.test(value)) {
    field.report('The {{ field }} field value is not a valid date, use ISO 8601', 'dateFormat', field);
    return;
  }

  const formatedDate = DateTime.fromISO(value);

  if (!formatedDate) {
    field.report('Not valid date', 'dateFormat', field);
    return;
  }

  field.mutate(formatedDate, field);
});

const notInFuture = vine.createRule((value: unknown, _: undefined, field: FieldContext) => {
  const formatedDate = DateTime.fromISO(value as string);

  if (DateTime.fromISO(value as string) > DateTime.now()) {
    field.report('Not valid date, the date is in the future', 'notInFuture', field);
    return;
  }
  field.mutate(formatedDate, field);
});

// a inesistencia no max indica que a data não deve ser no futuro
const dateRange = vine.createRule((value: unknown, { min, max }: IRangeDate, field: FieldContext) => {
  const dateFormated = DateTime.fromISO(value as string);

  if (!max && dateFormated > DateTime.now()) {
    field.report('Not valid date, the date is in the future', 'dateRange', field);
    return;
  }

  if (max && dateFormated.year > DateTime.fromISO(max.toString()).year) {
    field.report(`Invalid date, too far in the future. Use dates from ${max} or less`, 'dateRange', field);
    return;
  }

  if (dateFormated.year < DateTime.fromISO(min.toString()).year) {
    field.report(`Invalid date, too far in the past. Use dates from ${min} or higher`, 'dateRange', field);
    return;
  }

  field.mutate(value, field);
});

export { dateFormat, notInFuture, dateRange };
