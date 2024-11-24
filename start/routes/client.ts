import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

const ClientController = () => import('#controllers/http/client_controller');

router
  .group(() => {
    router.get('/', [ClientController, 'index']);
    router.get('/show/:id', [ClientController, 'show']);
    router.post('/store', [ClientController, 'store']);
    router.put('/update/:id', [ClientController, 'update']);
    router.delete('/delete/:id', [ClientController, 'delete']);
  })
  .prefix('/client')
  .use(middleware.auth());
