import {
	CalendarBlank,
	CheckSquareOffset,
	Folders,
	Gear,
	Icon,
	Question,
	SquaresFour,
	Users,
} from '@phosphor-icons/react';
import { Link, useLocation } from '@remix-run/react';
import { useSession } from '@shared/lib/session';
import { dataAttr } from '@shared/lib/utils';

import React from 'react';

const SideBarLink = ({
	to,
	icon,
	label,
}: {
	to: string;
	icon: Icon;
	label: string;
}) => {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			className='grid grid-cols-[2rem,1fr] gap-x-2 items-center data-[is-active="true"]:bg-default-200 data-[is-active="true"]:font-medium px-1 py-1.5 rounded-small transition-all'
			data-is-active={dataAttr(isActive)}
		>
			{React.createElement(icon, {
				size: 25,
				className: 'text-foreground',
				weight: isActive ? 'duotone' : 'regular',
			})}
			<span className='text-foreground text-small mt-1'>{label}</span>
		</Link>
	);
};

const SideBarSection = ({
	children,
	title,
}: {
	children: React.ReactNode;
	title: string;
}) => {
	return (
		<div className='flex flex-col gap-4'>
			<h3 className='text-default-600 text-small font-normal ml-2'>
				{title}
			</h3>
			{children}
		</div>
	);
};

export function SideBar(): React.ReactNode {
	const session = useSession();

	const userAlias = session.alias;
	const userEmail = session.email;

	return (
		<>
			<div className='flex flex-col gap-4 bg-default-100 p-4 border-r border-default-300'>
				<div className='grid grid-rows-2 grid-cols-[4rem,1fr] h-16 gap-x-2'>
					<div className='bg-default-300 rounded-full w-12 h-12 row-span-2 self-center justify-self-center' />
					<h3 className='self-end font-medium text-foreground'>
						{userAlias}
					</h3>
					<p className='text-small text-default-600'>{userEmail}</p>
				</div>
				<div className='bg-default-300 w-[23rem] h-px relative -translate-x-[2rem]' />
				<div className='flex flex-col gap-8'>
					<SideBarSection title='Main'>
						<SideBarLink
							to='/dashboard'
							icon={SquaresFour}
							label='Dashboard'
						/>
						<SideBarLink
							to='/organization'
							icon={Folders}
							label='Projects'
						/>
						<SideBarLink
							to='/tasks'
							icon={CheckSquareOffset}
							label='My Tasks'
						/>
						<SideBarLink
							to='/calendar'
							icon={CalendarBlank}
							label='Calendar'
						/>
					</SideBarSection>
					<SideBarSection title='Team'>
						<SideBarLink to='/team' icon={Users} label='Members' />
					</SideBarSection>
					<SideBarSection title='Settings'>
						<SideBarLink
							to='/settings'
							icon={Gear}
							label='Settings'
						/>
						<SideBarLink
							to='/support'
							icon={Question}
							label='Help & Support'
						/>
					</SideBarSection>
				</div>
			</div>
		</>
	);
}
