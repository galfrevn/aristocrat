'use client';

import z from 'zod/v4';

import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';

import { authenticationClientside } from '@/lib/auth-client';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Link from 'next/link';

const loginFormDefaultValues = {
	email: '',
	password: '',
};

const loginFormValidators = {
	onSubmit: z.object({
		email: z.string().email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
	}),
};

const generateLoginPayload = (value: typeof loginFormDefaultValues) => ({
	email: value.email,
	password: value.password,
});

export function AuthenticationLoginForm() {
	const router = useRouter();

	const authenticationRegisterFormInstance = useForm({
		defaultValues: loginFormDefaultValues,
		validators: loginFormValidators,
		onSubmit: async ({ value }) => {
			await authenticationClientside.signIn.email(generateLoginPayload(value), {
				onSuccess: () => {
					router.push('/dashboard');
					toast.success('Sign up successful');
				},
				onError: (error) => {
					toast.error(error.error.message);
				},
			});
		},
	});

	const handleSubmitRegisterForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		void authenticationRegisterFormInstance.handleSubmit();
	};

	return (
		<>
			<form onSubmit={handleSubmitRegisterForm} className="space-y-4">
				<div>
					<authenticationRegisterFormInstance.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Email</Label>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p
										key={error?.message}
										className="text-muted-foreground text-xs"
									>
										{error?.message}
									</p>
								))}
							</div>
						)}
					</authenticationRegisterFormInstance.Field>
				</div>

				<div>
					<authenticationRegisterFormInstance.Field name="password">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Contraseña</Label>
								<Input
									id={field.name}
									name={field.name}
									type="password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p
										key={error?.message}
										className="text-muted-foreground text-xs"
									>
										{error?.message}
									</p>
								))}
							</div>
						)}
					</authenticationRegisterFormInstance.Field>
				</div>

				<authenticationRegisterFormInstance.Subscribe>
					{(state) => (
						<Button
							type="submit"
							className="w-full"
							disabled={!state.canSubmit || state.isSubmitting}
						>
							{state.isSubmitting ? 'Procesando...' : 'Iniciar sesión'}
						</Button>
					)}
				</authenticationRegisterFormInstance.Subscribe>
			</form>
			<div className="mt-4 text-center">
				<Button asChild variant="link">
					<Link href="/auth/register">¿No tienes una cuenta? Regístrate</Link>
				</Button>
			</div>
		</>
	);
}
