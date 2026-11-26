<script setup>
import { getById } from '@/services/contacts'

const props = defineProps({
  id: { type: String, required: true },
})

// The view is recreated on every route change (keyed RouterView),
// so reading the contact once is enough.
const contact = getById(props.id)
</script>

<template>
  <section v-if="contact" class="card details-card">
    <img :src="contact.picture" :alt="`Picture of ${contact.name}`" class="picture" />

    <dl class="fields">
      <dt>ID</dt>
      <dd>{{ contact.id }}</dd>
      <dt>Name</dt>
      <dd>{{ contact.name }}</dd>
      <dt>Contact</dt>
      <dd>{{ contact.contact }}</dd>
      <dt>Email</dt>
      <dd>
        <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
      </dd>
    </dl>

    <div class="details-actions">
      <RouterLink :to="{ name: 'contacts' }" class="button secondary">Back to list</RouterLink>
      <RouterLink :to="{ name: 'contact-edit', params: { id: contact.id } }" class="button">
        Edit
      </RouterLink>
    </div>
  </section>

  <section v-else class="card details-card">
    <h1>Contact not found</h1>
    <p>This contact does not exist or was deleted.</p>
    <RouterLink :to="{ name: 'contacts' }" class="button secondary">Back to list</RouterLink>
  </section>
</template>

<style scoped>
.details-card {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
}

.picture {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 50%;
}

.fields {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  margin: 1.5rem 0;
  text-align: left;
}

.fields dt {
  font-weight: 600;
}

.fields dd {
  margin: 0;
  word-break: break-all;
}

.details-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>