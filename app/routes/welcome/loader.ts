import { LoaderFunctionArgs } from '@remix-run/node';

export function loader({ request }: LoaderFunctionArgs): Response {
	const cookie = request.headers.get('Cookie') || 'No cookie found';
	return Response.json({ welcomeMessage: 'Welcome to Remix!', cookie });
}
