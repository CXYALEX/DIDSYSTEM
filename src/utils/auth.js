import Cookies from 'js-cookie'

const TokenKey = 'vue_flask_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

//保存token到cookies
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
