import { createRouter, createWebHashHistory } from 'vue-router'
import ContactListView from '@/views/ContactListView.vue'

const router = createRouter({
  // Hash mode: the app is served as static files, so deep links and
  // page refreshes work without any server-side rewrite rules.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'contacts',
      component: ContactListView,
    },
    {
      path: '/contacts/new',
      name: 'contact-create',
      component: () => import('@/views/ContactFormView.vue'),
    },
    {
      // Same view as create (spec: reuse the add contact view for editing).
      path: '/contacts/:id/edit',
      name: 'contact-edit',
      component: () => import('@/views/ContactFormView.vue'),
      props: true,
    },
    {
      path: '/contacts/:id',
      name: 'contact-details',
      component: () => import('@/views/ContactDetailsView.vue'),
      props: true,
    },
    {
      // Unknown URLs go back to the contact list.
      path: '/:pathMatch(.*)*',
      redirect: { name: 'contacts' },
    },
  ],
})

export default router