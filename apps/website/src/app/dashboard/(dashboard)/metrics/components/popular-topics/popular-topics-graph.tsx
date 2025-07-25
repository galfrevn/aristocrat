'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from '@/components/ui/chart';

interface ChartDataPoint {
	topic: string;
	courses: number;
}

interface TooltipPayload {
	value: number;
	dataKey: string;
	name: string;
	payload: ChartDataPoint;
	color: string;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: TooltipPayload[];
	label?: string;
}

const chartData: ChartDataPoint[] = [
	{ topic: 'JavaScript', courses: 6 },
	{ topic: 'React', courses: 3 },
	{ topic: 'IA', courses: 3 },
	{ topic: 'Node.js', courses: 3 },
	{ topic: 'TypeScript', courses: 4 },
	{ topic: 'SQL', courses: 5 },
	{ topic: 'Marketing', courses: 2 },
];

const chartConfig = {
	popularity: {
		label: 'Popularidad',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
	if (active && payload && payload.length > 0) {
		const data = payload[0];
		return (
			<div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
				<p className="text-muted-foreground">{label}</p>
				<p className="font-medium text-primary">
					Cursos realizados: {data.value}
				</p>
			</div>
		);
	}
	return null;
};

export const AristocratPopularTopicsGraph = () => {
	return (
		<ChartContainer
			config={chartConfig}
			className=" aspect-square max-h-[230px] min-h-[220px] min-w-[400px] text-sm"
			aria-label="Radar chart showing skill distribution across topics"
		>
			<RadarChart data={chartData}>
				<ChartTooltip cursor={false} content={<CustomTooltip />} />
				<PolarGrid gridType="circle" />
				<PolarAngleAxis
					dataKey="topic"
					tickSize={15}
					tickLine={false}
					axisLine={false}
				/>
				<Radar
					dataKey="courses"
					fill="var(--color-popularity)"
					fillOpacity={0.6}
					stroke="var(--color-popularity)"
					dot={{
						r: 4,
						fillOpacity: 1,
					}}
				/>
			</RadarChart>
		</ChartContainer>
	);
};
