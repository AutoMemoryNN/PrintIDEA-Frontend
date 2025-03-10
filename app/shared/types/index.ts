export interface LoginResponse {
	token: string;
	isNewUser: boolean;
}

export interface SessionData {
	username: string;
	email: string;
	avatar: string;
}
