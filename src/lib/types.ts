import type { JSONSchema7 } from 'json-schema';

export type FieldType =
	| 'text'
	| 'longtext'
	| 'number'
	| 'boolean'
	| 'email'
	| 'date'
	| 'url'
	| 'choice'
	| 'multichoice'
	| 'group'
	| 'list';

export interface Field {
	id: string;
	type: FieldType;
	label: string;
	key: string;
	required: boolean;
	description?: string;
	// Type-specific
	options?: string[]; // For choice/multichoice
	children?: Field[]; // For group/list
	min?: number; // For number
	max?: number;
	minLength?: number; // For text
	maxLength?: number;
}

export interface FieldTypeInfo {
	type: FieldType;
	label: string;
	icon: string;
	category: 'basic' | 'selection' | 'structure';
}

export const FIELD_TYPES: FieldTypeInfo[] = [
	{ type: 'text', label: 'Text', icon: 'Type', category: 'basic' },
	{ type: 'longtext', label: 'Long Text', icon: 'AlignLeft', category: 'basic' },
	{ type: 'number', label: 'Number', icon: 'Hash', category: 'basic' },
	{ type: 'boolean', label: 'Yes/No', icon: 'ToggleLeft', category: 'basic' },
	{ type: 'email', label: 'Email', icon: 'Mail', category: 'basic' },
	{ type: 'date', label: 'Date', icon: 'Calendar', category: 'basic' },
	{ type: 'url', label: 'URL', icon: 'Link', category: 'basic' },
	{ type: 'choice', label: 'Single Choice', icon: 'CircleDot', category: 'selection' },
	{ type: 'multichoice', label: 'Multiple Choice', icon: 'CheckSquare', category: 'selection' },
	{ type: 'group', label: 'Group', icon: 'Folder', category: 'structure' },
	{ type: 'list', label: 'List', icon: 'List', category: 'structure' }
];

export type JSONSchema = JSONSchema7;
