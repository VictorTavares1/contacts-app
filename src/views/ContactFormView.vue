<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { create, getById, update, validate } from '@/services/contacts'
import { imageFileToDataUrl } from '@/utils/image'

const props = defineProps({
  // Present only on the edit route.
  id: { type: String, default: null },
})

const router = useRouter()

// Text inputs share the same markup, so they are rendered from config.
const TEXT_FIELDS = [
  { key: 'name', label: 'Name', type: 'text', autocomplete: 'name' },
  { key: 'contact', label: 'Contact', type: 'tel', inputmode: 'numeric', autocomplete: 'tel' },
  { key: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
]

const isEditing = props.id !== null
const existingContact = isEditing ? getById(props.id) : null

// Editing a contact that does not exist: go back to the list.
if (isEditing && !existingContact) {
  router.replace({ name: 'contacts' })
}

const form = reactive({
  name: existingContact?.name ?? '',
  contact: existingContact?.contact ?? '',
  email: existingContact?.email ?? '',
  picture: existingContact?.picture ?? '',
})

const errors = ref({})

async function onPictureChange(event) {
  const [file] = event.target.files
  if (!file) return

  try {
    form.picture = await imageFileToDataUrl(file)
    delete errors.value.picture
  } catch (error) {
    form.picture = ''
    errors.value = { ...errors.value, picture: error.message }
  }
}

function onSubmit() {
  errors.value = validate(form, props.id)
  if (Object.keys(errors.value).length > 0) return

  try {
    const saved = isEditing ? update(props.id, form) : create(form)
    router.push({ name: 'contact-details', params: { id: saved.id } })
  } catch {
    // localStorage throws when its quota is exceeded.
    errors.value = { form: 'Could not save the contact. Storage may be full.' }
  }
}
</script>

<template>
  <section class="card form-card">
    <h1>{{ isEditing ? 'Edit contact' : 'Add contact' }}</h1>

    <!-- novalidate: show our validation messages instead of the browser's. -->
    <form novalidate @submit.prevent="onSubmit">
      <div v-for="field in TEXT_FIELDS" :key="field.key" class="field">
        <label :for="field.key">{{ field.label }}</label>
        <input
          :id="field.key"
          v-model="form[field.key]"
          :type="field.type"
          :inputmode="field.inputmode"
          :autocomplete="field.autocomplete"
          :class="{ invalid: errors[field.key] }"
        />
        <p v-if="errors[field.key]" class="error">{{ errors[field.key] }}</p>
      </div>

      <div class="field">
        <label for="picture">Picture</label>
        <img v-if="form.picture" :src="form.picture" alt="Picture preview" class="preview" />
        <input id="picture" type="file" accept="image/*" @change="onPictureChange" />
        <p v-if="errors.picture" class="error">{{ errors.picture }}</p>
      </div>

      <p v-if="errors.form" class="error">{{ errors.form }}</p>

      <div class="actions">
        <RouterLink :to="{ name: 'contacts' }" class="button secondary">Cancel</RouterLink>
        <button type="submit" class="button">
          {{ isEditing ? 'Save changes' : 'Create contact' }}
        </button>
      </div>
    </form>
  </section>
</template>

<!-- Form, field and button styles are global (App.vue); only the preview is specific here. -->
<style scoped>
.preview {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 50%;
}
</style>