import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['<rootDir>/__tests__/**/*.test.{js,ts}'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	collectCoverageFrom: [
		'src/**/*.{ts,js}',
		'!src/**/*.d.ts',
		'!src/**/*.test.{ts,js}',
	],
	coverageDirectory: 'coverage',
	setupFilesAfterEnv: [],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: {
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					moduleResolution: 'node',
					baseUrl: '.',
					paths: {
						'@/*': ['./src/*'],
					},
					types: ['jest', 'node'],
				},
			},
		],
	},
};

export default config;
