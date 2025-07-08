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
		<div className="flex items-center gap-3 pt-2">
			<button
				type="button"
				className="flex cursor-pointer items-center gap-1 text-secondary-foreground/50 transition-colors hover:text-red-500"
			>
				<AristocratIcons.HeartLIke className="size-5" />
				<span className="text-sm">{likes}</span>
			</button>
			<button
				type="button"
				className="flex cursor-pointer items-center gap-1 text-secondary-foreground/50 transition-colors hover:text-blue-500"
			>
				<AristocratIcons.Chat className="size-5" />
				<span className="text-sm">{comments}</span>
			</button>
			<button
				type="button"
				className="flex cursor-pointer items-center gap-1 text-secondary-foreground/50 transition-colors hover:text-green-500"
			>
				<AristocratIcons.Share className="size-5" />
				<span className="text-sm">Compartir</span>
			</button>
		</div>
	);
};
