import { createCookie } from '@remix-run/node';

export const authCookie = createCookie(process.env.NODE_ENV, {
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'strict',
	maxAge: 60 * 60 * 24 * 7,
	secrets: [process.env.COOKIE_SECRET || 'default-secret'],
});
