import { ReactElement } from 'react';

import styles from './organization.module.css';

export default function Layout(): ReactElement {
	return (
		<div className={styles['main-container']}>
			<main className='flex-1 p-6 border border-gray-300 bg-white m-2 shadow-md rounded-sm'>
				<div></div>
			</main>
		</div>
	);
}
