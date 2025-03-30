import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Form, useNavigate } from '@remix-run/react';
import { axios } from '@shared/lib/axios';
import { SuccessBackendResponse } from '@shared/types';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, ReactNode } from 'react';

type MutationResponse = {
	id: string;
};

const CreateOrganizationForm = (): ReactNode => {
	const navigate = useNavigate();

	const createOrganizationMutation = useMutation({
		mutationFn: async (data: FormData) => {
			const name = String(data.get('name') || '');
			const description = String(data.get('description') || '');

			const response = await axios.post('/organizations', {
				name,
				description,
			});

			return response.data as SuccessBackendResponse<MutationResponse>;
		},
		onSuccess: (response) => {
			navigate(`/organization/${response.data.id}`);
		},
		onError: (error) => {
			console.log('Error creating organization:', error);
		},
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

		createOrganizationMutation.mutate(
			new FormData(e.target as HTMLFormElement),
		);
	};

	return (
		<div className='grid place-items-center bg-gradient-to-bl from-primary-400 to-secondary-400'>
			<div className='bg-background p-6 rounded-lg shadow-lg w-96 items-center justify-center flex flex-col'>
				<Form className='space-y-4 w-full' onSubmit={handleSubmit}>
					<h1 className='font-bold text-center'>
						Create Organization
					</h1>

					<Input
						label='Name'
						size='sm'
						isRequired={true}
						name='name'
					/>

					<Textarea
						label='Short Description'
						isRequired={true}
						name='description'
					/>

					<div className='flex gap-4 justify-center'>
						<Button
							className='w-full'
							color='danger'
							type='button'
							variant='light'
						>
							Cancel
						</Button>

						<Button
							className='w-full'
							color='primary'
							type='submit'
							isLoading={createOrganizationMutation.isPending}
						>
							{createOrganizationMutation.isPending
								? 'Creating...'
								: 'Create'}
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default CreateOrganizationForm;
