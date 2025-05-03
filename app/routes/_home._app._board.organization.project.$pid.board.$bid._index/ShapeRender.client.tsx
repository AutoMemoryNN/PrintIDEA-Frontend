import { KonvaEventObject } from 'konva/lib/Node';
import { Arrow, Circle, Group, Line, Rect, Text } from 'react-konva';
import { Shape } from './models/shapes';

interface ShapeRendererProps {
	shape: Shape;
	isDraggable: boolean;
	onShapeClick: (e: KonvaEventObject<MouseEvent>) => void;
	onShapeDblClick: (e: KonvaEventObject<MouseEvent>) => void;
}

export function ShapeRenderer({
	shape,
	isDraggable,
	onShapeClick,
	onShapeDblClick,
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
		case 'text':
			return (
				<Text
					id={shape.id}
					text={shape.text}
					x={shape.x}
					y={shape.y}
					width={shape.width}
					padding={shape.padding}
					fontSize={shape.fontSize}
					fill={shape.fillColor}
					draggable={isDraggable}
					hitStrokeWidth={20}
					perfectDrawEnabled={false}
					onClick={onShapeClick}
					onDblClick={onShapeDblClick}
				/>
			);
		case 'note':
			return (
				<Group
					id={shape.id}
					x={shape.x}
					y={shape.y}
					draggable={isDraggable}
					listening={true}
				>
					<Rect
						width={shape.width}
						height={shape.height}
						fill={shape.fillColor}
						stroke={shape.strokeColor}
						strokeWidth={shape.strokeWidth}
						listening={false}
					/>
					<Text
						id={shape.text.id}
						text={shape.text.text}
						x={shape.padding}
						y={shape.padding}
						width={shape.width - shape.padding * 2}
						padding={shape.padding}
						fontSize={shape.text.fontSize}
						wrap='word'
						fill={shape.text.fillColor}
						hitStrokeWidth={50}
						perfectDrawEnabled={false}
						onClick={onShapeClick}
						onDblClick={onShapeDblClick}
					/>
				</Group>
			);
		default:
			return null;
	}
}
