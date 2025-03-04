import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
      path: 'template generator',
      name: 'Template Generator',
      component: () => import('@/views/template_generator/index'),
      meta: { title: 'Template Generator', icon: 'link', roles: [1] }
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
      meta: { title: 'Credential', icon: 'tree', roles: [2] }
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
