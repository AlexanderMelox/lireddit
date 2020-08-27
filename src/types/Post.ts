import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class Post {
  @Field(() => String)
  readonly id!: string

  @Field(() => String)
  title!: string
}
