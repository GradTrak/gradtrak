import mongoose from 'mongoose';

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost/gradtrak';

const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export async function connect() {
  await mongoose.connect(dbUrl, CONFIG);

  console.log('MongoDB connected');

  return mongoose.connection;
}
