import {
  Entity,
  PrimaryKey,
  SerializedPrimaryKey,
  Property,
  Unique
} from '@mikro-orm/core'
import type { ObjectId } from '@mikro-orm/mongodb'

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  _id!: ObjectId

  // won't be saved in the database
  @SerializedPrimaryKey()
  id!: string

  @Property()
  @Unique()
  email!: string

  @Property({ hidden: true })
  code?: string

  @Property({ hidden: true })
  codeValidTo?: Date

  @Property()
  createdAt?: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date()
}
