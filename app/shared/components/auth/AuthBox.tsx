import {
	CredentialResponse,
	GoogleLogin,
	GoogleOAuthProvider,
} from '@react-oauth/google';
import styles from './auth.module.css';
import React from 'react';

import axios from 'axios';

const handleResponseMessage =
	(provider: string) =>
	async (response: CredentialResponse): Promise<void> => {
		console.log(`${provider} Login Success:`, response);

		await axios.post('/auth', new URLSearchParams({ provider }));
	};

const handleErrorMessage = (provider: string) => (): void => {
	console.error(`${provider} Login Failed`);
};

export default function AuthBox(): React.ReactNode {
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
		</div>
	);
}
