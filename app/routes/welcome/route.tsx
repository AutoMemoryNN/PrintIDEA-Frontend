import type { loader } from './loader';

import { Form, useLoaderData } from '@remix-run/react';
export { loader } from './loader';
export { action } from './action';

import React from 'react';

export default function Index(): React.ReactElement {
	const { welcomeMessage, cookie } = useLoaderData<typeof loader>();

	return (
		<div>
			<h1>{welcomeMessage}</h1>
			<h3>Dear user:</h3>
			<p>
				<strong>Cookie:</strong> {cookie}
			</p>

			<Form method='post'>
				<input type='text' name='username' placeholder='Username' />
				<button type='submit'>Yea! that name</button>
			</Form>
		</div>
	);
}
