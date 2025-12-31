import type { Field, FieldType, JSONSchema } from './types.js';

let counter = 0;

export function generateId(): string {
	return `field_${Date.now()}_${counter++}`;
}

export function labelToKey(label: string): string {
	return label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_|_$/g, '');
}

export function createField(type: FieldType, label = ''): Field {
	const defaultLabels: Record<FieldType, string> = {
		text: 'Text Field',
		longtext: 'Long Text',
		number: 'Number',
		boolean: 'Yes/No',
		email: 'Email',
		date: 'Date',
		url: 'URL',
		choice: 'Choice',
		multichoice: 'Multiple Choice',
		group: 'Group',
		list: 'List'
	};

	const fieldLabel = label || defaultLabels[type];

	return {
		id: generateId(),
		type,
		label: fieldLabel,
		key: labelToKey(fieldLabel),
		required: false,
		...(type === 'choice' || type === 'multichoice' ? { options: ['Option 1', 'Option 2'] } : {}),
		...(type === 'group' || type === 'list' ? { children: [] } : {})
	};
}

export function fieldToSchema(field: Field): JSONSchema {
	const base: JSONSchema = {};

	if (field.description) {
		base.description = field.description;
	}

	switch (field.type) {
		case 'text':
		case 'longtext':
			return {
				...base,
				type: 'string',
				...(field.minLength !== undefined && { minLength: field.minLength }),
				...(field.maxLength !== undefined && { maxLength: field.maxLength })
			};

		case 'number':
			return {
				...base,
				type: 'number',
				...(field.min !== undefined && { minimum: field.min }),
				...(field.max !== undefined && { maximum: field.max })
			};

		case 'boolean':
			return { ...base, type: 'boolean' };

		case 'email':
			return { ...base, type: 'string', format: 'email' };

		case 'date':
			return { ...base, type: 'string', format: 'date' };

		case 'url':
			return { ...base, type: 'string', format: 'uri' };

		case 'choice':
			return { ...base, type: 'string', enum: field.options || [] };

		case 'multichoice':
			return {
				...base,
				type: 'array',
				items: { type: 'string', enum: field.options || [] },
				uniqueItems: true
			};

		case 'group':
			return fieldsToSchema(field.children || []);

		case 'list':
			return {
				...base,
				type: 'array',
				items: fieldsToSchema(field.children || [])
			};
	}
}

export function fieldsToSchema(fields: Field[]): JSONSchema {
	if (fields.length === 0) {
		return { type: 'object', properties: {} };
	}

	const properties: Record<string, JSONSchema> = {};
	const required: string[] = [];

	for (const field of fields) {
		properties[field.key] = fieldToSchema(field);
		if (field.required) {
			required.push(field.key);
		}
	}

	return {
		type: 'object',
		properties,
		...(required.length > 0 && { required })
	};
}

export function schemaToFields(schema: JSONSchema): Field[] {
	if (schema.type !== 'object' || !schema.properties) {
		return [];
	}

	const requiredKeys = new Set(schema.required || []);
	const fields: Field[] = [];

	for (const [key, prop] of Object.entries(schema.properties)) {
		if (typeof prop === 'boolean') continue;
		const field = propertyToField(key, prop, requiredKeys.has(key));
		if (field) fields.push(field);
	}

	return fields;
}

function propertyToField(key: string, prop: JSONSchema, required: boolean): Field | null {
	const base = {
		id: generateId(),
		key,
		label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
		required,
		description: prop.description
	};

	if (prop.type === 'string') {
		if (prop.format === 'email') {
			return { ...base, type: 'email' };
		}
		if (prop.format === 'date') {
			return { ...base, type: 'date' };
		}
		if (prop.format === 'uri') {
			return { ...base, type: 'url' };
		}
		if (prop.enum) {
			return { ...base, type: 'choice', options: prop.enum as string[] };
		}
		return {
			...base,
			type: 'text',
			minLength: prop.minLength,
			maxLength: prop.maxLength
		};
	}

	if (prop.type === 'number' || prop.type === 'integer') {
		return {
			...base,
			type: 'number',
			min: prop.minimum,
			max: prop.maximum
		};
	}

	if (prop.type === 'boolean') {
		return { ...base, type: 'boolean' };
	}

	if (prop.type === 'array') {
		const items = prop.items;
		if (items && typeof items !== 'boolean' && !Array.isArray(items)) {
			if (items.type === 'string' && items.enum) {
				return { ...base, type: 'multichoice', options: items.enum as string[] };
			}
			if (items.type === 'object') {
				return { ...base, type: 'list', children: schemaToFields(items) };
			}
		}
	}

	if (prop.type === 'object') {
		return { ...base, type: 'group', children: schemaToFields(prop) };
	}

	return null;
}
