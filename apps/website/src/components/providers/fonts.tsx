import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { memo } from 'react';
import type { Layout } from '@/types/layout';

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
			{children}
		</body>
	);
});
