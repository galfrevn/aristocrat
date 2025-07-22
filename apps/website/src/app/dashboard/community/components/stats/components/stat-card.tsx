import { NumberTicker } from '@/components/magicui/number-ticker';

interface StatProps {
	title: string;
	value: number;
}

export const AristocratCommunityStatCard = ({ title, value }: StatProps) => {
	return (
		<article
			className="flex items-center gap-3"
			aria-label={`Estadística: ${title}`}
		>
			<div className="flex flex-col">
				<NumberTicker className="font-semibold text-xl" value={value} />
				<p className="text-sm">{title}</p>
			</div>
		</article>
	);
};
