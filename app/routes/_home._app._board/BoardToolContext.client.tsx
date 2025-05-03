import { ReactNode, createContext, useContext, useState } from 'react';

export enum ActionType {
	SELECT = 'SELECT',
	NOTE = 'NOTE',
	RECTANGLE = 'RECTANGLE',
	CIRCLE = 'CIRCLE',
	ARROW = 'ARROW',
	LINE = 'LINE',
	PEN = 'PEN',
	TEXT = 'TEXT',
	ERASER = 'ERASER',
}

interface ToolBoardContextType {
	action: ActionType;
	setAction: (a: ActionType) => void;
	strokeColor: string;
	setStrokeColor: (c: string) => void;
	strokeWidth: number;
	setStrokeWidth: (w: number) => void;
}

const ToolBoardContext = createContext<ToolBoardContextType | undefined>(
	undefined,
);

export function ToolBoardProvider({ children }: { children: ReactNode }) {
	const [action, setAction] = useState<ActionType>(ActionType.SELECT);
	const [strokeColor, setStrokeColor] = useState<string>('#000000');
	const [strokeWidth, setStrokeWidth] = useState<number>(2);

	return (
		<ToolBoardContext.Provider
			value={{
				action,
				setAction,
				strokeColor,
				setStrokeColor,
				strokeWidth,
				setStrokeWidth,
			}}
		>
			{children}
		</ToolBoardContext.Provider>
	);
}

export function useToolBoard(): ToolBoardContextType {
	const ctx = useContext(ToolBoardContext);
	if (!ctx) {
		throw new Error('useToolBoard must be used within a ToolBoardProvider');
	}
	return ctx;
}
