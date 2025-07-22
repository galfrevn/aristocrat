'use client';

import { AristocratBreadcrumb } from '@/components/navigation/breadcrumb';
import { useOverflowDetection } from '@/hooks/use-overflow-detection';
import type { Layout } from '@/types/layout';

interface AristocratPageWrapperProps extends Layout {
	action?: React.ReactNode;
}

export const AristocratPageWrapper = (props: AristocratPageWrapperProps) => {
	const { children } = props;
	const contentRef = useOverflowDetection();

	return (
		<div className="aristocrat-page-wrapper w-full flex-1 bg-background md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl">
			<div className="flex h-full flex-col px-4 md:px-6 lg:px-8">
				<AristocratBreadcrumb action={props.action} />
				<div
					ref={contentRef}
					className="aristocrat-content-area relative grow overflow-auto"
				>
					<div className="container mx-auto mt-6 space-y-6">{children}</div>
				</div>
			</div>
		</div>
	);
};
