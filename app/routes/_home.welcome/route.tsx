import { Form } from '@remix-run/react';
import { useSession } from '@shared/lib/session';
export { action } from './action';

import React from 'react';

export default function Index(): React.ReactElement {
	const session = useSession();
	console.log(session);

	return (
		<div>
			<h1>Welcome</h1>
			<h3>Dear user:</h3>

			<Form method='post'>
				<h1>user: {session.username}</h1>
				<input type='text' name='username' placeholder='Username' />
				<button type='submit'>Yea! that name</button>
			</Form>
		</div>
	);
}
