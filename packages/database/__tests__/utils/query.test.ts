import { eq } from 'drizzle-orm';
import { equals } from '@/utils/query';

describe('Query Utils', () => {
	describe('equals function', () => {
		test('should be an alias for drizzle eq function', () => {
			expect(equals).toBe(eq);
		});

		test('should work as expected with mock columns', () => {
			// Mock column objects for testing
			const mockColumn = { name: 'test_column' };
			const value = 'test_value';

			// Since equals is just an alias for eq, we test that it's the same function
			const equalsResult = equals(mockColumn as any, value);
			const eqResult = eq(mockColumn as any, value);

			// Both should produce the same result structure
			expect(typeof equalsResult).toBe(typeof eqResult);
			expect(equalsResult).toEqual(eqResult);
		});
	});
});
