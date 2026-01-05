<script>
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { getCategories, getListByCategoryAndSize } from '$lib/data/premadeLists';

	let name = '';
	let topic = '';
	let items = [''];
	let loading = false;
	let error = null;
	let bracketSize = null;
	let selectedCategory = '';
	let selectedCategorySize = 8;
	let showPremadeSection = false;

	const sizes = [2, 4, 8, 16, 32, 64, 128];
	const categorySizes = [8, 16, 32, 64, 128];
	const categories = getCategories();

	function addItem() {
		if (bracketSize && items.length >= bracketSize) {
			error = `Bracket is full! Maximum ${bracketSize} items allowed for this bracket size.`;
			return;
		}
		items = [...items, ''];
		error = null;
	}

	$: remainingItems = bracketSize ? (() => {
		const validItems = items.filter(item => item.trim() !== '').length;
		return bracketSize - validItems;
	})() : null;

	$: isBracketFull = bracketSize ? (() => {
		const validItems = items.filter(item => item.trim() !== '').length;
		return validItems >= bracketSize;
	})() : false;

	function removeItem(index) {
		items = items.filter((_, i) => i !== index);
	}

	function updateItem(index, value) {
		items[index] = value;
		items = items; // Trigger reactivity
	}

	async function handleSubmit() {
		error = null;
		
		if (!name.trim() || !topic.trim()) {
			error = 'Please fill in bracket name and topic';
			return;
		}

		const validItems = items.filter(item => item.trim() !== '');
		if (validItems.length < 2) {
			error = 'Please add at least 2 items';
			return;
		}

		if (bracketSize && validItems.length > bracketSize) {
			error = `You can only have up to ${bracketSize} items for this bracket size`;
			return;
		}

		loading = true;
		try {
			const bracket = await api.createBracket({
				name: name.trim(),
				topic: topic.trim(),
				items: validItems.map(item => item.trim()),
			});
			goto(`/bracket/${bracket.id}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to create bracket';
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		goto('/');
	}

	function handleSizeChange() {
		if (bracketSize && items.length > bracketSize) {
			items = items.slice(0, bracketSize);
		}
	}

	function populateFromCategory() {
		if (!selectedCategory) {
			error = 'Please select a category';
			return;
		}

		const categoryItems = getListByCategoryAndSize(selectedCategory, selectedCategorySize);
		items = categoryItems;
		bracketSize = selectedCategorySize;
		
		if (!name.trim()) {
			name = `Favorite ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`;
		}
		if (!topic.trim()) {
			topic = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
		}
		
		showPremadeSection = false;
	}

	function togglePremadeSection() {
		showPremadeSection = !showPremadeSection;
	}
</script>

<svelte:head>
	<title>Create Bracket - Bracket Builder</title>
</svelte:head>

<div class="container">
	<header>
		<h1>Create New Bracket</h1>
		<p class="subtitle">Enter your bracket details and items</p>
	</header>

	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="name">Bracket Name</label>
			<input
				id="name"
				type="text"
				bind:value={name}
				placeholder="e.g., Favorite Fruits"
				required
			/>
		</div>

		<div class="form-group">
			<label for="topic">Topic</label>
			<input
				id="topic"
				type="text"
				bind:value={topic}
				placeholder="e.g., Fruits"
				required
			/>
		</div>

		<div class="form-group">
			<label for="bracketSize">Bracket Size (Optional - limits number of items)</label>
			<select id="bracketSize" bind:value={bracketSize} on:change={handleSizeChange}>
				<option value={null}>No limit</option>
				{#each sizes as size}
					<option value={size}>{size} items</option>
				{/each}
			</select>
		</div>

		<div class="premade-section">
			<button type="button" class="btn-premade" on:click={togglePremadeSection}>
				{showPremadeSection ? '▼' : '▶'} Use Premade Category Lists
			</button>
			
			{#if showPremadeSection}
				<div class="premade-content">
					<p class="premade-description">
						Choose from 20 premade categories with lists of 8, 16, 32, 64, or 128 items:
					</p>
					<div class="premade-controls">
						<div class="form-group">
							<label for="category">Category</label>
							<select id="category" bind:value={selectedCategory}>
								<option value="">Select a category...</option>
								{#each categories as cat}
									<option value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="categorySize">Size</label>
							<select id="categorySize" bind:value={selectedCategorySize}>
								{#each categorySizes as size}
									<option value={size}>{size} items</option>
								{/each}
							</select>
						</div>
						<button 
							type="button" 
							class="btn-populate" 
							on:click={populateFromCategory}
							disabled={!selectedCategory}
						>
							Populate Bracket
						</button>
					</div>
					<div class="category-list">
						<p><strong>Available Categories:</strong></p>
						<div class="category-tags">
							{#each categories as cat}
								<span class="category-tag">{cat}</span>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<div class="form-group">
			<label>Items</label>
			<div class="items-list">
				{#each items as item, index}
					<div class="item-input">
						<input
							type="text"
							value={item}
							on:input={(e) => updateItem(index, e.currentTarget.value)}
							placeholder="Enter item name"
						/>
						{#if items.length > 1}
							<button
								type="button"
								class="btn-remove"
								on:click={() => removeItem(index)}
							>
								×
							</button>
						{/if}
					</div>
				{/each}
			</div>
			{#if bracketSize && remainingItems !== null}
				<div class="items-counter-container">
					{#if remainingItems > 0}
						<span class="items-counter">{remainingItems} {remainingItems === 1 ? 'item' : 'items'} remaining</span>
					{:else}
						<span class="items-counter items-counter-full">✓ Bracket is full</span>
					{/if}
				</div>
			{/if}
			<button 
				type="button" 
				class="btn-add" 
				on:click={addItem}
				disabled={isBracketFull}
				title={isBracketFull ? `Bracket is full. Maximum ${bracketSize} items allowed.` : 'Add another item'}
			>
				+ Add Item
			</button>
			{#if isBracketFull}
				<p class="bracket-full-message">
					✓ Bracket is full! You have reached the maximum of {bracketSize} items.
				</p>
			{/if}
		</div>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<div class="form-actions">
			<button type="button" class="btn btn-secondary" on:click={handleCancel}>
				Cancel
			</button>
			<button type="submit" class="btn btn-primary" disabled={loading}>
				{loading ? 'Creating...' : 'Create Bracket'}
			</button>
		</div>
	</form>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin: 0;
		color: #1a1a1a;
	}

	.subtitle {
		color: #666;
		margin-top: 0.5rem;
	}

	form {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #333;
	}

	input[type='text'] {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		font-size: 1rem;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	input[type='text']:focus,
	select:focus {
		outline: none;
		border-color: #667eea;
	}

	select {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		font-size: 1rem;
		transition: border-color 0.2s;
		box-sizing: border-box;
		background: white;
		cursor: pointer;
	}

	.items-list {
		margin-bottom: 0.75rem;
	}

	.items-counter-container {
		margin-bottom: 0.75rem;
		text-align: center;
	}

	.items-counter {
		display: inline-block;
		font-size: 0.9rem;
		color: #666;
		font-weight: 500;
		padding: 0.5rem 1rem;
		background: #f3f4f6;
		border-radius: 6px;
	}

	.items-counter-full {
		color: #10b981;
		font-weight: 600;
		background: #d1fae5;
	}

	.item-input {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		align-items: center;
	}

	.item-input input {
		flex: 1;
		padding: 0.75rem;
		border: 2px solid #e5e7eb;
		border-radius: 6px;
		font-size: 1rem;
		min-width: 0; /* Allow input to shrink */
	}

	.item-input input:focus {
		outline: none;
		border-color: #667eea;
	}

	.btn-remove {
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 6px;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 1.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}

	.btn-remove:hover {
		background: #dc2626;
	}

	.btn-add {
		background: #f3f4f6;
		border: 2px dashed #d1d5db;
		border-radius: 6px;
		padding: 0.75rem;
		width: 100%;
		cursor: pointer;
		font-size: 1rem;
		color: #666;
		transition: all 0.2s;
	}

	.btn-add:hover:not(:disabled) {
		background: #e5e7eb;
		border-color: #9ca3af;
	}

	.btn-add:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: #f3f4f6;
		border-color: #d1d5db;
	}

	.bracket-full-message {
		margin-top: 0.75rem;
		padding: 0.75rem;
		background: #d1fae5;
		border: 1px solid #10b981;
		border-radius: 6px;
		color: #065f46;
		font-size: 0.9rem;
		font-weight: 500;
		text-align: center;
	}

	.error {
		background: #fee2e2;
		color: #dc2626;
		padding: 1rem;
		border-radius: 6px;
		margin-bottom: 1rem;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 2rem;
	}

	.btn {
		padding: 0.75rem 2rem;
		font-size: 1rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 600;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}

	.btn-secondary {
		background: #f3f4f6;
		color: #333;
	}

	.btn-secondary:hover {
		background: #e5e7eb;
	}

	.premade-section {
		margin: 2rem 0;
		padding: 1.5rem;
		background: #f9fafb;
		border-radius: 8px;
		border: 2px solid #e5e7eb;
	}

	.btn-premade {
		width: 100%;
		background: #667eea;
		color: white;
		border: none;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.btn-premade:hover {
		background: #5568d3;
		transform: translateY(-1px);
	}

	.premade-content {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid #e5e7eb;
	}

	.premade-description {
		color: #666;
		margin-bottom: 1.5rem;
		font-size: 0.95rem;
	}

	.premade-controls {
		display: grid;
		grid-template-columns: 2fr 1fr auto;
		gap: 1rem;
		align-items: end;
		margin-bottom: 1.5rem;
	}

	.premade-controls .form-group {
		margin-bottom: 0;
	}

	.btn-populate {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.btn-populate:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
	}

	.btn-populate:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.category-list {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid #e5e7eb;
	}

	.category-list p {
		margin-bottom: 0.75rem;
		color: #333;
	}

	.category-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.category-tag {
		background: white;
		padding: 0.4rem 0.8rem;
		border-radius: 12px;
		font-size: 0.85rem;
		color: #667eea;
		border: 1px solid #667eea;
		font-weight: 500;
	}

	/* Mobile Responsive Styles */
	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		header {
			margin-bottom: 1.5rem;
		}

		h1 {
			font-size: 1.75rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.form-group {
			margin-bottom: 1.25rem;
		}

		.form-group label {
			font-size: 0.95rem;
		}

		.form-group input,
		.form-group select {
			font-size: 1rem;
			padding: 0.75rem;
		}

		.items-list {
			gap: 0.4rem;
			margin-bottom: 0.6rem;
		}

		.item-input {
			gap: 0.4rem;
			margin-bottom: 0.4rem;
		}

		.item-input input {
			padding: 0.5rem;
			font-size: 0.9rem;
		}

		.btn-remove {
			width: 1.75rem;
			height: 1.75rem;
			font-size: 1.1rem;
			flex-shrink: 0;
		}

		.btn-add {
			padding: 0.5rem;
			font-size: 0.9rem;
			min-height: 40px;
		}

		.btn-populate {
			padding: 0.5rem 0.75rem;
			font-size: 0.9rem;
		}

		.btn-premade {
			padding: 0.5rem 0.6rem;
			font-size: 0.9rem;
		}

		.actions {
			flex-direction: column;
			gap: 0.75rem;
		}

		.btn {
			width: 100%;
			padding: 0.875rem 1.5rem;
			font-size: 1rem;
		}

		.premade-section {
			padding: 1.25rem;
			margin: 1.5rem 0;
		}

		.premade-controls {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.btn-populate {
			width: 100%;
			white-space: normal;
			padding: 0.6rem 1rem;
			font-size: 0.95rem;
		}

		.btn-premade {
			padding: 0.6rem 0.75rem;
			font-size: 0.95rem;
		}

		.category-tags {
			gap: 0.4rem;
		}

		.category-tag {
			font-size: 0.8rem;
			padding: 0.35rem 0.7rem;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 0.75rem;
		}

		h1 {
			font-size: 1.5rem;
		}

		.subtitle {
			font-size: 0.9rem;
		}

		.form-group input,
		.form-group select {
			font-size: 0.95rem;
			padding: 0.7rem;
		}

		.premade-section {
			padding: 1rem;
		}

		.category-tag {
			font-size: 0.75rem;
			padding: 0.3rem 0.6rem;
		}
	}
</style>

