import {
	ArrowRight,
	Circle,
	Eraser,
	HandPointing,
	LineSegment,
	Pencil,
	Square,
} from '@phosphor-icons/react';

import { Button } from '@heroui/button';
import { TextT } from '@phosphor-icons/react/dist/ssr';
import React from 'react';
import { AccessoryToolbar } from './AccessoryToolBar.client';
import { ActionType, useToolBoard } from './BoardToolContext.client';

export interface ToolbarProps extends React.PropsWithChildren {}

export function Toolbar({ children }: ToolbarProps) {
	const { action, setAction } = useToolBoard();

	const getButtonClass = (a: ActionType) => {
		const baseClasses =
			'flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-200';
		const activeClasses = 'bg-violet-500 text-white shadow-md';
		const inactiveClasses =
			'bg-white hover:bg-violet-100 text-gray-700 hover:text-violet-700';

		return `${baseClasses} ${action === a ? activeClasses : inactiveClasses}`;
	};

	const buttonConfig = {
		size: 'sm' as const,
		variant: 'ghost',
		iconSize: 20,
	};

	const tools = [
		{ type: ActionType.SELECT, title: 'Select', icon: HandPointing },
		{ type: ActionType.RECTANGLE, title: 'Rectangle', icon: Square },
		{ type: ActionType.CIRCLE, title: 'Circle', icon: Circle },
		{ type: ActionType.LINE, title: 'Line', icon: LineSegment },
		{ type: ActionType.ARROW, title: 'Arrow', icon: ArrowRight },
		{ type: ActionType.PEN, title: 'Pen', icon: Pencil },
		{ type: ActionType.TEXT, title: 'Text', icon: TextT },
		{ type: ActionType.ERASER, title: 'Eraser', icon: Eraser },
	];

	return (
		<div className='relative w-full h-full'>
			<div className='absolute inset-0 z-0 overflow-hidden'>
				{children}
			</div>

			<aside className='absolute top-0 left-0 z-10 w-16 h-full bg-gray-50 border-r border-gray-200 p-2 flex flex-col items-center gap-3'>
				{tools.map((tool) => (
					<Button
						key={tool.type}
						size={buttonConfig.size}
						onPress={() => setAction(tool.type)}
						className={getButtonClass(tool.type)}
						aria-label={tool.title}
						title={tool.title}
					>
						<tool.icon
							size={buttonConfig.iconSize}
							weight={action === tool.type ? 'fill' : 'regular'}
						/>
					</Button>
				))}
				<div className='mt-4 w-full border-t border-gray-200' />
			</aside>

			<AccessoryToolbar />
		</div>
	);
}
