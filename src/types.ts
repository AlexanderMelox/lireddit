import { Connection } from 'typeorm'

export type MyContext = {
  connection: Connection
}
