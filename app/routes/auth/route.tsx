import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthBox } from './components/auth-box';

import React from 'react';

export default function Index(): React.ReactNode {
	return (
		<div className='grid place-items-center h-screen w-screen bg-slate-500'>
			<GoogleOAuthProvider
				clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
			>
				<AuthBox />
			</GoogleOAuthProvider>
		</div>
	);
}
