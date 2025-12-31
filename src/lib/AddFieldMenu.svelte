<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import type { FieldType } from './types.js';
	import { FIELD_TYPES } from './types.js';

	let { onadd }: { onadd: (type: FieldType) => void } = $props();

	let open = $state(false);

	function handleSelect(type: FieldType) {
		onadd(type);
		open = false;
	}

	function handleKeydown(e: KeyboardEvent, type: FieldType) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleSelect(type);
		}
	}

	const basicFields = $derived(FIELD_TYPES.filter((f) => f.category === 'basic'));
	const selectionFields = $derived(FIELD_TYPES.filter((f) => f.category === 'selection'));
	const structureFields = $derived(FIELD_TYPES.filter((f) => f.category === 'structure'));
</script>

<details class="add-menu" bind:open>
	<summary class="add-btn">
		<Plus size={16} />
		Add field
	</summary>

	<menu class="menu">
		<li class="menu-group">
			<span class="menu-label">Basic</span>
			{#each basicFields as field (field.type)}
				<button
					type="button"
					onclick={() => handleSelect(field.type)}
					onkeydown={(e) => handleKeydown(e, field.type)}
				>
					{field.label}
				</button>
			{/each}
		</li>

		<li class="menu-group">
			<span class="menu-label">Selection</span>
			{#each selectionFields as field (field.type)}
				<button
					type="button"
					onclick={() => handleSelect(field.type)}
					onkeydown={(e) => handleKeydown(e, field.type)}
				>
					{field.label}
				</button>
			{/each}
		</li>

		<li class="menu-group">
			<span class="menu-label">Structure</span>
			{#each structureFields as field (field.type)}
				<button
					type="button"
					onclick={() => handleSelect(field.type)}
					onkeydown={(e) => handleKeydown(e, field.type)}
				>
					{field.label}
				</button>
			{/each}
		</li>
	</menu>
</details>

<style>
	.add-menu {
		position: relative;
	}

	.add-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		padding-block: 0.75em;
		padding-inline: 1em;
		border: 2px dashed var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
		border-radius: var(--jsb-radius, 0.25em);
		background: transparent;
		color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
		list-style: none;

		&::marker,
		&::-webkit-details-marker {
			display: none;
		}

		&:hover {
			border-color: var(--jsb-primary, light-dark(oklch(0.55 0.2 250), oklch(0.7 0.15 250)));
			color: var(--jsb-primary, light-dark(oklch(0.55 0.2 250), oklch(0.7 0.15 250)));
		}
	}

	.menu {
		position: absolute;
		z-index: 10;
		margin-block-start: 0.5rem;
		padding: 0.5rem;
		border: 1px solid var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
		border-radius: var(--jsb-radius, 0.25em);
		background: var(--jsb-bg, canvas);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		list-style: none;
		min-inline-size: 12rem;
	}

	.menu-group + .menu-group {
		border-block-start: 1px solid var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
		margin-block-start: 0.5rem;
		padding-block-start: 0.5rem;
	}

	.menu-label {
		display: block;
		font-size: 0.75em;
		font-weight: 600;
		color: var(--jsb-text-muted, light-dark(oklch(0.45 0 0), oklch(0.65 0 0)));
		padding-block: 0.25em;
		padding-inline: 0.5em;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.menu button {
		display: block;
		inline-size: 100%;
		padding: 0.5em;
		border: none;
		background: transparent;
		text-align: start;
		border-radius: var(--jsb-radius, 0.25em);

		&:hover {
			background: var(--jsb-bg-muted, light-dark(oklch(0.97 0 0), oklch(0.25 0 0)));
		}
	}
</style>
