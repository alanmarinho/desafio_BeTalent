import { HttpContext } from '@adonisjs/core/http';
import { IJwtPayload } from '#utils/interfaces/interfaces';
declare module '@adonisjs/core/http' {
  interface HttpContext {
    authPayload?: IJwtPayload;
  }
}
