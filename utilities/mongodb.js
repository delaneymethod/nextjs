import { MongoClient } from 'mongodb';

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
	throw new Error('[mongodb.js] 🐛 Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
	throw new Error('[mongodb.js] 🐛 Please define the MONGODB_DB environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
	cached = global.mongo = {
		connection: null
	};
}

/**
 * @returns {Promise<null|*|{client: MongoClient, db: Db}>}
 */
export const connectToDatabase = async () => {
	if (cached.connection) {
		console.log('[mongodb.js] 👌 Using existing database connection');

		return cached.connection;
	}

	console.log('[mongodb.js] 🔥 New database connection');

	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		maxIdleTimeMS: 10000,
		socketTimeoutMS: 10000,
		serverSelectionTimeoutMS: 10000
	};

	const client = new MongoClient(MONGODB_URI, options);

	await client.connect();

	const db = client.db(MONGODB_DB);

	cached.connection = {
		db,
		client
	};

	return cached.connection;
};

/**
 * @returns {Promise<void>}
 */
export const disconnectFromDatabase = async () => {
	if (cached.connection) {
		await cached.connection.client.close();

		cached.connection = null;

		console.log('[mongodb.js] 👌 Database disconnected');
	}
};
