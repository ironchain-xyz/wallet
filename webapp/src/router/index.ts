import { createRouter, createWebHistory } from 'vue-router'
import Records from '..//views/RecordsView.vue'
import Profile from '../views/ProfileView.vue'
import Spaces from '../views/SpacesView.vue'
import Space from '../views/SpaceView.vue'
import NewRecord from '../views/NewRecordView.vue'
import Record from '../views/RecordView.vue'

const routes = [
  {
    path: '/',
    name: 'spaces',
    component: Spaces
  },
  {
    path: '/space/:id',
    name: 'space',
    component: Space
  },
  {
    path: '/records',
    name: 'records',
    component: Records
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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
