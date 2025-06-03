import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores';

const routes = [
  { path: '/', name: 'Login', component: () => import('../authentication/login.vue'), props: true },
  {
    path: '/12chat-manage',
    redirect: '/dashboard',
    children: [
      { path: '/dashboard', component: () => import('../views/dashboardView.vue') },
      { path: '/announcement', component: () => import('../views/announcementView.vue') },
      { path: '/develop', component: () => import('../views/developView.vue') },
      { path: '/chatGroup', component: () => import('../views/chatGroupView.vue') },
      { path: '/profile', component: () => import('../views/profileView.vue') },
      { path: '/employee', component: () => import('../views/employeeView.vue') },
    ]
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: async (to, from, next) => {
      const authStore = useAuthStore();
      await authStore.logout();
      next('/');
    },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to) => {
    const publicPages = ['/'];
    const authRequired = !publicPages.includes(to.path);
    const authStore = useAuthStore();

    if (authRequired && !authStore.isLoggedIn) {
        authStore.returnUrl = to.fullPath;
        return '/';
    }
});

export default router;
