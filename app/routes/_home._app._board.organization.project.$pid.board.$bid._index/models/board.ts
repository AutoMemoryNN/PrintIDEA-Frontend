import { Shape } from './shapes';

export interface BoardState {
	shapes: Shape[];
	selectedShapeId: string | null;
}
