import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb';
import { EmailDocument, ContentDocument, BusinessDocument, InvoiceDocument } from './types';

let client: MongoClient | null = null;
let db: Db | null = null;

interface Collections {
  emails: Collection<EmailDocument>;
  contents: Collection<ContentDocument>;
  clients: Collection<BusinessDocument>;
  providers: Collection<BusinessDocument>;
  invoices: Collection<InvoiceDocument>;
}

export async function getMongoClient(): Promise<Collections | null> {
  // Only attempt MongoDB connection if we're in the admin interface
  if (!window.location.pathname.startsWith('/koalax-admin')) {
    return handleMongoError(new Error('Not in admin interface'), null);
  }

  try {
    if (client && db) {
      await client.db().command({ ping: 1 });
      return getCollections(db);
    }

    if (!import.meta.env.VITE_MONGODB_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    client = new MongoClient(import.meta.env.VITE_MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    db = client.db('koalax');
    return getCollections(db);
  } catch (error) {
    return handleMongoError(error, null);
  }
}

function getCollections(db: Db): Collections {
  return {
    emails: db.collection<EmailDocument>('emails'),
    contents: db.collection<ContentDocument>('contents'),
    clients: db.collection<BusinessDocument>('clients'),
    providers: db.collection<BusinessDocument>('providers'),
    invoices: db.collection<InvoiceDocument>('invoices'),
  };
}

export const handleMongoError = (error: any, fallbackData: any) => {
  // Only log errors if we're in the admin interface
  if (window.location.pathname.startsWith('/koalax-admin')) {
    console.error('MongoDB Error:', error);
  }
  
  if (client) {
    client.close().catch(console.error);
    client = null;
    db = null;
  }
  
  return fallbackData;
};

export const closeMongoConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};