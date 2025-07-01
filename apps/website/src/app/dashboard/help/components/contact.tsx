'use client';

import { AristocratIcons } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AristocratContactMethod {
	icon: React.ComponentType<React.ComponentProps<'svg'>>;
	title: string;
	value: string;
	subtitle: string;
	bgColor: string;
	iconColor: string;
}

const aristocratContactMethods: AristocratContactMethod[] = [
	{
		icon: AristocratIcons.Mail,
		title: 'Email de Soporte',
		value: 'soporte@aristocrat.com',
		subtitle: 'Respuesta en 24 horas',
		bgColor: 'bg-blue-100',
		iconColor: 'text-blue-600',
	},
	{
		icon: AristocratIcons.Phone,
		title: 'Teléfono de Soporte',
		value: '+34 900 123 456',
		subtitle: 'Lun-Vie 9:00-18:00 CET',
		bgColor: 'bg-green-100',
		iconColor: 'text-green-600',
	},
	{
		icon: AristocratIcons.MessageCircle,
		title: 'Chat en Vivo',
		value: 'Disponible 24/7',
		subtitle: 'Respuesta inmediata',
		bgColor: 'bg-purple-100',
		iconColor: 'text-purple-600',
	},
];

interface AristocratScheduleItem {
	day: string;
	hours: string;
	isSpecial?: boolean;
}

const aristocratSchedule: AristocratScheduleItem[] = [
	{ day: 'Lunes - Viernes', hours: '9:00 - 18:00' },
	{ day: 'Sábados', hours: '10:00 - 14:00' },
	{ day: 'Domingos', hours: 'Cerrado' },
	{ day: 'Chat en Vivo', hours: '24/7', isSpecial: true },
];

function AristocratContactMethodCard({
	contactMethod,
}: {
	contactMethod: AristocratContactMethod;
}) {
	const IconComponent = contactMethod.icon;

	return (
		<div className="flex items-start gap-4">
			<div
				className={`h-10 w-10 ${contactMethod.bgColor} flex items-center justify-center rounded-lg`}
			>
				<IconComponent className={`h-5 w-5 ${contactMethod.iconColor}`} />
			</div>
			<div>
				<h4 className="mb-1 font-medium">{contactMethod.title}</h4>
				<p className="mb-1 text-gray-600 text-sm">{contactMethod.value}</p>
				<p className="text-gray-500 text-xs">{contactMethod.subtitle}</p>
			</div>
		</div>
	);
}

function AristocratScheduleRow({
	scheduleItem,
}: {
	scheduleItem: AristocratScheduleItem;
}) {
	return (
		<div className="flex items-center justify-between border-b py-2 last:border-b-0">
			<span className="font-medium text-sm">{scheduleItem.day}</span>
			<span
				className={`text-sm ${scheduleItem.isSpecial ? 'text-green-600' : 'text-gray-600'}`}
				style={{
					fontFamily: scheduleItem.isSpecial ? undefined : 'Geist Mono',
				}}
			>
				{scheduleItem.hours}
			</span>
		</div>
	);
}

export function AristocratContact() {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle className="font-serif text-lg">
						Información de Contacto
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{aristocratContactMethods.map((contactMethod) => (
						<AristocratContactMethodCard
							key={contactMethod.title}
							contactMethod={contactMethod}
						/>
					))}
				</CardContent>
			</Card>

			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle className="font-serif text-lg">
						Horarios de Atención
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{aristocratSchedule.map((scheduleItem) => (
							<AristocratScheduleRow
								key={scheduleItem.day}
								scheduleItem={scheduleItem}
							/>
						))}
					</div>

					<div className="mt-6 rounded-lg bg-blue-50 p-4">
						<h4 className="mb-2 font-medium text-sm">Zona Horaria</h4>
						<p className="text-gray-600 text-sm">
							Todos los horarios están en CET (Hora Central Europea - Madrid,
							España)
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
