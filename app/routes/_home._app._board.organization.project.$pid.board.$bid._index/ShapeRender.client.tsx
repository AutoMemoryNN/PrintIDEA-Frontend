import { KonvaEventObject } from 'konva/lib/Node';
import { Arrow, Circle, Line, Rect } from 'react-konva';
import { Shape } from './models/shapes';

interface ShapeRendererProps {
	shape: Shape;
	isDraggable: boolean;
	onShapeClick: (e: KonvaEventObject<MouseEvent>) => void;
}

export function ShapeRenderer({
	shape,
	isDraggable,
	onShapeClick,
}: ShapeRendererProps) {
	switch (shape.type) {
		case 'rectangle':
			return (
				<Rect
					id={shape.id}
					x={shape.x}
					y={shape.y}
					width={shape.width}
					height={shape.height}
					fill={shape.fillColor}
					stroke={shape.strokeColor}
					strokeWidth={shape.strokeWidth}
					draggable={isDraggable}
					onClick={onShapeClick}
				/>
			);
		case 'circle':
			return (
				<Circle
					id={shape.id}
					x={shape.x}
					y={shape.y}
					radius={shape.radius}
					fill={shape.fillColor}
					stroke={shape.strokeColor}
					strokeWidth={shape.strokeWidth}
					draggable={isDraggable}
					onClick={onShapeClick}
				/>
			);
		case 'arrow':
			return (
				<Arrow
					id={shape.id}
					points={shape.points}
					fill={shape.fillColor}
					stroke={shape.strokeColor}
					strokeWidth={shape.strokeWidth}
					draggable={isDraggable}
					onClick={onShapeClick}
				/>
			);
		case 'scribble':
			return (
				<Line
					id={shape.id}
					points={shape.points}
					stroke={shape.strokeColor}
					strokeWidth={shape.strokeWidth}
					lineCap='round'
					lineJoin='round'
					tension={0.5}
					draggable={isDraggable}
					onClick={onShapeClick}
				/>
			);
		default:
			return null;
	}
}
