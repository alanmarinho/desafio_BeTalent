import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

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

  @column()
  declare sale_date: DateTime;

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime;
}
