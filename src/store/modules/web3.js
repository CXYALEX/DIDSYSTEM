

const getDefaultState = () => {
    return {
        web3account: null, // 存储连接的账户地址
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_ACCOUNT: (state, web3account) => {
        state.web3account = web3account
    }
}

const actions = {
    changeWeb3Account({ commit }, data) {
        return new Promise(resolve => {
            commit('SET_ACCOUNT', data)
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
