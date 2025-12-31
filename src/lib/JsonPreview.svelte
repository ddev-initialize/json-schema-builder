<script lang="ts">
	import type { JSONSchema } from './types.js';

	let { schema }: { schema: JSONSchema } = $props();

	const formatted = $derived(JSON.stringify(schema, null, 2));
</script>

<details class="preview" open>
	<summary>JSON Schema Output</summary>
	<pre><code>{formatted}</code></pre>
</details>

<style>
	.preview {
		margin-block-start: var(--jsb-gap, 1rem);
		border: 1px solid var(--jsb-border, light-dark(oklch(0.9 0 0), oklch(0.3 0 0)));
		border-radius: var(--jsb-radius, 0.25em);
		overflow: hidden;

		& summary {
			padding: 0.75rem;
			background: var(--jsb-bg-muted, light-dark(oklch(0.97 0 0), oklch(0.25 0 0)));
			font-weight: 500;
		}

		& pre {
			margin: 0;
			padding: 1rem;
			overflow-x: auto;
			font-size: 0.875em;
		}
	}
</style>
