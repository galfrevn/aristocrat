import { CoursesRepository } from '@/repository';

describe('Repository Index', () => {
	test('should export CoursesRepository', () => {
		expect(CoursesRepository).toBeDefined();
		expect(typeof CoursesRepository).toBe('function');
	});

	test('should be able to instantiate CoursesRepository', () => {
		const mockDatabase = {} as any;
		const repository = new CoursesRepository(mockDatabase);
		expect(repository).toBeInstanceOf(CoursesRepository);
	});
});
