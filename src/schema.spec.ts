import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import {
	fieldsToSchema,
	schemaToFields,
	createField,
	labelToKey,
	type Field,
	type JSONSchema
} from '$lib';

const ajv = new Ajv({ strict: true });

// Helper to create a minimal field for testing
const makeField = (overrides: Partial<Field>): Field =>
({
	id: crypto.randomUUID(),
	type: 'text',
	key: 'test',
	label: 'Test',
	required: false,
	...overrides
});

describe('labelToKey', () => {
	it.each([
		['Full Name', 'full_name'],
		['Email Address', 'email_address'],
		['ABC 123', 'abc_123'],
		['  Spaces  ', 'spaces'],
		['Special!@#$%Chars', 'special_chars'],
		['UPPERCASE', 'uppercase'],
		['', '']
	])('converts "%s" to "%s"', (input, expected) => {
		expect(labelToKey(input)).toBe(expected);
	});
});

describe('createField', () => {
	it('creates text field with defaults', () => {
		const field = createField('text');
		expect(field.type).toBe('text');
		expect(field.id).toBeDefined();
		expect(field.required).toBe(false);
	});

	it('uses custom label and derives key', () => {
		const field = createField('text', 'Full Name');
		expect(field.label).toBe('Full Name');
		expect(field.key).toBe('full_name');
	});

	it('creates choice field with options', () => {
		const field = createField('choice');
		expect(field.options).toBeDefined();
		expect(Array.isArray(field.options)).toBe(true);
	});

	it('creates group with children array', () => {
		const field = createField('group');
		expect(field.children).toEqual([]);
	});

	it('creates list with children array', () => {
		const field = createField('list');
		expect(field.children).toEqual([]);
	});

	it('generates unique IDs', () => {
		const a = createField('text');
		const b = createField('text');
		expect(a.id).not.toBe(b.id);
	});
});

describe('fieldsToSchema', () => {
	it('returns empty object schema for empty array', () => {
		const schema = fieldsToSchema([]);
		expect(schema).toEqual({ type: 'object', properties: {} });
	});

	it('produces valid JSON Schema', () => {
		const fields = [makeField({ key: 'name', type: 'text' })];
		const schema = fieldsToSchema(fields);
		expect(ajv.validateSchema(schema)).toBe(true);
	});

	it('converts text field to string', () => {
		const schema = fieldsToSchema([makeField({ key: 'name', type: 'text' })]);
		expect(schema.properties?.name).toEqual({ type: 'string' });
	});

	it('adds required array for required fields', () => {
		const schema = fieldsToSchema([makeField({ key: 'email', type: 'text', required: true })]);
		expect(schema.required).toContain('email');
	});

	it('converts number with constraints', () => {
		const schema = fieldsToSchema([makeField({ key: 'age', type: 'number', min: 0, max: 100 })]);
		expect(schema.properties?.age).toMatchObject({
			type: 'number',
			minimum: 0,
			maximum: 100
		});
	});

	it('converts text with length constraints', () => {
		const schema = fieldsToSchema([
			makeField({ key: 'bio', type: 'text', minLength: 1, maxLength: 50 })
		]);
		expect(schema.properties?.bio).toMatchObject({
			type: 'string',
			minLength: 1,
			maxLength: 50
		});
	});

	it.each([
		['email', 'email'],
		['date', 'date'],
		['url', 'uri']
	] as const)('converts %s to format %s', (fieldType, format) => {
		const schema = fieldsToSchema([makeField({ key: 'field', type: fieldType })]);
		expect(schema.properties?.field).toMatchObject({ type: 'string', format });
	});

	it('converts boolean', () => {
		const schema = fieldsToSchema([makeField({ key: 'active', type: 'boolean' })]);
		expect(schema.properties?.active).toEqual({ type: 'boolean' });
	});

	it('converts choice to enum', () => {
		const schema = fieldsToSchema([makeField({ key: 'color', type: 'choice', options: ['A', 'B'] })]);
		expect(schema.properties?.color).toEqual({ type: 'string', enum: ['A', 'B'] });
	});

	it('converts multichoice to array with unique items', () => {
		const schema = fieldsToSchema([
			makeField({ key: 'tags', type: 'multichoice', options: ['X', 'Y'] })
		]);
		expect(schema.properties?.tags).toEqual({
			type: 'array',
			items: { type: 'string', enum: ['X', 'Y'] },
			uniqueItems: true
		});
	});

	it('converts group to nested object', () => {
		const schema = fieldsToSchema([
			makeField({
				key: 'address',
				type: 'group',
				children: [makeField({ key: 'city', type: 'text' })]
			})
		]);
		expect(schema.properties?.address).toMatchObject({
			type: 'object',
			properties: { city: { type: 'string' } }
		});
	});

	it('converts list to array of objects', () => {
		const schema = fieldsToSchema([
			makeField({
				key: 'items',
				type: 'list',
				children: [makeField({ key: 'name', type: 'text' })]
			})
		]);
		expect(schema.properties?.items).toMatchObject({
			type: 'array',
			items: { type: 'object', properties: { name: { type: 'string' } } }
		});
	});

	it('includes description when present', () => {
		const schema = fieldsToSchema([makeField({ key: 'name', type: 'text', description: 'Help' })]);
		expect(schema.properties?.name).toMatchObject({ description: 'Help' });
	});
});

