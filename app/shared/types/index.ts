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
