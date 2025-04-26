import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Form, useNavigate } from '@remix-run/react';
import { axios } from '@shared/lib/axios';
import { useSession } from '@shared/lib/session';
import { SuccessBackendResponse } from '@shared/types';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, ReactNode } from 'react';
import styles from './new-organization.module.css';

type MutationResponse = {
	id: string;
};

const CreateOrganizationForm = (): ReactNode => {
	const navigate = useNavigate();
	const { token } = useSession();

	const createOrganizationMutation = useMutation({
		mutationFn: async (data: FormData) => {
			const name = String(data.get('name') || '');
			const description = String(data.get('description') || '');

			const response = await axios.post(
				'/organizations',
				{
					name,
					description,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				},
			);

			return response.data as SuccessBackendResponse<MutationResponse>;
		},
		onSuccess: () => {
			navigate('/organization');
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
		<div className={styles.orgFormContainer}>
			<div className={styles.orgFormCard}>
				<Form className={styles.orgForm} onSubmit={handleSubmit}>
					<h1 className={styles.orgFormTitle}>Create Organization</h1>

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

					<div className={styles.btnGroup}>
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
