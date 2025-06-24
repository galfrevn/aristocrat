'use client';

import z from 'zod/v4';

import { useForm } from '@tanstack/react-form';

import { authenticationClientside } from '@/lib/auth-client';
import { toast } from 'sonner';

import { genUploader } from 'uploadthing/client';

import { Button } from '@/components/ui/button';
import { FileDropzone } from '@/components/ui/file';
import { CardAction, CardContent, CardFooter } from '@/components/ui/card';

const settingsPasswordFormValidators = {
	onChange: z.object({
		avatar: z
			.file()
			.min(1)
			.max(1024 * 1024)
			.mime(['image/jpeg', 'image/png', 'image/webp']),
	}),
};

import type { AristocratFileRouter } from '@/app/api/uploadthing/core';
import { UploadThingError } from 'uploadthing/server';

const aristocratFileUploader = genUploader<AristocratFileRouter>();

export function SettingsAvatarForm() {
	const settingsAvatarFormInstance = useForm({
		defaultValues: { avatar: {} as File },
		validators: settingsPasswordFormValidators,
		onSubmit: async ({ value, formApi }) => {
			toast.promise(
				async () => {
					const uploadResponse = await aristocratFileUploader.uploadFiles(
						'profilePicturesRouter',
						{ files: [value.avatar] },
					);

					if (!uploadResponse || uploadResponse.length === 0) {
						throw new UploadThingError(
							'No se pudo subir el archivo. Asegúrate de que el archivo sea una imagen válida.',
						);
					}

					await authenticationClientside.updateUser({
						image: uploadResponse[0]?.ufsUrl,
					});
				},
				{
					loading: 'Actualizando avatar...',
					success: 'Avatar actualizado con éxito.',
					error: 'Error al actualizar el avatar. Inténtalo de nuevo.',
				},
			);

			formApi.reset({ avatar: value.avatar });
		},
	});

	const handleSubmitRegisterForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		void settingsAvatarFormInstance.handleSubmit();
	};

	return (
		<form onSubmit={handleSubmitRegisterForm}>
			<CardContent className="pt-4">
				<settingsAvatarFormInstance.Field name="avatar">
					{(field) => (
						<FileDropzone onChange={(file) => field.handleChange(file)} />
					)}
				</settingsAvatarFormInstance.Field>
			</CardContent>

			<CardFooter className="mt-4 justify-end border-t pt-4!">
				<CardAction>
					<settingsAvatarFormInstance.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="text-sm"
								disabled={
									!state.canSubmit || state.isSubmitting || !state.isDirty
								}
							>
								{state.isSubmitting ? 'Procesando...' : 'Actualizar avatar'}
							</Button>
						)}
					</settingsAvatarFormInstance.Subscribe>
				</CardAction>
			</CardFooter>
		</form>
	);
}
