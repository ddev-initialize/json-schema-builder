<script lang="ts">
	import { SchemaBuilder, type JSONSchema } from '$lib';

	let schema = $state<JSONSchema>({ type: 'object', properties: {} });
</script>

<main>
	<h1>JSON Schema Builder</h1>
	<p>A visual tool for building data extraction blueprints.</p>

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

	p {
		color: #6b7280;
		margin: 0 0 2rem;
	}
</style>
