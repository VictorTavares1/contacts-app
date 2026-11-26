<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirm' },
})

const emit = defineEmits(['confirm', 'cancel'])

const dialog = ref(null)

// Keep the native <dialog> in sync with the "open" prop.
watch(
  () => props.open,
  (isOpen) => (isOpen ? dialog.value?.showModal() : dialog.value?.close()),
)
</script>

<template>
  <!-- Native <dialog>: built-in backdrop, focus handling and Esc support. -->
  <dialog ref="dialog" class="modal" @cancel.prevent="emit('cancel')">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>

    <div class="modal-actions">
      <button type="button" class="button secondary" @click="emit('cancel')">Cancel</button>
      <button type="button" class="button danger" @click="emit('confirm')">
        {{ confirmLabel }}
      </button>
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  max-width: 400px;
  width: calc(100% - 2rem);
  padding: 1.5rem;
  border: none;
  border-radius: 10px;
}

.modal::backdrop {
  background: rgb(0 0 0 / 0.4);
}

.modal h2 {
  margin-top: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>