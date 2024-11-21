import router from '@adonisjs/core/services/router';

router
  .group(() => {
    router.get('/', async () => {
      return JSON.stringify({ msg: 'listAll' });
    });
    router.get('/show/:id', ({ params, request }) => {
      return JSON.stringify({ msg: `details params ${params.id}, ${request.header('Authorization')}` });
    });
    router.post('/store', ({ request }) => {
      const data = request.body();
      return JSON.stringify({ msg: 'new', data: data });
    });
  })
  .prefix('/sale');
