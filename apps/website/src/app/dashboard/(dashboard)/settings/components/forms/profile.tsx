'use client';

import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import z from 'zod/v4';
import { Button } from '@/components/ui/button';
import { CardAction, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authenticationClientside } from '@/lib/auth-client';

const settingsProfileFormValidators = {
	onSubmit: z.object({
		name: z
			.string()
			.min(1, 'El nombre es obligatorio')
			.max(50, 'El nombre no puede tener más de 50 caracteres'),
	}),
};

export function SettingsProfileForm() {
	const { data } = authenticationClientside.useSession();

	const settingsProfileFormInstance = useForm({
		defaultValues: { name: data?.user.name || '' },
		validators: settingsProfileFormValidators,
		onSubmit: async ({ value }) => {
			await authenticationClientside.updateUser(value, {
				onSuccess: () => {
					toast.success('Perfil actualizado correctamente');
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
		void settingsProfileFormInstance.handleSubmit();
	};

	return (
		<form onSubmit={handleSubmitRegisterForm}>
			<CardContent className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-2">
				<div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							disabled
							id="email"
							name="email"
							type="text"
							className="mt-1 bg-secondary"
							value={data?.user?.email || ''}
						/>
					</div>
				</div>

				<div>
					<settingsProfileFormInstance.Field name="name">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Nombre completo</Label>
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
					</settingsProfileFormInstance.Field>
				</div>
			</CardContent>

			<CardFooter className="mt-4 justify-end border-t pt-4!">
				<CardAction>
					<settingsProfileFormInstance.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="text-sm"
								disabled={
									!state.canSubmit || state.isSubmitting || !state.isDirty
								}
							>
								{state.isSubmitting ? 'Procesando...' : 'Guardar cambios'}
							</Button>
						)}
					</settingsProfileFormInstance.Subscribe>
				</CardAction>
			</CardFooter>
		</form>
	);
}
