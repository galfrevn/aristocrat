'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { AristocratIcons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface AristocratFrequentlyAskedQuestion {
	id: string;
	question: string;
	answer: string;
	category: string;
	tags: string[];
	helpful: number;
}

export const aristocratFrequentlyAskedQuestionsData: AristocratFrequentlyAskedQuestion[] =
	[
		{
			id: '1',
			question: '¿Cómo puedo restablecer mi contraseña?',
			answer:
				"Para restablecer tu contraseña, ve a la página de inicio de sesión y haz clic en '¿Olvidaste tu contraseña?'. Introduce tu dirección de email y recibirás un enlace para crear una nueva contraseña. El enlace expira en 24 horas por seguridad.",
			category: 'account',
			tags: ['contraseña', 'cuenta', 'seguridad'],
			helpful: 45,
		},
		{
			id: '2',
			question: '¿Puedo descargar los cursos para verlos sin conexión?',
			answer:
				'Actualmente, nuestros cursos están disponibles solo en línea para garantizar que siempre tengas acceso a la versión más actualizada del contenido. Sin embargo, puedes tomar notas y descargar los recursos complementarios de cada lección.',
			category: 'courses',
			tags: ['descarga', 'offline', 'cursos'],
			helpful: 32,
		},
		{
			id: '3',
			question: '¿Cómo funciona el sistema de certificados?',
			answer:
				"Al completar un curso con una calificación del 80% o superior, recibirás automáticamente un certificado digital. Puedes descargarlo desde tu perfil en la sección 'Mis Certificados'. Los certificados incluyen un código de verificación único.",
			category: 'certificates',
			tags: ['certificados', 'completar', 'verificación'],
			helpful: 28,
		},
		{
			id: '4',
			question: '¿Qué navegadores son compatibles con la plataforma?',
			answer:
				'Aristocrat Learning es compatible con las versiones más recientes de Chrome, Firefox, Safari y Edge. Para una experiencia óptima, recomendamos mantener tu navegador actualizado y habilitar JavaScript.',
			category: 'technical',
			tags: ['navegador', 'compatibilidad', 'técnico'],
			helpful: 19,
		},
		{
			id: '5',
			question: '¿Cómo puedo cambiar el idioma de la interfaz?',
			answer:
				'Puedes cambiar el idioma de la interfaz desde tu perfil. Ve a Configuración > Preferencias > Idioma y selecciona tu idioma preferido. Los cursos mantienen su idioma original, pero la navegación cambiará al idioma seleccionado.',
			category: 'platform',
			tags: ['idioma', 'interfaz', 'configuración'],
			helpful: 23,
		},
		{
			id: '6',
			question: '¿Hay límite en el número de cursos que puedo tomar?',
			answer:
				'No hay límite en el número de cursos que puedes tomar simultáneamente. Sin embargo, recomendamos enfocarte en 2-3 cursos a la vez para maximizar tu aprendizaje y retención del conocimiento.',
			category: 'courses',
			tags: ['límite', 'cursos', 'simultáneos'],
			helpful: 15,
		},
	];

export const aristocratFrequentlyAskedQuestionsCategoryLabels = {
	account: 'Cuenta',
	courses: 'Cursos',
	certificates: 'Certificados',
	technical: 'Técnico',
	platform: 'Plataforma',
};

interface AristocratFrequentlyAskedQuestionItemProps {
	frequentlyAskedQuestion: AristocratFrequentlyAskedQuestion;
	isExpanded: boolean;
	onToggle: () => void;
}

