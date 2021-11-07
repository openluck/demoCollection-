<template>
  <div
    :class="[
      `nav-theme-${navTheme}`,
      `nav-layout-${navLayout}`,
      'basic-layout',
    ]"
  >
    <a-layout id="components-layout-demo-side" style>
        <a-layout-header style="background: #fff; padding: 0">
          <Header></Header>
        </a-layout-header>
      <a-layout>
      <a-layout-sider
        v-if="navLayout === 'left'"
        width="200px"
        v-model="collapsed"
        :theme="navTheme"
        :trigger="null"
        collapsible
        style="
          position: static;
          height: calc(100vh - 55px);
          overflow-y: auto;
          overflow-x: hidden;
        "
      >
        <!-- <div class="logo">体检信息化管理系统</div> -->
        <SideMenu :theme="navTheme"></SideMenu>
      </a-layout-sider>
        <!-- 多个tabs切换 -->
        <!-- <div>
          <span @click="toXXX">/phyExamScheduleManage/phyExamHospArrange</span>
        </div> -->
        <a-layout-content
          v-if="delay"
          style="margin: 16px;height: calc(100vh - 87px); overflow-y: auto;background-color: #fff;"
        >

        <a-spin tip="数据导出中..." :spinning="exportSpinLoading" wrapperClassName='global-export-spin-loading'>
          <router-view></router-view>
        </a-spin>
        </a-layout-content>
        <a-spin v-else :spinning="!delay" tip="加载中..." wrapperClassName="spin-main">
          <div class="spin-content"></div>
        </a-spin>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Header from "./Header";
import SideMenu from "./SideMenu";
// import axios from 'axios'
export default {
  data() {
    return {
      collapsed: false
    };
  },
  created() {
    this.$store.commit("gettedInfo", false);
    this.setMenus();
  },
  computed: {
    navTheme() {
      return this.$route.query.navTheme || "light";
    },
    navLayout() {
      return this.$route.query.navLayout || "left";
    },
    delay() {
      return this.$store.state.app.isGettedInfo;
    },
    exportSpinLoading() {
      // console.log(this.$store.state);
      return this.$store.state.app.exportSpinLoading
    }
  },
  methods: {
    // toXXX() {
    //   this.$router.push("/phyExamScheduleManage/phyExamHospArrange")
    // },
    setMenus() {
      const userId = JSON.parse(sessionStorage.getItem("userInfo")).userId;
      this.$api.user.getMenu({ userId }).then((res) => {
        if (res.code === "200" || res.code === 200) {
          // this.$store.dispatch("add_Routes", res.data);
          this.$store.dispatch("add_Routes", res.data.menus);
          this.$store.commit('setMenuLoadType', res.data.menuLoadType)
          if (this.$route.name === "index") {
            this.$router.push("/" + res.data.menus[0].children[0].path);
          }
          // this.$store.dispatch("add_Routes", JSON.parse(res.data.menuList));
          // sessionStorage.setItem("userInfo", JSON.stringify(res.data));
          this.$store.commit("gettedInfo", true);
        } else {
          this.$message.error("获加载菜单失败");
        }
      });
    }
  },
  components: {
    Header,
    SideMenu
  }
};
</script>

<style lang="less">
.basic-layout {
  .trigger-icon {
    padding: 0 20px;
    line-height: 64px;
    font-size: 20px;
  }
  .trigger-icon :hover {
    background: #eeeeee;
  }
  .logo {
    height: 64px;
    line-height: 64px;
    font-size: 18px;
    text-align: center;
  }
  .logo {
    color: white;
  }
  .spin-main{
    width: 100%;
  }
  .spin-content {
    background: #f0f2f5;
    display: flex;
    flex-direction: column;
    grid-row: 1;
    margin: 0px;
    padding: 100px;
  }
  // .ant-layout-sider {
  //   background-color: rgb(8, 100, 173);
  // }
  // .ant-layout-sider-children{
  //   height: calc(100% - 55px);
  // }
  &>.ant-layout{
    display: flex;
    flex-direction: column;
    &>.ant-layout-header{
      height: 55px;
    }
  }

  .global-export-spin-loading{
    height: 100%;
    .ant-spin-container{
      height: 100%;
    }
  }
}
.ant-layout-content>div{
  padding: 15px;
}
</style>
