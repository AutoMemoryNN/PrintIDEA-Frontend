export interface LoginResponse {
	jwt: string;
	isNewUser: boolean;
}

export interface SessionData {
	id: string;
	username: string;
	alias: string;
	email: string;
	role: string;
	token: string;
}

export interface BaseBackendResponse<T, E> {
	message: string;
	data?: T;
	errors?: E;
}

export interface SuccessBackendResponse<T>
	extends BaseBackendResponse<T, never> {
	message: string;
	data: T;
}

export interface Organization {
	id: string;
	name: string;
	description: string;
	createdAt: string;
}

export interface Project {
	id: string;
	name: string;
	description: string;
	status: string;
	priority: string;
	startDate: Date;
	endDate: Date;
	organizationId: string;
	boardId: string;
}

export enum ProjectStatus {
	PENDING = 'pending',
	IN_PROGRESS = 'in_progress',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
}

export enum ProjectPriorities {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
	URGENT = 'urgent',
}

export const statusOptions = [
	{ value: ProjectStatus.PENDING, label: 'Pending' },
	{ value: ProjectStatus.IN_PROGRESS, label: 'In Progress' },
	{ value: ProjectStatus.COMPLETED, label: 'Completed' },
	{ value: ProjectStatus.CANCELLED, label: 'Cancelled' },
];

export const priorityOptions = [
	{ value: ProjectPriorities.LOW, label: 'Low' },
	{ value: ProjectPriorities.MEDIUM, label: 'Medium' },
	{ value: ProjectPriorities.HIGH, label: 'High' },
	{ value: ProjectPriorities.URGENT, label: 'Urgent' },
];
