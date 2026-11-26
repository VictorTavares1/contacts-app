import { createRouter, createWebHashHistory } from 'vue-router'
import ContactListView from '@/views/ContactListView.vue'
import { isAuthenticated } from '@/services/auth'

const router = createRouter({
  // Hash mode: the app is served as static files, so deep links and
  // page refreshes work without any server-side rewrite rules.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Public: anyone can see the contact list.
      path: '/',
      name: 'contacts',
      component: ContactListView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/contacts/new',
      name: 'contact-create',
      component: () => import('@/views/ContactFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      // Same view as create (spec: reuse the add contact view for editing).
      path: '/contacts/:id/edit',
      name: 'contact-edit',
      component: () => import('@/views/ContactFormView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/contacts/:id',
      name: 'contact-details',
      component: () => import('@/views/ContactDetailsView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      // Unknown URLs go back to the contact list.
      path: '/:pathMatch(.*)*',
      redirect: { name: 'contacts' },
    },
  ],
})

// Protected routes redirect to login, remembering where the user wanted to go.
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && isAuthenticated.value) {
    return { name: 'contacts' }
  }
})

export default router