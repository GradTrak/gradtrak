import mongoose from 'mongoose';

const defaultDbUrl = process.env.NODE_ENV === 'test'? 'mongodb://localhost/gradtrak-test': 'mongodb://localhost/gradtrak'
const dbUrl = process.env.MONGO_URL || defaultDbUrl;

const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export async function connect(): Promise<mongoose.Connection> {
  await mongoose.connect(dbUrl, CONFIG);

  console.log('MongoDB connected');

  return mongoose.connection;
}
