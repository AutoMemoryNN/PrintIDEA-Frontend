import { createCookie } from '@remix-run/node';
import { getSafeEnvSecret } from '@shared/lib/server/security';

export const authCookie = createCookie('session', {
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'strict',
	maxAge: 60 * 60 * 24 * 7,
	secrets: [getSafeEnvSecret('COOKIE_SECRET')],
});
