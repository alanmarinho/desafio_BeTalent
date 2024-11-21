import router from '@adonisjs/core/services/router';

router.group(() => {
  router.post('/login', async () => {
    return JSON.stringify({ authToken: 'fwrf3ffqwfwcv' });
  });
  router.post('/signup', async () => {
    return JSON.stringify({ msg: 'signup' });
  });
  router.post('/logout', async () => {
    return JSON.stringify({ msg: 'logout' });
  });
});
