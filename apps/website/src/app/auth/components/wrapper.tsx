import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';

interface AristocratAuthWrapperProps {
	form: React.ReactNode;
	content: {
		title: string;
		description?: string;
	};
}

export const AristocratAuthWrapper = (props: AristocratAuthWrapperProps) => {
	const { form, content } = props;

	return (
		<Card className="w-full max-w-sm rounded-3xl pt-10 ">
			<CardContent>
				<div className="mb-6 flex flex-col items-center space-y-4">
					<div className="relative flex aspect-square size-14 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary p-2 text-sidebar-primary-foreground after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)]">
						<Image
							alt="Aristocrat Logo"
							src="/aristocrat/logo.avif"
							width={30}
							height={30}
						/>
					</div>

					<div className="space-y-1 text-center">
						<h1 className="font-medium font-serif text-2xl">{content.title}</h1>
						<p className="text-muted-foreground/80 text-sm">
							{content.description}
						</p>
					</div>
				</div>
				{form}
			</CardContent>
		</Card>
	);
};
