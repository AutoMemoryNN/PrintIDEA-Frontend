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
