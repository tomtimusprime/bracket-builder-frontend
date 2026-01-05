<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { api } from "$lib/api";
  import ConfirmModal from "$lib/ConfirmModal.svelte";

  let bracket = null;
  let loading = true;
  let error = null;
  let updatingMatch = null;
  let hoveredItemId = null;
  let resetting = false;
  let showResetModal = false;
  let showClearWinnerModal = false;
  let matchToClear = null;

  $: bracketId = $page.params.id;
  $: finalWinner =
    bracket && bracket.status === "completed"
      ? bracket.matches
          .filter((m) => m.round === bracket.total_rounds)
          .find((m) => m.winner_id)?.winner_id
      : null;
  $: finalWinnerItem =
    finalWinner && bracket
      ? bracket.items.find((i) => i.id === finalWinner)
      : null;

  onMount(async () => {
    await loadBracket();
  });

  async function loadBracket() {
    loading = true;
    error = null;
    try {
      bracket = await api.getBracket(bracketId);
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load bracket";
    } finally {
      loading = false;
    }
  }

   async function selectWinner(match, winnerId, event) {
     if (!bracket || match.winner_id) return;

     hoveredItemId = null; // Clear hover state
     updatingMatch = match.id;
     error = null;
     
     // Save scroll position and find the clicked match element
     const bracketContainer = document.querySelector('.traditional-bracket');
     let scrollLeft = 0;
     let matchOffsetLeft = 0;
     
     if (bracketContainer) {
       scrollLeft = bracketContainer.scrollLeft;
       // Try to find the match element from the event
       if (event && event.currentTarget) {
         const matchElement = event.currentTarget.closest('.match');
         if (matchElement) {
           const containerRect = bracketContainer.getBoundingClientRect();
           const matchRect = matchElement.getBoundingClientRect();
           matchOffsetLeft = matchRect.left - containerRect.left + scrollLeft;
         }
       }
     }
     
     try {
       await api.updateMatch(bracket.id, match.id, { winner_id: winnerId });
       // Reload the bracket to get fresh data from the server (including new rounds)
       await loadBracket();
       
       // Restore scroll position after DOM updates
       setTimeout(() => {
         const updatedContainer = document.querySelector('.traditional-bracket');
         if (updatedContainer) {
           if (matchOffsetLeft > 0) {
             // Try to scroll the match back into view (center it)
             updatedContainer.scrollLeft = matchOffsetLeft - (updatedContainer.clientWidth / 2);
           } else {
             // Fallback to saved scroll position
             updatedContainer.scrollLeft = scrollLeft;
           }
         }
       }, 100);
     } catch (e) {
       error = e instanceof Error ? e.message : "Failed to update match";
       console.error("Error selecting winner:", e);
     } finally {
       updatingMatch = null;
     }
   }

  function openClearWinnerModal(match) {
    if (!bracket || !match.winner_id) return;
    matchToClear = match;
    showClearWinnerModal = true;
  }

  async function handleClearWinnerConfirm() {
    if (!bracket || !matchToClear) return;

    updatingMatch = matchToClear.id;
    error = null;
    
    // Save scroll position before update
    const bracketContainer = document.querySelector('.traditional-bracket');
    const scrollLeft = bracketContainer ? bracketContainer.scrollLeft : 0;
    
    const match = matchToClear;
    matchToClear = null;
    
    try {
      await api.clearMatchWinner(bracket.id, match.id);
      // Reload the bracket to get fresh data from the server
      await loadBracket();
      
      // Restore scroll position after a brief delay to allow DOM update
      setTimeout(() => {
        if (bracketContainer) {
          bracketContainer.scrollLeft = scrollLeft;
        }
      }, 50);
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to clear match winner";
      console.error("Error clearing match winner:", e);
    } finally {
      updatingMatch = null;
    }
  }

  function handleClearWinnerCancel() {
    matchToClear = null;
  }

  function openResetModal() {
    if (!bracket) return;
    showResetModal = true;
  }

  async function handleResetConfirm() {
    if (!bracket) return;

    resetting = true;
    error = null;
    hoveredItemId = null;
    try {
      // Reset and reload the bracket to ensure fresh data
      await api.resetBracket(bracket.id);
      // Reload the bracket to get fresh data from the server
      await loadBracket();
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to reset bracket";
      console.error("Error resetting bracket:", e);
    } finally {
      resetting = false;
    }
  }

  function handleResetCancel() {
    // Modal will close automatically
  }

  function getMatchesByRound(round) {
    if (!bracket || !bracket.matches) return [];
    return bracket.matches.filter((m) => m != null && m.round === round);
  }

  function getItemName(itemId) {
    if (!bracket || !itemId) return "";
    const item = bracket.items.find((i) => i.id === itemId);
    return item ? item.name : "";
  }

  function isItemEliminated(itemId) {
    if (!bracket || !itemId) return false;
    const item = bracket.items.find((i) => i.id === itemId);
    return item ? item.eliminated : false;
  }

  function getLeftSideMatches(round) {
    if (!bracket) return [];
    const matches = getMatchesByRound(round).filter((m) => m != null);
    if (round === 1) {
      // Split first round: left side gets first half
      const midPoint = Math.floor(matches.length / 2);
      return matches.slice(0, midPoint);
    }
    // For subsequent rounds, left side gets first half
    if (matches.length > 1) {
      const midPoint = Math.floor(matches.length / 2);
      return matches.slice(0, midPoint);
    }
    return []; // Final round (1 match) goes in center only
  }

  function getRightSideMatches(round) {
    if (!bracket) return [];
    const matches = getMatchesByRound(round).filter((m) => m != null);
    if (round === 1) {
      // Split first round: right side gets second half
      const midPoint = Math.floor(matches.length / 2);
      return matches.slice(midPoint);
    }
    // For subsequent rounds, right side gets second half
    if (matches.length > 1) {
      const midPoint = Math.floor(matches.length / 2);
      return matches.slice(midPoint);
    }
    return []; // Final round (1 match) goes in center only
  }

  function getFinalMatch() {
    if (!bracket) return null;
    const finalRound = bracket.total_rounds;
    const finalMatches = getMatchesByRound(finalRound);
    return finalMatches && finalMatches.length > 0 ? finalMatches[0] : null;
  }

  function getCenterRounds() {
    if (!bracket) return [];
    // Get all rounds except round 1 and final
    const rounds = [];
    for (let round = 2; round < bracket.total_rounds; round++) {
      const matches = getMatchesByRound(round).filter((m) => m != null);
      // Always include the round structure, even if no matches yet
      rounds.push({ round, matches });
    }
    return rounds;
  }

  function getCurrentRound() {
    if (!bracket) return null;
    // Find the first round that has matches but not all are complete
    for (let round = 1; round <= bracket.total_rounds; round++) {
      const matches = getMatchesByRound(round).filter((m) => m != null);
      if (matches.length > 0) {
        const incompleteMatches = matches.filter((m) => !m.winner_id);
        if (incompleteMatches.length > 0) {
          return round;
        }
      }
    }
    // If all rounds are complete, return the final round
    return bracket.total_rounds;
  }
