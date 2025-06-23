'use client';

import { RiUser2Line } from '@remixicon/react';

import { useFileUpload } from '@/hooks/use-file-upload';
import { useEffect } from 'react';

import { genUploader } from 'uploadthing/client';
import type { AristocratFileRouter } from '@/app/api/uploadthing/core';

export const { uploadFiles } = genUploader<AristocratFileRouter>();

interface FileUploaderProps {
	onChange: (file: File | null) => void;
	preview?: string | null;
}

export function FileUploader({ onChange, preview }: FileUploaderProps) {
	const [{ files }, { removeFile, openFileDialog, getInputProps }] =
		useFileUpload({
			accept: 'image/*',
			maxFiles: 1,
			maxSize: 1 * 1024 * 1024,
		});

	useEffect(() => {
		if (files.length > 0) {
			onChange(files[0].file as File);
		} else {
			onChange(null);
		}
	}, [files, onChange]);

	const previewUrl = files[0]?.preview || preview || null;
	const fileName = files[0]?.file.name || null;

	return (
		<div className="mt-1 flex flex-col items-start gap-2">
			<div className="inline-flex items-center gap-2 align-top">
				<div
					onClick={openFileDialog}
					className="cursor-pointer hover:opacity-90 relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input"
				>
					{previewUrl ? (
						<img
							className="size-full object-cover"
							src={previewUrl}
							alt="Preview of uploaded"
							width={32}
							height={32}
						/>
					) : (
						<div aria-hidden="true">
							<RiUser2Line className="opacity-60" size={16} />
						</div>
					)}
				</div>
				<input
					{...getInputProps()}
					className="sr-only"
					aria-label="Upload image file"
					tabIndex={-1}
				/>
			</div>
			{fileName && (
				<div className="inline-flex gap-2 text-xs">
					<p className="truncate text-muted-foreground" aria-live="polite">
						{fileName}
					</p>{' '}
					<button
						type="button"
						onClick={() => removeFile(files[0]?.id)}
						className="cursor-pointer font-medium hover:underline"
						aria-label={`Remove ${fileName}`}
					>
						Eliminar
					</button>
				</div>
			)}
		</div>
	);
}
