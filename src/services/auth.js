import { computed, ref } from 'vue'

const STORAGE_KEY = 'auth_user'

// No backend: authentication is simulated client-side with demo credentials.
// Real authentication must be validated by a server.
const DEMO_USER = { username: 'admin', password: 'admin123' }

// Shared reactive state, so the header and the router guard stay in sync.
const currentUser = ref(localStorage.getItem(STORAGE_KEY))

export const isAuthenticated = computed(() => currentUser.value !== null)

export function login(username, password) {
  const isValid = username === DEMO_USER.username && password === DEMO_USER.password

  if (isValid) {
    currentUser.value = username
    localStorage.setItem(STORAGE_KEY, username)
  }

  return isValid
}

export function logout() {
  currentUser.value = null
  localStorage.removeItem(STORAGE_KEY)
}