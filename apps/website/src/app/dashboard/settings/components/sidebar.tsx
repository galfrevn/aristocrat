'use client';

import { Button } from '@/components/ui/button';

interface SidebarItem {
	id: string;
	label: string;
}

const sidebarItems: SidebarItem[] = [
	{ id: 'profile', label: 'Mi Perfil' },
	{ id: 'avatar', label: 'Mi Avatar' },
	{ id: 'security', label: 'Seguridad' },
];

export const AristocratDashboardSettingsSidebar = () => {
	const handleScrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			// Find the accordion trigger within this section
			const accordionTrigger = element.querySelector(
				'[data-radix-collection-item] button[aria-expanded]',
			);

			if (accordionTrigger) {
				const isExpanded =
					accordionTrigger.getAttribute('aria-expanded') === 'true';

				if (!isExpanded) {
					// Open the accordion first
					(accordionTrigger as HTMLElement).click();

					// Wait for the accordion animation to complete
					setTimeout(() => {
						element.scrollIntoView({
							behavior: 'smooth',
							block: 'start',
						});
					}, 150);
				} else {
					// Just scroll if already open
					element.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
				}
			} else {
				// Fallback scroll if accordion trigger not found
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		}
	};

	return (
		<aside>
			<ul className="w-full space-y-1">
				{sidebarItems.map((item) => (
					<li key={item.id}>
						<Button
							variant="ghost"
							className="w-full cursor-pointer justify-start"
							onClick={() => handleScrollToSection(item.id)}
						>
							{item.label}
						</Button>
					</li>
				))}
			</ul>
		</aside>
	);
};
