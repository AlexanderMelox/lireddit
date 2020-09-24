import gql from 'graphql-tag'
import * as Urql from 'urql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `Long` scalar type represents 52-bit integers */
  Long: any
}

export type Query = {
  __typename?: 'Query'
  posts?: Maybe<Array<Post>>
  post?: Maybe<Post>
  users: Array<User>
  me?: Maybe<User>
}

export type QueryPostArgs = {
  id: Scalars['String']
}

export type Post = {
  __typename?: 'Post'
  id: Scalars['ID']
  title: Scalars['String']
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  createdAt?: Maybe<Scalars['Long']>
  username: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createPost: Post
  updatePost?: Maybe<Post>
  deletePost: Scalars['Boolean']
  registerUser: UserResponse
  login: UserResponse
  deleteUser: Scalars['Boolean']
}

export type MutationCreatePostArgs = {
  title: Scalars['String']
}

export type MutationUpdatePostArgs = {
  title?: Maybe<Scalars['String']>
  id: Scalars['String']
}

export type MutationDeletePostArgs = {
  id: Scalars['String']
}

export type MutationRegisterUserArgs = {
  options: UsernamePasswordInput
}

export type MutationLoginArgs = {
  options: UsernamePasswordInput
}

export type MutationDeleteUserArgs = {
  id: Scalars['String']
}

export type UserResponse = {
  __typename?: 'UserResponse'
  errors?: Maybe<Array<FieldError>>
  user?: Maybe<User>
}

export type FieldError = {
  __typename?: 'FieldError'
  field: Scalars['String']
  message: Scalars['String']
}

export type UsernamePasswordInput = {
  username: Scalars['String']
  password: Scalars['String']
}

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput
}>

export type RegisterMutation = { __typename?: 'Mutation' } & {
  registerUser: { __typename?: 'UserResponse' } & {
    errors?: Maybe<
      Array<
        { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
      >
    >
    user?: Maybe<{ __typename?: 'User' } & Pick<User, 'id' | 'username'>>
  }
}

export const RegisterDocument = gql`
  mutation Register($options: UsernamePasswordInput!) {
    registerUser(options: $options) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
`

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument
  )
}
