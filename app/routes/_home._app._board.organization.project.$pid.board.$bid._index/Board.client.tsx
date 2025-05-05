import { useParams } from '@remix-run/react';
import { axios } from '@shared/lib/axios';
import { useSession } from '@shared/lib/session';
import { SuccessBackendResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
import { ShapeRenderer } from './ShapeRender.client';
import { BackendBoardState } from './types';
import { useBoard } from './useBoard';

interface StageSize {
	width: number;
	height: number;
}

export function Board() {
	const {
		shapes,
		setShapes,
		stageRef,
		transformerRef,
		isDraggable,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handleShapeClick,
		handleStageClick,
		handleShapeDblClick,
	} = useBoard();

	const session = useSession();

	const { bid } = useParams();

	const [stageSize, setStageSize] = useState<StageSize | null>(null);

	const fetchBoardState = async () => {
		try {
			const response = await axios.get<
				SuccessBackendResponse<BackendBoardState>
			>(`/board/${bid}`, {
				headers: {
					authorization: `Bearer ${session.token}`,
				},
			});
			return response.data;
		} catch (error) {
			console.error('Error fetching board state:', error);
			throw error;
		}
	};

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: [`BoardState-${bid}`],
		queryFn: fetchBoardState,
		enabled: !!session.token,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (isSuccess && data) {
			const boardState = data.data;
			setStageSize({
				width: boardState.width,
				height: boardState.height,
			});
			const BackendShapes = boardState.shapes;
			if (!BackendShapes) {
				return;
			}

			// If you want to use the backend shapes, you can transform them here:
			// const transformedShapes = BackendShapes.map((shape) => {
			//     // Transform backend shape to frontend format
			//     return {...};
			// });
			// setShapes(transformedShapes);

			// For now, using static shapes for development
			setShapes([
				{
					id: 'rect-1',
					type: 'rectangle',
					fillColor: '#a0d911',
					strokeColor: '#389e0d',
					strokeWidth: 2,
					draggable: true,
					x: 20,
					y: 30,
					width: 120,
					height: 80,
				},
				{
					id: 'circ-1',
					type: 'circle',
					fillColor: '#13c2c2',
					strokeColor: '#08979c',
					strokeWidth: 3,
					draggable: true,
					x: 200,
					y: 150,
					radius: 50,
				},
				{
					id: 'arrow-1',
					type: 'arrow',
					fillColor: '#ffa940',
					strokeColor: '#d46b08',
					strokeWidth: 4,
					draggable: false,
					points: [300, 50, 350, 100, 300, 150],
				},
				{
					id: 'scribble-1',
					type: 'scribble',
					fillColor: 'transparent',
					strokeColor: '#722ed1',
					strokeWidth: 2,
					draggable: true,
					points: [400, 200, 420, 220, 410, 240, 430, 260],
				},
				{
					id: 'line-1',
					type: 'line',
					fillColor: 'transparent',
					strokeColor: '#eb2f96',
					strokeWidth: 1,
					draggable: false,
					points: [50, 300, 150, 350],
				},
				{
					id: 'text-1',
					type: 'text',
					fillColor: 'transparent',
					strokeColor: '#000000',
					strokeWidth: 0,
					draggable: true,
					text: 'Hello World',
					fontSize: 18,
					width: 100,
					padding: 4,
					x: 100,
					y: 400,
				},
				{
					id: 'note-1',
					type: 'note',
					x: 250,
					y: 350,
					width: 150,
					height: 100,
					padding: 6,
					fillColor: '#fff1b8',
					strokeColor: '#d48806',
					strokeWidth: 1,
					draggable: true,
					text: 'Important note',
					fontSize: 14,
				},
				{
					id: 'f53a4eea-ff74-49b9-9a12-ed563567a8f6',
					type: 'note',
					fillColor: '#00000033',
					strokeColor: '#000000',
					strokeWidth: 2,
					fontSize: 20,
					height: 100,
					width: 100,
					padding: 10,
					text: 'Double click to edit',
					x: 576.0226745605469,
					y: 84.37499618530273,
					draggable: true,
				},
			]);
		}
	}, [isSuccess, data, setShapes]);

	if (isLoading || !stageSize) {
		return (
			<div className='flex items-center justify-center w-full h-screen'>
				<div className='loader' />
			</div>
		);
	}

	return (
		<div className='relative w-full h-screen overflow-hidden bg-gray-50'>
			<Stage
				ref={stageRef}
				width={stageSize.width}
				height={stageSize.height}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onClick={handleStageClick}
			>
				<Layer>
					{/* Background */}
					<Rect
						x={0}
						y={0}
						width={stageSize.width}
						height={stageSize.height}
						fill='#ffffff'
					/>

					{shapes.map((shape) => (
						<ShapeRenderer
							key={shape.id}
							shape={shape}
							isDraggable={isDraggable}
							onShapeClick={handleShapeClick}
							onShapeDblClick={handleShapeDblClick}
						/>
					))}

					<Transformer
						ref={transformerRef}
						listening={false}
						enabledAnchors={['middle-left', 'middle-right']}
						boundBoxFunc={(_oldBox, newBox) => ({
							...newBox,
							width: Math.max(30, newBox.width),
						})}
					/>
				</Layer>
			</Stage>
		</div>
	);
}
