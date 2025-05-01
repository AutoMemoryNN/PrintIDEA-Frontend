import { Button } from '@heroui/button';
import { Minus, Plus } from '@phosphor-icons/react';
import { useToolBoard } from './BoardToolContext.client';

export function AccessoryToolbar() {
	const { strokeColor, setStrokeColor, strokeWidth, setStrokeWidth } =
		useToolBoard();

	const colors = [
		{ value: '#000000', class: 'bg-black' },
		{ value: '#e3342f', class: 'bg-red-500' },
		{ value: '#38c172', class: 'bg-green-500' },
		{ value: '#3490dc', class: 'bg-blue-500' },
		{ value: '#6574cd', class: 'bg-indigo-500' },
		{ value: '#f6993f', class: 'bg-orange-500' },
	];

	return (
		<div className='fixed top-4 right-4 z-50 bg-white border border-gray-200 p-3 rounded-lg shadow-md'>
			<div className='mb-3'>
				<label
					htmlFor='color-selection'
					className='block text-xs font-medium text-gray-700 mb-2'
				>
					Color
				</label>
				<div
					id='color-selection'
					className='flex gap-2'
					role='radiogroup'
					aria-labelledby='color-selection'
				>
					{colors.map((color) => (
						<button
							key={color.value}
							type='button'
							className={`
                w-6 h-6 rounded-full ${color.class}
                ${strokeColor === color.value ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
              `}
							onClick={() => setStrokeColor(color.value)}
						/>
					))}
				</div>
			</div>

			<div>
				<div className='flex justify-between items-center mb-2'>
					<label
						htmlFor='stroke-width'
						className='block text-xs font-medium text-gray-700'
					>
						Width
					</label>
					<span className='text-xs'>{strokeWidth}px</span>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						size='sm'
						variant='bordered'
						className='h-7 w-7 p-0 flex items-center justify-center'
						onPress={() =>
							setStrokeWidth(Math.max(1, strokeWidth - 1))
						}
					>
						<Minus size={12} />
					</Button>

					<div className='w-20 h-1 bg-gray-200 rounded-full relative'>
						<input
							id='stroke-width'
							type='range'
							min='1'
							max='20'
							value={strokeWidth}
							onChange={(e) =>
								setStrokeWidth(Number(e.target.value))
							}
							className='sr-only'
						/>
						<div
							className='absolute top-0 left-0 h-1 bg-blue-500 rounded-full'
							style={{ width: `${(strokeWidth / 20) * 100}%` }}
						/>
					</div>

					<Button
						size='sm'
						variant='bordered'
						className='h-7 w-7 p-0 flex items-center justify-center'
						onPress={() =>
							setStrokeWidth(Math.min(20, strokeWidth + 1))
						}
					>
						<Plus size={12} />
					</Button>
				</div>
			</div>
		</div>
	);
}
