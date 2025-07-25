import React, { type ReactElement } from 'react';

export const AristocratCommunityGrid = ({
	children,
}: {
	children: ReactElement[];
}) => {
	const childrenArray = React.Children.toArray(children);

	return (
		<div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 xl:grid-cols-10">
			<section className="sticky col-span-1 h-full rounded-[0.625rem] border bg-card p-6 md:col-span-5">
				{childrenArray[0]}
			</section>

			<section className="sticky top-4 col-span-3 h-fit rounded-[0.625rem] border bg-card p-6">
				{childrenArray[1]}
			</section>

			<section className="sticky top-4 col-span-2 max-h-[84vh] rounded-[0.625rem] border bg-card p-6">
				{childrenArray[2]}
			</section>
		</div>
	);
};
