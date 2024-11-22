import Session from '#models/session';
import { decrypt } from '#utils/auth/encryptAndDecrypt';
import { ValidateJWT } from '#utils/auth/validateJWT';
import { ErrorReturn } from '#utils/errorReturn';
import { IJwtPayload } from '#utils/interfaces/interfaces';
import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import jwt from 'jsonwebtoken';

import env from '#start/env';
const APP_KEY = env.get('APP_KEY');

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      const token = ctx.request.header('Authorization')?.split(' ')[1];

      if (!token) {
        return ErrorReturn({
          res: ctx.response,
          msg: 'Token not send',
          status: 401,
          actions: { logout: true },
        });
      }
      const tokenPayload = jwt.decode(token) as IJwtPayload;

      const userSession = await Session.findBy({ id: tokenPayload.session_id, user_id: tokenPayload.user_id });

      if (!userSession) {
        return ErrorReturn({
          res: ctx.response,
          status: 401,
          msg: 'Not authenticated',
          actions: { logout: true },
        });
      }

      const decriptedJwtKey = decrypt({ data: userSession.token_key, key: APP_KEY });

      const [payload, status] = await ValidateJWT({ jwt: token, key: decriptedJwtKey });

      switch (status) {
        case 'Valid':
          ctx.authPayload = payload as IJwtPayload;
          await next();
          break;
        case 'Expired':
          return ErrorReturn({
            res: ctx.response,
            msg: 'Expired token ',
            status: 401,
            actions: { logout: true },
          });

        case 'Invalid':
          return ErrorReturn({
            res: ctx.response,
            msg: 'Invalid token',
            status: 401,
            actions: { logout: true },
          });

        default:
          return ErrorReturn({
            res: ctx.response,
            msg: 'Token validation error',
            status: 500,
            actions: { logout: true },
          });
      }
    } catch (err) {
      console.log('err', err);
      return ErrorReturn({
        res: ctx.response,
        msg: 'Internal server error',
        status: 500,
      });
    }
  }
}
