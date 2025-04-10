<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <sidebar class="sidebar-container" />
    <div class="main-container">
  <!-- 新增内容包裹层 -->
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
        // hideSidebar: !this.sidebar.opened,
        openSidebar: true,
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
  .userInfo {
    width: 280px;
    height: 130px;
    border: 1px solid #f1f1f1;
    color: #687083;
    padding: 20px;
    .title {
      display: flex;
      justify-content: space-between;
    }
    .content {
      margin: 10px 0;
    }
    .detail {
      div {
        width: 50px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border: 1px solid #f1f1f1;
        border-radius: 5px;
      }
    }
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
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
  // 保持原有布局逻辑
  background-color: #f9fafb;
  margin-left: $sideBarWidth;
  transition: margin 0.28s;

  // 新增弹性布局保证高度撑满
  display: flex;
  min-height: calc(100vh - 60px); // 根据实际头部高度调整

  .content-wrapper {
    width: 100%;
    max-width: 1200px;    // 控制最大内容宽度
    margin: 0 auto;       // 水平居中
    padding: 20px;        // 内容边距
    
    // 响应式处理
    @media (max-width: 992px) {
      max-width: 90%;
      padding: 15px;
    }
    @media (max-width: 768px) {
      max-width: 100%;
      padding: 10px;
    }
  }
  
  // 移动端适配
  &.mobile {
    .content-wrapper {
      margin-left: 0;
    }
  }
}

</style>
