import PageDashboard from '@/pages/PageDashboard.vue'
import PageHome from '@/pages/PageHome.vue'
import PageLogin from '@/pages/PageLogin.vue'
import PageProfile from '@/pages/PageProfile.vue'
import PageSignIn from '@/pages/PageSignIn.vue'
import CreateNewTask from '@/pages/CreateNewTask.vue'
import { createRouter, createWebHistory } from 'vue-router'
import PageTaskIndex from '@/pages/PageTaskIndex.vue'
import CreateNewMoment from '@/pages/CreateNewMoment.vue'
import PageTaskShow from '@/pages/PageTaskShow.vue'


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
      component: CreateNewTask,
      meta: {requireAuth: true}
    },
    {
      path: '/tasks',
      name: "user.task.list",
      component: PageTaskIndex,
      meta: {requireAuth: true}
    },
    {
      path: '/tasks/:id',
      name: 'show.task',
      component: PageTaskShow,
      meta: {requireAuth: true}
    },
    {
      path: '/tasks/:id/create-new-moment',
      name: "create.new.moment",
      component: CreateNewMoment,
      meta: {requireAuth: true},
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
