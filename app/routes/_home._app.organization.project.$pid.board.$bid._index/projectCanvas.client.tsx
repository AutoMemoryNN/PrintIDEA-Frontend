import { Layer, Rect, Stage } from 'react-konva';

export function ProjectCanvas() {
	// Aquí podrías leer props o estado, agregar más shapes, handlers, etc.
	return (
		<Stage width={window.innerWidth} height={window.innerHeight}>
			<Layer>
				<Rect x={20} y={20} width={100} height={100} fill='lightblue' />
			</Layer>
		</Stage>
	);
}
