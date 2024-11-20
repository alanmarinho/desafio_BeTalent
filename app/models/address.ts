import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare client_id: string;

  @column()
  declare road: string;

  @column()
  declare number: number;

  @column()
  declare complement: string;

  @column()
  declare neighborhood: string;

  @column()
  declare city: string;

  @column()
  declare state: string;

  @column()
  declare country: string;

  @column()
  declare zip_code: string;

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime;
}
