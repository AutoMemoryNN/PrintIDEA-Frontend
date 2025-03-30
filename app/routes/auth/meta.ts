import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Login on Print Idea' },
		{
			name: 'description',
			content:
				'Experience Print Idea - Your creative design and planning platform for bringing ideas to life with professional solutions. Join us to transform your vision into reality.',
		},
	];
};
