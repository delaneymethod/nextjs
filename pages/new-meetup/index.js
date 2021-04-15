import Head from 'next/head';
import { Fragment } from 'react';
import { useRouter } from 'next/router';

import NewMeetupForm from '../../components/meetups/NewMeetupForm';

const NewMeetupPage = () => {
	const router = useRouter();

	const addMeetupHandler = async meetupData => {
		const input = '/api/new-meetup';
		const init = {
			method: 'POST',
			body: JSON.stringify(meetupData),
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const response = await fetch(input, init);

		await response.json();

		await router.push('/');
	};

	return (
		<Fragment>
			<Head>
				<title>New Meetup :: Scottish Meetups</title>
			</Head>
			<NewMeetupForm onAddMeetup={addMeetupHandler}/>
		</Fragment>
	);
};

export default NewMeetupPage;
