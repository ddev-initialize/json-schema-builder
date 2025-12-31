<script lang="ts">
	import type { Field, FieldType, JSONSchema } from './types.js';
	import { createField, fieldsToSchema, schemaToFields } from './schema.js';
	import FieldList from './FieldList.svelte';
	import AddFieldMenu from './AddFieldMenu.svelte';
	import JsonPreview from './JsonPreview.svelte';

	let {
		schema = $bindable<JSONSchema>({ type: 'object', properties: {} }),
		class: className = ''
	}: {
		schema?: JSONSchema;
		class?: string;
	} = $props();

	let fields = $state<Field[]>(schemaToFields(schema));

	const outputSchema = $derived(fieldsToSchema(fields));

	$effect(() => {
		schema = outputSchema;
	});

	function addField(type: FieldType) {
		fields = [...fields, createField(type)];
	}
</script>

<div class="jsb {className}">
	<header class="header">
		<h2>Design your data blueprint</h2>
	</header>

	<FieldList bind:fields />
	<AddFieldMenu onadd={addField} />

	<JsonPreview schema={outputSchema} />
</div>

<style>
	.jsb {
		font-family: var(--jsb-font, inherit);
		color: var(--jsb-text, canvastext);
		background: var(--jsb-bg, canvas);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-block-end: var(--jsb-gap, 1rem);

		& h2 {
			margin: 0;
		}
	}
</style>
