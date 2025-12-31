<script lang="ts">
	import { SchemaBuilder, type JSONSchema } from '$lib';

	let schema = $state<JSONSchema>({ type: 'object', properties: {} });
</script>

<main>
	<h1>Data Blueprint Builder</h1>
	<SchemaBuilder bind:schema />
</main>

<style>
	main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		margin: 0 0 0.5rem;
	}
</style>
