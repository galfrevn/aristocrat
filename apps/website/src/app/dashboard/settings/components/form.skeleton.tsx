import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export function SettingsProfileFormSkeleton() {
	return (
		<>
			<CardContent className="grid grid-cols-2 gap-x-6 gap-y-2 space-y-4">
				<div className="col-span-2">
					<div className="space-y-3">
						<Label>Avatar</Label>
						<Skeleton className="mt-1 size-20 rounded-lg" />
					</div>
				</div>

				<div>
					<div className="space-y-3">
						<Label>Email</Label>
						<Skeleton className="mt-1 h-9 w-full" />
					</div>
				</div>

				<div>
					<div className="space-y-3">
						<Label>Nombre completo</Label>
						<Skeleton className="mt-1 h-9 w-full" />
					</div>
				</div>
			</CardContent>

			<CardFooter className="-mt-2 justify-end border-t pt-4!">
				<Button type="submit" className="text-sm" disabled>
					Guardar cambios
				</Button>
			</CardFooter>
		</>
	);
}
