<script lang="ts">
	import type { FieldType } from './types.js';
	import { FIELD_TYPES } from './types.js';

	let { onadd }: { onadd: (type: FieldType) => void } = $props();

	function handleChange(e: Event) {
		const select = e.target as HTMLSelectElement;
		if (select.value) {
			onadd(select.value as FieldType);
			select.value = '';
		}
	}
</script>

<select class="field-select" onchange={handleChange}>
	<option value="" disabled selected>Add field…</option>

	<optgroup label="Basic">
		{#each FIELD_TYPES.filter((f) => f.category === 'basic') as f}
			<option value={f.type}>{f.label}</option>
		{/each}
	</optgroup>

	<optgroup label="Selection">
		{#each FIELD_TYPES.filter((f) => f.category === 'selection') as f}
			<option value={f.type}>{f.label}</option>
		{/each}
	</optgroup>

	<optgroup label="Structure">
		{#each FIELD_TYPES.filter((f) => f.category === 'structure') as f}
			<option value={f.type}>{f.label}</option>
		{/each}
	</optgroup>
</select>

<style>
	.field-select {
		appearance: none;
		font: inherit;
		cursor: pointer;

		padding-block: 0.75em;
		padding-inline: 1em;

		border: 2px dashed var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
		border-radius: var(--jsb-radius, 0.25em);
	}

	.field-select:hover,
	.field-select:focus-visible {
		border-color: var(--jsb-primary, light-dark(oklch(0.55 0.2 250), oklch(0.7 0.15 250)));
		outline: none;
	}

	optgroup {
		font-weight: 600;
	}

	option {
		font-size: 1em;
		font-weight: 400;
	}
</style>
