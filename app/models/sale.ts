import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';

import Product from './product.js';
import Client from './client.js';
import User from './user.js';

export default class Sale extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare user_id: number;

  @column()
  declare client_id: number;

  @column()
  declare product_id: number;

  @column()
  declare quantity: number;

  @column()
  declare total_price: number;

  @column()
  declare unit_price: number;

  @column.dateTime()
  declare sale_date: DateTime;

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime;

  @belongsTo(() => Product, { foreignKey: 'product_id' })
  public product!: BelongsTo<typeof Product>;

  @belongsTo(() => Client, { foreignKey: 'client_id' })
  public client!: BelongsTo<typeof Client>;

  @belongsTo(() => User, { foreignKey: 'client_id' })
  public user!: BelongsTo<typeof User>;
}
