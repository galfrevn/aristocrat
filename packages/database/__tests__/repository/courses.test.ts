import type { AristocratDatabase } from '@/index';
import { CoursesRepository } from '@/repository/courses';
import type { Course, InserCourse } from '@/schema/courses';

// Mock the database and query methods
const mockDatabase = {
	query: {
		courses: {
			findFirst: jest.fn(),
		},
	},
	insert: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
} as unknown as AristocratDatabase;

// Mock return methods for chaining
const mockReturning = jest.fn();
const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });
const mockSet = jest
	.fn()
	.mockReturnValue({
		where: jest.fn().mockReturnValue({ returning: mockReturning }),
	});
const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });

// Setup mock implementations
(mockDatabase.insert as jest.Mock).mockReturnValue({ values: mockValues });
(mockDatabase.update as jest.Mock).mockReturnValue({ set: mockSet });
(mockDatabase.delete as jest.Mock).mockReturnValue({ where: mockWhere });

describe('CoursesRepository', () => {
	let repository: CoursesRepository;

	const mockCourse: Course = {
		id: 'course-123',
		title: 'Test Course',
		description: 'A test course',
		thumbnail: 'https://example.com/thumb.jpg',
		youtubeVideoId: 'dQw4w9WgXcQ',
		generationProcessId: 'process-456',
		userId: 'user-789',
		estimatedDuration: 3600,
		difficulty: 'medium',
		language: 'en',
		category: 'programming',
		tags: ['javascript', 'testing'],
	};

	const mockInsertCourse: InserCourse = {
		title: 'New Test Course',
		description: 'A new test course',
		thumbnail: 'https://example.com/new-thumb.jpg',
		youtubeVideoId: 'newVideoId123',
		generationProcessId: 'process-new-456',
		userId: 'user-new-789',
		estimatedDuration: 7200,
		difficulty: 'hard',
		language: 'es',
		category: 'data-science',
		tags: ['python', 'machine-learning'],
	};

	beforeEach(() => {
		repository = new CoursesRepository(mockDatabase);
		jest.clearAllMocks();
	});

	describe('constructor', () => {
		test('should initialize with database instance', () => {
			expect(repository).toBeInstanceOf(CoursesRepository);
			expect(repository['database']).toBe(mockDatabase);
		});

		test('should assign database property correctly', () => {
			const newMockDatabase = {} as AristocratDatabase;
			const newRepository = new CoursesRepository(newMockDatabase);
			expect(newRepository['database']).toBe(newMockDatabase);
		});
	});

	describe('get', () => {
		test('should find course by id successfully', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				mockCourse,
			);

			const result = await repository.get('course-123');

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toEqual(mockCourse);
		});

		test('should return undefined if course not found', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				undefined,
			);

			const result = await repository.get('non-existent-id');

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toBeUndefined();
		});

		test('should handle empty string ID', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				undefined,
			);

			const result = await repository.get('');

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toBeUndefined();
		});

		test('should handle database errors', async () => {
			const dbError = new Error('Database connection failed');
			(mockDatabase.query.courses.findFirst as jest.Mock).mockRejectedValue(
				dbError,
			);

			await expect(repository.get('course-123')).rejects.toThrow(
				'Database connection failed',
			);
		});
	});

	describe('getByYoutubeVideoId', () => {
		test('should find course by YouTube video ID', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				mockCourse,
			);

			const result = await repository.getByYoutubeVideoId('dQw4w9WgXcQ');

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toEqual(mockCourse);
		});

		test('should return undefined for non-existent video ID', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				undefined,
			);

			const result = await repository.getByYoutubeVideoId('invalidVideoId');

			expect(result).toBeUndefined();
		});

		test('should handle malformed video IDs', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				undefined,
			);

			const result = await repository.getByYoutubeVideoId('invalid@video#id');

			expect(result).toBeUndefined();
		});
	});

	describe('getByGenerationProcessId', () => {
		test('should find course by generation process ID', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				mockCourse,
			);

			const result = await repository.getByGenerationProcessId('process-456');

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toEqual(mockCourse);
		});

		test('should return undefined for non-existent process ID', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				undefined,
			);

			const result =
				await repository.getByGenerationProcessId('invalid-process-id');

			expect(result).toBeUndefined();
		});

		test('should handle UUID format process IDs', async () => {
			const uuidProcessId = '550e8400-e29b-41d4-a716-446655440000';
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				mockCourse,
			);

			const result = await repository.getByGenerationProcessId(uuidProcessId);

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toEqual(mockCourse);
		});
	});

	describe('getByUserId', () => {
		test('should find course by user ID', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				mockCourse,
			);

			const result = await repository.getByUserId('user-789');

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toEqual(mockCourse);
		});

		test('should return undefined for user with no courses', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				undefined,
			);

			const result = await repository.getByUserId('user-without-courses');

			expect(result).toBeUndefined();
		});

		test('should handle numeric user IDs as strings', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				mockCourse,
			);

			const result = await repository.getByUserId('12345');

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toEqual(mockCourse);
		});
	});

	describe('insert', () => {
		test('should insert new course successfully', async () => {
			const insertedCourse = { ...mockInsertCourse, id: 'new-course-id' };
			mockReturning.mockResolvedValue([insertedCourse]);

			const result = await repository.insert(mockInsertCourse);

			expect(mockDatabase.insert).toHaveBeenCalled();
			expect(mockValues).toHaveBeenCalledWith(mockInsertCourse);
			expect(mockReturning).toHaveBeenCalled();
			expect(result).toEqual(insertedCourse);
		});

		test('should handle insert with minimal required fields', async () => {
			const minimalCourse: InserCourse = {
				title: 'Minimal Course',
				thumbnail: 'https://example.com/minimal.jpg',
				youtubeVideoId: 'minimalVideo',
				generationProcessId: 'minimal-process',
				userId: 'minimal-user',
				difficulty: 'easy',
				language: 'en',
				estimatedDuration: 1800,
				tags: [],
			};
			const insertedMinimalCourse = { ...minimalCourse, id: 'minimal-id' };
			mockReturning.mockResolvedValue([insertedMinimalCourse]);

			const result = await repository.insert(minimalCourse);

			expect(mockValues).toHaveBeenCalledWith(minimalCourse);
			expect(result).toEqual(insertedMinimalCourse);
		});

		test('should handle insert with all optional fields', async () => {
			const fullCourse: InserCourse = {
				...mockInsertCourse,
				description: 'Full description',
				category: 'advanced-programming',
			};
			const insertedFullCourse = { ...fullCourse, id: 'full-course-id' };
			mockReturning.mockResolvedValue([insertedFullCourse]);

			const result = await repository.insert(fullCourse);

			expect(mockValues).toHaveBeenCalledWith(fullCourse);
			expect(result).toEqual(insertedFullCourse);
		});

		test('should handle database insert errors', async () => {
			const insertError = new Error('Unique constraint violation');
			mockReturning.mockRejectedValue(insertError);

			await expect(repository.insert(mockInsertCourse)).rejects.toThrow(
				'Unique constraint violation',
			);
		});
	});

	describe('update', () => {
		test('should update course successfully', async () => {
			const updateData = {
				title: 'Updated Course Title',
				description: 'Updated description',
			};
			const updatedCourse = { ...mockCourse, ...updateData };
			mockReturning.mockResolvedValue([updatedCourse]);

			const result = await repository.update('course-123', updateData);

			expect(mockDatabase.update).toHaveBeenCalled();
			expect(mockSet).toHaveBeenCalledWith(updateData);
			expect(mockReturning).toHaveBeenCalled();
			expect(result).toEqual(updatedCourse);
		});

		test('should update single field', async () => {
			const updateData = { title: 'New Title Only' };
			const updatedCourse = { ...mockCourse, title: 'New Title Only' };
			mockReturning.mockResolvedValue([updatedCourse]);

			const result = await repository.update('course-123', updateData);

			expect(mockSet).toHaveBeenCalledWith(updateData);
			expect(result).toEqual(updatedCourse);
		});

		test('should update complex fields like tags and difficulty', async () => {
			const updateData = {
				tags: ['updated', 'tags', 'list'],
				difficulty: 'hard' as const,
				estimatedDuration: 9000,
			};
			const updatedCourse = { ...mockCourse, ...updateData };
			mockReturning.mockResolvedValue([updatedCourse]);

			const result = await repository.update('course-123', updateData);

			expect(mockSet).toHaveBeenCalledWith(updateData);
			expect(result).toEqual(updatedCourse);
		});

		test('should handle empty update data', async () => {
			const updateData = {};
			const updatedCourse = { ...mockCourse };
			mockReturning.mockResolvedValue([updatedCourse]);

			const result = await repository.update('course-123', updateData);

			expect(mockSet).toHaveBeenCalledWith(updateData);
			expect(result).toEqual(updatedCourse);
		});

		test('should handle update errors', async () => {
			const updateError = new Error('Course not found for update');
			mockReturning.mockRejectedValue(updateError);

			await expect(
				repository.update('non-existent', { title: 'New Title' }),
			).rejects.toThrow('Course not found for update');
		});
	});

	describe('delete', () => {
		test('should delete course successfully', async () => {
			mockReturning.mockResolvedValue([mockCourse]);

			const result = await repository.delete('course-123');

			expect(mockDatabase.delete).toHaveBeenCalled();
			expect(mockWhere).toHaveBeenCalled();
			expect(mockReturning).toHaveBeenCalled();
			expect(result).toEqual(mockCourse);
		});

		test('should handle deletion of non-existent course', async () => {
			mockReturning.mockResolvedValue([]);

			const result = await repository.delete('non-existent-course');

			expect(mockDatabase.delete).toHaveBeenCalled();
			expect(mockWhere).toHaveBeenCalled();
			expect(result).toBeUndefined();
		});

		test('should handle database deletion errors', async () => {
			const deleteError = new Error('Foreign key constraint violation');
			mockReturning.mockRejectedValue(deleteError);

			await expect(repository.delete('course-123')).rejects.toThrow(
				'Foreign key constraint violation',
			);
		});

		test('should handle empty course ID', async () => {
			mockReturning.mockResolvedValue([]);

			const result = await repository.delete('');

			expect(mockDatabase.delete).toHaveBeenCalled();
			expect(result).toBeUndefined();
		});
	});

	describe('exists', () => {
		test('should return course if exists', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				mockCourse,
			);

			const result = await repository.exists('course-123');

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toEqual(mockCourse);
		});

		test('should return undefined if course does not exist', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				undefined,
			);

			const result = await repository.exists('non-existent-course');

			expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
				where: expect.any(Function),
			});
			expect(result).toBeUndefined();
		});

		test('should handle database errors in exists check', async () => {
			const existsError = new Error('Database timeout');
			(mockDatabase.query.courses.findFirst as jest.Mock).mockRejectedValue(
				existsError,
			);

			await expect(repository.exists('course-123')).rejects.toThrow(
				'Database timeout',
			);
		});

		test('should check existence with various ID formats', async () => {
			const testIds = [
				'uuid-123',
				'12345',
				'course_with_underscores',
				'course-with-dashes',
			];

			for (const testId of testIds) {
				(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
					mockCourse,
				);

				const result = await repository.exists(testId);

				expect(mockDatabase.query.courses.findFirst).toHaveBeenCalledWith({
					where: expect.any(Function),
				});
				expect(result).toEqual(mockCourse);
			}
		});
	});

	describe('error handling and edge cases', () => {
		test('should handle database connection failures gracefully', async () => {
			const connectionError = new Error('Connection refused');
			(mockDatabase.query.courses.findFirst as jest.Mock).mockRejectedValue(
				connectionError,
			);

			await expect(repository.get('course-123')).rejects.toThrow(
				'Connection refused',
			);
			await expect(repository.exists('course-123')).rejects.toThrow(
				'Connection refused',
			);
		});

		test('should handle null/undefined return values', async () => {
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				null,
			);

			const result = await repository.get('course-123');
			expect(result).toBeNull();
		});

		test('should handle malformed course data from database', async () => {
			const malformedCourse = { id: 'course-123' }; // Missing required fields
			(mockDatabase.query.courses.findFirst as jest.Mock).mockResolvedValue(
				malformedCourse,
			);

			const result = await repository.get('course-123');
			expect(result).toEqual(malformedCourse);
		});
	});
});
