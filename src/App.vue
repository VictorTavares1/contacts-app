<template>
  <header class="app-header">
    <RouterLink :to="{ name: 'contacts' }" class="brand">Contacts</RouterLink>
    <RouterLink :to="{ name: 'contact-create' }" class="button">Add contact</RouterLink>
  </header>

  <main class="app-main">
    <RouterView />
  </main>
</template>

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