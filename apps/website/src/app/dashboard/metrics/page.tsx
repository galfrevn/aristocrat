'use client';

import { motion } from 'motion/react';
import { AristocratPageHeader } from '@/app/dashboard/components/header';
import { AristocratPageWrapper } from '@/app/dashboard/components/wrapper';
import { AristocratFunFactsCard } from './components/fun-facts-card';
import { AristocratMetricCard } from './components/metric-card';
import { AristocratPopularTopicsCard } from './components/popular-topics/popular-topics-card';
import { AristocratStatCard } from './components/stat-card';
import { metricsData, statsData } from './data';

const AristocratDashboardMetricsPage = () => (
	<AristocratPageWrapper>
		<AristocratPageHeader
			title="Metricas"
			description="Así es como estás dominando nuevas habilidades"
		/>

		<section className="flex flex-wrap gap-4">
			{metricsData.map((metric) => (
				<AristocratMetricCard
					key={metric.id}
					className={metric.className}
					icon={metric.icon}
					title={metric.title}
					value={metric.value}
					subtitle={metric.subtitle}
					badge={metric.badge}
				/>
			))}
		</section>

		<section className="flex flex-wrap gap-4">
			{statsData.map(({ title, value, icon }) => (
				<AristocratStatCard
					key={title}
					title={title}
					value={value}
					icon={icon}
				/>
			))}
		</section>

		<motion.section
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
				duration: 1.4,
			}}
			className="flex flex-wrap gap-4"
		>
			<AristocratPopularTopicsCard />
			<AristocratFunFactsCard />
		</motion.section>
	</AristocratPageWrapper>
);

export default AristocratDashboardMetricsPage;
