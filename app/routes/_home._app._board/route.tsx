import { Outlet } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ToolBoardProvider } from './BoardToolContext.client';
import { Toolbar } from './ToolBar.client';

export default function BoardLayout() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<div>
			{isClient ? (
				<div className='board-container'>
					<ToolBoardProvider>
						<Toolbar>
							<Outlet />
						</Toolbar>
					</ToolBoardProvider>
				</div>
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
