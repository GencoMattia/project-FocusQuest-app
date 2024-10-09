import PageDashboard from '@/pages/PageDashboard.vue'
import PageHome from '@/pages/PageHome.vue'
import PageLogin from '@/pages/PageLogin.vue'
import PageProfile from '@/pages/PageProfile.vue'
import PageSignIn from '@/pages/PageSignIn.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PageHome
    },
    {
      path: '/login',
      name: 'login',
      component: PageLogin
    },
    {
      path: '/sign-in',
      name: 'signin',
      component: PageSignIn
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: PageDashboard,
      meta: { requireAuth: true },
    },
    {
      path: '/profile/:nameSurname',
      name: 'profile',
      component: PageProfile,
      meta: { requireAuth: true },
    },
    {
      path: '/create-new-task',
      name: "create.new.task",
      component: CreateNewTask
    }
  ]
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!token) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router
