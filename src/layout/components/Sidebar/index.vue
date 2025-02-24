<template>
  <div :class="{ 'has-logo': showLogo }">
    <div class="userInfo">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="title">
          <img :src="require('@/assets/image/polyu.jpg')" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/CXYALEX/DIDSYSTEM">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="login">
            <span style="display:block;">Log In</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="content">
      <template v-if="name">
        User Name: {{ name }}
      </template>
      <template v-else>
        Please login your account.
      </template>
    </div>
      <div class="detail">
        <div class="conection" @click="connectWallet">Connect</div><span>{{ web3account ? web3account : "Connect your wallet" }}</span>
      </div>
    </div>
    <div class="contentR">
      <div class="rout" v-for="(item,index) in routes" v-if="!item.hidden" @click="handleRoute(item,index)" :key="item.path" :class="{'routActive': active == item.children[0].path}">
        <svg-icon :iconClass="item.children[0].meta.icon" />
        <div class="name">{{ item.children[0].meta.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import detectEthereumProvider from '@metamask/detect-provider';
import wasmPath from '@/utils/bbs/wasm_bg.wasm';
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routes',
      'avatar',
      "web3account",
      'name'
    ]),
    routes() {
      let result = []
      console.log(this.permission_routes,"this.permission_routes")
      this.permission_routes.forEach(item => {
        if(!item.hidden && item.children && item.children.length > 0){
          result.push(item)
        }
      })
      console.log(result,"222");
      
      return result
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      await this.$store.commit('web3/RESET_STATE');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async login() {
      await this.$store.dispatch('user/logout')
      await this.$store.commit('web3/RESET_STATE');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  },
  data(){
    return {
      active:null,
      account: null,
      recipient: '',
      amount: 0,
      provider: null
    }
  },
  watch:{
    $route:{
      deep:true,
      immediate:true,
      handler(newVal,oldVal){
        console.log(newVal,"nwlllllll");
        this.active = newVal.path.slice(1)
      }
    }
  },
  methods:{
    handleRoute(item,index){
      this.$router.push(item.children[0].path)
    },
    async connectWallet() {
      this.provider = await detectEthereumProvider();
      if (this.provider) {
        try {
          const accounts = await this.provider.request({
            method: 'eth_requestAccounts',
          });
          this.account = accounts[0];
          await this.$store.dispatch('web3/changeWeb3Account', this.account);
        } catch (error) {
          console.error('User rejected the request:', error);
        }
      } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
      }
    },
  }
}
</script>
<style scope lang="scss">
$menuText: #7c8394;
$menuActiveText: #1e3a8a; // Changed to dark blue
$menuHover: #e8f0ff; // Changed to light blue
$subMenuBg: #1e3a8a; // Changed to dark blue

.contentR {
  height: 100%;
  padding: 20px;
}

.rout {
  width: 100%;
  height: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
  border-radius: 5px;
  color: #7c8394;
  margin-bottom: 10px;
  cursor: pointer;
}

.rout:hover {
  color: #1e3a8a; // Changed to dark blue
  background-color: #e8f0ff; // Changed to light blue
}

.routActive {
  color: #1e3a8a; // Changed to dark blue
  background-color: #e8f0ff; // Changed to light blue
}

.userInfo {
  width: 280px;
  height: 130px;
  border: 1px solid #f1f1f1;
  color: #687083;
  padding: 20px;
  margin-top: 100px;
  margin-bottom: 30px;
  border-radius: 10px;
  
  .el-dropdown {
    width: 100%;
  }
  
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    
    img {
      width: 30px;
      height: 30px;
      border-radius: 2px;
    }
    
    .el-icon-caret-bottom {
      cursor: pointer;
      font-size: 12px;
    }
  }
  
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
  
  .content {
    font-size: 12px;
    margin: 10px 0;
  }
  
  .detail {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    
    div {
      width: auto;
      height: 32px;
      padding: 0 12px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      color: #495057;
      font-weight: 500;
      line-height: 30px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.05);
      
      &:hover {
        background: #e8f0ff; // Changed to light blue
        border-color: #1e3a8a; // Changed to dark blue
        box-shadow: 0 2px 6px rgba(30, 58, 138, 0.08),
                    inset 0 -1px 0 rgba(30, 58, 138, 0.1);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(1px);
        box-shadow: inset 0 2px 4px rgba(30, 58, 138, 0.05);
      }
    }

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 8px;
      color: #6c757d;
    }
  }
}
</style>