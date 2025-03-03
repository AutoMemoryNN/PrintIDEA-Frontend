import type { LoginResponse } from '@shared/types';

import { useMsal } from '@azure/msal-react';
import { Button } from '@heroui/button';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from '@remix-run/react';
import { axios } from '@shared/lib/axios';

import cookies from 'js-cookie';
import React from 'react';

import styles from './auth.module.css';

export function AuthBox(): React.ReactNode {
	const { instance } = useMsal();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = React.useState(false);

	const openGoogleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse): Promise<void> => {
			if (import.meta.env.MODE !== 'development') {
				throw new Error('Mocks are only available in development mode');
			}
			const userInfo = await axios.get(
				'http://localhost:5173/mocks/google/', // This is the URL of the mock server
				{
					headers: {
						authorization: `Bearer ${tokenResponse.access_token}`,
					},
				},
			);

			const data = userInfo.data as LoginResponse;
			console.log({ tokenResponse, data });

			cookies.set('session', data.token);

			if (data.isNewUser) {
				return navigate('/welcome');
			}

			return navigate('/');
		},
		onError: (errorResponse): void => console.log(errorResponse),
	});

	const logout = async (): Promise<void> => {
		if (import.meta.env.MODE !== 'development') {
			throw new Error('Mocks are only available in development mode');
		}
		await axios.post('http://localhost:5173/mocks/logout', {
			// This is the URL of the mock server
			headers: {
				authorization: `Bearer ${cookies.get('session')}`,
			},
		});
		cookies.remove('session');
	};

	const handleMicrosoftLogin = (): void => {
		instance.loginPopup().catch((e) => console.log(e));
	};

	const handleGoogleLogin = (): void => {
		setIsLoading(true);
		openGoogleLogin();
	};

	return (
		<div className={styles.authBox}>
			<h1 className={styles.welcomeText}>Welcome!</h1>
			<h1>Log-in</h1>
			<Button onPress={handleGoogleLogin}> Log-in with Google</Button>

			<Button isLoading={isLoading} onPress={handleMicrosoftLogin}>
				Log-in with Microsoft
			</Button>

			<Button onPress={logout}>Logout</Button>
		</div>
	);
}
