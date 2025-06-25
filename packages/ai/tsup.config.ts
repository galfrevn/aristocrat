import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	dts: false, // Disable DTS generation to avoid provider type issues
	splitting: false,
	sourcemap: true,
	clean: true,
	treeshake: true,
	minify: false,
	external: ['react', 'react-dom'],
	esbuildOptions: (options) => {
		options.alias = {
			'@': './src',
		};
	},
});
