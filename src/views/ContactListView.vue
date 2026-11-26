<script setup>
import { ref } from 'vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ContactCard from '@/components/ContactCard.vue'
import { getAll, remove } from '@/services/contacts'

const contacts = ref(getAll())

// The contact pending deletion; non-null means the modal is open.
const contactToDelete = ref(null)

function deleteContact() {
  remove(contactToDelete.value.id)
  contacts.value = getAll()
  contactToDelete.value = null
}
</script>

<template>
  <h1>Contacts</h1>

  <p v-if="contacts.length === 0" class="empty">
    No contacts yet.
    <RouterLink :to="{ name: 'contact-create' }">Add the first one</RouterLink>.
  </p>

  <div v-else class="contact-grid">
    <ContactCard
      v-for="contact in contacts"
      :key="contact.id"
      :contact="contact"
      @delete="contactToDelete = contact"
    />
  </div>

  <ConfirmModal
    :open="contactToDelete !== null"
    title="Delete contact"
    :message="`Are you sure you want to delete ${contactToDelete?.name ?? 'this contact'}? This cannot be undone.`"
    confirm-label="Delete"
    @confirm="deleteContact"
    @cancel="contactToDelete = null"
  />
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.empty {
  color: #52606d;
}
</style>