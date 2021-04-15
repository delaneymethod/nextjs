import Head from 'next/head';
import { Fragment } from 'react';
//import { useState, useEffect } from 'react';

import { connectToDatabase } from '../utilities/mongodb';
import MeetupList from '../components/meetups/MeetupList';

/**
 * @returns {Promise<{props: {meetups: (*|*)}}>}
 */
export const getServerSideProps = async () => {
	const { db, client } = await connectToDatabase();

	const isConnected = await client.isConnected();

	if (!isConnected) {
		global.mongo.connection = null;

		throw new Error('[pages/index.js] 💩 Not connected to database');
	}

	const collection = db.collection('meetups');

	let meetups = await collection.find().toArray();

	meetups = meetups.map(meetup => ({
		id: meetup._id.toString(),
		title: meetup.title,
		image: meetup.image,
		address: meetup.address,
		description: meetup.description
	}));

	return {
		props: {
			meetups
		}
	};
};

/**
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const IndexPage = props => {
	/*
	const [meetups, setMeetups] = useState([]);

	useEffect(() => {
		setMeetups(props.meetups);
	}, []);
	*/

	return (
		<Fragment>
			<Head>
				<title>Scottish Meetups</title>
			</Head>
			<MeetupList meetups={props.meetups}/>
		</Fragment>
	);
};

export default IndexPage;
