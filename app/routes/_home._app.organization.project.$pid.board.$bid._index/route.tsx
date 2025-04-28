// app/routes/board.tsx
import { useEffect, useState } from 'react';
import { ProjectCanvas } from './projectCanvas.client';

export default function BoardRoute() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<div>
			{isClient ? (
				<ProjectCanvas />
			) : (
				<div className='flex h-screen w-screen items-center justify-center bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400'>
					<h1 className='text-3xl font-bold underline text-center mt-10 text-gray-500'>
						Loading Canvas...
					</h1>
				</div>
			)}
		</div>
	);
}