</script>

<svelte:head>
  <title>{bracket?.name || "Bracket"} - Bracket Builder</title>
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">Loading bracket...</div>
  {:else if error}
    <div class="error">{error}</div>
    <button class="btn btn-secondary" on:click={() => goto("/")}>Go Home</button
    >
  {:else if bracket}
    {#if error}
      <div class="error-banner">{error}</div>
    {/if}
    <header>
      <div class="header-top">
        <button class="btn-back" on:click={() => goto("/")}>← Back</button>
        <button
          class="btn-reset"
          on:click={openResetModal}
          disabled={resetting || bracket.status === "draft"}
          title="Reset bracket to start over"
        >
          {resetting ? "Resetting..." : "🔄 Reset Bracket"}
        </button>
      </div>
      <h1>{bracket.name}</h1>
      <p class="topic">{bracket.topic}</p>
      <div class="status-badge status-{bracket.status}">{bracket.status}</div>
    </header>

     <!-- Traditional Bracket Layout (always used) -->
     <div class="traditional-bracket">
       <div class="bracket-container-horizontal">
        <!-- Left Side - Round 1 -->
        <div class="bracket-column">
          {#if getLeftSideMatches(1).length > 0}
            {@const leftMatches = getLeftSideMatches(1)}
            {@const currentRound = getCurrentRound()}
            <div class="round">
              <h3
                class="round-title {1 === currentRound ? 'current-round' : ''}"
              >
                Round 1
              </h3>
              <div class="matches">
                {#each leftMatches as match}
                  {#if match}
                    <div class="match">
                      {#if match.winner_id}
                        <button
                          class="btn-clear-winner"
                          on:click={() => openClearWinnerModal(match)}
                          disabled={updatingMatch === match.id}
                          title="Clear winner to change selection"
                        >
                          {updatingMatch === match.id ? "..." : "✕"}
                        </button>
                      {/if}
                      <div
                        class="match-item {match.item1 &&
                        isItemEliminated(match.item1.id)
                          ? 'eliminated'
                          : ''} {match.winner_id === match.item1?.id
                          ? 'winner'
                          : ''} {hoveredItemId === match.item1?.id
                          ? 'hovered'
                          : ''}"
                        on:click={(e) =>
                          match.item1 &&
                          !match.winner_id &&
                          selectWinner(match, match.item1.id, e)}
                        on:mouseenter={() =>
                          match.item1 &&
                          !match.winner_id &&
                          (hoveredItemId = match.item1.id)}
                        on:mouseleave={() => (hoveredItemId = null)}
                        class:clickable={!match.winner_id && match.item1}
                        class:updating={updatingMatch === match.id}
                      >
                        {#if match.item1}
                          <span class="seed">#{match.item1.seed}</span>
                          <span class="name">{match.item1.name}</span>
                          {#if match.winner_id === match.item1.id}
                            <span class="check">✓</span>
                          {:else if !match.winner_id && hoveredItemId === match.item1.id}
                            <span class="select-hint">Click</span>
                          {/if}
                        {:else}
                          <span class="name empty">—</span>
                        {/if}
                      </div>
                      <div class="vs">vs</div>
                      <div
                        class="match-item {match.item2 &&
                        isItemEliminated(match.item2.id)
                          ? 'eliminated'
                          : ''} {match.winner_id === match.item2?.id
                          ? 'winner'
                          : ''} {hoveredItemId === match.item2?.id
                          ? 'hovered'
                          : ''}"
                        on:click={(e) =>
                          match.item2 &&
                          !match.winner_id &&
                          selectWinner(match, match.item2.id, e)}
                        on:mouseenter={() =>
                          match.item2 &&
                          !match.winner_id &&
                          (hoveredItemId = match.item2.id)}
                        on:mouseleave={() => (hoveredItemId = null)}
                        class:clickable={!match.winner_id && match.item2}
                        class:updating={updatingMatch === match.id}
                      >
                        {#if match.item2}
                          <span class="seed">#{match.item2.seed}</span>
                          <span class="name">{match.item2.name}</span>
                          {#if match.winner_id === match.item2.id}
                            <span class="check">✓</span>
                          {:else if !match.winner_id && hoveredItemId === match.item2.id}
                            <span class="select-hint">Click</span>
                          {/if}
                        {:else}
                          <span class="name empty">—</span>
                        {/if}
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Center Rounds - Round 2, 3, 4, etc. converging inward -->
        {#each getCenterRounds() as centerRound}
          {@const round = centerRound.round}
          {@const leftMatches = getLeftSideMatches(round)}
          {@const rightMatches = getRightSideMatches(round)}
          {@const currentRound = getCurrentRound()}
          {#if leftMatches.length > 0}
            <div class="bracket-column">
              <div class="round">
                <h3
                  class="round-title {round === currentRound
                    ? 'current-round'
                    : ''}"
                >
                  Round {round}
                </h3>
                <div class="matches">
                  {#each leftMatches as match}
                    {#if match}
                      <div class="match">
                        {#if match.winner_id}
                          <button
                            class="btn-clear-winner"
                            on:click={() => openClearWinnerModal(match)}
                            disabled={updatingMatch === match.id}
                            title="Clear winner to change selection"
                          >
                            {updatingMatch === match.id ? "..." : "✕"}
                          </button>
                        {/if}
                        <div
                          class="match-item {match.item1 &&
                          isItemEliminated(match.item1.id)
                            ? 'eliminated'
                            : ''} {match.winner_id === match.item1?.id
                            ? 'winner'
                            : ''} {hoveredItemId === match.item1?.id
                            ? 'hovered'
                            : ''}"
                          on:click={(e) =>
                            match.item1 &&
                            !match.winner_id &&
                            selectWinner(match, match.item1.id, e)}
                          on:mouseenter={() =>
                            match.item1 &&
                            !match.winner_id &&
                            (hoveredItemId = match.item1.id)}
                          on:mouseleave={() => (hoveredItemId = null)}
                          class:clickable={!match.winner_id && match.item1}
                          class:updating={updatingMatch === match.id}
                        >
                          {#if match.item1}
                            <span class="seed">#{match.item1.seed}</span>
                            <span class="name">{match.item1.name}</span>
                            {#if match.winner_id === match.item1.id}
                              <span class="check">✓</span>
                            {:else if !match.winner_id && hoveredItemId === match.item1.id}
                              <span class="select-hint">Click</span>
                            {/if}
                          {:else}
                            <span class="name empty">—</span>
                          {/if}
                        </div>
                        <div class="vs">vs</div>
                        <div
                          class="match-item {match.item2 &&
                          isItemEliminated(match.item2.id)
                            ? 'eliminated'
                            : ''} {match.winner_id === match.item2?.id
                            ? 'winner'
                            : ''} {hoveredItemId === match.item2?.id
                            ? 'hovered'
                            : ''}"
                          on:click={(e) =>
                            match.item2 &&
                            !match.winner_id &&
                            selectWinner(match, match.item2.id, e)}
                          on:mouseenter={() =>
                            match.item2 &&
                            !match.winner_id &&
                            (hoveredItemId = match.item2.id)}
                          on:mouseleave={() => (hoveredItemId = null)}
                          class:clickable={!match.winner_id && match.item2}
                          class:updating={updatingMatch === match.id}
                        >
                          {#if match.item2}
                            <span class="seed">#{match.item2.seed}</span>
                            <span class="name">{match.item2.name}</span>
                            {#if match.winner_id === match.item2.id}
                              <span class="check">✓</span>
                            {:else if !match.winner_id && hoveredItemId === match.item2.id}
                              <span class="select-hint">Click</span>
                            {/if}
                          {:else}
                            <span class="name empty">—</span>
                          {/if}
                        </div>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        {/each}

        <!-- Final Round - Center -->
        {#if getFinalMatch()}
          {@const finalMatch = getFinalMatch()}
          <div class="bracket-column bracket-final">
            <div class="round final-round">
              <h3 class="round-title">Final</h3>
              <div class="match">
                {#if finalMatch.winner_id}
                  <button
                    class="btn-clear-winner"
                    on:click={() => clearWinner(finalMatch)}
                    disabled={updatingMatch === finalMatch.id}
                    title="Clear winner to change selection"
                  >
                    {updatingMatch === finalMatch.id ? "..." : "✕"}
                  </button>
                {/if}
                <div
                  class="match-item {finalMatch.item1 &&
                  isItemEliminated(finalMatch.item1.id)
                    ? 'eliminated'
                    : ''} {finalMatch.winner_id === finalMatch.item1?.id
                    ? 'winner'
                    : ''} {hoveredItemId === finalMatch.item1?.id
                    ? 'hovered'
                    : ''}"
                    on:click={(e) =>
                      finalMatch.item1 &&
                      !finalMatch.winner_id &&
                      selectWinner(finalMatch, finalMatch.item1.id, e)}
                  on:mouseenter={() =>
                    finalMatch.item1 &&
                    !finalMatch.winner_id &&
                    (hoveredItemId = finalMatch.item1.id)}
                  on:mouseleave={() => (hoveredItemId = null)}
                  class:clickable={!finalMatch.winner_id && finalMatch.item1}
                  class:updating={updatingMatch === finalMatch.id}
                >
                  {#if finalMatch.item1}
                    <span class="seed">#{finalMatch.item1.seed}</span>
                    <span class="name">{finalMatch.item1.name}</span>
                    {#if finalMatch.winner_id === finalMatch.item1.id}
                      <span class="check">✓</span>
                    {:else if !finalMatch.winner_id && hoveredItemId === finalMatch.item1.id}
                      <span class="select-hint">Click</span>
                    {/if}
                  {:else}
                    <span class="name empty">—</span>
                  {/if}
                </div>
                <div class="vs">vs</div>
                <div
                  class="match-item {finalMatch.item2 &&
                  isItemEliminated(finalMatch.item2.id)
                    ? 'eliminated'
                    : ''} {finalMatch.winner_id === finalMatch.item2?.id
                    ? 'winner'
                    : ''} {hoveredItemId === finalMatch.item2?.id
                    ? 'hovered'
                    : ''}"
                    on:click={(e) =>
                      finalMatch.item2 &&
                      !finalMatch.winner_id &&
                      selectWinner(finalMatch, finalMatch.item2.id, e)}
                  on:mouseenter={() =>
                    finalMatch.item2 &&
                    !finalMatch.winner_id &&
                    (hoveredItemId = finalMatch.item2.id)}
                  on:mouseleave={() => (hoveredItemId = null)}
                  class:clickable={!finalMatch.winner_id && finalMatch.item2}
                  class:updating={updatingMatch === finalMatch.id}
                >
                  {#if finalMatch.item2}
                    <span class="seed">#{finalMatch.item2.seed}</span>
                    <span class="name">{finalMatch.item2.name}</span>
                    {#if finalMatch.winner_id === finalMatch.item2.id}
                      <span class="check">✓</span>
                    {:else if !finalMatch.winner_id && hoveredItemId === finalMatch.item2.id}
                      <span class="select-hint">Click</span>
                    {/if}
                  {:else}
                    <span class="name empty">—</span>
                  {/if}
                </div>
              </div>
            </div>
            {#if finalWinnerItem}
              <div class="champion-round">
                <h3 class="champion-title">🏆 Champion</h3>
                <div class="champion-card">
                  <div class="champion-seed">#{finalWinnerItem.seed}</div>
                  <div class="champion-name">{finalWinnerItem.name}</div>
                  <div class="champion-label">Winner</div>
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Center Rounds - Right side (reversed order) -->
        {#each getCenterRounds().slice().reverse() as centerRound}
          {@const round = centerRound.round}
          {@const rightMatches = getRightSideMatches(round)}
          {@const currentRound = getCurrentRound()}
          <div class="bracket-column">
            {#if rightMatches.length > 0}
              <div class="round">
                <h3
                  class="round-title {round === currentRound
                    ? 'current-round'
                    : ''}"
                >
                  Round {round}
                </h3>
                <div class="matches">
                  {#each rightMatches as match}
                    {#if match}
                      <div class="match">
                        {#if match.winner_id}
                          <button
                            class="btn-clear-winner"
                            on:click={() => openClearWinnerModal(match)}
                            disabled={updatingMatch === match.id}
                            title="Clear winner to change selection"
                          >
                            {updatingMatch === match.id ? "..." : "✕"}
                          </button>
                        {/if}
                        <div
                          class="match-item {match.item1 &&
                          isItemEliminated(match.item1.id)
                            ? 'eliminated'
                            : ''} {match.winner_id === match.item1?.id
                            ? 'winner'
                            : ''} {hoveredItemId === match.item1?.id
                            ? 'hovered'
                            : ''}"
                          on:click={(e) =>
                            match.item1 &&
                            !match.winner_id &&
                            selectWinner(match, match.item1.id, e)}
                          on:mouseenter={() =>
                            match.item1 &&
                            !match.winner_id &&
                            (hoveredItemId = match.item1.id)}
                          on:mouseleave={() => (hoveredItemId = null)}
                          class:clickable={!match.winner_id && match.item1}
                          class:updating={updatingMatch === match.id}
                        >
                          {#if match.item1}
                            <span class="seed">#{match.item1.seed}</span>
                            <span class="name">{match.item1.name}</span>
                            {#if match.winner_id === match.item1.id}
                              <span class="check">✓</span>
                            {:else if !match.winner_id && hoveredItemId === match.item1.id}
                              <span class="select-hint">Click</span>
                            {/if}
                          {:else}
                            <span class="name empty">—</span>
                          {/if}
                        </div>
                        <div class="vs">vs</div>
                        <div
                          class="match-item {match.item2 &&
                          isItemEliminated(match.item2.id)
                            ? 'eliminated'
                            : ''} {match.winner_id === match.item2?.id
                            ? 'winner'
                            : ''} {hoveredItemId === match.item2?.id
                            ? 'hovered'
                            : ''}"
                          on:click={(e) =>
                            match.item2 &&
                            !match.winner_id &&
                            selectWinner(match, match.item2.id, e)}
                          on:mouseenter={() =>
                            match.item2 &&
                            !match.winner_id &&
                            (hoveredItemId = match.item2.id)}
                          on:mouseleave={() => (hoveredItemId = null)}
                          class:clickable={!match.winner_id && match.item2}
                          class:updating={updatingMatch === match.id}
                        >
                          {#if match.item2}
                            <span class="seed">#{match.item2.seed}</span>
                            <span class="name">{match.item2.name}</span>
                            {#if match.winner_id === match.item2.id}
                              <span class="check">✓</span>
                            {:else if !match.winner_id && hoveredItemId === match.item2.id}
                              <span class="select-hint">Click</span>
                            {/if}
                          {:else}
                            <span class="name empty">—</span>
                          {/if}
                        </div>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/each}

        <!-- Right Side - Round 1 -->
        <div class="bracket-column">
          {#if getRightSideMatches(1).length > 0}
            {@const rightMatches = getRightSideMatches(1)}
            {@const currentRound = getCurrentRound()}
            <div class="round">
              <h3
                class="round-title {1 === currentRound ? 'current-round' : ''}"
              >
                Round 1
              </h3>
              <div class="matches">
                {#each rightMatches as match}
                  <div class="match">
                    {#if match.winner_id}
                      <button
                        class="btn-clear-winner"
                        on:click={() => clearWinner(match)}
                        disabled={updatingMatch === match.id}
                        title="Clear winner to change selection"
                      >
                        {updatingMatch === match.id ? "..." : "✕"}
                      </button>
                    {/if}
                    <div
                      class="match-item {match.item1 &&
                      isItemEliminated(match.item1.id)
                        ? 'eliminated'
                        : ''} {match.winner_id === match.item1?.id
                        ? 'winner'
                        : ''} {hoveredItemId === match.item1?.id
                        ? 'hovered'
                        : ''}"
                      on:click={() =>
                        match.item1 &&
                        !match.winner_id &&
                        selectWinner(match, match.item1.id)}
                      on:mouseenter={() =>
                        match.item1 &&
                        !match.winner_id &&
                        (hoveredItemId = match.item1.id)}
                      on:mouseleave={() => (hoveredItemId = null)}
                      class:clickable={!match.winner_id && match.item1}
                      class:updating={updatingMatch === match.id}
                    >
                      {#if match.item1}
                        <span class="seed">#{match.item1.seed}</span>
                        <span class="name">{match.item1.name}</span>
                        {#if match.winner_id === match.item1.id}
                          <span class="check">✓</span>
                        {:else if !match.winner_id && hoveredItemId === match.item1.id}
                          <span class="select-hint">Click</span>
                        {/if}
                      {:else}
                        <span class="name empty">—</span>
                      {/if}
                    </div>
                    <div class="vs">vs</div>
                    <div
                      class="match-item {match.item2 &&
                      isItemEliminated(match.item2.id)
                        ? 'eliminated'
                        : ''} {match.winner_id === match.item2?.id
                        ? 'winner'
                        : ''} {hoveredItemId === match.item2?.id
                        ? 'hovered'
                        : ''}"
                      on:click={() =>
                        match.item2 &&
                        !match.winner_id &&
                        selectWinner(match, match.item2.id)}
                      on:mouseenter={() =>
                        match.item2 &&
                        !match.winner_id &&
                        (hoveredItemId = match.item2.id)}
                      on:mouseleave={() => (hoveredItemId = null)}
                      class:clickable={!match.winner_id && match.item2}
                      class:updating={updatingMatch === match.id}
                    >
                      {#if match.item2}
                        <span class="seed">#{match.item2.seed}</span>
                        <span class="name">{match.item2.name}</span>
                        {#if match.winner_id === match.item2.id}
                          <span class="check">✓</span>
                        {:else if !match.winner_id && hoveredItemId === match.item2.id}
                          <span class="select-hint">Click</span>
                        {/if}
                      {:else}
                        <span class="name empty">—</span>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Reset Bracket Modal -->
<ConfirmModal
  bind:show={showResetModal}
  title="Reset Bracket"
  message="Are you sure you want to reset this bracket? All progress will be lost."
  confirmText="Reset"
  cancelText="Cancel"
  confirmClass="btn-danger"
  onConfirm={handleResetConfirm}
  onCancel={handleResetCancel}
/>

<!-- Clear Winner Modal -->
<ConfirmModal
  bind:show={showClearWinnerModal}
  title="Clear Match Winner"
  message="Are you sure you want to clear this match winner? This will also remove any subsequent rounds that depend on this match."
  confirmText="Clear"
  cancelText="Cancel"
  confirmClass="btn-danger"
  onConfirm={handleClearWinnerConfirm}
  onCancel={handleClearWinnerCancel}
/>

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .loading,
  .error {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  .error {
    color: #e74c3c;
  }

  .error-banner {
    background: #fee2e2;
    border: 2px solid #ef4444;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    color: #dc2626;
    font-weight: 600;
    text-align: center;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .btn-back {
    background: #f3f4f6;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #333;
    transition: background 0.2s;
  }

  .btn-back:hover {
    background: #e5e7eb;
  }

  .btn-reset {
    background: #fee2e2;
    border: 2px solid #ef4444;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #dc2626;
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-reset:hover:not(:disabled) {
    background: #fecaca;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }

  .btn-reset:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    color: #1a1a1a;
  }

  .topic {
    font-size: 1.2rem;
    color: #666;
    margin: 0 0 1rem 0;
  }

  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
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

  .bracket-container {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    padding: 1rem 0;
  }

  .round {
    min-width: 300px;
    flex-shrink: 0;
  }

  .round-title {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.5rem;
  }

  .matches {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .match {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .match-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 6px;
    background: #f9fafb;
    border: 2px solid transparent;
    transition: all 0.2s;
  }

  .match-item.clickable {
    cursor: pointer;
  }

  .match-item.clickable:hover,
  .match-item.hovered {
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    transform: translateX(4px);
    border: 2px solid #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .match-item.eliminated {
    opacity: 0.5;
    text-decoration: line-through;
  }

  .match-item.winner {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    font-weight: 600;
    border: 2px solid #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  }

  .match-item.updating {
    opacity: 0.6;
    pointer-events: none;
  }

  .seed {
    background: #667eea;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 2rem;
    text-align: center;
  }

  .name {
    flex: 1;
    font-size: 1rem;
  }

  .name.empty {
    color: #999;
    font-style: italic;
  }

  .check {
    color: #10b981;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .vs {
    text-align: center;
    color: #999;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.25rem 0;
  }

  .btn {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
    margin-top: 1rem;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #333;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
  }

  .select-hint {
    font-size: 0.75rem;
    color: #667eea;
    font-weight: 600;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  .champion-round {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 280px;
  }

  .champion-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .champion-card {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 3px solid #f59e0b;
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
    animation: champion-glow 2s ease-in-out infinite;
    min-width: 250px;
  }

  @keyframes champion-glow {
    0%,
    100% {
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
    }
    50% {
      box-shadow: 0 8px 32px rgba(245, 158, 11, 0.6);
    }
  }

  .champion-seed {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    display: inline-block;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);
  }

  .champion-name {
    font-size: 2rem;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 0.5rem;
  }

  .champion-label {
    font-size: 1rem;
    color: #78350f;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Traditional Bracket Layout */
  .traditional-bracket {
    width: 100%;
    overflow-x: auto;
    padding: 1rem 0;
  }

  .bracket-container-horizontal {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 1rem;
    min-width: fit-content;
  }

  .bracket-column {
    flex: 0 0 auto;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bracket-column .round {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bracket-column .round-title {
    text-align: center;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #555;
  }

  .bracket-column .matches {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .bracket-column .match {
    background: white;
    border-radius: 6px;
    padding: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
  }

  .bracket-column .match-item {
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
  }

  .bracket-column .match-item .seed {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }

  .bracket-column .match-item .name {
    font-size: 0.8rem;
  }

  .bracket-column .vs {
    font-size: 0.7rem;
    padding: 0.2rem 0;
  }

  .bracket-final {
    min-width: 200px;
  }

  .bracket-final .round-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #667eea;
  }

  .bracket-final .match {
    border: 2px solid #667eea;
    box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .bracket-final .match-item {
    padding: 0.5rem 0.6rem;
    font-size: 0.85rem;
  }

  .bracket-final .match-item .seed {
    font-size: 0.75rem;
  }

  .bracket-final .match-item .name {
    font-size: 0.9rem;
  }

  .bracket-column .champion-round {
    width: 100%;
    margin-top: 1rem;
  }

  /* Legacy styles - keeping for compatibility */
  .traditional-bracket-old {
    width: 100%;
    overflow-x: auto;
    padding: 2rem 0;
  }

  .bracket-container-horizontal {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 1rem;
    min-width: fit-content;
  }

  .bracket-column {
    flex: 0 0 auto;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bracket-column .round {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bracket-column .round-title {
    text-align: center;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #555;
  }

  .bracket-column .matches {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .bracket-column .match {
    background: white;
    border-radius: 6px;
    padding: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
  }

  .bracket-column .match-item {
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
  }

  .bracket-column .match-item .seed {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }

  .bracket-column .match-item .name {
    font-size: 0.8rem;
  }

  .bracket-column .vs {
    font-size: 0.7rem;
    padding: 0.2rem 0;
  }

  .bracket-final {
    min-width: 200px;
  }

  .bracket-final .round-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #667eea;
  }

  .bracket-final .match {
    border: 2px solid #667eea;
    box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .bracket-final .match-item {
    padding: 0.5rem 0.6rem;
    font-size: 0.85rem;
  }

  .bracket-final .match-item .seed {
    font-size: 0.75rem;
  }

  .bracket-final .match-item .name {
    font-size: 0.9rem;
  }

  .bracket-column .champion-round {
    width: 100%;
    margin-top: 1rem;
  }

  .round-title.current-round {
    font-size: 1.1rem;
    font-weight: 700;
    color: #667eea;
  }

  .match {
    position: relative;
  }

  .btn-clear-winner {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: #fee2e2;
    border: 1px solid #fca5a5;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
    color: #dc2626;
    transition: all 0.2s;
    z-index: 10;
    opacity: 0.7;
  }

  .btn-clear-winner:hover {
    opacity: 1;
    background: #fecaca;
    transform: scale(1.1);
  }

  .btn-clear-winner:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .center-round {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .center-round .round-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    text-align: center;
    color: #333;
  }

  .center-round .matches {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .center-round .match {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Final round styling */
  .center-round:last-of-type .round-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
  }

  .center-round:last-of-type .match {
    border: 2px solid #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    padding: 1.5rem;
  }

  .bracket-center .champion-round {
    width: 100%;
    margin-top: 1rem;
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
      max-width: 100%;
    }

    header {
      margin-bottom: 1.5rem;
    }

    .header-top {
      flex-direction: column;
      gap: 0.75rem;
      align-items: stretch;
    }

    .btn-back,
    .btn-reset {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
    }

    h1 {
      font-size: 1.75rem;
    }

    .topic {
      font-size: 1rem;
    }

    .status-badge {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }

    /* Traditional bracket - make it scrollable horizontally on mobile */
    .traditional-bracket {
      padding: 0.5rem 0;
      -webkit-overflow-scrolling: touch;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      position: relative;
      /* Add subtle gradient fade at edges to indicate scrollability */
      mask-image: linear-gradient(
        to right,
        transparent,
        black 10%,
        black 90%,
        transparent
      );
      -webkit-mask-image: linear-gradient(
        to right,
        transparent,
        black 10%,
        black 90%,
        transparent
      );
    }


    .bracket-container-horizontal {
      gap: 0.5rem;
      padding: 0 0.25rem;
    }

    .bracket-column {
      min-width: 110px;
    }

    .bracket-column .round-title {
      font-size: 0.75rem;
      margin-bottom: 0.4rem;
    }

    .bracket-column .round-title.current-round {
      font-size: 0.85rem;
    }

    .bracket-column .matches {
      gap: 0.3rem;
    }

    .bracket-column .match {
      padding: 0.25rem;
      gap: 0.15rem;
      font-size: 0.65rem;
    }

    .bracket-column .match-item {
      padding: 0.25rem 0.3rem;
      font-size: 0.6rem;
      min-height: 38px; /* Touch target size */
      display: flex;
      align-items: center;
      -webkit-tap-highlight-color: rgba(102, 126, 234, 0.2);
    }

    .bracket-column .match-item .seed {
      font-size: 0.55rem;
      padding: 0.06rem 0.2rem;
      min-width: 1.3rem;
    }

    .bracket-column .match-item .name {
      font-size: 0.6rem;
    }

    .bracket-column .vs {
      font-size: 0.6rem;
      padding: 0.1rem 0;
    }

    .bracket-final {
      min-width: 130px;
    }

    .bracket-final .round-title {
      font-size: 0.9rem;
    }

    .bracket-final .match {
      padding: 0.5rem;
      font-size: 0.75rem;
    }

    .bracket-final .match-item {
      padding: 0.4rem 0.45rem;
      font-size: 0.7rem;
      min-height: 44px;
      -webkit-tap-highlight-color: rgba(102, 126, 234, 0.2);
    }

    .bracket-final .match-item .seed {
      font-size: 0.65rem;
    }

    .bracket-final .match-item .name {
      font-size: 0.8rem;
    }

    .btn-clear-winner {
      top: 0.15rem;
      right: 0.15rem;
      padding: 0.25rem 0.35rem;
      font-size: 0.7rem;
      min-width: 36px;
      min-height: 36px;
      -webkit-tap-highlight-color: rgba(220, 38, 38, 0.2);
    }

    .champion-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .champion-card {
      padding: 1.5rem;
      min-width: auto;
      width: 100%;
    }

    .champion-name {
      font-size: 1.5rem;
    }

    .champion-seed {
      font-size: 0.9rem;
      padding: 0.4rem 0.8rem;
    }

    .champion-label {
      font-size: 0.9rem;
    }
  }

  /* Small mobile devices */
  @media (max-width: 480px) {
    .container {
      padding: 0.5rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .topic {
      font-size: 0.9rem;
    }

    .bracket-container-horizontal {
      gap: 0.4rem;
    }

    .bracket-column {
      min-width: 85px;
    }

    .bracket-column .round-title {
      font-size: 0.65rem;
      margin-bottom: 0.3rem;
    }

    .bracket-column .round-title.current-round {
      font-size: 0.75rem;
    }

    .bracket-column .matches {
      gap: 0.25rem;
    }

    .bracket-column .match {
      padding: 0.2rem;
      font-size: 0.6rem;
      gap: 0.12rem;
    }

    .bracket-column .match-item {
      padding: 0.2rem 0.25rem;
      font-size: 0.55rem;
      min-height: 36px;
    }

    .bracket-column .match-item .seed {
      font-size: 0.5rem;
      padding: 0.04rem 0.15rem;
      min-width: 1.1rem;
    }

    .bracket-column .match-item .name {
      font-size: 0.55rem;
    }

    .bracket-column .vs {
      font-size: 0.55rem;
      padding: 0.08rem 0;
    }

    .bracket-final {
      min-width: 110px;
    }

    .bracket-final .round-title {
      font-size: 0.8rem;
    }

    .bracket-final .match {
      padding: 0.35rem;
      font-size: 0.7rem;
    }

    .bracket-final .match-item {
      padding: 0.3rem 0.35rem;
      font-size: 0.6rem;
      min-height: 40px;
    }

    .bracket-final .match-item .seed {
      font-size: 0.6rem;
    }

    .bracket-final .match-item .name {
      font-size: 0.7rem;
    }

    .btn-clear-winner {
      top: 0.1rem;
      right: 0.1rem;
      padding: 0.2rem 0.3rem;
      font-size: 0.65rem;
      min-width: 32px;
      min-height: 32px;
    }

    .champion-title {
      font-size: 1.25rem;
    }

    .champion-card {
      padding: 1.25rem;
    }

    .champion-name {
      font-size: 1.25rem;
    }
  }

  /* Extra small mobile devices */
  @media (max-width: 360px) {
    .container {
      padding: 0.4rem;
    }

    h1 {
      font-size: 1.25rem;
    }

    .topic {
      font-size: 0.85rem;
    }

    .bracket-container-horizontal {
      gap: 0.35rem;
    }

    .bracket-column {
      min-width: 75px;
    }

    .bracket-column .round-title {
      font-size: 0.6rem;
      margin-bottom: 0.25rem;
    }

    .bracket-column .round-title.current-round {
      font-size: 0.7rem;
    }

    .bracket-column .matches {
      gap: 0.2rem;
    }

    .bracket-column .match {
      padding: 0.15rem;
      font-size: 0.55rem;
      gap: 0.08rem;
    }

    .bracket-column .match-item {
      padding: 0.15rem 0.2rem;
      font-size: 0.5rem;
      min-height: 32px;
    }

    .bracket-column .match-item .seed {
      font-size: 0.45rem;
      padding: 0.03rem 0.12rem;
      min-width: 0.9rem;
    }

    .bracket-column .match-item .name {
      font-size: 0.5rem;
    }

    .bracket-column .vs {
      font-size: 0.5rem;
      padding: 0.06rem 0;
    }

    .bracket-final {
      min-width: 100px;
    }

    .bracket-final .round-title {
      font-size: 0.75rem;
    }

    .bracket-final .match {
      padding: 0.3rem;
      font-size: 0.65rem;
    }

    .bracket-final .match-item {
      padding: 0.25rem 0.3rem;
      font-size: 0.55rem;
      min-height: 36px;
    }

    .bracket-final .match-item .seed {
      font-size: 0.55rem;
    }

    .bracket-final .match-item .name {
      font-size: 0.65rem;
    }

    .btn-clear-winner {
      min-width: 26px;
      min-height: 26px;
      font-size: 0.55rem;
      padding: 0.12rem 0.2rem;
    }
  }

  /* Landscape mobile orientation */
  @media (max-width: 768px) and (orientation: landscape) {
    .bracket-column {
      min-width: 150px;
    }

    .bracket-column .match-item {
      min-height: 40px;
    }
  }
</style>
