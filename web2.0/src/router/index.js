import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const router = new VueRouter({
  linkActiveClass: 'selected',
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'layout',
      component: () => import('@/views/Layout.vue'),
      children: [
        { path: '/home', name: 'home', component: () => import('@/views/Home.vue') },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },


    // { path: "/platForm", name: 'platForm', meta: { requiresAuth: true }, component: () => import( /* webpackChunkName: "about" */ '../views/Merchant/PlatForm.vue') },       
  ]
})

export default router