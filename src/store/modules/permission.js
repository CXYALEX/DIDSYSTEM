import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param role
 * @param route
 */
function hasPermission(role, route) {
    if (route.meta && route.meta.roles) {
        return route.meta.roles.includes(role)
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param role
 */
export function filterAsyncRoutes(routes, role) {
    const res = []
    console.log("res0:", res)
    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(role, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, role)
            }
            res.push(tmp)
        }
    })
    console.log("res1:", res)
    return res
}

const state = {
    routes: [],   //所有路由
    addRoutes: [] //动态添加的路由
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes) //合并基础路由和动态路由
    }
}

const actions = {
    generateRoutes({ commit }, role) {
        return new Promise(resolve => {
            let accessedRoutes
            if (role === 'admin') { //管理员可以访问的路由
                accessedRoutes = asyncRoutes || []
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, role) //过滤出用户根据身份可以访问的路由
                console.log("accessedRoutes", accessedRoutes)
            }
            commit('SET_ROUTES', accessedRoutes) //存储路由
            resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
