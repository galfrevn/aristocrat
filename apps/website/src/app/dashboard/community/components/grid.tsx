import React, { type ReactElement } from 'react';

export const AristocratCommunityGrid = ({
	children,
}: {
	children: ReactElement[];
}) => {
	const childrenArray = React.Children.toArray(children);

	return (
		<div className="grid w-full grid-cols-1 gap-6 pb-8 md:w-auto lg:grid-cols-2 xl:grid-cols-10">
			<section
				className="col-span-1 h-full w-full rounded-[0.625rem] border bg-card p-6 md:col-span-5"
				aria-label="Contenido principal"
			>
				{childrenArray[0]}
			</section>
			<aside
				className="relative top-4 col-span-3 h-fit w-full rounded-[0.625rem] border bg-card p-6 md:w-full xl:sticky"
				aria-label="Panel lateral de estadísticas"
			>
				{childrenArray[1]}
			</aside>
			<aside
				className="relative top-4 col-span-2 h-fit w-full rounded-[0.625rem] border bg-card p-6 md:w-full xl:sticky"
				aria-label="Panel lateral de reglas"
			>
				{childrenArray[2]}
			</aside>
		</div>
	);
};
