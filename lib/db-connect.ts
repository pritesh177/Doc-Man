import { MongoClient } from 'mongodb';
const MONGODB_URI = process.env.MONGODB_URI as string;
let cachedClient: MongoClient | null = null;
export async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) {
    console.log("Using cached database instance");
    return cachedClient;
  }
  const client = new MongoClient(MONGODB_URI, {
  });
  await client.connect();
  console.log("Database connected");
  cachedClient = client;
  return client;
}