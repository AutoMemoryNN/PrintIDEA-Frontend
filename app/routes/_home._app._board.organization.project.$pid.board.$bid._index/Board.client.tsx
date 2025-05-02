import { useEffect, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
import { ShapeRenderer } from './ShapeRender.client';
import { useBoard } from './useBoard';

export function Board() {
	const {
		shapes,
		stageRef,
		transformerRef,
		isDraggable,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handleShapeClick,
		handleStageClick,
	} = useBoard();

	const [stageSize, setStageSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setStageSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Load initial board state from server (future implementation)
	useEffect(() => {
		const loadBoardState = async () => {
			try {
				// const response = await fetch();
				// const data = await response.json();
				// setShapes(data.shapes);
				await console.log('Board state would load here');
			} catch (error) {
				console.error('Error loading board state:', error);
			}
		};

		loadBoardState();
	}, []);

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
						/>
					))}

					<Transformer ref={transformerRef} />
				</Layer>
			</Stage>
		</div>
	);
}
