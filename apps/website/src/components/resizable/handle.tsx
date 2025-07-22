/** biome-ignore-all lint/a11y/noStaticElementInteractions: false positive */

import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResizableHandleProps {
	onMouseDown: (e: React.MouseEvent) => void;
	isResizing: boolean;
	className?: string;
}

export function ResizableHandle({
	onMouseDown,
	isResizing,
	className,
}: ResizableHandleProps) {
	return (
		<div
			onMouseDown={onMouseDown}
			className={cn(
				'group absolute top-0 left-0 z-10 flex h-full w-1 cursor-col-resize items-center justify-center bg-transparent transition-all duration-200 hover:bg-border',
				"before:-left-1 before:absolute before:inset-y-0 before:w-3 before:content-['']",
				isResizing && 'bg-primary',
				className,
			)}
		>
			<div
				className={cn(
					'flex h-8 w-1 items-center justify-center rounded-sm bg-border opacity-0 transition-all duration-200 group-hover:opacity-100',
					isResizing && 'bg-primary opacity-100',
				)}
			>
				<GripVertical className="h-4 w-4 text-muted-foreground" />
			</div>
		</div>
	);
}
