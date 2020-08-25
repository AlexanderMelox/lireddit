import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: String,
})

const Post: mongoose.Model<mongoose.Document, {}> = mongoose.model(
  'Post',
  schema
)

export default Post
