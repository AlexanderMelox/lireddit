import { Resolver, Arg, Mutation, InputType, Field } from 'type-graphql'
import { User } from '../types/User'
import UserModel from '../models/UserModel'
import argon2 from 'argon2'

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async registerUser(@Arg('options') options: UsernamePasswordInput) {
    const hashedPassword = await argon2.hash(options.password)
    const user = await UserModel.create({
      username: options.username,
      password: hashedPassword,
    })
    return user
  }
}
