export interface BaseShape {
	id: string;
	type: string;
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	draggable: boolean;
}

export interface RectangleShape extends BaseShape {
	type: 'rectangle';
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface CircleShape extends BaseShape {
	type: 'circle';
	x: number;
	y: number;
	radius: number;
}

export interface ArrowShape extends BaseShape {
	type: 'arrow';
	points: number[];
}

export interface ScribbleShape extends BaseShape {
	type: 'scribble';
	points: number[];
}

export interface LineShape extends BaseShape {
	type: 'line';
	points: number[];
}

export interface TextShape extends BaseShape {
	type: 'text';
	x: number;
	y: number;
	text: string;
	fontSize: number;
}

export type Shape =
	| RectangleShape
	| CircleShape
	| ArrowShape
	| ScribbleShape
	| LineShape
	| TextShape;
