<script>
  export let show = false;
  export let title = "Confirm";
  export let message = "Are you sure?";
  export let confirmText = "Confirm";
  export let cancelText = "Cancel";
  export let confirmClass = "btn-primary";
  export let onConfirm = () => {};
  export let onCancel = () => {};

  function handleConfirm() {
    onConfirm();
    show = false;
  }

  function handleCancel() {
    onCancel();
    show = false;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }
</script>

{#if show}
  <div class="modal-backdrop" on:click={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-content" on:click|stopPropagation>
      <h3 id="modal-title" class="modal-title">{title}</h3>
      <p class="modal-message">{message}</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" on:click={handleCancel}>
          {cancelText}
        </button>
        <button class="btn {confirmClass}" on:click={handleConfirm}>
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.2s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-title {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    color: #1a1a1a;
    font-weight: 600;
  }

  .modal-message {
    margin: 0 0 1.5rem 0;
    color: #666;
    line-height: 1.5;
    font-size: 1rem;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #333;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-danger {
    background: #ef4444;
    color: white;
  }

  .btn-danger:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 0.5rem;
    }

    .modal-content {
      padding: 1.25rem;
      max-width: 100%;
    }

    .modal-title {
      font-size: 1.25rem;
    }

    .modal-message {
      font-size: 0.95rem;
      margin-bottom: 1.25rem;
    }

    .modal-actions {
      flex-direction: column-reverse;
      gap: 0.5rem;
    }

    .btn {
      width: 100%;
      padding: 0.875rem 1.25rem;
    }
  }
</style>

