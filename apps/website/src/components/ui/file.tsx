'use client';

import { useEffect } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';

import { Button } from '@/components/ui/button';
import {
	RiAlertLine,
	RiCloseLine,
	RiImage2Line,
	RiUpload2Line,
} from '@remixicon/react';

interface FileDropzoneProps {
	onChange: (file: File) => void;
}

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

export function FileDropzone(props: FileDropzoneProps) {
	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept: 'image/png,image/jpeg,image/jpg,image/webp',
		maxSize: MAX_FILE_SIZE,
	});

	const previewUrl = files[0]?.preview || null;

	useEffect(() => {
		if (files.length > 0) {
			props.onChange(files[0].file as File);
		}
	}, [files]);

	return (
		<div className="flex flex-col gap-2">
			<div className="relative">
				<div
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					data-dragging={isDragging || undefined}
					className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-input border-dashed p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
				>
					<input
						{...getInputProps()}
						className="sr-only"
						aria-label="Upload image file"
					/>
					{previewUrl ? (
						<div className="absolute inset-0 flex items-center justify-center p-4">
							<img
								src={previewUrl}
								alt={files[0]?.file?.name || 'Uploaded image'}
								className="mx-auto max-h-full rounded object-contain"
							/>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center px-4 py-3 text-center">
							<div
								className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
								aria-hidden="true"
							>
								<RiImage2Line className="size-4 opacity-60" />
							</div>
							<p className="mb-1.5 font-medium text-sm">
								Arrastra tus imagenes aquí
							</p>
							<p className="text-muted-foreground text-xs">
								PNG, JPG o WEBP (max. {MAX_FILE_SIZE_MB}MB)
							</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={openFileDialog}
							>
								<RiUpload2Line
									className="-ms-1 size-4 opacity-60"
									aria-hidden="true"
								/>
								Seleccionar archivo
							</Button>
						</div>
					)}
				</div>

				{previewUrl && (
					<div className="absolute top-4 right-4">
						<button
							type="button"
							className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
							onClick={() => {
								removeFile(files[0]?.id);
								props.onChange({} as File);
							}}
							aria-label="Eliminar archivo seleccionado"
						>
							<RiCloseLine className="size-4" aria-hidden="true" />
						</button>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div
					className="flex items-center gap-1 text-destructive text-xs"
					role="alert"
				>
					<RiAlertLine className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	);
}
