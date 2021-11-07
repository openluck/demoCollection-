<template>
  <div :class="[`nav-theme-${navTheme}`, `nav-layout-${navLayout}`]">
    <a-layout id="components-layout-demo-side" style>
      <a-layout-sider
        v-if="navLayout === 'left' && isteacher"
        width="256px"
        v-model="collapsed"
        :theme="navTheme"
        :trigger="null"
        collapsible
        style="position: static; min-height: 100vh; height: 100vh; overflow-y: auto"
      >
        <div class="logo" > <span v-if="!collapsed">新高考选课</span></div>
        <SideMenu :theme="navTheme" @getMetaInfo="getMetaInfo" :collapsed="collapsed"></SideMenu>
      </a-layout-sider>

      <a-layout-sider
        v-if="navLayout === 'left' && isStudent"
        width="256px"
        v-model="collapsed"
        :theme="navTheme"
        :trigger="null"
        collapsible
        style="position: static; min-height: 100vh; height: 100vh; overflow-y: auto"
      >
        <StudentSideMenu @getMetaInfo="getMetaInfo" ></StudentSideMenu>
      </a-layout-sider>

      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
          <Header></Header>
        </a-layout-header>
        <a-breadcrumb>
          <!-- <a-breadcrumb-item v-if="metaInfo.parentTitle">{{
              metaInfo.parentTitle
            }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ metaInfo.title }}</a-breadcrumb-item> -->
          <!-- <a-breadcrumb-item>{{ metaInfo.title }}</a-breadcrumb-item> -->
          <!-- <a-breadcrumb-item v-for="item in parentRouter" :key="item.path">{{ item.meta.title }}{{item.index}} </a-breadcrumb-item> -->
        </a-breadcrumb>
        <a-layout-content
          v-if="delay"
          style="margin: 16px; height: calc(100vh - 120px); overflow-y: auto;"
        >
          <router-view></router-view>
        </a-layout-content>
        <a-spin v-else :spinning="!delay" tip="加载中...">
          <div class="spin-content"></div>
        </a-spin>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Header from "./Header";
import SideMenu from "./SideMenu";
import StudentSideMenu from "./StudentSideMenu";
export default {
  data() {
    return {
      collapsed: false,
      metaInfo: {
        title: "123",
      },
      isteacher: false,
      isStudent: false,
      parentRouter: [],
    };
  },
  watch: {
    "$route.path": function (val) {
      this.parentRouter = this.$route.matched.slice(1);
    },
  },
  created() {
    this.setMenus();
    this.parentRouter = this.$route.matched.slice(1);
  },
  computed: {
    navTheme() {
      return this.$route.query.navTheme || "dark";
    },
    navLayout() {
      return this.$route.query.navLayout || "left";
    },
    delay() {
      // return this.$store.state.app.isGettedInfo;
      return true;
    },
  },
  methods: {
    // 获取meta
    getMetaInfo(val) {
      this.metaInfo = val;
    },
    setMenus() {
      if (sessionStorage.getItem("role") === "2") {
        //学生
        this.isStudent = true;
      } else if (sessionStorage.getItem("role") === "1") {
        //老师
        this.isteacher = true;
      } else if (sessionStorage.getItem("role") === "0") {
        //管理员
        this.isteacher = true;
      }
    },
  },
  components: {
    Header,
    SideMenu,
    StudentSideMenu,
  },
};
</script>

<style lang="less" scoped>
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
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}
  .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
.nav-theme-dark .logo {
  color: white;
}
.ant-breadcrumb {
  margin: 8px 16px 8px 16px !important;
}
.ant-layout-content {
  background: #fff;
  margin: 0 16px 16px 16px !important;
}
.spin-content {
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  grid-row: 1;
  margin: 0px;
  padding: 100px;
}
</style>
>
