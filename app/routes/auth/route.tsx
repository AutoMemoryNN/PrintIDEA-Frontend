import { AuthBox } from './components/auth-box';

import React from 'react';

export default function Index(): React.ReactNode {
	return (
		<div className='grid place-items-center h-screen w-screen bg-slate-500'>
			<AuthBox />
		</div>
	);
}
