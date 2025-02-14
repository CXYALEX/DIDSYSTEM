import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    // component: () => import('@/views/login/index'),
    component: () => import('@/views/login/myLogin'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index.vue'),
    hidden: true
  },

  

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Homepage', icon: 'dashboard' }
    }]
  },

  {
    path: '/',
    component: Layout,
    //redirect: '/dashboard',
    children: [{
      path: 'did',
      name: 'did',
      component: () => import('@/views/did/index'),
      meta: { title: 'DID', icon: 'user' }
    }]
  },


  
  
]

// 在 asyncRoutes 中添加图书管理的路由
export const asyncRoutes = [
  // {
  //   path: '/template',
  //   component: Layout, // 一级路由
  //   redirect: '/template/template',
  //   name: 'Template',
  //   meta: {
  //     title: 'Template',
  //     icon: 'el-icon-s-help',
  //     roles: [1] // 只有 role=1 的用户可以访问
  //   },
  //   children: [
  //     {
  //       path: 'template',
  //       name: 'Template',
  //       component: () => import('@/views/template/index'), // 懒加载路由组件
  //       meta: { title: 'Template Management', icon: 'table', roles: [1] }
  //     },
  //     {
  //       path: 'application',
  //       name: 'Application',
  //       component: () => import('@/views/application/index'),
  //       meta: { title: 'Credential Application', icon: 'table', roles: [1] }
  //     }
  //   ]
  // },

  {
    path: '/',
    component: Layout,
    //redirect: '/dashboard',
    children: [{
      path: 'template',
      name: 'Template',
      component: () => import('@/views/template/index'),
      meta: { title: 'Template', icon: 'table', roles: [1] }
    }]
  },

  {
    path: '/',
    component: Layout,
    //redirect: '/dashboard',
    children: [{
      path: 'application',
      name: 'Application',
      component: () => import('@/views/application/index'),
      meta: { title: 'Application', icon: 'eye', roles: [1] }
    }]
  },

  {
    path: '/',
    component: Layout,
    //redirect: '/dashboard',
    children: [{
      path: 'credentials',
      name: 'credentials',
      component: () => import('@/views/credentials/index'),
      meta: { title: 'Credentials', icon: 'tree', roles: [2] }
    }]
  },

  {
    path: '/',
    component: Layout,
    //redirect: '/dashboard',
    children: [{
      path: 'verifier',
      name: 'verifier',
      component: () => import('@/views/verifier/index'),
      meta: { title: 'Verifier', icon: 'user', roles: [3] }
    }]
  },
  {
    path: '/',
    component: () => import('@/views/404'),
    hidden: true,
    children: [{
        path: '404',
        name: '404',
        component: () => import('@/views/404'),
        meta: { title: '404', icon: '404',roles:[1,2,3] }
      }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true ,children: [{
    path: '404',
    name: '404',
    component: () => import('@/views/404'),
    meta: { title: '404', icon: '404' ,roles:[1,2,3]}
  }]}
];


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
