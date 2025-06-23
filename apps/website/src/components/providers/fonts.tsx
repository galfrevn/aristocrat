import { memo } from 'react';

import type { Layout } from '@/types/layout';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';

interface FontsProviderProps extends Layout {
	fonts: {
		mono: NextFontWithVariable;
		sans: NextFontWithVariable;
		serif: NextFontWithVariable;
	};
}

export const FontsProvider = memo((props: FontsProviderProps) => {
	const { children, fonts } = props;
	const { mono, sans, serif } = fonts;

	return (
		<body
			className={`${mono.variable} ${sans.variable} ${serif.variable} antialiased`}
		>
			<div className="font-sans">{children}</div>
		</body>
	);
});
