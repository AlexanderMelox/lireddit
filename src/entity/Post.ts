import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity()
export class Post {
  @ObjectIdColumn()
  @Field(() => ID)
  readonly id!: string

  @Column()
  @Field(() => String)
  title!: string
}
