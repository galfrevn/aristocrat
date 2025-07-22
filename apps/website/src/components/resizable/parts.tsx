import type { Layout } from '@/types/layout';

interface ResizablePanelGroupProps extends Layout {}

export const ResizablePanelGroup = (props: ResizablePanelGroupProps) => {
	const { children } = props;

	return <div className="relative flex">{children}</div>;
};

interface ResizablePanelProps extends Layout {
	resizableRef: React.RefObject<HTMLDivElement | null>;
	resizableWidth: string;
}

export const ResizablePanel = (props: ResizablePanelProps) => {
	const { children, resizableRef, resizableWidth } = props;

	return (
		<div
			ref={resizableRef}
			className="sticky top-0 h-screen border-l"
			style={{ width: resizableWidth }}
		>
			{children}
		</div>
	);
};
