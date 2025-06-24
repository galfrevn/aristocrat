'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AristocratIcons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useRouter } from 'next/navigation';
import { authenticationClientside } from '@/lib/auth-client';

export const AristocratNavigationHeaderUser = () => {
	const router = useRouter();
	const { data, isPending } = authenticationClientside.useSession();

	if (isPending) {
		return <Skeleton className="size-8 rounded-lg" />;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
					<Avatar className="size-8 rounded-lg">
						<AvatarImage
							src={data?.user.image || ''}
							alt={`${data?.user.name} avatar`}
							width={32}
							height={32}
						/>
						<AvatarFallback>
							{data?.user.name.at(0)?.toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-w-64 p-2 font-sans" align="end">
				<DropdownMenuLabel className="mb-2 flex min-w-0 flex-col px-1 py-0">
					<span className="mb-0.5 truncate font-medium text-foreground text-sm">
						{data?.user.name}
					</span>
					<span className="truncate font-normal text-muted-foreground text-xs">
						{data?.user.email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuItem className="gap-3 px-1">
					<AristocratIcons.Profile
						size={20}
						className="text-muted-foreground/70"
						aria-hidden="true"
					/>
					<span>Perfil</span>
				</DropdownMenuItem>
				<DropdownMenuItem className="gap-3 px-1">
					<AristocratIcons.Metrics
						size={20}
						className="text-muted-foreground/70"
						aria-hidden="true"
					/>
					<span>Métricas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push('/dashboard/settings')}
					className="gap-3 px-1"
				>
					<AristocratIcons.Settings
						size={20}
						className="text-muted-foreground/70"
						aria-hidden="true"
					/>
					<span>Configuración</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						authenticationClientside.signOut({});
						router.push('/auth/login');
					}}
					className="gap-3 px-1"
				>
					<AristocratIcons.Logout
						size={20}
						className="text-muted-foreground/70"
						aria-hidden="true"
					/>
					<span>Cerrar sesión</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
