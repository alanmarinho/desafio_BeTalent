import router from '@adonisjs/core/services/router';

import './routes/auth.ts';
import './routes/product.ts';
import './routes/client.ts';
import './routes/sale.ts';

router.get('/', ({ response }) => {
  response.status(200).json({ working: true, project_ulr: 'https://github.com/alanmarinho/desafio_BeTalent' });
});

// :)
