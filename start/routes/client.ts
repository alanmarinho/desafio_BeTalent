import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import type { HttpContext } from '@adonisjs/core/http';
router
  .group(() => {
    router.get('/', async (ctx: HttpContext) => {
      return JSON.stringify({ msg: 'listAll', authData: ctx.authPayload });
    });
    router.get('/show/:id', ({ params, request }) => {
      return JSON.stringify({ msg: `details params ${params.id}, ${request.header('Authorization')}` });
    });
    router.post('/store', ({ request }) => {
      const data = request.body();
      return JSON.stringify({ msg: 'new product', data: data });
    });
    router.put('/update/:id', ({ params, request }) => {
      const data = request.body();
      return JSON.stringify({ msg: `update ${params.id}`, data: data });
    });
    router.delete('/delete/:id', ({ params }) => {
      return JSON.stringify({ msg: `Delet ${params.id}` });
    });
  })
  .prefix('/client')
  .use(middleware.auth());
