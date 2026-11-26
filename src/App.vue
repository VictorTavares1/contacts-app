<template>
  <header class="app-header">
    <RouterLink :to="{ name: 'contacts' }" class="brand">Contacts</RouterLink>
    <RouterLink :to="{ name: 'contact-create' }" class="button">Add contact</RouterLink>
  </header>

  <main class="app-main">
    <!--
      Keyed by full path: create and edit share the same component,
      so this forces a fresh instance (and a clean form) on every route change.
    -->
    <RouterView :key="$route.fullPath" />
  </main>
</template>

<!-- Global (unscoped) styles: base layout and shared UI classes used across all views. -->
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
</style>