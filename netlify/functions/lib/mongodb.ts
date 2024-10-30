import { MongoClient, ServerApiVersion } from 'mongodb';
import { withAsyncHandler, retryWithBackoff } from '../../../src/lib/asyncUtils';

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  return await retryWithBackoff(async () => {
    if (cachedClient) {
      return cachedClient;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    const { data: client, error } = await withAsyncHandler(async () => {
      const client = new MongoClient(process.env.MONGODB_URI!, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      await client.connect();
      return client;
    });

    if (error) throw error;
    cachedClient = client!;
    return client!;
  });
}

export async function getDatabase() {
  const client = await connectToDatabase();
  return client.db('koalax');
}