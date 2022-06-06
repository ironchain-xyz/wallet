import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Profile from '../views/ProfileView.vue'
import NewRecord from '../views/NewRecordView.vue'
import Record from '../views/RecordView.vue'

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
    path: '/record/new',
    name: "newRecord",
    component: NewRecord,
  },
  {
    path: '/record/:hash',
    name: "record",
    component: Record,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
