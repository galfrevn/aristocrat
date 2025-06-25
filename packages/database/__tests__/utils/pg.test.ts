import {
	index as drizzleIndex,
	integer as drizzleInteger,
	text as drizzleText,
	uuid as drizzleUuid,
	PgTable,
	pgEnum,
	pgTable,
} from 'drizzle-orm/pg-core';
import { index, integer, oneof, Table, table, text, uuid } from '@/utils/pg';

describe('PostgreSQL Utils', () => {
	test('should export index function from drizzle', () => {
		expect(index).toBe(drizzleIndex);
	});

	test('should export integer function from drizzle', () => {
		expect(integer).toBe(drizzleInteger);
	});

	test('should export PgTable as Table alias', () => {
		expect(Table).toBe(PgTable);
	});

	test('should export pgEnum as oneof alias', () => {
		expect(oneof).toBe(pgEnum);
	});

	test('should export pgTable as table alias', () => {
		expect(table).toBe(pgTable);
	});

	test('should export text function from drizzle', () => {
		expect(text).toBe(drizzleText);
	});

	test('should export uuid function from drizzle', () => {
		expect(uuid).toBe(drizzleUuid);
	});

	test('should be able to create a table using aliases', () => {
		const testTable = table('test_table', {
			id: uuid('id').primaryKey(),
			name: text('name').notNull(),
			count: integer('count').default(0),
		});

		expect(testTable).toBeDefined();
		expect(typeof testTable).toBe('object');
		expect(testTable.id).toBeDefined();
		expect(testTable.id.name).toBe('id');
		expect(testTable.name).toBeDefined();
		expect(testTable.name.name).toBe('name');
		expect(testTable.count).toBeDefined();
		expect(testTable.count.name).toBe('count');
	});

	test('should be able to create enum using oneof alias', () => {
		const testEnum = oneof('test_status', ['pending', 'active', 'inactive']);

		expect(testEnum.enumName).toBe('test_status');
		expect(testEnum.enumValues).toEqual(['pending', 'active', 'inactive']);
	});
});
