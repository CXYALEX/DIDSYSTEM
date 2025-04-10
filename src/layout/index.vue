<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div class="content-wrapper">
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters([
      'avatar'
    ]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    
    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
  
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  
  .main-container {
    background-color: #f9fafb;
    margin-left: $sideBarWidth;
    transition: margin-left 0.28s;
    min-height: 100vh;
    
    // 移动端适配
    .mobile & {
      margin-left: 0;
    }
    
    // 当隐藏侧边栏时
    .hideSidebar & {
      margin-left: 54px;
      
      @media (max-width: 768px) {
        margin-left: 0;
      }
    }

    .content-wrapper {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      
      @media (max-width: 992px) {
        max-width: 96%;
        padding: 15px;
      }
      
      @media (max-width: 768px) {
        max-width: 100%;
        padding: 10px;
      }
    }
  }
  
  // 移动端侧边栏样式调整
  .mobile {
    .sidebar-container {
      width: 180px !important; // 移动端时侧边栏宽度更小
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    
    &.openSidebar {
      .sidebar-container {
        transform: translateX(0);
      }
      
      .main-container {
        position: relative;
        transform: translateX(180px); // 与侧边栏宽度匹配
      }
    }
  }
</style>
