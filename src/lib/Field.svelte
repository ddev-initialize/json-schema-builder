<script lang="ts">
	import { GripVertical, Settings, X } from '@lucide/svelte';
	import type { Field } from './types.js';
	import { FIELD_TYPES } from './types.js';
	import { labelToKey } from './schema.js';
	import FieldSettings from './FieldSettings.svelte';

	let {
		field = $bindable(),
		ondelete,
		ondragstart,
		ondragend
	}: {
		field: Field;
		ondelete: () => void;
		ondragstart: (e: DragEvent) => void;
		ondragend: () => void;
	} = $props();

	const typeInfo = $derived(FIELD_TYPES.find((t) => t.type === field.type));
	const popoverId = $derived(`settings-${field.id}`);
	const anchorName = $derived(`anchor-${field.id}`);

	function handleLabelChange(e: Event) {
		const input = e.target as HTMLInputElement;
		field.label = input.value;
		field.key = labelToKey(input.value);
	}
</script>

<li class="field" draggable="true" {ondragstart} {ondragend}>
	<div class="field-container">
		<span class="drag-handle" aria-label="Drag to reorder">
			<GripVertical size={16} />
		</span>

		<input
			type="text"
			class="label"
			name="{field.id}-label"
			value={field.label}
			oninput={handleLabelChange}
			aria-label="Field label"
		/>

		<span class="type">{typeInfo?.label}</span>

		{#if field.required}
			<span class="required-indicator" aria-label="Required field">*</span>
		{/if}

		<button
			type="button"
			popovertarget={popoverId}
			class="settings-btn"
			style="anchor-name: --{anchorName}"
			aria-label="Field settings"
		>
			<Settings size={16} />
		</button>

		<button type="button" onclick={ondelete} class="delete-btn" aria-label="Delete field">
			<X size={16} />
		</button>
	</div>

	<div id={popoverId} popover class="settings-popover" style="position-anchor: --{anchorName}">
		<FieldSettings bind:field />
	</div>
</li>

<style>
	.field {
		border: 1px solid var(--jsb-border, var(--color-border));
		border-radius: var(--jsb-radius, 0.25em);
		background: var(--jsb-bg, var(--color-bg));
		cursor: grab;

		&:hover {
			border-color: var(--jsb-primary, var(--color-primary));

			.delete-btn {
				opacity: 1;
			}
		}

		list-style: none;
	}

	.field-container {
		display: grid;
		grid-template-columns: auto 1fr auto auto auto auto;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
	}

	.drag-handle {
		color: var(--jsb-text-muted, var(--color-text-muted));
		display: grid;
		place-items: center;
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
			background: var(--jsb-bg-muted, var(--color-bg-muted));
			outline: none;
		}
	}

	.required-indicator {
		color: var(--jsb-danger, var(--color-danger));
		font-weight: 700;
	}

	.type {
		font-size: 0.75em;
		color: var(--jsb-text-muted, var(--color-text-muted));
		background: var(--jsb-bg-muted, var(--color-bg-muted));
		padding-block: 0.25em;
		padding-inline: 0.5em;
		border-radius: var(--jsb-radius, 0.25em);
	}

	.settings-btn,
	.delete-btn {
		display: grid;
		place-items: center;
		padding: 0.5em;
		border: none;
		background: transparent;
		border-radius: var(--jsb-radius, 0.25em);
		color: var(--jsb-text-muted, var(--color-text-muted));
		cursor: pointer;

		&:hover {
			background: var(--jsb-bg-muted, var(--color-bg-muted));
			color: var(--jsb-text, var(--color-text));
		}
	}

	.delete-btn {
		opacity: 0;
		transition: opacity 0.2s;

		&:hover {
			color: var(--jsb-danger, var(--color-danger));
		}
	}

	.settings-popover {
		position: absolute;
		inset: unset;
		top: anchor(bottom);
		left: anchor(right);
		margin: 0.5rem;
		translate: -100% 0;

		border: 1px solid var(--jsb-border, var(--color-border));
		border-radius: var(--jsb-radius, 0.25em);
		background: var(--jsb-bg, var(--color-bg));
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		padding: 0;
		max-inline-size: 20rem;
	}
</style>
