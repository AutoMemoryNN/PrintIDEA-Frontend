import { Outlet } from '@remix-run/react';
import { SideBar } from '@shared/components/layout/side-bar';
import { ReactNode } from 'react';

export default function AppLayout(): ReactNode {
	return (
		<>
			<div className='grid grid-cols-[22rem,1fr] bg-background h-dvh w-dvw overflow-hidden'>
				<SideBar />
				<main className='p-8'>
					<Outlet />
				</main>
			</div>
		</>
	);
}
