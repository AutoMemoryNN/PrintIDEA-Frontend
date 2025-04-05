import type { LoginResponse } from '@shared/types';

import { useMsal } from '@azure/msal-react';
import { Button } from '@heroui/button';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from '@remix-run/react';
import { axios } from '@shared/lib/axios';

import cookies from 'js-cookie';
import React from 'react';

import styles from './styles.module.css';

export function AuthBox(): React.ReactNode {
	const navigate = useNavigate();
	const { instance } = useMsal();
	const openGoogleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse): Promise<void> => {
			await logout();

			const userInfo = await axios.get('/login?provider=google', {
				headers: {
					authorization: `Bearer ${tokenResponse.access_token}`,
				},
			});

			console.log(userInfo);

			const data = userInfo.data as LoginResponse;

			cookies.set('session', data.jwt);

			if (data.isNewUser) {
				return navigate('/welcome');
			}

			return navigate('/organization');
		},
		onError: (errorResponse): void => console.log(errorResponse),
	});

	const logout = async (): Promise<void> => {
		if (!cookies.get('session')) {
			return Promise.resolve();
		}

		const response = await axios.delete('/login', {
			headers: {
				authorization: `Bearer ${cookies.get('session')}`,
			},
		});

		console.log(response);

		cookies.remove('session');
		console.log('Logged out');
		return Promise.resolve();
	};
	const handleMicrosoftLogin = async (): Promise<void> => {
		try {
			if (cookies.get('session')) {
				await logout();
			}
			const loginResponse = await instance.loginPopup({
				scopes: ['User.Read'],
			});
			const { accessToken } = await instance.acquireTokenSilent({
				scopes: ['User.Read'],
				account: loginResponse.account,
			});

			const userInfo = await axios.get('/mocks/microsoft/', {
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});
			const data = userInfo.data as LoginResponse;
			cookies.set('session', data.jwt);
			if (data.isNewUser) {
				return navigate('/welcome');
			}
			return navigate('/');
		} catch (error) {
			console.error('Microsoft login error:', error);
		}
	};

	const handleGoogleLogin = (): void => {
		openGoogleLogin();
	};

	return (
		<main className={styles.mainContainer}>
			<h1 className={styles.title}>
				Print
				<span className={styles.titleAccent}>Idea!</span>
			</h1>
			<h2>Log-in</h2>
			<Button
				className={styles.button}
				onPress={handleGoogleLogin}
				color='primary'
				size='lg'
			>
				Log-in with <b>Google</b>
			</Button>
			<Button
				className={styles.button}
				onPress={handleMicrosoftLogin}
				color='primary'
				size='lg'
			>
				Log-in with <b>Microsoft</b>
			</Button>
			<Button
				className={styles.button}
				onPress={logout}
				color='danger'
				size='lg'
			>
				Logout
			</Button>
		</main>
	);
}
