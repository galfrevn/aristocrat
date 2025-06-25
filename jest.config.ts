import type { Config } from 'jest';

const config: Config = {
	// Use projects for workspace configuration
	projects: [
		'<rootDir>/packages/ai/jest.config.ts',
		// Future packages can be added here
		// {
		//   displayName: '@aristocrat/server',
		//   testMatch: ['<rootDir>/apps/server/__tests__/**/*.test.{js,ts}'],
		//   ...
		// },
	],
	// Global Jest configuration
	collectCoverage: false,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	verbose: true,
	// Ignore node_modules and build artifacts
	testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
	// Setup files that run before each test
	setupFilesAfterEnv: [],
};

export default config;
