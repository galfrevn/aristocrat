import { AristocratIcons } from '@/components/icons';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface GroupAvatarsProps {
	members: string[];
	actual_members: number;
	max_members: number;
}

export const AristocratCommunityGroupAvatars = ({
	members,
	actual_members,
	max_members,
}: GroupAvatarsProps) => {
	return (
		<fieldset
			className="flex gap-3"
			aria-label={`Avatares de miembros del grupo (${actual_members} de ${max_members})`}
		>
			<ul className="-space-x-3 flex flex-wrap">
				{members.map((avatar, idx) => (
					<li key={avatar}>
						<Avatar className="size-10 border border-primary/10">
							<AvatarImage src={avatar} alt={`Avatar del miembro ${idx + 1}`} />
						</Avatar>
					</li>
				))}
				<div className="z-20 flex size-10 items-center justify-center rounded-full bg-muted">
					<span className="text-sm">+{actual_members - 4}</span>
				</div>
			</ul>
			<div className="flex items-center gap-2 text-muted-foreground">
				<AristocratIcons.PersonGroups size={18} aria-hidden="true" />
				<span>
					{actual_members} / {max_members}
				</span>
			</div>
		</fieldset>
	);
};
