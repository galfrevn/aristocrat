import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		schema: 'src/schema/index.ts',
		repository: 'src/repository/index.ts',
		utils: 'src/utils/index.ts',
	},
	format: ['cjs', 'esm'],
	dts: false,
	splitting: false,
	sourcemap: true,
	clean: true,
	treeshake: true,
	minify: false,
	esbuildOptions: (options) => {
		options.alias = {
			'@': './src',
		};
	},
});
