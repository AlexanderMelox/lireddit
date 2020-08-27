import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class User {
  @Field(() => String)
  readonly id!: string

  @Field(() => String)
  username!: string
}
