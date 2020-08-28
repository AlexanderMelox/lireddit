import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { ObjectType, Field, ID, Int } from 'type-graphql'

@ObjectType()
@Entity()
export class User {
  @ObjectIdColumn()
  @Field(() => ID)
  readonly id!: string

  @Column()
  @Field(() => Int, { defaultValue: () => Date.now() })
  createdAt: number

  @Column()
  @Field(() => String)
  username!: string

  @Column()
  password!: string
}