function AristocratFrequentlyAskedQuestionItem({
	frequentlyAskedQuestion,
	isExpanded,
	onToggle,
}: AristocratFrequentlyAskedQuestionItemProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="rounded-lg border"
		>
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
			>
				<div className="flex-1">
					<h4 className="mb-2 font-medium text-sm">
						{frequentlyAskedQuestion.question}
					</h4>
					<div className="flex items-center gap-2">
						<Badge variant="secondary" className="text-xs">
							{
								aristocratFrequentlyAskedQuestionsCategoryLabels[
									frequentlyAskedQuestion.category as keyof typeof aristocratFrequentlyAskedQuestionsCategoryLabels
								]
							}
						</Badge>
						<span
							className="text-gray-500 text-xs"
							style={{ fontFamily: 'Geist Mono' }}
						>
							{frequentlyAskedQuestion.helpful} personas encontraron esto útil
						</span>
					</div>
				</div>
				{isExpanded ? (
					<AristocratIcons.ChevronDown className="h-4 w-4 text-gray-400" />
				) : (
					<AristocratIcons.ChevronRight className="h-4 w-4 text-gray-400" />
				)}
			</button>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="border-t bg-gray-50 px-4 pt-0 pb-4">
							<p className="mt-3 text-gray-700 text-sm leading-relaxed">
								{frequentlyAskedQuestion.answer}
							</p>
							<div className="mt-4 flex items-center gap-2">
								<span className="text-gray-500 text-xs">¿Te resultó útil?</span>
								<button
									type="button"
									className="text-green-600 text-xs hover:underline"
								>
									Sí
								</button>
								<button
									type="button"
									className="text-red-600 text-xs hover:underline"
								>
									No
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

interface AristocratFrequentlyAskedQuestionsProps {
	frequentlyAskedQuestions?: AristocratFrequentlyAskedQuestion[];
}

export function AristocratFrequentlyAskedQuestions({
	frequentlyAskedQuestions = aristocratFrequentlyAskedQuestionsData,
}: AristocratFrequentlyAskedQuestionsProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [activeCategory, setActiveCategory] = useState('all');
	const [expandedFrequentlyAskedQuestion, setExpandedFrequentlyAskedQuestion] =
		useState<string | null>(null);

	const filteredFrequentlyAskedQuestions = frequentlyAskedQuestions.filter(
		(frequentlyAskedQuestion) => {
			const matchesSearch =
				frequentlyAskedQuestion.question
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				frequentlyAskedQuestion.answer
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				frequentlyAskedQuestion.tags.some((tag) =>
					tag.toLowerCase().includes(searchQuery.toLowerCase()),
				);

			const matchesCategory =
				activeCategory === 'all' ||
				frequentlyAskedQuestion.category === activeCategory;

			return matchesSearch && matchesCategory;
		},
	);

	const categories = [
		'all',
		...Array.from(
			new Set(
				frequentlyAskedQuestions.map(
					(frequentlyAskedQuestion) => frequentlyAskedQuestion.category,
				),
			),
		),
	];

	return (
		<Card className="shadow-sm">
			<CardHeader>
				<CardTitle className="mb-6 tracking-tight">
					Preguntas Frecuentes
				</CardTitle>
				<SearchInput
					placeholder="Buscar en las FAQs..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</CardHeader>

			<CardContent>
				<Tabs
					value={activeCategory}
					onValueChange={setActiveCategory}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-6">
						<TabsTrigger value="all">Todas</TabsTrigger>
						{categories.slice(1).map((category) => (
							<TabsTrigger key={category} value={category}>
								{
									aristocratFrequentlyAskedQuestionsCategoryLabels[
										category as keyof typeof aristocratFrequentlyAskedQuestionsCategoryLabels
									]
								}
							</TabsTrigger>
						))}
					</TabsList>

					<TabsContent value={activeCategory} className="mt-6">
						<div className="space-y-3">
							{filteredFrequentlyAskedQuestions.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									<p>
										No se encontraron preguntas que coincidan con tu búsqueda.
									</p>
								</div>
							) : (
								filteredFrequentlyAskedQuestions.map(
									(frequentlyAskedQuestion) => (
										<AristocratFrequentlyAskedQuestionItem
											key={frequentlyAskedQuestion.id}
											frequentlyAskedQuestion={frequentlyAskedQuestion}
											isExpanded={
												expandedFrequentlyAskedQuestion ===
												frequentlyAskedQuestion.id
											}
											onToggle={() =>
												setExpandedFrequentlyAskedQuestion(
													expandedFrequentlyAskedQuestion ===
														frequentlyAskedQuestion.id
														? null
														: frequentlyAskedQuestion.id,
												)
											}
										/>
									),
								)
							)}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
