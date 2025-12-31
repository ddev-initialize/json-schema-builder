<script lang="ts">
	import { Plus } from '@lucide/svelte';
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

<select
	name="jsb-field-select-adder"
	class="field-select"
	onchange={handleChange}
	title="Add a field"
>
	<option value="" disabled selected></option>

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
		inline-size: 100%;
		appearance: none;
		font: inherit;
		cursor: pointer;

		padding-block: 0.75em;
		padding-inline: 1em;

		border: 2px dashed var(--jsb-border, var(--color-border));
		border-radius: var(--jsb-radius, 0.25em);

		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E");

		/* 3. Center and size it */
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 18px;
	}

	.field-select:hover,
	.field-select:focus-visible {
		color: var(--jsb-text, var(--color-text));
	}

	optgroup {
		font-weight: 600;
	}

	option {
		font-size: 1em;
		font-weight: 400;
	}
</style>
