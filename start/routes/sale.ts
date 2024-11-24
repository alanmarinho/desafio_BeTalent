import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

const SaleController = () => import('#controllers/http/sale_controller');

router
  .group(() => {
    router.get('/', [SaleController, 'index']);
    router.get('/show/:id', [SaleController, 'show']);
    router.post('/store', [SaleController, 'store']);
  })
  .prefix('/sale')
  .use(middleware.auth());
