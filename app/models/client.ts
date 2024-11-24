import { DateTime } from 'luxon';

import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';

import User from '#models/user';
import Sale from './sale.js';

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare user_id: number;

  @column()
  declare name: string;

  @column()
  declare CPF: string;

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime;

  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user!: BelongsTo<typeof User>;

  @hasMany(() => Sale, { foreignKey: 'user_id' })
  public sales!: HasMany<typeof Sale>;
}
