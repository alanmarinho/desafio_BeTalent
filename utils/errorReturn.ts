import type { Response } from '@adonisjs/core/http';

interface IFieldError {
  message: string;
  field: string | null;
}

interface IErrorActions {
  refresh?: boolean;
  logout?: boolean;
}

interface IErrorReturn {
  res: Response;
  status: number;
  msg: string;
  fields?: IFieldError[];
  actions?: IErrorActions;
}

export function ErrorReturn({ msg, fields, actions, res, status }: IErrorReturn) {
  const errorReturn = {
    msg: msg,
    status: status,
    ...(fields && { fields: fields }),
    ...(actions && { actions: actions }),
  };
  res.status(status).json(errorReturn);
}
