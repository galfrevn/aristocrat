'use client';

import { motion } from 'motion/react';

import { AristocratIcons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface AristocratSupportTicket {
	id: string;
	title: string;
	description: string;
	status: 'open' | 'in-progress' | 'resolved' | 'closed';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	category: string;
	createdAt: string;
	updatedAt: string;
	responses: number;
}

interface AristocratSupportTicketCardProps {
	supportTicket: AristocratSupportTicket;
	onClick: () => void;
}

const aristocratSupportTicketStatusConfiguration = {
	open: { color: 'bg-blue-100 text-blue-800', icon: AristocratIcons.Clock },
	'in-progress': {
		color: 'bg-yellow-100 text-yellow-800',
		icon: AristocratIcons.AlertCircle,
	},
	resolved: {
		color: 'bg-green-100 text-green-800',
		icon: AristocratIcons.CheckCircle,
	},
	closed: { color: 'bg-gray-100 text-gray-800', icon: AristocratIcons.XCircle },
};

const aristocratSupportTicketPriorityConfiguration = {
	low: 'bg-gray-100 text-gray-800',
	medium: 'bg-blue-100 text-blue-800',
	high: 'bg-orange-100 text-orange-800',
	urgent: 'bg-red-100 text-red-800',
};

const aristocratSupportTicketStatusLabels = {
	open: 'Abierto',
	'in-progress': 'En Progreso',
	resolved: 'Resuelto',
	closed: 'Cerrado',
};

const aristocratSupportTicketPriorityLabels = {
	low: 'Baja',
	medium: 'Media',
	high: 'Alta',
	urgent: 'Urgente',
};

export const aristocratSampleSupportTickets: AristocratSupportTicket[] = [
	{
		id: 'TK-2024-001',
		title: 'No puedo acceder a mi curso de JavaScript',
		description:
			'Cuando intento acceder al curso de JavaScript Avanzado, la página se queda cargando indefinidamente. He probado con diferentes navegadores pero el problema persiste.',
		status: 'in-progress',
		priority: 'high',
		category: 'Problema Técnico',
		createdAt: '15 Ene 2024',
		updatedAt: '16 Ene 2024',
		responses: 3,
	},
	{
		id: 'TK-2024-002',
		title: 'Consulta sobre certificado de React',
		description:
			'Completé el curso de React hace una semana pero aún no he recibido mi certificado. ¿Cuánto tiempo suele tomar el proceso?',
		status: 'resolved',
		priority: 'medium',
		category: 'Certificados',
		createdAt: '12 Ene 2024',
		updatedAt: '14 Ene 2024',
		responses: 2,
	},
	{
		id: 'TK-2024-003',
		title: 'Error en el pago de suscripción',
		description:
			'Mi tarjeta fue cobrada pero mi cuenta sigue mostrando que no tengo suscripción activa. Necesito ayuda urgente.',
		status: 'open',
		priority: 'urgent',
		category: 'Cuenta y Facturación',
		createdAt: '16 Ene 2024',
		updatedAt: '16 Ene 2024',
		responses: 0,
	},
];

export function AristocratSupportTicketCard({
	supportTicket,
	onClick,
}: AristocratSupportTicketCardProps) {
	const StatusIcon =
		aristocratSupportTicketStatusConfiguration[supportTicket.status].icon;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 300, damping: 30 }}
		>
			<Card
				className="cursor-pointer transition-colors hover:bg-muted/40"
				onClick={onClick}
			>
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="mb-2 flex items-center gap-2">
								<Badge
									className={`text-xs ${aristocratSupportTicketStatusConfiguration[supportTicket.status].color}`}
								>
									<StatusIcon className="mr-1 h-3 w-3" />
									{aristocratSupportTicketStatusLabels[supportTicket.status]}
								</Badge>
								<Badge
									className={`text-xs ${aristocratSupportTicketPriorityConfiguration[supportTicket.priority]}`}
								>
									{
										aristocratSupportTicketPriorityLabels[
											supportTicket.priority
										]
									}
								</Badge>
							</div>
							<CardTitle className="text-base leading-tight tracking-tight">
								{supportTicket.title}
							</CardTitle>
							<p className="mt-1 text-gray-600 text-sm">#{supportTicket.id}</p>
						</div>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<p className="mb-4 line-clamp-2 text-gray-700 text-sm">
						{supportTicket.description}
					</p>

					<div className="flex items-center justify-between text-gray-500 text-xs">
						<div className="flex items-center gap-4">
							<span>Categoría: {supportTicket.category}</span>
							<div className="flex items-center gap-1">
								<AristocratIcons.MessageCircle className="h-3 w-3" />
								<span style={{ fontFamily: 'Geist Mono' }}>
									{supportTicket.responses}
								</span>
							</div>
						</div>
						<div className="text-right">
							<div>Creado: {supportTicket.createdAt}</div>
							<div>Actualizado: {supportTicket.updatedAt}</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

interface AristocratSupportTicketsProps {
	supportTickets?: AristocratSupportTicket[];
}

export function AristocratSupportTickets({
	supportTickets = aristocratSampleSupportTickets,
}: AristocratSupportTicketsProps) {
	const activeSupportTickets = supportTickets.filter(
		(supportTicket) => supportTicket.status !== 'closed',
	);
	const historySupportTickets = supportTickets.filter(
		(supportTicket) =>
			supportTicket.status === 'resolved' || supportTicket.status === 'closed',
	);

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div className="space-y-4">
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="tracking-tight">Tickets Activos</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{activeSupportTickets.length > 0 ? (
							activeSupportTickets.map((supportTicket) => (
								<AristocratSupportTicketCard
									key={supportTicket.id}
									supportTicket={supportTicket}
									onClick={() => {}}
								/>
							))
						) : (
							<div className="py-8 text-center text-gray-500">
								<AristocratIcons.Ticket className="mx-auto mb-4 h-12 w-12 text-gray-300" />
								<p>No tienes tickets activos</p>
								<Button variant="outline" className="mt-3">
									Crear tu primer ticket
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="space-y-4">
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="tracking-tight">
							Historial de Tickets
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{historySupportTickets.map((supportTicket) => (
							<AristocratSupportTicketCard
								key={supportTicket.id}
								supportTicket={supportTicket}
								onClick={() => {}}
							/>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
