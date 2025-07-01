import { AristocratPageHeader } from '@/app/dashboard/components/header';
import { AristocratPageWrapper } from '@/app/dashboard/components/wrapper';
import { AristocratDashboardSettingsCards } from '@/app/dashboard/settings/components/cards';
import { SettingsAvatarForm } from '@/app/dashboard/settings/components/forms/avatar';
import { SettingsPasswordForm } from '@/app/dashboard/settings/components/forms/password';
import { SettingsProfileForm } from '@/app/dashboard/settings/components/forms/profile';
import { AristocratDashboardSettingsSidebar } from '@/app/dashboard/settings/components/sidebar';

const AristocratDashboardSettingsPage = () => (
	<AristocratPageWrapper>
		<AristocratPageHeader
			title="Configuración"
			description="Ajusta la configuración de tu cuenta y preferencias aquí."
		/>

		<div className="mt-12 flex gap-20">
			<AristocratDashboardSettingsSidebar />
			<div className="flex-1 space-y-6">
				<AristocratDashboardSettingsCards
					id="profile"
					form={<SettingsProfileForm />}
					content={{
						title: 'Mi Perfil',
						description:
							'Actualiza tu información personal y preferencias de cuenta.',
					}}
				/>

				<AristocratDashboardSettingsCards
					id="avatar"
					form={<SettingsAvatarForm />}
					content={{
						title: 'Mi Avatar',
						description: 'Personaliza tu imagen y deja una impresión única.',
					}}
				/>

				<AristocratDashboardSettingsCards
					id="security"
					form={<SettingsPasswordForm />}
					content={{
						title: 'Seguridad',
						description:
							'Cambia tu contraseña y gestiona la seguridad de tu cuenta.',
					}}
				/>
			</div>
		</div>
	</AristocratPageWrapper>
);

export default AristocratDashboardSettingsPage;
