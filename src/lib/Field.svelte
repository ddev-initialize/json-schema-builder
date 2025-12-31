<script lang="ts">
	import { ChevronUp, ChevronDown, Trash2, GripVertical, Settings } from '@lucide/svelte';
	import type { Field } from './types.js';
	import { FIELD_TYPES } from './types.js';
	import { labelToKey } from './schema.js';
	import FieldSettings from './FieldSettings.svelte';

	let {
		field = $bindable(),
		ondelete,
		onmoveup,
		onmovedown,
		canMoveUp = true,
		canMoveDown = true
	}: {
		field: Field;
		ondelete: () => void;
		onmoveup: () => void;
		onmovedown: () => void;
		canMoveUp?: boolean;
		canMoveDown?: boolean;
	} = $props();

	const typeInfo = $derived(FIELD_TYPES.find((t) => t.type === field.type));

	function handleLabelChange(e: Event) {
		const input = e.target as HTMLInputElement;
		field.label = input.value;
		field.key = labelToKey(input.value);
	}
</script>

<article class="field">
	<header class="header">
		<span class="drag-handle" aria-hidden="true">
			<GripVertical size={16} />
		</span>

		<input
			type="text"
			class="label"
			value={field.label}
			oninput={handleLabelChange}
			aria-label="Field label"
		/>

		<span class="type">{typeInfo?.label}</span>

		<label class="required">
			<input type="checkbox" bind:checked={field.required} />
			<span>Required</span>
		</label>

		<div class="actions">
			<div class="movers">
				<button
					type="button"
					onclick={onmoveup}
					disabled={!canMoveUp}
					aria-label="Move field up"
					class="icon-btn"
				>
					<ChevronUp size={16} />
				</button>
				<button
					type="button"
					onclick={onmovedown}
					disabled={!canMoveDown}
					aria-label="Move field down"
					class="icon-btn"
				>
					<ChevronDown size={16} />
				</button>
			</div>
			<button type="button" onclick={ondelete} aria-label="Delete field" class="icon-btn delete">
				<Trash2 size={16} />
			</button>
		</div>
	</header>

	<details class="details">
		<summary>
			<Settings size={14} />
			Settings
		</summary>
		<FieldSettings bind:field />
	</details>
</article>

<style>
	.field {
		border: 1px solid var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
		border-radius: var(--jsb-radius, 0.25em);
	}

	.header {
		display: grid;
		grid-template-columns: auto 1fr auto auto auto;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
	}

	.drag-handle {
		color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
	}

	.label {
		border: none;
		background: transparent;
		font: inherit;
		font-weight: 500;
		padding: 0.25em;
		border-radius: var(--jsb-radius, 0.25em);

		&:hover,
		&:focus {
			background: var(--jsb-bg-muted, light-dark(oklch(0.97 0 0), oklch(0.25 0 0)));
			outline: none;
		}
	}

	.type {
		font-size: 0.75em;
		color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
		background: var(--jsb-bg-muted, light-dark(oklch(0.97 0 0), oklch(0.25 0 0)));
		padding-block: 0.25em;
		padding-inline: 0.5em;
		border-radius: var(--jsb-radius, 0.25em);
	}

	.required {
		display: flex;
		align-items: center;
		gap: 0.25em;
		font-size: 0.875em;
		color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
	}

	.actions {
		display: flex;
		gap: 0.25rem;
	}

	.movers {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;

		.icon-btn {
			padding: 2px;
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

		&:hover:not(:disabled) {
			background: var(--jsb-bg-muted, light-dark(oklch(0.97 0 0), oklch(0.25 0 0)));
			color: var(--jsb-text, canvastext);
		}

		&:disabled {
			opacity: 0.3;
		}
	}

	.delete:hover:not(:disabled) {
		color: var(--jsb-danger, light-dark(oklch(0.55 0.2 25), oklch(0.7 0.18 25)));
	}

	.details {
		border-block-start: 1px solid var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));

		& summary {
			display: flex;
			align-items: center;
			gap: 0.5em;
			padding: 0.5rem;
			font-size: 0.875em;
			color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
			list-style: none;

			&::marker,
			&::-webkit-details-marker {
				display: none;
			}

			&:hover {
				background: var(--jsb-bg-muted, light-dark(oklch(0.97 0 0), oklch(0.25 0 0)));
			}
		}
	}
</style>
