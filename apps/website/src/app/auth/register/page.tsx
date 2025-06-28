import { AristocratAuthWrapper } from '@/app/auth/components/wrapper';
import { AuthenticationRegisterForm } from '@/app/auth/register/form';

export default function AristocratAuthRegisterPage() {
	return (
		<AristocratAuthWrapper
			form={<AuthenticationRegisterForm />}
			content={{
				title: 'Crea tu cuenta',
				description:
					'Conoce Aristocrat Learning, la plataforma de aprendizaje que te ayuda a alcanzar tus metas educativas y profesionales.',
			}}
		/>
	);
}
