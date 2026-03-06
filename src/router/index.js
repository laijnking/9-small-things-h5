import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Writing from '@/views/Writing.vue'
import Organize from '@/views/Organize.vue'
import Expense from '@/views/Expense.vue'
import Learning from '@/views/Learning.vue'
import Stats from '@/views/Stats.vue'
import Review from '@/views/Review.vue'
import Settings from '@/views/Settings.vue'
import Reading from '@/views/Reading.vue'
import Contact from '@/views/Contact.vue'
import EarlyRise from '@/views/EarlyRise.vue'
import Exercise from '@/views/Exercise.vue'
import Bedtime from '@/views/Bedtime.vue'

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
      path: '/organize',
      name: 'organize',
      component: Organize,
    },
    {
      path: '/expense',
      name: 'expense',
      component: Expense,
    },
    {
      path: '/learning',
      name: 'learning',
      component: Learning,
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
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/reading',
      name: 'reading',
      component: Reading,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
    },
    {
      path: '/early-rise',
      name: 'earlyRise',
      component: EarlyRise,
    },
    {
      path: '/exercise',
      name: 'exercise',
      component: Exercise,
    },
    {
      path: '/bedtime',
      name: 'bedtime',
      component: Bedtime,
    },
  ],
})

export default router
