import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import { Post } from './entities/Post'
import mircroConfig from './mikro-orm.config'

const main = async () => {
  const orm = await MikroORM.init(mircroConfig)
  const { em } = orm
  orm.getMigrator().up()

  // const post = em.create(Post, { title: 'my first post' })
  // await em.persistAndFlush(post)

  const posts = await em.find(Post, {})
  console.log(posts)
}

main().catch((err) => {
  console.error(err)
})
