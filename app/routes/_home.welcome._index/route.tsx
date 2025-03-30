import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Form } from '@remix-run/react';
import { useNavigate } from '@remix-run/react';
import { axios } from '@shared/lib/axios';
import { useSession } from '@shared/lib/session';

import React from 'react';

import styles from './welcome.module.css';

export default function Index(): React.ReactElement {
	const session = useSession();
	const [username, setUsername] = React.useState(session.username);
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent): Promise<void> => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const nickname = formData.get('username') as string;

		try {
			const response = await axios.post('/your-endpoint', {
				alias: nickname,
			});

			console.log('Success:', response.data);
		} catch (_error) {
			return navigate('/organization/welcome');
		}
	};

	return (
		<div className={styles.routeContainer}>
			<Form onSubmit={handleSubmit} className={styles.routeContent}>
				<h1 className='text-3xl font-bold text-foreground truncate text-center'>
					Hi there{' '}
					<span className='text-transparent bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text'>
						{username || 'Unknown'}!
					</span>{' '}
					👋
				</h1>
				<Input
					label='Nickname'
					type='text'
					name='username'
					isRequired={true}
					size='lg'
					value={username}
					onValueChange={setUsername}
				/>
				<Button type='submit' color='primary' size='lg'>
					Yeah! That name
				</Button>
			</Form>
		</div>
	);
}
