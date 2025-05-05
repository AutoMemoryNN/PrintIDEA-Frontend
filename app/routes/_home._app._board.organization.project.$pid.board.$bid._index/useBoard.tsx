import {
	ActionType,
	useToolBoard,
} from '@routes/_home._app._board/BoardToolContext.client';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
	ArrowShape,
	CircleShape,
	NoteShape,
	RectangleShape,
	ScribbleShape,
	Shape,
	TextShape,
} from './models/shapes';

export function useBoard() {
	const { action, strokeColor, strokeWidth } = useToolBoard();
	const [shapes, setShapes] = useState<Shape[]>([]);
	const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

	const stageRef = useRef<Stage>(null);
	const isPainting = useRef<boolean>(false);
	const currentShapeId = useRef<string | null>(null);
	const transformerRef = useRef<Transformer>(null);

	const isDraggable = action === ActionType.SELECT;

	const handlePointerDown = useCallback(
		(_e: KonvaEventObject<PointerEvent>) => {
			if (action === ActionType.SELECT) {
				return;
			}

			const stage = stageRef.current;
			const vectorPointer = stage?.getPointerPosition();
			if (!vectorPointer) {
				return;
			}

			const x = vectorPointer.x;
			const y = vectorPointer.y;

			const id = uuidv4();

			currentShapeId.current = id;
			isPainting.current = true;

			console.log(`Drawing ${action} at (${x}, ${y})`);

			switch (action) {
				case ActionType.RECTANGLE:
					setShapes((prev) => [
						...prev,
						{
							id,
							type: 'rectangle',
							x,
							y,
							width: 20,
							height: 20,
							fillColor: 'transparent',
							strokeColor,
							strokeWidth,
						} as RectangleShape,
					]);
					break;

				case ActionType.CIRCLE:
					setShapes((prev) => [
						...prev,
						{
							id,
							type: 'circle',
							x,
							y,
							radius: 20,
							fillColor: 'transparent',
							strokeColor,
							strokeWidth,
						} as CircleShape,
					]);
					break;

				case ActionType.ARROW:
					setShapes((prev) => [
						...prev,
						{
							id,
							type: 'arrow',
							points: [x, y, x + 20, y + 20],
							fillColor: 'transparent',
							strokeColor,
							strokeWidth,
						} as ArrowShape,
					]);
					break;

				case ActionType.PEN:
					setShapes((prev) => [
						...prev,
						{
							id,
							type: 'scribble',
							points: [x, y],
							fillColor: 'transparent',
							strokeColor,
							strokeWidth,
						} as ScribbleShape,
					]);
					break;

				case ActionType.TEXT:
					setShapes((prev) => [
						...prev,
						{
							id,
							type: 'text',
							x,
							y,
							text: 'Edit me',
							fontSize: 20, // TODO: Add in the context ToolBar
							width: 150,
							padding: 4,
							fillColor: 'black',
							strokeColor: strokeColor,
							strokeWidth: strokeWidth,
							draggable: true,
						} as TextShape,
					]);
					break;

				case ActionType.NOTE:
					setShapes((prev) => [
						...prev,
						{
							id,
							type: 'note',
							padding: 10,
							x,
							y,
							width: 100,
							height: 100,
							fillColor: strokeColor.startsWith('#')
								? `${strokeColor}33`
								: 'rgba(0,0,0,0.2)',
							strokeColor,
							strokeWidth,
							text: 'Double click to edit',
							fontSize: 20,
						} as NoteShape,
					]);
					break;
			}
		},
		[action, strokeColor, strokeWidth],
	);

	const handlePointerMove = useCallback(() => {
		if (action === ActionType.SELECT || !isPainting.current) {
			return;
		}

		const stage = stageRef.current;
		const pointerPosition = stage?.getPointerPosition();
		if (!pointerPosition) {
			return;
		}
		const { x, y } = pointerPosition;

		setShapes((prevShapes) =>
			prevShapes.map((shape) => {
				if (shape.id === currentShapeId.current) {
					switch (shape.type) {
						case 'rectangle':
							return {
								...shape,
								width: x - (shape as RectangleShape).x,
								height: y - (shape as RectangleShape).y,
							};
						case 'circle':
							return {
								...shape,
								radius:
									((y - (shape as CircleShape).y) ** 2 +
										(x - (shape as CircleShape).x) ** 2) **
									0.5,
							};
						case 'arrow':
							return {
								...shape,
								points: [
									(shape as ArrowShape).points[0],
									(shape as ArrowShape).points[1],
									x,
									y,
								],
							};
						case 'scribble':
							return {
								...shape,
								points: [
									...(shape as ScribbleShape).points,
									x,
									y,
								],
							};
						default:
							return shape;
					}
				}
				return shape;
			}),
		);
	}, [action]);

	const handlePointerUp = useCallback(() => {
		isPainting.current = false;
	}, []);

	const handleShapeClick = useCallback(
		(e: KonvaEventObject<MouseEvent>) => {
			if (action !== ActionType.SELECT) {
				return;
			}

			const target = e.target;
			const shapeId = target.id();

			setSelectedShapeId(shapeId);

			if (transformerRef.current) {
				transformerRef.current.nodes([target]);
			}
		},
		[action],
	);

	const handleShapeDblClick = useCallback(
		(e: KonvaEventObject<MouseEvent>) => {
			const node = e.target;
			const shapeId = node.id();

			setShapes((prev: Shape[]) =>
				prev.map((s: Shape) => {
					if (s.type === 'text' && s.id === shapeId) {
						const newText = window.prompt(
							'Edit text:',
							(s as TextShape).text,
						);
						return newText != null ? { ...s, text: newText } : s;
					}
					if (s.type === 'note' && s.id === shapeId) {
						const newText = window.prompt(
							'Edit note text:',
							(s as NoteShape).text,
						);
						if (newText != null) {
							return {
								...s,
								text: newText,
							};
						}
					}
					return s;
				}),
			);
		},
		[],
	);

	const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
		if (e.evt.detail !== 1) {
			return;
		}

		setSelectedShapeId(null);
		transformerRef.current?.nodes([]);
	}, []);

	const handleExport = useCallback(() => {
		if (!stageRef.current) {
			return;
		}

		const uri = stageRef.current.toDataURL();
		const link = document.createElement('a');
		link.download = 'canvas-drawing.png';
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, []);

	return {
		shapes,
		setShapes,
		selectedShapeId,
		stageRef,
		transformerRef,
		isDraggable,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handleShapeClick,
		handleStageClick,
		handleExport,
		handleShapeDblClick,
	};
}
