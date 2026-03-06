import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Writing from '@/views/Writing.vue'
import Stats from '@/views/Stats.vue'
import Review from '@/views/Review.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/writing',
      name: 'writing',
      component: Writing,
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats,
    },
    {
      path: '/review',
      name: 'review',
      component: Review,
    },
  ],
})

export default router
