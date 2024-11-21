import router from '@adonisjs/core/services/router';

import './routes/auth.ts';
import './routes/product.ts';
import './routes/client.ts';
import './routes/sale.ts';

router.get('/', async () => 'It works!');
