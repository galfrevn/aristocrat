'use client';

import z from 'zod/v4';

import type { User } from 'better-auth';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import { authenticationClientside } from '@/lib/auth-client';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { FileUploader, uploadFiles } from '@/components/ui/file';
import { CardAction, CardContent, CardFooter } from '@/components/ui/card';

import { SettingsProfileFormSkeleton } from '@/app/dashboard/settings/components/form.skeleton';

const settingsProfileFormDefaultValues = (user?: User) => ({
	image: user?.image || ('' as string | null),
	name: user?.name || '',
});

const settingsProfileFormValidators = {
	onSubmit: z.object({
		image: z.url().nullable(),
		name: z
			.string()
			.min(1, 'El nombre es obligatorio')
			.max(50, 'El nombre no puede tener más de 50 caracteres'),
	}),
};

const generateSettingsProfilePayload = (
	value: ReturnType<typeof settingsProfileFormDefaultValues>,
) => ({
	image: value.image,
	name: value.name,
});

export function SettingsProfileForm() {
	const { data, isPending } = authenticationClientside.useSession();
	const [image, setImage] = useState<File | null>(null);

	const settingsProfileFormInstance = useForm({
		defaultValues: settingsProfileFormDefaultValues(data?.user),
		validators: settingsProfileFormValidators,
		onSubmit: async ({ value }) => {
			if (!image) return;
			const responses = await uploadFiles('profilePicturesRouter', {
				files: [image as File],
			});

			await handleUpdateUser(value, responses);
		},
	});

	const handleUpdateUser = async (
		value: ReturnType<typeof settingsProfileFormDefaultValues>,
		responses: { ufsUrl: string }[],
	) =>
		await authenticationClientside.updateUser(
			generateSettingsProfilePayload({
				name: value.name,
				image: responses[0].ufsUrl,
			}),
			{
				onSuccess: () => {
					toast.success('Perfil actualizado correctamente');
					settingsProfileFormInstance.reset();
					setImage(null);
				},
				onError: (error) => {
					toast.error(error.error.message);
				},
			},
		);

	const handleSubmitRegisterForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		void settingsProfileFormInstance.handleSubmit();
	};

	if (isPending) {
		return <SettingsProfileFormSkeleton />;
	}

	return (
		<form onSubmit={handleSubmitRegisterForm}>
			<CardContent className="grid grid-cols-2 gap-x-6 gap-y-2 space-y-4">
				<div className="col-span-2">
					<settingsProfileFormInstance.Field name="image">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Avatar</Label>
								<FileUploader preview={field.state.value} onChange={setImage} />
							</div>
						)}
					</settingsProfileFormInstance.Field>
				</div>

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
