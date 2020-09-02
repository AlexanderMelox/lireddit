import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import GraphQLLong from 'graphql-type-long'

@ObjectType()
@Entity()
export class User {
  @ObjectIdColumn()
  @Field(() => ID)
  readonly id!: string

  @Column()
  @Field(() => GraphQLLong, { defaultValue: () => Date.now() })
  readonly createdAt: number

  @Column()
  @Field(() => String)
  username!: string

  @Column()
  password!: string
}
