import { createRouter, createWebHistory } from 'vue-router'
import ProfileMaterials from '../views/ProfileMaterialsView.vue'
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
    path: '/material/:hash',
    name: "material",
    component: Material,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileMaterials
  },
  {
    path: '/profile/about',
    name: 'profileAbout',
    component: ProfileAbout
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
