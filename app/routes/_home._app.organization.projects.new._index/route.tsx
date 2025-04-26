import { Button } from '@heroui/button';
import { DateRangePicker } from '@heroui/date-picker';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { DateValue, today } from '@internationalized/date';
import { Form, useNavigate } from '@remix-run/react';
import { useOrganization } from '@shared/context/organization';
import { axios } from '@shared/lib/axios';
import { Project, priorityOptions, statusOptions } from '@shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import styles from './new-project.module.css';

type RangeValue<T = DateValue> = {
	start: T;
	end: T;
};

type CreateProjectData = Omit<Project, 'id' | 'organizationId' | 'boardId'>;

export default function NewProjectModal() {
	const navigate = useNavigate();
	const organizations = useOrganization();
	const [dateRange, setDateRange] = useState<RangeValue | null>({
		start: today('UTC'),
		end: today('UTC').add({ days: 7 }),
	});

	const createProject = async (params: {
		projectData: CreateProjectData;
		organizationId: string;
	}): Promise<void> => {
		const { projectData, organizationId } = params;
		await axios.post(`/projects/${organizationId}`, projectData);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!dateRange) {
			alert('Please select a date range');
			return;
		}

		const formData = new FormData(event.currentTarget);
		const formValues = Object.fromEntries(formData.entries());

		const projectData = {
			name: formValues.name as string,
			description: formValues.description as string,
			status: formValues.status as string,
			priority: formValues.priority as string,
			startDate: dateRange.start.toDate('UTC'),
			endDate: dateRange.end.toDate('UTC'),
		};

		mutate({
			projectData,
			organizationId: organizations.currentOrganization?.id || '',
		});
	};

	const queryClient = useQueryClient();

	const { mutate, isPending, isSuccess, isError, error } = useMutation({
		mutationFn: createProject,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['projects', organizations.currentOrganization?.id],
			});
			navigate(-1);
		},
		onError: (error) => {
			console.error('Error creating project:', error);
			alert('Failed to create project. Please try again.');
		},
	});

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>New Project</h2>
					<Button
						isIconOnly={true}
						variant='light'
						radius='full'
						onPress={() => navigate(-1)}
						className={styles.closeButton}
					>
						×
					</Button>
				</div>

				<Form
					method='post'
					className={styles.formContainer}
					onSubmit={handleSubmit}
				>
					<div className={styles.formRow}>
						<div className={styles.inputName}>
							<Input
								label='Name'
								name='name'
								placeholder='Enter project name'
								variant='bordered'
								isRequired={true}
								classNames={{
									inputWrapper: styles.inputWrapper,
								}}
							/>
						</div>
					</div>
					<div className={styles.formRow}>
						<div className={styles.dateRangeContainer}>
							<DateRangePicker
								aria-label='Select date range'
								showMonthAndYearPickers={true}
								label='Project Timeline'
								startContent='From'
								endContent='To'
								minValue={today('UTC')}
								value={dateRange}
								onChange={setDateRange}
								classNames={{ base: styles.dateRangePicker }}
							/>
						</div>

						<div className={styles.inputStatus}>
							<Select
								name='status'
								label='Status'
								placeholder='Select status'
								variant='bordered'
							>
								{statusOptions.map((o) => (
									<SelectItem key={o.value}>
										{o.label}
									</SelectItem>
								))}
							</Select>
						</div>
						<div className={styles.inputPriority}>
							<Select
								name='priority'
								label='Priority'
								placeholder='Select priority'
								variant='bordered'
							>
								{priorityOptions.map((o) => (
									<SelectItem key={o.value}>
										{o.label}
									</SelectItem>
								))}
							</Select>
						</div>
					</div>

					<div className={styles.formRow}>
						<div className={styles.inputDescription}>
							<Textarea
								label='Description'
								name='description'
								placeholder='Enter project description'
								variant='bordered'
								minRows={4}
								className={styles.textarea}
							/>
						</div>
					</div>

					{isError && <p>Error creating project: {error.message}</p>}
					{isSuccess && <p>Project created successfully!</p>}

					<div className={styles.formActions}>
						<Button
							type='submit'
							color='primary'
							disabled={isPending}
						>
							{isPending ? 'Creating...' : 'Create Project'}
						</Button>
						<Button
							variant='flat'
							type='button'
							onPress={() => navigate(-1)}
						>
							Cancel
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
}
