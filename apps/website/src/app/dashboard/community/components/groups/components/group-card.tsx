import { AristocratIcons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AristocratCommunityGroupAvatars } from './group-avatars';

interface GroupProps {
	title: string;
	description: string;
	category: string;
	schedule: string;
	members: string[];
	max_members: number;
	actual_members: number;
	isJoined: boolean;
}

export const AristocratCommunityGroupCard = ({
	title,
	description,
	category,
	schedule,
	members,
	max_members,
	actual_members,
	isJoined,
}: GroupProps) => {
	return (
		<fieldset
			aria-labelledby={`group-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
			className="w-full"
		>
			<Card className="flex flex-col gap-3 rounded-lg border p-6 shadow-none">
				<h3
					id={`group-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
					className="font-semibold text-lg"
				>
					{title}
				</h3>
				<Badge
					className="bg-primary px-3 py-1 text-secondary text-xs"
					aria-label={`Categoría: ${category}`}
				>
					{category}
				</Badge>
				<p className="text-base">{description}</p>

				<AristocratCommunityGroupAvatars
					members={members}
					actual_members={actual_members}
					max_members={max_members}
				/>

				<div className="flex items-center gap-2 text-muted-foreground">
					<AristocratIcons.Calendar size={18} aria-hidden="true" />
					<span>{schedule}</span>
				</div>
				{isJoined ? (
					<Button
						type="button"
						size="lg"
						disabled
						aria-label="Ya eres miembro de este grupo"
					>
						Miembro
					</Button>
				) : (
					<Button
						size="lg"
						className="cursor-pointer"
						aria-label={`Unirse al grupo ${title}`}
					>
						Unirse al Grupo
					</Button>
				)}
			</Card>
		</fieldset>
	);
};
