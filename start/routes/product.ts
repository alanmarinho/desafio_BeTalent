import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

const ProductController = () => import('#controllers/http/product_controller');

router
  .group(() => {
    router.get('/', [ProductController, 'index']);
    router.get('/show/:id', [ProductController, 'show']);
    router.post('/store', [ProductController, 'store']);
    router.put('/update/:id', [ProductController, 'update']);
    router.put('/delete/:id', [ProductController, 'delete']);
  })
  .prefix('/product')
  .use(middleware.auth());
