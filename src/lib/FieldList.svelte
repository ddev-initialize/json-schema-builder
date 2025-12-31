<script lang="ts">
	import type { Field } from './types.js';
	import FieldComponent from './Field.svelte';

	let { fields = $bindable() }: { fields: Field[] } = $props();

	let draggedIndex = $state<number | null>(null);
	let dropTargetIndex = $state<number | null>(null);

	function deleteField(index: number) {
		fields = fields.filter((_, i) => i !== index);
	}

	function handleDragStart(index: number) {
		return (e: DragEvent) => {
			draggedIndex = index;
			if (e.dataTransfer) {
				e.dataTransfer.effectAllowed = 'move';
			}
		};
	}

	function handleDragEnd() {
		draggedIndex = null;
		dropTargetIndex = null;
	}

	function handleDragOver(index: number) {
		return (e: DragEvent) => {
			e.preventDefault();
			if (draggedIndex !== null && draggedIndex !== index) {
				dropTargetIndex = index;
			}
		};
	}

	function handleDrop(index: number) {
		return (e: DragEvent) => {
			e.preventDefault();
			if (draggedIndex !== null && draggedIndex !== index) {
				const newFields = [...fields];
				const [movedField] = newFields.splice(draggedIndex, 1);
				newFields.splice(index, 0, movedField);
				fields = newFields;
			}
			draggedIndex = null;
			dropTargetIndex = null;
		};
	}
</script>

<div class="field-list">
	{#each fields as field, index (field.id)}
		<div
			role="none"
			class="field-wrapper"
			class:drag-over={dropTargetIndex === index}
			ondragover={handleDragOver(index)}
			ondrop={handleDrop(index)}
		>
			<FieldComponent
				bind:field={fields[index]}
				ondelete={() => deleteField(index)}
				ondragstart={handleDragStart(index)}
				ondragend={handleDragEnd}
			/>
		</div>
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

	.field-wrapper {
		transition: transform 0.2s;

		&.drag-over {
			transform: translateY(4px);
		}
	}

	.empty {
		color: var(--jsb-text-muted, var(--color-text-muted));
		text-align: center;
		padding: 1rem;
		border: 2px dashed var(--jsb-border, var(--color-border));
		border-radius: var(--jsb-radius, 0.25em);
	}
</style>
