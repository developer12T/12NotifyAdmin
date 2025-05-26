export default {
    path: '/',
    // component: () => import('../views/manageDrug/layout.vue'),
    redirect: '/dashboard',
    children: [
        { path: '/dashboard', component: () => import('../../src/views/dashboardView.vue') },
        { path: '/announcement', component: () => import('../views/announcementView.vue') },
        { path: '/develop', component: () => import('../views/developView.vue') },
        { path: '/chatGroup', component: () => import('../views/chatGroupView.vue') },
        { path: '/profile', component: () => import('../views/profileView.vue') },
        { path: '/employee', component: () => import('../views/employeeView.vue') },
    ]
};  