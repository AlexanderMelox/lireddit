import { Resolver, Arg, Mutation, InputType, Field, Ctx } from 'type-graphql'
import { User } from '../entity/'
import argon2 from 'argon2'
import { MyContext } from 'src/types'

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
  async registerUser(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { connection }: MyContext
  ) {
    const { username, password } = options
    // Hashes the password
    const hashedPassword = await argon2.hash(password)
    const userRepository = connection.getRepository(User)

    // Creates a new user instance
    const user: User = userRepository.create({
      username,
      password: hashedPassword,
    })

    // Save the user to the database
    await userRepository.save(user)

    return user
  }
}