describe('schemaToFields', () => {
	it('returns empty array for empty schema', () => {
		const fields = schemaToFields({ type: 'object', properties: {} });
		expect(fields).toEqual([]);
	});

	it('converts string to text field', () => {
		const fields = schemaToFields({ type: 'object', properties: { name: { type: 'string' } } });
		expect(fields[0].type).toBe('text');
		expect(fields[0].key).toBe('name');
	});

	it('marks required fields', () => {
		const fields = schemaToFields({
			type: 'object',
			properties: { email: { type: 'string' } },
			required: ['email']
		});
		expect(fields[0].required).toBe(true);
	});

	it.each([
		['email', 'email'],
		['date', 'date'],
		['uri', 'url']
	] as const)('converts format %s to type %s', (format, fieldType) => {
		const fields = schemaToFields({
			type: 'object',
			properties: { field: { type: 'string', format } }
		});
		expect(fields[0].type).toBe(fieldType);
	});

	it('converts enum to choice', () => {
		const fields = schemaToFields({
			type: 'object',
			properties: { color: { type: 'string', enum: ['A', 'B'] } }
		});
		expect(fields[0].type).toBe('choice');
		expect(fields[0].options).toEqual(['A', 'B']);
	});

	it('converts number with bounds', () => {
		const fields = schemaToFields({
			type: 'object',
			properties: { age: { type: 'number', minimum: 5, maximum: 10 } }
		});
		expect(fields[0]).toMatchObject({ type: 'number', min: 5, max: 10 });
	});

	it('converts boolean', () => {
		const fields = schemaToFields({
			type: 'object',
			properties: { active: { type: 'boolean' } }
		});
		expect(fields[0].type).toBe('boolean');
	});

	it('converts array with enum to multichoice', () => {
		const fields = schemaToFields({
			type: 'object',
			properties: { tags: { type: 'array', items: { type: 'string', enum: ['X', 'Y'] } } }
		});
		expect(fields[0].type).toBe('multichoice');
	});

	it('converts array of objects to list', () => {
		const fields = schemaToFields({
			type: 'object',
			properties: { items: { type: 'array', items: { type: 'object', properties: {} } } }
		});
		expect(fields[0].type).toBe('list');
	});

	it('converts nested object to group', () => {
		const fields = schemaToFields({
			type: 'object',
			properties: { address: { type: 'object', properties: {} } }
		});
		expect(fields[0].type).toBe('group');
	});

	it('derives label from key', () => {
		const fields = schemaToFields({
			type: 'object',
			properties: { first_name: { type: 'string' } }
		});
		expect(fields[0].label).toBe('First Name');
	});

	it('preserves description', () => {
		const fields = schemaToFields({
			type: 'object',
			properties: { name: { type: 'string', description: 'Help text' } }
		});
		expect(fields[0].description).toBe('Help text');
	});
});

describe('round-trip', () => {
	it('fields → schema → fields preserves structure', () => {
		const original = [
			makeField({ key: 'name', type: 'text', required: true, description: 'Name' }),
			makeField({ key: 'age', type: 'number', min: 0, max: 120 }),
			makeField({ key: 'role', type: 'choice', options: ['admin', 'user'] })
		];
		const schema = fieldsToSchema(original);
		const restored = schemaToFields(schema);

		expect(restored).toHaveLength(original.length);
		for (let i = 0; i < original.length; i++) {
			expect(restored[i].key).toBe(original[i].key);
			expect(restored[i].type).toBe(original[i].type);
			expect(restored[i].required).toBe(original[i].required);
		}
	});

	it('schema → fields → schema produces equivalent output', () => {
		const original: JSONSchema = {
			type: 'object',
			properties: {
				name: { type: 'string', description: 'Full name' },
				email: { type: 'string', format: 'email' },
				active: { type: 'boolean' }
			},
			required: ['name', 'email']
		};
		const fields = schemaToFields(original);
		const restored = fieldsToSchema(fields);

		expect(restored.properties).toMatchObject(original.properties!);
		expect(restored.required?.sort()).toEqual(original.required?.sort());
	});
});

describe('JSON Schema validity', () => {
	it('complex schema validates with AJV', () => {
		const fields = [
			makeField({ key: 'name', type: 'text', required: true, minLength: 1 }),
			makeField({ key: 'email', type: 'email', required: true }),
			makeField({ key: 'age', type: 'number', min: 0, max: 150 }),
			makeField({
				key: 'address',
				type: 'group',
				children: [
					makeField({ key: 'city', type: 'text' }),
					makeField({ key: 'country', type: 'choice', options: ['US', 'UK', 'CA'] })
				]
			}),
			makeField({
				key: 'skills',
				type: 'list',
				children: [makeField({ key: 'name', type: 'text' })]
			})
		];
		const schema = fieldsToSchema(fields);

		expect(ajv.validateSchema(schema)).toBe(true);
	});
});