import { motion } from 'motion/react';
import type React from 'react';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
	icon: React.ReactNode;
	title: string;
	value: number;
	suffix?: string;
	subtitle?: string;
	badge?: React.ReactNode;
	isPrimary?: boolean;
}

export const AristocratMetricCard: React.FC<MetricCardProps> = ({
	icon,
	title,
	value,
	subtitle,
	suffix,
	badge,
	isPrimary = false,
}) => {
	const cardId = `metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`;

	const MotionCard = motion(Card);

	return (
		<MotionCard
			initial={{
				opacity: 0,
				y: 50,
			}}
			animate={{
				opacity: 1,
				y: 0,
			}}
			transition={{
				type: 'spring',
				duration: 1,
			}}
			id={cardId}
			className={`w-auto border-none shadow-none ${
				isPrimary ? 'flex-3 bg-sidebar text-white' : 'flex-2 bg-muted'
			}`}
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

					<div className="flex items-baseline gap-2">
						<NumberTicker
							value={value}
							className={`inline font-bold text-4xl leading-none tracking-tight ${
								isPrimary ? 'text-secondary' : 'text-primary'
							}`}
						/>
						{suffix && <p className="font-bold text-2xl">{suffix}</p>}
					</div>

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
		</MotionCard>
	);
};
