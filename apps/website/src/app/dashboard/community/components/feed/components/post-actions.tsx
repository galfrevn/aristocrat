import { AristocratIcons } from '@/components/icons';

interface PostCardActionsProps {
	likes: number;
	comments: number;
}

export const AristocratCommunityPostCardActions = ({
	likes,
	comments,
}: PostCardActionsProps) => {
	return (
		<nav aria-label="Acciones de la publicación" className="pt-2">
			<ul className="flex items-center gap-3">
				<li>
					<button
						type="button"
						className="flex cursor-pointer items-center gap-1 text-secondary-foreground/50 transition-colors hover:text-red-500"
						aria-label="Me gusta"
					>
						<AristocratIcons.HeartLIke className="size-5" aria-hidden="true" />
						<span className="text-sm">{likes}</span>
					</button>
				</li>
				<li>
					<button
						type="button"
						className="flex cursor-pointer items-center gap-1 text-secondary-foreground/50 transition-colors hover:text-blue-500"
						aria-label="Ver comentarios"
					>
						<AristocratIcons.Chat className="size-5" aria-hidden="true" />
						<span className="text-sm">{comments}</span>
					</button>
				</li>
				<li>
					<button
						type="button"
						className="flex cursor-pointer items-center gap-1 text-secondary-foreground/50 transition-colors hover:text-green-500"
						aria-label="Compartir publicación"
					>
						<AristocratIcons.Share className="size-5" aria-hidden="true" />
						<span className="text-sm">Compartir</span>
					</button>
				</li>
			</ul>
		</nav>
	);
};
