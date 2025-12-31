<script lang="ts">
	import { Plus, X } from '@lucide/svelte';
	import type { Field } from './types.js';

	let { field = $bindable() }: { field: Field } = $props();

	function addOption() {
		if (!field.options) field.options = [];
		field.options = [...field.options, `Option ${field.options.length + 1}`];
	}

	function removeOption(index: number) {
		if (field.options) {
			field.options = field.options.filter((_, i) => i !== index);
		}
	}

	function updateOption(index: number, value: string) {
		if (field.options) {
			field.options[index] = value;
		}
	}
</script>

<div class="settings">
	<label class="setting">
		<span>Key</span>
		<input type="text" bind:value={field.key} />
	</label>

	<label class="setting">
		<span>Description</span>
		<input type="text" bind:value={field.description} placeholder="Optional help text" />
	</label>

	{#if field.type === 'text' || field.type === 'longtext'}
		<div class="setting-row">
			<label class="setting">
				<span>Min length</span>
				<input type="number" bind:value={field.minLength} min="0" />
			</label>
			<label class="setting">
				<span>Max length</span>
				<input type="number" bind:value={field.maxLength} min="0" />
			</label>
		</div>
	{/if}

	{#if field.type === 'number'}
		<div class="setting-row">
			<label class="setting">
				<span>Minimum</span>
				<input type="number" bind:value={field.min} />
			</label>
			<label class="setting">
				<span>Maximum</span>
				<input type="number" bind:value={field.max} />
			</label>
		</div>
	{/if}

	{#if field.type === 'choice' || field.type === 'multichoice'}
		<fieldset class="options">
			<legend>Options</legend>
			{#each field.options || [] as option, i (i)}
				<div class="option">
					<input
						type="text"
						value={option}
						oninput={(e) => updateOption(i, (e.target as HTMLInputElement).value)}
					/>
					<button
						type="button"
						onclick={() => removeOption(i)}
						aria-label="Remove option"
						class="icon-btn"
					>
						<X size={14} />
					</button>
				</div>
			{/each}
			<button type="button" onclick={addOption} class="add-option">
				<Plus size={14} />
				Add option
			</button>
		</fieldset>
	{/if}
</div>

<style>
	.settings {
		display: grid;
		gap: 0.5rem;
		padding: 0.5rem;
		background: var(--jsb-bg-muted, light-dark(oklch(0.97 0 0), oklch(0.25 0 0)));
	}

	.setting {
		display: grid;
		gap: 0.25rem;

		& span {
			font-size: 0.75em;
			color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
		}

		& input {
			padding: 0.5em;
			border: 1px solid var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
			border-radius: var(--jsb-radius, 0.25em);
		}
	}

	.setting-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.options {
		border: 1px solid var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
		border-radius: var(--jsb-radius, 0.25em);
		padding: 0.5rem;
		margin: 0;

		& legend {
			font-size: 0.75em;
			color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
			padding-inline: 0.25em;
		}
	}

	.option {
		display: flex;
		gap: 0.5rem;
		margin-block-end: 0.5rem;

		& input {
			flex: 1;
			padding: 0.5em;
			border: 1px solid var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
			border-radius: var(--jsb-radius, 0.25em);
		}
	}

	.icon-btn {
		display: grid;
		place-items: center;
		padding: 0.5em;
		border: none;
		background: transparent;
		border-radius: var(--jsb-radius, 0.25em);
		color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
		cursor: pointer;

		&:hover {
			background: var(--jsb-bg, canvas);
			color: var(--jsb-text, canvastext);
		}
	}

	.add-option {
		display: flex;
		align-items: center;
		gap: 0.25em;
		padding: 0.5em;
		border: none;
		background: transparent;
		color: var(--jsb-primary, light-dark(oklch(0.55 0.2 250), oklch(0.7 0.15 250)));

		&:hover {
			text-decoration: underline;
		}
	}
</style>
