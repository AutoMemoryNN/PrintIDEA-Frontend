import type { ActionFunctionArgs, TypedResponse } from '@remix-run/node';

import { redirect } from '@remix-run/node';
import { authCookie } from '@shared/lib/server/cookies';

export async function action({
	request,
}: ActionFunctionArgs): Promise<TypedResponse<never>> {
	const formData = await request.formData();
	const provider = formData.get('provider'); // "google" or "microsoft"

	let cookieData = {};
	if (provider === 'google' || provider === 'microsoft') {
		cookieData = { provider };
	}

	return redirect('/', {
		headers: {
			'Set-Cookie': await authCookie.serialize(cookieData),
		},
	});
}
