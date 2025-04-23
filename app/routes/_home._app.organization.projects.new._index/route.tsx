import { Button } from '@heroui/button';
import { DateRangePicker } from '@heroui/date-picker';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { DateValue, today } from '@internationalized/date';
import { Form, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import styles from './new-project.module.css';

type RangeValue<T = DateValue> = {
	start: T;
	end: T;
};

export default function NewProjectModal() {
	const navigate = useNavigate();
	const [dateRange, setDateRange] = useState<RangeValue | null>({
		start: today('UTC'),
		end: today('UTC').add({ days: 7 }),
	});

	const statusOptions = [
		{ label: 'Not Started', value: 'not_started' },
		{ label: 'In Progress', value: 'in_progress' },
		{ label: 'Completed', value: 'completed' },
	];
	const priorityOptions = [
		{ label: 'Low', value: 'low' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'High', value: 'high' },
	];

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>New Project</h2>
					<Button
						isIconOnly={true}
						variant='light'
						radius='full'
						onClick={() => navigate(-1)}
						className={styles.closeButton}
					>
						×
					</Button>
				</div>

				<Form method='post' className={styles.formContainer}>
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
								showMonthAndYearPickers={true}
								label='Project Timeline'
								startContent='From'
								endContent='To'
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

					<div className={styles.formActions}>
						<Button color='primary' type='submit'>
							Create Project
						</Button>
						<Button
							variant='flat'
							type='button'
							onClick={() => navigate(-1)}
						>
							Cancel
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
}
