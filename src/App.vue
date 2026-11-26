<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '@/services/auth'

const router = useRouter()

function onLogout() {
  logout()
  router.push({ name: 'contacts' })
}
</script>

<template>
  <header class="app-header">
    <RouterLink :to="{ name: 'contacts' }" class="brand">Contacts</RouterLink>

    <nav class="nav">
      <template v-if="isAuthenticated">
        <RouterLink :to="{ name: 'contact-create' }" class="button">Add contact</RouterLink>
        <button type="button" class="button secondary" @click="onLogout">Logout</button>
      </template>
      <RouterLink v-else :to="{ name: 'login' }" class="button">Login</RouterLink>
    </nav>
  </header>

  <main class="app-main">
    <!--
      Keyed by full path: create and edit share the same component,
      so this forces a fresh instance (and a clean form) on every route change.
    -->
    <RouterView :key="$route.fullPath" />
  </main>
</template>

<!-- Global (unscoped) styles: base layout and UI classes shared across views. -->
<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f5f6f8;
  color: #1f2933;
}

h1 {
  margin-top: 0;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #fff;
  border-bottom: 1px solid #e1e4e8;
}

.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.app-main {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.card {
  background: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 10px;
  padding: 1.5rem;
}

/* Buttons work on both <button> and <RouterLink>. */
.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: #fff;
  font-size: 0.95rem;
  text-decoration: none;
  cursor: pointer;
}

.button.secondary {
  background: #e5e7eb;
  color: #1f2933;
}

.button.danger {
  background: #dc2626;
}

/* Forms: shared by the contact form and the login page. */
.form-card {
  max-width: 520px;
  margin: 0 auto;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.field label {
  font-weight: 600;
}

.field input:not([type='file']) {
  padding: 0.55rem 0.7rem;
  border: 1px solid #cbd2d9;
  border-radius: 6px;
  font-size: 1rem;
}

.field input.invalid {
  border-color: #dc2626;
}

.error {
  margin: 0;
  color: #dc2626;
  font-size: 0.875rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>