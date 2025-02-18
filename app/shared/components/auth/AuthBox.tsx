import {
	CredentialResponse,
	GoogleLogin,
	GoogleOAuthProvider,
} from '@react-oauth/google';
import styles from './auth.module.css';
import React from 'react';

function AuthBox(): React.ReactNode {
	const responseMessage = (response: CredentialResponse): void => {
		console.log('Google Login Success:', response);
	};

	const errorMessage = (): void => {
		console.log('Google Login Error');
	};
	return (
		<div className={styles.authBox}>
			<h1 className={styles.welcomeText}>Welcome!</h1>
			<GoogleOAuthProvider
				clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
			>
				<h1>Log-in</h1>
				<GoogleLogin
					onSuccess={responseMessage}
					onError={errorMessage}
				/>
			</GoogleOAuthProvider>
		</div>
	);
}

export default AuthBox;
