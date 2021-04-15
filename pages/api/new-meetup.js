import { connectToDatabase } from '../../utilities/mongodb';

/**
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
const handler = async (request, response) => {
	if (request.method === 'POST') {
		const { client, db } = await connectToDatabase();

		const isConnected = await client.isConnected();

		if (!isConnected) {
			// throw new Error('[api/new-meetup.js] 💩 Not connected to database');

			response.status(500).json({ error: 'Not connected to database' });
		}

		const collection = db.collection('meetups');

		const meetup = request.body;

		await collection.insertOne(meetup);

		response.status(200).json({ message: 'New meetup added successfully!' });
	}
};

export default handler;
