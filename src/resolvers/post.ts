import { Resolver, Query, Arg, Mutation } from 'type-graphql'
import { DocumentQuery, Document } from 'mongoose'
import { Post } from '../types/Post'
import PostModel from '../models/Post'

@Resolver()
export class PostResolver {
  @Query(() => [Post], { nullable: true })
  posts(): DocumentQuery<Document[], Document, {}> {
    return PostModel.find({})
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg('id') id: string): Promise<Document | null> {
    const post = await PostModel.findById(id)
    console.log('get post', post)
    return post
  }

  @Mutation(() => Post)
  async createPost(@Arg('title') title: string): Promise<Document> {
    const post = await PostModel.create({ title })
    return post
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: string,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Document | null> {
    const post: any = await PostModel.findById(id)

    if (!post) {
      return null
    }

    if (title) post.title = title

    await post.save()

    return post
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: string): Promise<boolean> {
    const deletedPost = await PostModel.findByIdAndDelete(id)
    if (deletedPost) return true
    return false
  }
}
