import { Card } from '@/components/ui/card';
import { AristocratPopularTopicsGraph } from './popular-topics-graph';

interface Topic {
	id: number;
	topic: string;
	hours: number;
	courses: number;
}

const topTopics: Topic[] = [
	{
		id: 1,
		topic: 'JavaScript',
		hours: 72,
		courses: 6,
	},
	{
		id: 2,
		topic: 'SQL',
		hours: 65,
		courses: 5,
	},
	{
		id: 3,
		topic: 'TypeScript',
		hours: 43,
		courses: 4,
	},
];

export const AristocratPopularTopicsCard = () => {
	return (
		<Card className="w-auto flex-2 justify-start px-4 py-4 shadow-none sm:px-6 sm:py-4">
			<h2 id="skills-dominance-title" className="font-semibold text-xl">
				Habilidadaes
			</h2>

			<main className="flex gap-2">
				<AristocratPopularTopicsGraph />

				<section className="w-full">
					<h2 className="text-xl">Tus especialidades</h2>
					<ul className="list-none">
						{topTopics.map((topic) => (
							<li
								key={topic.id}
								className="flex items-center gap-4 border-border/50 border-b py-3 last:border-b-0"
								aria-label={`Especialidad ${topic.id}: ${topic.topic}`}
							>
								<div
									className="flex size-10 items-center justify-center rounded-lg bg-primary/15 font-semibold text-primary text-sm"
									aria-hidden="true"
								>
									{topic.id + 1}
								</div>

								<div className="min-w-0 flex-1">
									<h4 className="truncate font-medium text-foreground">
										{topic.topic}
									</h4>
									<p className="text-muted-foreground text-sm">
										{topic.courses}{' '}
										{topic.courses === 1
											? 'curso completado'
											: 'cursos completados'}
									</p>
								</div>

								<div className="text-right">
									<p className="font-semibold text-foreground">
										{topic.hours}h
									</p>
								</div>
							</li>
						))}
					</ul>
				</section>
			</main>
		</Card>
	);
};
