import type { LoginResponse } from '@shared/types';

import { Button } from '@heroui/button';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from '@remix-run/react';
import { axios } from '@shared/lib/axios';

import cookies from 'js-cookie';
import React from 'react';

import { useMsal } from '@azure/msal-react';
import styles from './auth.module.css';

export function AuthBox(): React.ReactNode {
	const navigate = useNavigate();
	const { instance } = useMsal();
	const openGoogleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse): Promise<void> => {
			if (cookies.get('session')) {
				await logout();
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

			cookies.set('session', data.token);

			if (data.isNewUser) {
				return navigate('/welcome');
			}

			return navigate('/');
		},
		onError: (errorResponse): void => console.log(errorResponse),
	});

	const logout = async (): Promise<void> => {
		if (!cookies.get('session')) {
			return;
		}

		await axios.post('http://localhost:5173/mocks/logout', {
			// This is the URL of the mock server
			headers: {
				authorization: `Bearer ${cookies.get('session')}`,
			},
		});
		cookies.remove('session');
		console.log('Logged out');
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

			const userInfo = await axios.get(
				'http://localhost:5173/mocks/microsoft/',
				{
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				},
			);
			const data = userInfo.data as LoginResponse;
			cookies.set('session', data.token);
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
		<div className={styles.authBox}>
			<h1 className={styles.welcomeText}>Welcome!</h1>
			<h1>Log-in</h1>
			<Button onPress={handleGoogleLogin}>Log-in with Google</Button>
			<Button onPress={handleMicrosoftLogin}>
				Log-in with Microsoft
			</Button>
			<Button onPress={logout}>Logout</Button>
		</div>
	);
}
