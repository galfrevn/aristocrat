'use client';

import { AristocratContact } from '@/app/dashboard/(dashboard)/help/components/contact';
import { AristocratFrequentlyAskedQuestions } from '@/app/dashboard/(dashboard)/help/components/faq';
import { AristocratKnowledge } from '@/app/dashboard/(dashboard)/help/components/knowledge';
import { AristocratSupportTickets } from '@/app/dashboard/(dashboard)/help/components/tickets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AristocratHelpTabs() {
	return (
		<Tabs defaultValue="tickets" className="w-full">
			<TabsList className="grid w-full grid-cols-4">
				<TabsTrigger value="tickets">Mis Tickets</TabsTrigger>
				<TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
				<TabsTrigger value="knowledge">Base de Conocimientos</TabsTrigger>
				<TabsTrigger disabled value="contact">
					Contacto
				</TabsTrigger>
			</TabsList>

			<TabsContent value="tickets" className="mt-6">
				<AristocratSupportTickets />
			</TabsContent>

			<TabsContent value="faq" className="mt-6">
				<AristocratFrequentlyAskedQuestions />
			</TabsContent>

			<TabsContent value="knowledge" className="mt-6">
				<AristocratKnowledge />
			</TabsContent>

			<TabsContent value="contact" className="mt-6">
				<AristocratContact />
			</TabsContent>
		</Tabs>
	);
}
