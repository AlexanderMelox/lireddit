import { Connection, MongoEntityManager } from 'typeorm'
import { Request, Response } from 'express'

export type MyContext = {
  connection: Connection
  manager: MongoEntityManager
  req: Request
  res: Response
}
