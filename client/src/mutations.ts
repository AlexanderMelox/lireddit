export const Register = `
  mutation ($options: UsernamePasswordInput!) {
    registerUser(options: $options) {
      errors {
        field
        message
      }
      user {
        username
      }
    }
  }
`
