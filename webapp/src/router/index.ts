import { createRouter, createWebHistory } from 'vue-router'
import Materials from '../views/MaterialsView.vue'
import Profile from '../views/ProfileView.vue'
import ProfileAbout from '../views/ProfileAboutView.vue'
import Spaces from '../views/SpacesView.vue'
import Space from '../views/SpaceView.vue'
import SpaceNewMaterial from '../views/SpaceNewMaterialView.vue'
import SpaceAbout from '../views/SpaceAboutView.vue'
import Material from '../views/MaterialView.vue'

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
    path: '/space/:id/newMaterial',
    name: 'newMaterial',
    component: SpaceNewMaterial
  },
  {
    path: '/space/:id/about',
    name: 'spaceAbout',
    component: SpaceAbout
  },
  {
    path: '/materials',
    name: 'materials',
    component: Materials
  },
  {
    path: '/material/:hash',
    name: "material",
    component: Material,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/profile/about',
    name: 'profileAbout',
    component: ProfileAbout
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
