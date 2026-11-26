<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/services/auth'

const router = useRouter()
const route = useRoute()

const credentials = reactive({ username: '', password: '' })
const error = ref('')

function onSubmit() {
  if (!login(credentials.username, credentials.password)) {
    error.value = 'Invalid username or password.'
    return
  }

  // Return to the page the user originally tried to open (internal paths only).
  const { redirect } = route.query
  const target = typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/'
  router.push(target)
}
</script>

<template>
  <section class="card form-card">
    <h1>Login</h1>

    <form novalidate @submit.prevent="onSubmit">
      <div class="field">
        <label for="username">Username</label>
        <input id="username" v-model="credentials.username" type="text" autocomplete="username" />
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="credentials.password"
          type="password"
          autocomplete="current-password"
        />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="actions">
        <button type="submit" class="button">Login</button>
      </div>
    </form>
  </section>
</template>