import { Skeleton } from '@heroui/skeleton';
import { CalendarDots, CheckSquare } from '@phosphor-icons/react';
import { Link } from '@remix-run/react';
import { useOrganization } from '@shared/context/organization';
import { axios } from '@shared/lib/axios';
import { useSession } from '@shared/lib/session';
import type { Project, SuccessBackendResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import styles from './organization.module.css';

const ProjectCard = ({
	id,
	name,
	description,
	totalTasks,
	completedTasks,
}: Project) => {
	const progress = (completedTasks / totalTasks) * 100;
	const to = `/organization/projects/${id}`;

	return (
		<Link to={to} className={styles.projectCard}>
			<div className={styles.projectHeader}>
				<h2 className={styles.projectTitle}>{name}</h2>
				<div className={styles.progressWrapper}>
					<div className={styles.progressIndicator} />
					<span className={styles.progressText}>{progress}%</span>
				</div>
			</div>
			<p className={styles.projectDescription}>{description}</p>
			<div className={styles.projectFooter}>
				<div className={styles.footerInfo}>
					<CheckSquare size={16} />
					<span className={styles.footerText}>
						{completedTasks}/{totalTasks}
					</span>
				</div>
				<div className={styles.footerInfo}>
					<CalendarDots size={16} />
					<span className={styles.footerText}>Jan 19</span>
				</div>
			</div>
		</Link>
	);
};

const Projects = () => {
	const sessionToken = useSession().token;
	const { currentOrganization, refetchOrganizations } = useOrganization();
	refetchOrganizations();
	const projectsQuery = useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await axios.get<SuccessBackendResponse<Project[]>>(
				`/projects/${currentOrganization?.id}`,
				{
					headers: {
						authorization: `Bearer ${sessionToken}`,
					},
				},
			);

			console.log({ projects: response.data });

			return response.data.data;
		},
	});

	const skeletons = Array.from({ length: 3 }, () => (
		<div className={styles.skeletonCard} key={crypto.randomUUID()}>
			<div className={styles.skeletonHeader}>
				<div className='flex items-center gap-2'>
					<Skeleton className='rounded-small w-24 h-4' />
				</div>
				<Skeleton className='rounded-small w-16 h-4' />
			</div>
			<div className={styles.skeletonBody}>
				<Skeleton className='rounded-small w-2/3 h-4' />
				<Skeleton className='rounded-small w-3/4 h-4' />
			</div>
			<div className={styles.skeletonHeader}>
				<div className='flex items-center gap-2'>
					<Skeleton className='rounded-small w-16 h-4' />
				</div>
				<Skeleton className='rounded-small w-16 h-4' />
			</div>
		</div>
	));

	const projects = projectsQuery.data?.map((project) => (
		<ProjectCard
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
		<div className={styles.gridContainer}>
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
