import Vue from 'vue'
import VueRouter from 'vue-router'
import { getCookie } from '@/facade'


Vue.use(VueRouter)
const routerReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(error => error)
}
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export const router = new VueRouter({
  linkActiveClass: 'selected',
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/login',name: 'login',component: () => import('@/views/Login.vue')},
    { path: '/reg',name: 'reg',component: () => import('@/views/Reg.vue')},
    { path: "/blank", name: 'blank', meta: { requiresAuth: true }, component: () => import( /* webpackChunkName: "about" */ '@/views/Blank.vue') },
    {
      path: '/',
      name: 'layout',
      component: () => import('@/views/Layout.vue'),
      redirect:{ path: '/userCenter' },
      children: [
        { path: "/userCenter", name: 'userCenter', meta: { requiresAuth: true}, component: () => import('@/views/UserCenter.vue')},
        /**admin */
        { path: "/sysInfo", name: 'sysInfo', meta: { requiresAuth: true}, component: () => import('@/views/Admin/AdHome/SysInfo.vue')},
        { path: "/merchantList", name: 'merchantList', meta: { requiresAuth: true}, component: () => import('@/views/Admin/MerchantList.vue')},
        { path: "/sysSet", name: 'sysSet', meta: { requiresAuth: true}, component: () => import('@/views/Admin/SysSet.vue')},
        /**merchant */
        { path: "/merSysStatist", name: 'merSysStatist', meta: { requiresAuth: true}, component: () => import('@/views/Merchant/MerHome/MerSysStatist.vue')},
        { path: "/merInfo", name: 'merInfo', meta: { requiresAuth: true}, component: () => import('@/views/Merchant/MerHome/MerInfo.vue')},
        { path: "/merCashList", name: 'merCashList', meta: { requiresAuth: true}, component: () => import('@/views/Merchant/MerCashList.vue')},
        { path: "/merFlow", name: 'merFlow', meta: { requiresAuth: true}, component: () => import('@/views/Merchant/MerFlow.vue')},
        { path: "/merFounds", name: 'merFounds', meta: { requiresAuth: true}, component: () => import('@/views/Merchant/MerFounds.vue')},
        { path: "/merOrder", name: 'merOrder', meta: { requiresAuth: true}, component: () => import('@/views/Merchant/MerOrder.vue')},
        { path: "/merOther", name: 'merOther', meta: { requiresAuth: true}, component: () => import('@/views/Merchant/MerOther.vue')},
        { path: "/merVerderList", name: 'merVerderList', meta: { requiresAuth: true}, component: () => import('@/views/Merchant/MerVerderList.vue')},
        /**码商verder */
        { path: "/verderInfo", name: 'verderInfo', meta: { requiresAuth: true}, component: () => import('@/views/Verder/VeHome/VerderInfo.vue')},
        { path: "/veStatist", name: 'veStatist', meta: { requiresAuth: true}, component: () => import('@/views/Verder/VeHome/VeStatist.vue')},
        { path: "/buyerMgmt", name: 'buyerMgmt', meta: { requiresAuth: true}, component: () => import('@/views/Verder/BuyerMgmt.vue')},
        { path: "/logistics", name: 'logistics', meta: { requiresAuth: true}, component: () => import('@/views/Verder/Logistics.vue')},
        { path: "/verGoods", name: 'verGoods', meta: { requiresAuth: true}, component: () => import('@/views/Verder/Mall/VerGoods.vue')},
        { path: "/venMallList", name: 'venMallList', meta: { requiresAuth: true}, component: () => import('@/views/Verder/Mall/VenMallList.vue')},
        { path: "/veOrderList", name: 'veOrderList', meta: { requiresAuth: true}, component: () => import('@/views/Verder/VeOrderList.vue')},
        { path: "/veFlow", name: 'veFlow', meta: { requiresAuth: true}, component: () => import('@/views/Verder/VeFlow.vue')},
        { path: "/veFounds", name: 'veFounds', meta: { requiresAuth: true}, component: () => import('@/views/Verder/VeFounds.vue')},
        /**盘口cashier */
        { path: "/caSys", name: 'caSys', meta: { requiresAuth: true}, component: () => import('@/views/Cashier/CaHome/CaSys.vue')},
        { path: "/caOrderList", name: 'caOrderList', meta: { requiresAuth: true}, component: () => import('@/views/Cashier/CaOrderList.vue')},
        { path: "/caFlow", name: 'caFlow', meta: { requiresAuth: true}, component: () => import('@/views/Cashier/CaFlow.vue')},
        { path: "/caWithdraw", name: 'caWithdraw', meta: { requiresAuth: true}, component: () => import('@/views/Cashier/WithdrawMagem/CaWithdraw.vue')},
        { path: "/setPush", name: 'setPush', meta: { requiresAuth: true}, component: () => import('@/views/Cashier/WithdrawMagem/SetPush.vue')},
        { path: "/guide", name: 'guide', meta: { requiresAuth: true}, component: () => import('@/views/Cashier/Guide.vue')},
      ]
    },
   // { path: "/platForm", name: 'platForm', meta: { requiresAuth: true }, component: () => import( /* webpackChunkName: "about" */ '../views/Merchant/PlatForm.vue') },       
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!getCookie('origin_token')){
      next({path:'/login',query:{ redirect: to.fullPath }})
    }else{
      next()
    }
  }else{
    next()
  }
})