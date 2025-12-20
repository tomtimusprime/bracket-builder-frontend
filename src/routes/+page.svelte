<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';

	let brackets = [];
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			brackets = await api.listBrackets();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load brackets';
		} finally {
			loading = false;
		}
	});

	function handleCreateNew() {
		goto('/create');
	}

	function handleViewBracket(id) {
		goto(`/bracket/${id}`);
	}

	async function handleDeleteBracket(id, event) {
		event.stopPropagation();
		if (!confirm('Are you sure you want to delete this bracket? This action cannot be undone.')) {
			return;
		}
		try {
			await api.deleteBracket(id);
			brackets = brackets.filter(b => b.id !== id);
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Failed to delete bracket');
		}
	}
</script>

<svelte:head>
	<title>Bracket Builder</title>
</svelte:head>

<div class="container">
	<header>
		<h1>🏆 Bracket Builder</h1>
		<p class="subtitle">Create and manage tournament-style brackets for any topic</p>
	</header>

	<div class="actions">
		<button class="btn btn-primary" on:click={handleCreateNew}>
			+ Create New Bracket
		</button>
	</div>

	{#if loading}
		<div class="loading">Loading brackets...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if brackets.length === 0}
		<div class="empty-state">
			<p>No brackets yet. Create your first bracket to get started!</p>
		</div>
	{:else}
		<div class="brackets-grid">
			{#each brackets as bracket}
				<div class="bracket-card" on:click={() => handleViewBracket(bracket.id)}>
					<div class="bracket-header">
						<h3>{bracket.name}</h3>
						<button
							class="btn-delete"
							on:click={(e) => handleDeleteBracket(bracket.id, e)}
							title="Delete bracket"
						>
							🗑️
						</button>
					</div>
					<p class="topic">{bracket.topic}</p>
					<div class="meta">
						<span class="status status-{bracket.status}">{bracket.status}</span>
						<span class="rounds">{bracket.total_rounds} rounds</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 3rem;
		margin: 0;
		color: #1a1a1a;
	}

	.subtitle {
		font-size: 1.2rem;
		color: #666;
		margin-top: 0.5rem;
	}

	.actions {
		margin-bottom: 2rem;
		display: flex;
		justify-content: center;
	}

	.btn {
		padding: 0.75rem 2rem;
		font-size: 1.1rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 600;
	}

	.btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}

	.loading,
	.error,
	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #666;
	}

	.error {
		color: #e74c3c;
	}

	.brackets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.bracket-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.2s;
		border: 2px solid transparent;
	}

	.bracket-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
		border-color: #667eea;
	}

	.bracket-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.5rem;
	}

	.bracket-card h3 {
		margin: 0;
		color: #1a1a1a;
		font-size: 1.5rem;
		flex: 1;
	}

	.btn-delete {
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		padding: 0.25rem 0.5rem;
		opacity: 0.6;
		transition: all 0.2s;
		border-radius: 4px;
	}

	.btn-delete:hover {
		opacity: 1;
		background: #fee2e2;
		transform: scale(1.1);
	}

	.topic {
		color: #666;
		margin: 0 0 1rem 0;
		font-size: 1rem;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #eee;
	}

	.status {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.status-draft {
		background: #f3f4f6;
		color: #6b7280;
	}

	.status-active {
		background: #dbeafe;
		color: #1e40af;
	}

	.status-completed {
		background: #d1fae5;
		color: #065f46;
	}

	.rounds {
		color: #666;
		font-size: 0.9rem;
	}
</style>

