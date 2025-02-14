import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { resetRouter } from '@/router';
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist /register页面也需要添加在这儿

//Vue Router 的导航守卫，它在每次路由发生变化（页面跳转）之前执行，用于拦截导航，执行一些逻辑后决定是否允许跳转、重定向或阻止导航。
//自动触发：当用户通过 Vue Router 导航时（如点击链接或调用 this.$router.push()），会自动调用 router.beforeEach。
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      console.log('Generated Routes:')
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.role
      if (hasRoles) {
        console.log(to,"routr yo")
        //next() //如果你调用 next() 而不传任何参数，则当前导航会继续前往目标路由
        console.log("user's roles:", store.getters.role);
        next()
      } else {
        try {
          // get user info
          console.log("router/try", router);
          await store.dispatch('user/getInfo')
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', store.getters.role)
          resetRouter();

          console.log('Generated Routes:',to, accessRoutes)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes);
          // ensure the navigation is complete
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          //Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
