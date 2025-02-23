import { useMsal } from '@azure/msal-react';
import { Button } from '@heroui/button';
import {
	CredentialResponse,
	GoogleLogin,
	GoogleOAuthProvider,
} from '@react-oauth/google';

import cookies from 'js-cookie';
import React from 'react';

import styles from './auth.module.css';

const handleResponseMessage =
	(provider: string) =>
	(response: CredentialResponse): void => {
		console.log(`${provider} Login Success:`, response);
		const token = response.credential ?? '';
		cookies.set('session', token);
	};

const handleErrorMessage = (provider: string) => (): void => {
	console.error(`${provider} Login Failed`);
};

export function AuthBox(): React.ReactNode {
	const { instance } = useMsal();

	const microsoftLogin = (): void => {
		instance.loginPopup().catch((e) => handleErrorMessage(e)());
	};

	return (
		<div className={styles.authBox}>
			<h1 className={styles.welcomeText}>Welcome!</h1>
			<GoogleOAuthProvider
				clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
			>
				<h1>Log-in</h1>
				<GoogleLogin
					onSuccess={handleResponseMessage('google')}
					onError={handleErrorMessage('google')}
				/>
			</GoogleOAuthProvider>
			<Button onClick={microsoftLogin}>Log-in with Microsoft</Button>
		</div>
	);
}
