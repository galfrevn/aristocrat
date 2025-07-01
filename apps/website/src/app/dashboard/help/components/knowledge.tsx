'use client';

import { motion } from 'motion/react';

import { AristocratIcons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface AristocratKnowledgeItem {
	id: string;
	title: string;
	description: string;
	type: 'article' | 'video' | 'guide';
	category: string;
	readTime: string;
	views: number;
	updated: string;
}

export const aristocratKnowledgeData: AristocratKnowledgeItem[] = [
	{
		id: '1',
		title: 'Guía completa para nuevos usuarios',
		description:
			'Todo lo que necesitas saber para comenzar tu experiencia de aprendizaje en Aristocrat Learning.',
		type: 'guide',
		category: 'Primeros pasos',
		readTime: '10 min',
		views: 1250,
		updated: 'hace 2 días',
	},
	{
		id: '2',
		title: 'Cómo maximizar tu experiencia de aprendizaje',
		description:
			'Consejos y estrategias para aprovechar al máximo los cursos y recursos disponibles.',
		type: 'article',
		category: 'Consejos',
		readTime: '7 min',
		views: 890,
		updated: 'hace 1 semana',
	},
	{
		id: '3',
		title: 'Tutorial: Navegando por la plataforma',
		description:
			'Video tutorial que te muestra todas las funcionalidades principales de la plataforma.',
		type: 'video',
		category: 'Tutoriales',
		readTime: '15 min',
		views: 2100,
		updated: 'hace 3 días',
	},
	{
		id: '4',
		title: 'Solución de problemas técnicos comunes',
		description:
			'Guía paso a paso para resolver los problemas técnicos más frecuentes.',
		type: 'guide',
		category: 'Soporte técnico',
		readTime: '12 min',
		views: 675,
		updated: 'hace 5 días',
	},
	{
		id: '5',
		title: 'Configuración de notificaciones y preferencias',
		description:
			'Aprende a personalizar tus notificaciones y configurar tus preferencias de aprendizaje.',
		type: 'article',
		category: 'Configuración',
		readTime: '5 min',
		views: 445,
		updated: 'hace 1 semana',
	},
	{
		id: '6',
		title: 'Cómo obtener y verificar certificados',
		description:
			'Proceso completo para obtener, descargar y verificar tus certificados de finalización.',
		type: 'guide',
		category: 'Certificados',
		readTime: '8 min',
		views: 1580,
		updated: 'hace 4 días',
	},
];

const aristocratKnowledgeTypeConfiguration = {
	article: {
		icon: AristocratIcons.FileText,
		color: 'bg-blue-100 text-blue-800',
	},
	video: { icon: AristocratIcons.Video, color: 'bg-red-100 text-red-800' },
	guide: {
		icon: AristocratIcons.BookOpen,
		color: 'bg-green-100 text-green-800',
	},
};

const aristocratKnowledgeTypeLabels = {
	article: 'Artículo',
	video: 'Video',
	guide: 'Guía',
};

interface AristocratKnowledgeItemCardProps {
	knowledgeItem: AristocratKnowledgeItem;
	itemIndex: number;
}

function AristocratKnowledgeItemCard({
	knowledgeItem,
	itemIndex,
}: AristocratKnowledgeItemCardProps) {
	const TypeIcon =
		aristocratKnowledgeTypeConfiguration[knowledgeItem.type].icon;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: itemIndex * 0.1 }}
			className="group cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/40"
		>
			<div className="flex items-start gap-3">
				<div
					className={`rounded-lg p-2 ${aristocratKnowledgeTypeConfiguration[knowledgeItem.type].color}`}
				>
					<TypeIcon className="h-4 w-4" />
				</div>

				<div className="min-w-0 flex-1">
					<div className="mb-2 flex items-start justify-between">
						<h4 className="font-medium text-sm leading-tight transition-colors group-hover:text-[oklch(0.21_0.006_285.885)]">
							{knowledgeItem.title}
						</h4>
						<AristocratIcons.ExternalLink className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
					</div>

					<p className="mb-3 text-gray-600 text-sm leading-relaxed">
						{knowledgeItem.description}
					</p>

					<div className="flex items-center gap-3 text-gray-500 text-xs">
						<Badge variant="secondary" className="text-xs">
							{aristocratKnowledgeTypeLabels[knowledgeItem.type]}
						</Badge>
						<span>{knowledgeItem.category}</span>
						<span style={{ fontFamily: 'Geist Mono' }}>
							{knowledgeItem.readTime}
						</span>
						<span style={{ fontFamily: 'Geist Mono' }}>
							{knowledgeItem.views} vistas
						</span>
						<span>Actualizado {knowledgeItem.updated}</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

interface AristocratKnowledgeProps {
	knowledgeItems?: AristocratKnowledgeItem[];
}

export function AristocratKnowledge({
	knowledgeItems = aristocratKnowledgeData,
}: AristocratKnowledgeProps) {
	return (
		<Card className="shadow-sm">
			<CardHeader>
				<CardTitle className="tracking-tight">Base de Conocimientos</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{knowledgeItems.map((knowledgeItem, itemIndex) => (
						<AristocratKnowledgeItemCard
							key={knowledgeItem.id}
							knowledgeItem={knowledgeItem}
							itemIndex={itemIndex}
						/>
					))}
				</div>

				<div className="mt-6 text-center">
					<button
						type="button"
						className="text-[oklch(0.21_0.006_285.885)] text-sm hover:underline"
					>
						Ver toda la base de conocimientos
					</button>
				</div>
			</CardContent>
		</Card>
	);
}
