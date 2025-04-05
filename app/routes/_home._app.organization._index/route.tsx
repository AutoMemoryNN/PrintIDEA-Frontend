import { Skeleton } from '@heroui/skeleton';
import { CalendarDots, CheckSquare } from '@phosphor-icons/react';
import { Link } from '@remix-run/react';
import { axios } from '@shared/lib/axios';
import { useQuery } from '@tanstack/react-query';

interface Project {
	id: string;
	name: string;
	description: string;
	status: string;
	priority: string;
	totalTasks: number;
	completedTasks: number;
	startDate?: string | undefined;
	endDate?: string | undefined;
}

const Project = ({
	id,
	name,
	description,
	totalTasks,
	completedTasks,
}: Project) => {
	const progress = (completedTasks / totalTasks) * 100;
	const to = `/organization/projects/${id}`;

	return (
		<Link
			to={to}
			className='border border-default-300 rounded-small grid grid-rows-[2rem,1fr,2rem] gap-2 py-2 px-4 h-36 hover:shadow-small transition-shadow'
		>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-medium'>{name}</h2>
				<div className='flex gap-x-2 pl-1.5 pr-2 py-1 justify-between rounded-full border border-success bg-success-50/20'>
					<div className='flex items-center justify-center w-3.5 h-3.5 rounded-full bg-success/30 border border-success/50' />
					<span className='text-tiny text-center text-success-700'>
						{progress}%
					</span>
				</div>
			</div>
			<p className='text-small text-foreground/70'>{description}</p>
			<div className='flex items-center justify-between'>
				<div className='flex gap-2 text-foreground/70'>
					<CheckSquare size={16} />
					<span className='text-tiny'>
						{completedTasks}/{totalTasks}
					</span>
				</div>
				<div className='flex gap-2 text-foreground/70'>
					<CalendarDots size={16} />
					<span className='text-tiny'>Jan 19</span>
				</div>
			</div>
		</Link>
	);
};

const Projects = () => {
	const projectsQuery = useQuery({
		queryKey: ['projects'],
		queryFn: () => {
			const projects = [
				{
					id: '1',
					name: 'Project A',
					description: 'Description of Project A',
					status: 'In Progress',
					priority: 'High',
					totalTasks: 10,
					completedTasks: 5,
				},
				{
					id: '2',
					name: 'Project B',
					description: 'Description of Project B',
					status: 'Completed',
					priority: 'Medium',
					totalTasks: 8,
					completedTasks: 8,
				},
			];

			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(projects);
				}, 1200);
			}) as Promise<Project[]>;
		},
	});

	const skeletons = Array.from({ length: 3 }, () => (
		<div
			className='border border-default-300 rounded-small grid grid-rows-[2rem,1fr,2rem] gap-2 py-2 px-4 h-36'
			key={crypto.randomUUID()}
		>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Skeleton className='rounded-small w-24 h-4' />
				</div>
				<Skeleton className='rounded-small w-16 h-4' />
			</div>
			<div className='flex flex-col gap-2'>
				<Skeleton className='rounded-small w-2/3 h-4' />
				<Skeleton className='rounded-small w-3/4 h-4' />
			</div>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Skeleton className='rounded-small w-16 h-4' />
				</div>
				<Skeleton className='rounded-small w-16 h-4' />
			</div>
		</div>
	));

	const projects = projectsQuery.data?.map((project) => (
		<Project
			id={project.id}
			key={project.name}
			name={project.name}
			description={project.description}
			status={project.status}
			priority={project.priority}
			totalTasks={project.totalTasks}
			completedTasks={project.completedTasks}
		/>
	));

	return (
		<div className='grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4'>
			{projectsQuery.isLoading ? skeletons : projects}
		</div>
	);
};

export default function OrganizationRoute() {
	return (
		<div className='flex flex-col gap-8'>
			<h1 className='text-2xl font-medium'>Organization Projects</h1>
			<Projects />
		</div>
	);
}
