/**
 * Mock implementation of Bun shell for Jest tests
 */

import { jest } from '@jest/globals';

export const $ = jest
	.fn()
	.mockImplementation(
		(template: TemplateStringsArray, ...values: unknown[]) => {
			const _command = template
				.map((str, i) => str + (values[i] || ''))
				.join('');

			return {
				exitCode: 0,
				stderr: {
					text: jest.fn().mockResolvedValue(''),
				},
				nothrow: jest.fn().mockReturnThis(),
				text: jest.fn().mockResolvedValue('mock-file1.vtt\nmock-file2.srt'),
			};
		},
	);
