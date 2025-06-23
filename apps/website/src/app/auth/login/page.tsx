import { AristocratAuthWrapper } from '@/app/auth/components/wrapper';
import { AuthenticationLoginForm } from '@/app/auth/login/form';

export const AristocratAuthLoginPage = () => (
	<AristocratAuthWrapper
		form={<AuthenticationLoginForm />}
		content={{
			title: 'Iniciar sesión',
			description:
				'Nos encanta verte de vuelta, por favor inicia sesión para continuar disfrutando de Aristocrat Learning.',
		}}
	/>
);

export default AristocratAuthLoginPage;
