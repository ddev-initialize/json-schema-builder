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
		<input type="text" name="{field.id}-key" bind:value={field.key} />
	</label>

	<label class="setting">
		<span>Description</span>
		<input name="{field.id}-description" type="text" bind:value={field.description} placeholder="Optional help text" />
	</label>

	<label class="setting-checkbox">
		<input name="{field.id}-required" type="checkbox" bind:checked={field.required} />
		<span>Required field</span>
	</label>

	{#if field.type === 'text' || field.type === 'longtext'}
		<div class="setting-row">
			<label class="setting">
				<span>Min length</span>
				<input type="number" name="{field.id}-minimum-length" bind:value={field.minLength} min="0" />
			</label>
			<label class="setting">
				<span>Max length</span>
				<input type="number" name="{field.id}-maximum-length" bind:value={field.maxLength} min="0" />
			</label>
		</div>
	{/if}

	{#if field.type === 'number'}
		<div class="setting-row">
			<label class="setting">
				<span>Minimum</span>
				<input type="number" name="{field.id}-minimum" bind:value={field.min} />
			</label>
			<label class="setting">
				<span>Maximum</span>
				<input type="number" name="{field.id}-maximum" bind:value={field.max} />
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
						name="{field.id}-option-{i}"
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
		gap: 0.75rem;
		padding: 1rem;
		background: var(--jsb-bg-muted, var(--color-bg-muted));
	}

	.setting {
		display: grid;
		gap: 0.25rem;

		& span {
			font-size: 0.75em;
			font-weight: 500;
			color: var(--jsb-text-muted, var(--color-text-muted));
		}

		& input {
			padding: 0.5em;
			border: 1px solid var(--jsb-border, var(--color-border));
			border-radius: var(--jsb-radius, 0.25em);
			font: inherit;
		}
	}

	.setting-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.5em;
		border-radius: var(--jsb-radius, 0.25em);
		background: var(--jsb-bg, var(--color-bg));

		& input {
			cursor: pointer;
		}

		& span {
			font-size: 0.875em;
		}
	}

	.setting-row {
		display: grid;
		gap: 0.75rem;
	}

	.options {
		border: 1px solid var(--jsb-border, var(--color-border));
		border-radius: var(--jsb-radius, 0.25em);
		padding: 0.75rem;
		margin: 0;
		background: var(--jsb-bg, var(--color-bg));

		& legend {
			font-size: 0.75em;
			font-weight: 500;
			color: var(--jsb-text-muted, var(--color-text-muted));
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
			border: 1px solid var(--jsb-border, var(--color-border));
			border-radius: var(--jsb-radius, 0.25em);
			font: inherit;
		}
	}

	.icon-btn {
		display: grid;
		place-items: center;
		padding: 0.5em;
		border: none;
		background: transparent;
		border-radius: var(--jsb-radius, 0.25em);
		color: var(--jsb-text-muted, var(--color-text-muted));

		&:hover {
			background: var(--jsb-bg-muted, var(--color-bg-muted));
			color: var(--jsb-text, var(--color-text));
		}
	}

	.add-option {
		display: flex;
		align-items: center;
		gap: 0.25em;
		padding: 0.5em;
		border: none;
		background: transparent;
		color: var(--jsb-primary, var(--color-primary));

		&:hover {
			text-decoration: underline;
		}
	}
</style>
