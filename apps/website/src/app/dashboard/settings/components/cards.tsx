import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AristocratDashboardSettingsCardsProps {
	form: React.ReactNode;
	content: {
		title: string;
		description: string;
	};
	id?: string;
}

export const AristocratDashboardSettingsCards = (
	props: AristocratDashboardSettingsCardsProps,
) => {
	const { form, content, id } = props;

	return (
		<div id={id}>
			<Accordion
				className="rounded-lg border p-2 pt-3 shadow transition-colors duration-200 hover:bg-muted/30"
				type="single"
				collapsible
			>
				<AccordionItem className="border-none" value={content.title}>
					<CardHeader>
						<AccordionTrigger className="cursor-pointer decoration-transparent">
							<div>
								<CardTitle className="font-serif">{content.title}</CardTitle>
								<CardDescription>{content.description}</CardDescription>
							</div>
						</AccordionTrigger>
					</CardHeader>
					<AccordionContent className="mx-4 mb-4 rounded-lg border bg-background py-4">
						{form}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};
