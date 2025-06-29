import type { Config } from 'jest';

const config: Config = {
	// Use projects for workspace configuration
	projects: [
		'<rootDir>/apps/transcripter/jest.config.ts',
		'<rootDir>/packages/ai/jest.config.ts',
		'<rootDir>/packages/database/jest.config.ts',
	],
	verbose: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
	testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
	setupFilesAfterEnv: [],
};

export default config;
