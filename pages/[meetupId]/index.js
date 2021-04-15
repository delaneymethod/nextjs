import Head from 'next/head';
import { Fragment } from 'react';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';

import { connectToDatabase } from '../../utilities/mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';

/**
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const MeetupDetails = props => (
	<Fragment>
		<Head>
			<title>{props.meetup.title} :: Scottish Meetups</title>
		</Head>
		<MeetupDetail
			title={props.meetup.title}
			image={props.meetup.image}
			address={props.meetup.address}
			description={props.meetup.description}
		/>
	</Fragment>
);

/**
 * @param context
 * @returns {Promise<{props: {meetup: {image, address, description, id: string, title}}}>}
 */
export const getServerSideProps = async context => {
	if (!context.params.hasOwnProperty('meetupId')) {
		const router = useRouter();

		await router.push('/');
	}

	const { db, client } = await connectToDatabase();

	const isConnected = await client.isConnected();

	if (!isConnected) {
		global.mongo.connection = null;

		throw new Error('[pages/index.js] 💩 Not connected to database');
	}

	const collection = db.collection('meetups');

	// Gets a string value
	let { meetupId } = context.params;
	meetupId = ObjectId(meetupId);

	const document = await collection.findOne({ _id: meetupId });

	const meetup = {
		id: document._id.toString(),
		title: document.title,
		image: document.image,
		address: document.address,
		description: document.description
	};

	return {
		props: {
			meetup
		}
	};
};

export default MeetupDetails;
