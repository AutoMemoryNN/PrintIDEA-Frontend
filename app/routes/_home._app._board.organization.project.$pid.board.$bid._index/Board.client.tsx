import { useToolBoard } from '@routes/_home._app._board/BoardToolContext.client';
import { Layer, Rect, Stage } from 'react-konva';

export function Board() {
	const toolBar = useToolBoard();
	console.log(toolBar.action);

	return (
		<Stage width={window.innerWidth} height={window.innerHeight}>
			<Layer>
				<Rect x={20} y={20} width={100} height={100} fill='lightblue' />
			</Layer>
		</Stage>
	);
}
