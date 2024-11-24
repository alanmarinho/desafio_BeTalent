import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

const AuthController = () => import('#controllers/http/auth_controller');

router.group(() => {
  router.post('/login', [AuthController, 'login']);
  router.post('/signup', [AuthController, 'signup']);
  router.post('/logout', [AuthController, 'logout']).use(middleware.auth());
});
