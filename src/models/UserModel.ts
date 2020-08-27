import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true, select: false },
})

const User: mongoose.Model<mongoose.Document, {}> = mongoose.model(
  'User',
  schema
)

export default User
