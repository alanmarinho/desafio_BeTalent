import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare user_id: number;

  @column()
  declare name: string;

  @column()
  declare unit_price: number;

  @column()
  declare description: string;

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime;
}
