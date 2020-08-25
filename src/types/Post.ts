import { ObjectType, Field } from 'type-graphql'
import { ObjectId } from 'mongodb'
import GraphQLObjectId from 'graphql-scalar-objectid'

@ObjectType()
export class Post {
  @Field(() => GraphQLObjectId)
  readonly id!: ObjectId

  @Field(() => String)
  title!: string
}
