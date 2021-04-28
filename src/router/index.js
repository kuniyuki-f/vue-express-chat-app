import Vue from 'vue'
import VueRouter from 'vue-router'
import room from '@/views/chat.vue';
import login from '@/views/login.vue';
import entry from '@/views/entry.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: room
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/entry',
    component: entry
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
