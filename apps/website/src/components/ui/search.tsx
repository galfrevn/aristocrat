'use client';

import { useEffect, useId, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
	RiArrowRightLongLine,
	RiLoader2Line,
	RiSearchLine,
} from '@remixicon/react';
import { cn } from '@/lib/utils';

export function SearchInput({
	className,
	type,
	label,
	...props
}: React.ComponentProps<'input'> & {
	label?: string;
}) {
	const id = useId();
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (inputValue) {
			setIsLoading(true);
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 500);
			return () => clearTimeout(timer);
		}
		setIsLoading(false);
	}, [inputValue]);

	return (
		<div className={cn("*:not-first:mt-2", className)}>
			{label && <Label htmlFor={id}>{label}</Label>}
			<div className="relative">
				<Input
					id={id}
					className="peer ps-9 pe-9"
					type={type || 'search'}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					{...props}
				/>
				<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
					{isLoading ? (
						<RiLoader2Line
							className="animate-spin"
							size={16}
							role="status"
							aria-label="Loading..."
						/>
					) : (
						<RiSearchLine size={16} aria-hidden="true" />
					)}
				</div>
				{/* <button
					className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Press to speak"
					type="submit"
				>
					<RiArrowRightLongLine size={16} aria-hidden="true" />
				</button> */}
			</div>
		</div>
	);
}
