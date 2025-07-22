import { motion } from 'motion/react';
import type React from 'react';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Card } from '@/components/ui/card';

interface Props {
	icon: React.ReactNode;
	title: string;
	value: number;
	prefix?: string;
}

export const AristocratStatCard = ({ icon, title, value, prefix }: Props) => {
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
				duration: 1.2,
			}}
			className="flex h-auto w-auto flex-1 flex-row items-center gap-4 bg-gradient-to-br from-card to-card/80 p-4 shadow-none"
		>
			<div className="flex size-12 items-center justify-center rounded-lg bg-muted text-primary">
				<span aria-label="Icono de la métrica" role="img">
					{icon}
				</span>
			</div>
			<div>
				<h4 className="font-medium text-md text-muted-foreground">{title}</h4>
				<div className="flex items-baseline gap-1">
					<NumberTicker
						value={value}
						className="font-bold text-3xl text-foreground"
					/>
					{prefix && <p className="font-bold text-xl">{prefix}</p>}
				</div>
			</div>
		</MotionCard>
	);
};
