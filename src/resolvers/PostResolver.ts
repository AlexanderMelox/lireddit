import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql'
import { Post } from '../entity/Post'
import { MyContext } from 'src/types'

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post], { nullable: true })
  async posts(@Ctx() { connection }: MyContext) {
    const postRepository = connection.getRepository(Post)
    const posts = postRepository.find()
    return posts
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg('id') id: string,
    @Ctx() { connection }: MyContext
  ): Promise<Post | undefined> {
    const postRepository = connection.getRepository(Post)
    const post = await postRepository.findOne(id)
    return post
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { connection }: MyContext
  ): Promise<Post> {
    let post = new Post()
    post.title = title
    const savedPost = await connection.manager.save(post)
    console.log('Post has beed created. The post id is ', post.id)
    return savedPost
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: string,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { connection }: MyContext
  ): Promise<Post | null> {
    const postRepository = connection.getRepository(Post)
    const post = await postRepository.findOne(id)

    if (!post) {
      return null
    }

    if (title) post.title = title

    const updatedPost = await postRepository.save(post)
    console.log('Post has beed updated. The post id is ', post.id)

    return updatedPost
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: string,
    @Ctx() { connection }: MyContext
  ): Promise<boolean> {
    const postRepository = connection.getRepository(Post)
    try {
      await postRepository.delete(id)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
}
