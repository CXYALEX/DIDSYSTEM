const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  permission_routes: state => state.permission.routes,
  web3account: state => state.web3.web3account

}
export default getters
