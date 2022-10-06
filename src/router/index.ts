import { route } from 'quasar/wrappers'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// @ts-ignore
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'

import generatedRoutes from 'virtual:generated-pages'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const router = createRouter({
    scrollBehavior: () => ({
      left: 0,
      top: 0
    }),
    routes: generatedRoutes,
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })
  router.beforeEach(async (to, from, next) => {
    NProgress.start() // 开启顶部加载动画
    next()
    NProgress.done()
  })
  return router
})
