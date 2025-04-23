import { Skeleton } from '@heroui/skeleton';
import { Chalkboard, CheckSquare, Target } from '@phosphor-icons/react';
import { Link } from '@remix-run/react';
import { useOrganization } from '@shared/context/organization';
import { axios } from '@shared/lib/axios';
import { useSession } from '@shared/lib/session';
import type { Project, SuccessBackendResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import styles from './organization.module.css';

const ProjectCard = ({ id, name, description, boardId }: Project) => {
	const progress = (20 / 50) * 100;
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
					<Link to={`/organization/project/${id}/boards/${boardId}`}>
						<Chalkboard size={16} />
					</Link>
				</div>
				<div className={styles.footerInfo}>
					<CheckSquare size={16} />
					<span className={styles.footerText}>
						{}/{} {/* TODO: Replace with actual task count */}
					</span>
				</div>
				<div className={styles.footerInfo}>
					<Target size={16} />
					<span className={styles.footerText}>Jan 19</span>
				</div>
			</div>
		</Link>
	);
};

const Projects = () => {
	const sessionToken = useSession().token;
	const { currentOrganization } = useOrganization();

	const projectsQuery = useQuery({
		queryKey: ['projects', currentOrganization?.id],
		queryFn: async () => {
			if (!currentOrganization?.id) {
				return [];
			}

			const response = await axios.get<SuccessBackendResponse<Project[]>>(
				`/projects/${currentOrganization.id}`,
				{
					headers: {
						authorization: `Bearer ${sessionToken}`,
					},
				},
			);

			return response.data.data;
		},
		enabled: !!currentOrganization?.id && !!sessionToken,
	});

	const skeletonIds = [
		'skeleton-card-1',
		'skeleton-card-2',
		'skeleton-card-3',
	];
	const skeletons = skeletonIds.map((id) => (
		<div className={styles.skeletonCard} key={id}>
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
			key={project.id}
			name={project.name}
			description={project.description}
			status={project.status}
			priority={project.priority}
			startDate={project.startDate}
			endDate={project.endDate}
			organizationId={project.organizationId}
			boardId={project.boardId}
		/>
	));

	return (
		<div className={styles.gridContainer}>
			{projectsQuery.isLoading || !currentOrganization
				? skeletons
				: projects}
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
