import { MsalProvider } from '@azure/msal-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthBox } from './components/auth-box';

import { PublicClientApplication } from '@azure/msal-browser';
import React from 'react';

export default function Index(): React.ReactNode {
	const msalConfig = {
		auth: {
			clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
		},
	};
	const pca = new PublicClientApplication(msalConfig);

	return (
		<div className='grid place-items-center h-screen w-screen bg-slate-500'>
			<MsalProvider instance={pca}>
				<GoogleOAuthProvider
					clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
				>
					<AuthBox />
				</GoogleOAuthProvider>
			</MsalProvider>
		</div>
	);
}
