import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Profile from '../views/ProfileView.vue'
import NewEvent from '../views/NewEventView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/init',
    name: 'initProfile',
    component: () => import('../views/InitProfileView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/verify',
    name: 'verify',
    component: () => import('../views/VerifyView.vue')
  },
  {
    path: '/event/new',
    name: "newEvent",
    component: NewEvent,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
