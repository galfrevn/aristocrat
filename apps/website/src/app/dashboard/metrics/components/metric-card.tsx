import type React from 'react';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
	icon: React.ReactNode;
	title: string;
	value: string | number;
	subtitle?: string;
	badge?: React.ReactNode;
	className?: string;
}

export const AristocratMetricCard: React.FC<MetricCardProps> = ({
	icon,
	title,
	value,
	subtitle,
	badge,
	className = 'flex-2 bg-muted',
}) => {
	const cardId = `metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`;

	return (
		<Card
			id={cardId}
			className={`w-auto ${className} border-none shadow-none`}
			aria-labelledby={`${cardId}-title`}
			aria-describedby={subtitle ? `${cardId}-subtitle` : undefined}
		>
			<div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-4">
				<header className="flex items-start justify-between">
					<div
						className="flex size-12 items-center justify-center rounded-lg bg-muted-foreground text-background transition-transform duration-300 ease-in-out"
						aria-hidden="true"
					>
						{icon}
					</div>
					{badge && (
						<div className="ml-2 flex min-h-6 items-center rounded-lg text-center text-muted-foreground text-sm">
							{badge}
						</div>
					)}
				</header>

				<section className="flex flex-col space-y-2">
					<h3
						id={`${cardId}-title`}
						className="font-medium text-md text-muted-foreground leading-tight"
					>
						{title}
					</h3>
					<p className="font-bold text-4xl leading-none tracking-tight">
						{value}
					</p>
					{subtitle && (
						<p
							id={`${cardId}-subtitle`}
							className="text-base text-muted-foreground leading-relaxed"
						>
							{subtitle}
						</p>
					)}
				</section>
			</div>
		</Card>
	);
};
