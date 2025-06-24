'use client';

import { useState } from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const AristocratDashboardSettingsSidebar = () => {
	return (
		<aside>
			<ul className="w-full space-y-1">
				<li>
					<Button
						asChild
						variant="ghost"
						className="w-full justify-start"
					>
						<Link href="/dashboard/settings#profile">Perfil</Link>
					</Button>
				</li>
				<li>
					<Button
						asChild
						variant="ghost"
						className="w-full justify-start"
					>
						<Link href="/dashboard/settings#account">Cuenta</Link>
					</Button>
				</li>
				<li>
					<Button
						asChild
						variant="ghost"
						className="w-full justify-start"
					>
						<Link href="/dashboard/settings#notifications">Notificaciones</Link>
					</Button>
				</li>
				<li>
					<Button
						asChild
						variant="ghost"
						className="w-full justify-start"
					>
						<Link href="/dashboard/settings#billing">Facturación</Link>
					</Button>
				</li>
			</ul>
		</aside>
	);
};
