const mongoose = require('mongoose')

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    return
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
  console.log(`MongoDB connected: ${mongoose.connection.host}`)
  return mongoose.connection
}

module.exports = connectDB
module.exports.connectDB = connectDB
