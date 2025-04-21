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
	totalTasks: number;
	completedTasks: number;
	startDate?: string | undefined;
	endDate?: string | undefined;
}
