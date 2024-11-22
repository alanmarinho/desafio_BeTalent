import type { HttpContext } from '@adonisjs/core/http';
import { signupValidator, loginValidator } from '#validators/auth';
import { ErrorReturn } from '#utils/errorReturn';
import { SuccessReturn } from '#utils/successReturn';
import User from '#models/user';
import { FieldError } from '#utils/fieldErrorPatern';
import { errors } from '@vinejs/vine';
import { keyGenerator } from '#utils/auth/authKeyGenerator';

import hash from '@adonisjs/core/services/hash';
import jwt from 'jsonwebtoken';
import { encrypt } from '#utils/auth/encryptAndDecrypt';
import env from '#start/env';
import Session from '#models/session';
import { RemoveSession } from '#utils/auth/removeSession';

const APP_KEY = env.get('APP_KEY');

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(loginValidator);

      const existentUser = await User.findBy({ email: data.email });

      if (!existentUser) {
        return ErrorReturn({
          res: response,
          status: 404,
          msg: 'User not found',
          fields: [{ field: 'email', message: 'Usuário não encontrado' }],
        });
      }
      const passwordIsValid = await hash.verify(existentUser.password, data.password);

      if (!passwordIsValid) {
        return ErrorReturn({
          res: response,
          status: 401,
          msg: 'Incorrect password',
          fields: [{ field: 'password', message: 'Senha incorreta' }],
        });
      }

      const JwtKey = keyGenerator();
      const encriptJwtKey = encrypt({ data: JwtKey, key: APP_KEY });

      const sessionData = {
        user_id: existentUser.id,
        token_key: encriptJwtKey,
      };
      try {
        const newSession = await Session.create(sessionData);

        const sessionJWT = jwt.sign({ user_id: existentUser.id, session_id: newSession.id }, JwtKey); //sem tempo de expiração

        if (sessionJWT) {
          return SuccessReturn({
            msg: 'login successful',
            status: 200,
            res: response,
            data: { authToken: sessionJWT },
          });
        } else {
          if (newSession) {
            await newSession.delete();
          }
          return ErrorReturn({ status: 500, msg: 'Create user error', res: response });
        }
      } catch (err) {
        console.log('err', err);
        return ErrorReturn({
          res: response,
          status: 500,
          msg: 'Create session erro, try later',
        });
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
      console.log('err', err);
      return ErrorReturn({
        res: response,
        status: 500,
        msg: 'Internal Serveer error',
      });
    }
  }

  public async signup({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(signupValidator);

      const existentUser = await User.findBy({ email: data.email });

      if (existentUser) {
        return ErrorReturn({
          res: response,
          status: 409,
          msg: 'email already registered',
          fields: [{ field: 'email', message: 'Email já cadastrado!' }],
        });
      }

      const newUserData = {
        name: data.name,
        email: data.email,
        password: await hash.make(data.password),
      };

      const newUser = await User.create(newUserData);

      if (!!newUser) {
        return SuccessReturn({ status: 201, msg: 'Success create user', res: response });
      } else {
        return ErrorReturn({ status: 500, msg: 'Create user error', res: response });
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

  public async logout({ response, authPayload }: HttpContext) {
    try {
      if (!authPayload) {
        return ErrorReturn({ res: response, status: 401, msg: 'Not authenticated', actions: { logout: true } });
      }

      const success = await RemoveSession({ session_id: authPayload.session_id });
      if (success) {
        return SuccessReturn({ res: response, status: 200, msg: 'Success logout' });
      } else {
        return ErrorReturn({ status: 500, msg: 'Remove session error', res: response, actions: { logout: true } });
      }
    } catch (err) {
      return ErrorReturn({ res: response, msg: 'Internal server error', status: 500 });
    }
  }
}
