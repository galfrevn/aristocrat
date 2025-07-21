import Image from 'next/image';

import { AristocratIcons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import type { PostType } from '../types';
import { AristocratCommunityPostCardActions } from './post-actions';

interface PostProps {
	name: string;
	type: PostType;
	description: string;
	tags: string[];
	hours: number;
	avatar: string;
	likes: number;
	comments: number;
}

export const AristocratCommunityPostCard = ({
	name,
	type,
	description,
	tags,
	hours,
	avatar,
	likes,
	comments,
}: PostProps) => {
	return (
		<fieldset
			aria-labelledby={`post-title-${name.replace(/\s+/g, '-').toLowerCase()}`}
			className="w-full"
		>
			<Card className="flex flex-col gap-3 rounded-lg border p-6 shadow-none">
				<Popover>
					<div className="flex items-center justify-between">
						<div className="flex gap-3">
							<Image
								src={avatar}
								alt={`Avatar de ${name}`}
								width={48}
								height={48}
							/>
							<div className="flex flex-col">
								<h3
									id={`post-title-${name.replace(/\s+/g, '-').toLowerCase()}`}
									className="font-medium text-md"
								>
									{name}
								</h3>
								<p className="text-secondary-foreground text-sm">
									hace {hours} horas
								</p>
							</div>
						</div>
						<PopoverTrigger
							type="button"
							className="cursor-pointer rounded-md p-1 transition-colors hover:bg-muted"
							aria-label="Opciones de la publicación"
						>
							<AristocratIcons.MorePoints />
						</PopoverTrigger>
						<PopoverContent className="w-full max-w-sm p-1">
							<a
								href="/dashboard/community/report-post"
								className="flex cursor-pointer items-center gap-2 rounded-md border-none px-3 py-2 transition-colors hover:bg-muted"
							>
								<AristocratIcons.Flag className="size-4" aria-hidden="true" />
								<span className="text-sm">Reportar</span>
							</a>
						</PopoverContent>
					</div>
					<Badge
						className="bg-primary px-4 py-1 text-xs"
						aria-label={`Tipo de publicación: ${type}`}
					>
						{type}
					</Badge>
					<p>{description}</p>
					<div className="flex gap-2 pb-2">
						{tags.map((tag) => (
							<Badge
								key={tag}
								className="bg-muted px-3 py-1 text-primary text-xs"
								aria-label={`Etiqueta: ${tag}`}
							>
								{tag}
							</Badge>
						))}
					</div>

					<hr />

					<AristocratCommunityPostCardActions
						likes={likes}
						comments={comments}
					/>
				</Popover>
			</Card>
		</fieldset>
	);
};
