<script lang="ts">
	import type { JSONSchema } from './types.js';

	let { schema }: { schema: JSONSchema } = $props();

	const formatted = $derived(JSON.stringify(schema, null, 2));
</script>

<details class="preview">
	<summary>JSON Schema Output</summary>
	<pre><code>{formatted}</code></pre>
</details>

<style>
	.preview {
		margin-block-start: var(--jsb-gap, 1rem);
		border: 1px solid var(--jsb-border, var(--color-border));
		border-radius: var(--jsb-radius, 0.25em);
		overflow: hidden;

		& summary {
			padding: 0.75rem;
			background: var(--jsb-bg-muted, var(--color-bg-muted));
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
