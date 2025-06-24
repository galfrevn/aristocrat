import type { Layout } from '@/types/layout';

import { AristocratBreadcrumb } from '@/components/navigation/breadcrumb';

interface AristocratPageWrapperProps extends Layout {
  action?: React.ReactNode;
}

export const AristocratPageWrapper = (props: AristocratPageWrapperProps) => {
	const { children } = props;

	return (
		<div className="w-full flex-1 bg-background md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl">
			<div className="flex h-full flex-col px-4 md:px-6 lg:px-8">
				<AristocratBreadcrumb action={props.action} />
				<div className="relative grow">
					<div className="container mx-auto mt-6 space-y-6">
            {children}
          </div>
				</div>
			</div>
		</div>
	);
};
