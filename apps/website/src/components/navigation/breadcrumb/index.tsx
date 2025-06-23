'use client';

import { useAristocratBreadcrumb } from '@/components/navigation/breadcrumb/hooks';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface AristocratBreadcrumbProps {
	action?: React.ReactNode;
}

export const AristocratBreadcrumb = (props: AristocratBreadcrumbProps) => {
	const aristocratBreadcrumb = useAristocratBreadcrumb();

	return (
		<div className="sticky top-0 z-10 bg-background py-5 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
			<div className="flex items-center justify-between gap-2">
				<Breadcrumb>
					<BreadcrumbList className="sm:gap-1.5">
						{aristocratBreadcrumb.map((item, index) => (
							<div key={item.href} className="flex items-center gap-1.5">
								{index > 0 && <BreadcrumbSeparator />}
								<BreadcrumbItem>
									{item.isLast && <BreadcrumbPage>{item.label}</BreadcrumbPage>}
									{!item.isLast && (
										<BreadcrumbLink href={item.href}>
											{item.label}
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</div>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<div className="-my-2 -me-2 flex items-center gap-1">
					{props.action && (
						<div className="flex items-center">{props.action}</div>
					)}
				</div>
			</div>
		</div>
	);
};
