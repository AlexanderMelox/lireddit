import {
  Resolver,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  ObjectType,
  Query,
} from 'type-graphql'
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

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() { manager }: MyContext): Promise<User[]> {
    const users = await manager.find(User, {})
    return users
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, manager }: MyContext) {
    // You are not logged in
    if (!req.session!.userId) {
      return null
    }

    const user = await manager.findOne(User, req.session!.userId)
    return user
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { manager, req }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options

    const userExists = await manager.findOne(User, { username })

    if (userExists) {
      return {
        errors: [
          {
            field: 'username',
            message: 'The username is already taken',
          },
        ],
      }
    }

    // Validate username
    if (username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'The username should be longer than 2 characters',
          },
        ],
      }
    }

    // Check if the password is long
    if (password.length <= 4) {
      return {
        errors: [
          {
            field: 'password',
            message: 'The password should be longer than 4 characters',
          },
        ],
      }
    }

    // Hashes the password
    const hashedPassword = await argon2.hash(password)

    // Creates a new user instance
    const user: User = manager.create(User, {
      username,
      password: hashedPassword,
      createdAt: Date.now(),
    })

    // Save the user to the database
    await manager.save(user)

    // This will set the user cookie so they can
    // log in
    req.session!.userId = user.id

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { manager, req }: MyContext
  ): Promise<UserResponse> {
    const user = await manager.findOne(User, { username: options.username })

    let valid = false
    if (user) {
      valid = await argon2.verify(user.password, options.password)
    }

    if (!user || !valid) {
      return {
        errors: [
          {
            field: 'password',
            message: `The username or the password is incorrect. Try again?`,
          },
        ],
      }
    }

    req.session!.userId = user.id

    return {
      user,
    }
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg('id') id: string,
    @Ctx() { manager }: MyContext
  ): Promise<boolean> {
    try {
      await manager.delete(User, id)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
