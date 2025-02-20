<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <div class="userInfo">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="title">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <img :src="require('@/assets/image/polyu.jpg')" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="content">
        user login data 
      </div>

      <div class="detail">
        <div class="conection" @click="connectWallet">DID</div><span>{{ web3account ? web3account : "请连接您的账户" }}</span>
      </div>
    </div>
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
        :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText"
        :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in exmp" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar> -->
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
      "web3account"
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
      // if set path, the sidebar will highlight the path you set
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
    }
  },
  data(){
    return {
      active:null,
      account: null, // 存储连接的账户地址
      recipient: '', // 收款地址
      amount: 0, // 转账金额
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
$menuText:#7c8394;
$menuActiveText:#488326;
$menuHover:#f4ffe7;
$subMenuBg:#488326;
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
  .name {

  }
}
.rout:hover {
  color: #488326;
  background-color: #f4ffe7;
}
.routActive {
  color: #488326;
  background-color: #f4ffe7;
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
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 12px;
        }
    }
    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color:transparent;

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
        width: 50px;
        height: 30px;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        line-height: 30px;
        border: 1px solid #f1f1f1;
        border-radius: 5px;
        margin-right: 5px;
        cursor: pointer;
        &:hover {
          border: 1px solid #687083;
          color: #687083;
        }
      }
      span {
        white-space: nowrap;       /* 防止文本换行 */
        overflow: hidden;          /* 隐藏超出部分 */
        text-overflow: ellipsis;   /* 超出的文本显示省略号 */
      }
    }
  }
</style>
