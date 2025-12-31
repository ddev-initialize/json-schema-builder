<script lang="ts">
	import type { Field } from './types.js';
	import FieldComponent from './Field.svelte';

	let { fields = $bindable() }: { fields: Field[] } = $props();

	function deleteField(index: number) {
		fields = fields.filter((_, i) => i !== index);
	}

	function moveUp(index: number) {
		if (index <= 0) return;
		const newFields = [...fields];
		[newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
		fields = newFields;
	}

	function moveDown(index: number) {
		if (index >= fields.length - 1) return;
		const newFields = [...fields];
		[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
		fields = newFields;
	}
</script>

<div class="field-list">
	{#each fields as field, index (field.id)}
		<FieldComponent
			bind:field={fields[index]}
			ondelete={() => deleteField(index)}
			onmoveup={() => moveUp(index)}
			onmovedown={() => moveDown(index)}
			canMoveUp={index > 0}
			canMoveDown={index < fields.length - 1}
		/>
	{/each}

	{#if fields.length === 0}
		<p class="empty">No fields yet. Add one to get started.</p>
	{/if}
</div>

<style>
	.field-list {
		display: grid;
		gap: 0.5rem;
		margin-block-end: var(--jsb-gap, 1rem);
	}

	.empty {
		color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
		text-align: center;
		padding: 2rem;
		border: 2px dashed var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
		border-radius: var(--jsb-radius, 0.25em);
	}
</style>
