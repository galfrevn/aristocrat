import { AristocratPageHeader } from '@/app/dashboard/components/header';
import { AristocratPageWrapper } from '@/app/dashboard/components/wrapper';

import { AristocratDashboardSettingsSidebar } from './components/sidebar';
import { AristocratDashboardSettingsCards } from './components/cards';
import { SettingsProfileForm } from './components/form';

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
					form={<SettingsProfileForm />}
					content={{
						title: 'Mi Perfil',
						description:
							'Actualiza tu información personal y preferencias de cuenta.',
					}}
				/>
				<AristocratDashboardSettingsCards
					form={<></>}
					content={{
						title: 'Seguridad',
						description: 'Actualiza tu contraseña y opciones de seguridad.',
					}}
				/>
			</div>
		</div>
	</AristocratPageWrapper>
);

export default AristocratDashboardSettingsPage;
