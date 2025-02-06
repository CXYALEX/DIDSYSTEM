import { login, logout, getInfo, register } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    role: ''
  }
}

const state = getDefaultState()

//在vuex中只有调用mutations中的commit方法才能修改vuexstate中的数据
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => { //调用登陆接口
        commit('SET_TOKEN', response.token) // 保存 token
        commit('SET_NAME', response.name) // 保存 用户名
        commit('SET_AVATAR', response.avatar) //保存头像
        commit('SET_ROLE', response.role) //保存role
        setToken(response.token)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        commit('SET_NAME', response.name)
        commit('SET_ROLE', response.role_id)
        commit('SET_AVATAR', response.avatar) //保存头像
        resolve(response.role_id)
      }).catch(error => {
        console.error('Error fetching user info:', error);
        reject(error)
      })
    })
  },

  // User registration 
  register({ commit }, userInfo) {
    const { username, password, role_id } = userInfo // Get the data including role_id
    return new Promise((resolve, reject) => {
      // Call the register API with the required fields: username, password, role_id
      register({ username: username.trim(), password, role_id }).then(response => {
        // You can choose to handle the response here, such as saving the token or user info if needed
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })

    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

