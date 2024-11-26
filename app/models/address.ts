import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import User from './user.js';
import Client from './client.js';

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare client_id: number;

  @column()
  declare user_id: number;

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

  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user!: BelongsTo<typeof User>;

  @belongsTo(() => Client, { foreignKey: 'client_id' })
  public client!: BelongsTo<typeof Client>;
}
