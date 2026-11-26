<script setup>
import { isAuthenticated } from '@/services/auth'

defineProps({
  contact: { type: Object, required: true },
})

// The card only signals the intent; the list owns the data and the deletion.
defineEmits(['delete'])
</script>

<template>
  <article class="card contact-card">
    <img :src="contact.picture" :alt="`Picture of ${contact.name}`" class="avatar" />
    <h2 class="name">{{ contact.name }}</h2>

    <dl class="details">
      <dt>ID</dt>
      <dd>{{ contact.id }}</dd>
      <dt>Contact</dt>
      <dd>{{ contact.contact }}</dd>
      <dt>Email</dt>
      <dd>{{ contact.email }}</dd>
    </dl>

    <div class="card-actions">
      <RouterLink
        :to="{ name: 'contact-details', params: { id: contact.id } }"
        class="button secondary"
      >
        Details
      </RouterLink>
      <!-- Editing and deleting require an authenticated user. -->
      <template v-if="isAuthenticated">
        <RouterLink
          :to="{ name: 'contact-edit', params: { id: contact.id } }"
          class="button secondary"
        >
          Edit
        </RouterLink>
        <button type="button" class="button danger" @click="$emit('delete')">Delete</button>
      </template>
    </div>
  </article>
</template>

<style scoped>
.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 50%;
}

.name {
  margin: 0.75rem 0 0.5rem;
  font-size: 1.15rem;
  word-break: break-word;
}

.details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.25rem 0.75rem;
  margin: 0 0 1rem;
  text-align: left;
  font-size: 0.9rem;
}

.details dt {
  font-weight: 600;
}

.details dd {
  margin: 0;
  word-break: break-all;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
}
</style>