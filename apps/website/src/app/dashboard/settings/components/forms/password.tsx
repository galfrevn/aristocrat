'use client';

import z from 'zod/v4';

import { useForm } from '@tanstack/react-form';

import { authenticationClientside } from '@/lib/auth-client';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { CardAction, CardContent, CardFooter } from '@/components/ui/card';

const settingsPasswordFormValidators = {
	onSubmit: z
		.object({
			currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
			newPassword: z
				.string()
				.min(8, 'La contraseña debe tener al menos 8 caracteres')
				.max(30, 'La contraseña no puede tener más de 30 caracteres'),
		})
		.refine((data) => data.currentPassword !== data.newPassword, {
			message: 'La nueva contraseña debe ser diferente a la contraseña actual',
			path: ['newPassword'],
		}),
};

export function SettingsPasswordForm() {
	const settingsPasswordFormInstance = useForm({
		defaultValues: { currentPassword: '', newPassword: '' },
		validators: settingsPasswordFormValidators,
		onSubmit: async ({ value }) => {
			await authenticationClientside.changePassword(value, {
				onSuccess: () => {
					toast.success('Contraseña actualizada correctamente');
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
		void settingsPasswordFormInstance.handleSubmit();
	};

	return (
		<form onSubmit={handleSubmitRegisterForm}>
			<CardContent className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-2">
				<div>
					<settingsPasswordFormInstance.Field name="currentPassword">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Contraseña actual</Label>
								<Input
									id={field.name}
									name={field.name}
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									className="mt-1 bg-secondary text-secondary-foreground"
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
					</settingsPasswordFormInstance.Field>
				</div>

				<div>
					<settingsPasswordFormInstance.Field name="newPassword">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Nueva contraseña</Label>
								<Input
									id={field.name}
									name={field.name}
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									className="mt-1 bg-secondary text-secondary-foreground"
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<div>
									{field.state.meta.errors.map((error) => (
										<p
											key={error?.message}
											className="text-muted-foreground text-xs"
										>
											{error?.message}
										</p>
									))}
								</div>
							</div>
						)}
					</settingsPasswordFormInstance.Field>
				</div>
			</CardContent>

			<CardFooter className="mt-4 justify-end border-t pt-4!">
				<CardAction>
					<settingsPasswordFormInstance.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="text-sm"
								disabled={
									!state.canSubmit || state.isSubmitting || !state.isDirty
								}
							>
								{state.isSubmitting ? 'Procesando...' : 'Actualizar contraseña'}
							</Button>
						)}
					</settingsPasswordFormInstance.Subscribe>
				</CardAction>
			</CardFooter>
		</form>
	);
}
