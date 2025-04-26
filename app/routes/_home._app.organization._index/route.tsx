import { Button } from '@heroui/button';
import { Skeleton } from '@heroui/skeleton';
import { today } from '@internationalized/date';
import {
	Chalkboard,
	CheckSquare,
	Clock,
	PauseCircle,
	Target,
	Trash,
	XCircle,
} from '@phosphor-icons/react';
import { ChartLine } from '@phosphor-icons/react/dist/ssr';
import { Link, useNavigate } from '@remix-run/react';
import { useOrganization } from '@shared/context/organization';
import { axios } from '@shared/lib/axios';
import { useSession } from '@shared/lib/session';
import {
	type Project,
	ProjectStatus,
	type SuccessBackendResponse,
} from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import Masonry from 'react-masonry-css';
import styles from './organization.module.css';

const breakpointColumns = {
	default: 4, // ≥1200px → 4 columns
	1024: 3, // ≥1024px → 3 columns
	768: 2, // ≥768px → 2 columns
	480: 1, // <480px → 1 column
};

const ProjectCard = (project: Project) => {
	const { id, name, description, status, endDate, boardId } = project;
	const token = useSession().token;
	const progress = (20 / 50) * 100;
	const to = '/organization';
	const endDateObj = new Date(endDate);
	const organizations = useOrganization();

	return (
		<div className={styles.projectCard}>
			<Link to={to}>
				<div className={styles.projectHeader}>
					<h2 className={styles.projectTitle}>{name}</h2>
					<div className={styles.progressWrapper}>
						<div className={styles.progressIndicator} />
						<span className={styles.progressText}>{progress}%</span>
					</div>
				</div>
				<p className={styles.projectDescription}>{description}</p>
			</Link>
			<div className={styles.projectFooter}>
				<div className={styles.footerInfo}>
					<Link to={`/organization/project/${id}/boards/${boardId}`}>
						<Chalkboard size={16} />
					</Link>
				</div>
				<div className={styles.footerInfo}>
					{status === ProjectStatus.COMPLETED ? (
						<CheckSquare size={16} color='green' weight='fill' />
					) : status === ProjectStatus.IN_PROGRESS ? (
						<ChartLine size={16} color='blue' />
					) : status === ProjectStatus.CANCELLED ? (
						<XCircle size={16} color='red' weight='fill' />
					) : status === ProjectStatus.PENDING ? (
						<PauseCircle size={16} color='gray' weight='fill' />
					) : (
						<Clock size={16} color='gray' weight='fill' />
					)}
				</div>
				<div className={styles.footerInfo}>
					{endDateObj.getTime() >
					new Date(today('UTC').toString()).getTime() ? (
						<Target size={16} color='green' weight='fill' />
					) : (
						<PauseCircle size={16} color='red' weight='fill' />
					)}
					<span className={styles.footerText}>
						{endDateObj.toLocaleDateString('en-US', {
							month: 'short',
							day: '2-digit',
						})}
					</span>
					<button
						type='button'
						onClick={async (e) => {
							e.stopPropagation();
							await axios.delete(
								`/projects/${organizations.currentOrganization?.id}/${id}`,
								{
									headers: {
										authorization: `Bearer ${token}`,
									},
								},
							);
							window.location.reload(); // TODO: use react-query to invalidate the cache
						}}
					>
						<Trash size={16} color='orange' />
					</button>
				</div>
			</div>
		</div>
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
				{ headers: { authorization: `Bearer ${sessionToken}` } },
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

	const skeletons = (
		<Masonry
			breakpointCols={breakpointColumns}
			className={styles.myMasonryGrid}
			columnClassName={styles.myMasonryGridColumn}
		>
			{skeletonIds.map((id) => (
				<div key={id} className={styles.skeletonCard}>
					<div className={styles.skeletonHeader}>
						<Skeleton className='rounded-small w-24 h-4' />
						<Skeleton className='rounded-small w-16 h-4' />
					</div>
					<div className={styles.skeletonBody}>
						<Skeleton className='rounded-small w-2/3 h-4' />
						<Skeleton className='rounded-small w-3/4 h-4' />
					</div>
					<div className={styles.skeletonHeader}>
						<Skeleton className='rounded-small w-16 h-4' />
						<Skeleton className='rounded-small w-16 h-4' />
					</div>
				</div>
			))}
		</Masonry>
	);

	return (
		<div>
			{projectsQuery.isLoading || !currentOrganization ? (
				skeletons
			) : (
				<Masonry
					breakpointCols={breakpointColumns}
					className={styles.myMasonryGrid}
					columnClassName={styles.myMasonryGridColumn}
				>
					{projectsQuery.data?.map((project) => (
						<ProjectCard key={project.id} {...project} />
					))}
				</Masonry>
			)}
		</div>
	);
};

export default function OrganizationRoute() {
	const navigate = useNavigate();
	return (
		<div className={styles.container}>
			<div className='flex items-center justify-between'>
				<h1 className={styles.pageTitle}>Organization Projects</h1>
				<Button
					color='primary'
					variant='ghost'
					size='sm'
					onPress={() => {
						navigate('/organization/projects/new');
					}}
				>
					New
				</Button>
			</div>
			<Projects />
		</div>
	);
}
