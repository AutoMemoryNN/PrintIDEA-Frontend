import { ReactNode, createContext, useContext, useState } from 'react';

export enum ActionType {
	SELECT = 'SELECT',
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
	setAction: (action: ActionType) => void;
}

const ToolBoardContext = createContext<ToolBoardContextType | undefined>(
	undefined,
);

export function ToolBoardProvider({ children }: { children: ReactNode }) {
	const [action, setAction] = useState<ActionType>(ActionType.SELECT);
	return (
		<ToolBoardContext.Provider value={{ action, setAction }}>
			{children}
		</ToolBoardContext.Provider>
	);
}

export function useToolBoard(): ToolBoardContextType {
	const context = useContext(ToolBoardContext);
	if (!context) {
		throw new Error('useBoard must be used within a BoardProvider');
	}
	return context;
}
