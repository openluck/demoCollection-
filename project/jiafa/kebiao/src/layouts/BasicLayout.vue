<template>
  <div :class="[`nav-theme-${navTheme}`, `nav-layout-${navLayout}`]">
    <a-layout>
      <a-layout-header class="layout-header">
        <Header></Header>
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          v-if="navLayout === 'left'"
          v-model="collapse"
          :theme="navTheme"
          :trigger="null"
          collapsible
          width="248"
          collapsedWidth="48"
          class="layout-sider"
        >
          <SideMenu :theme="navTheme"></SideMenu>
          <div class="toggle-item">
            <a-button
              class="toggle-btn"
              :class="{ 'toggle-btn-collapsed': collapse }"
              type="primary"
              style="margin-bottom: 16px"
              @click="toggleCollapsed"
            >
              <a-icon :type="collapse ? 'menu-unfold' : 'menu-fold'" />
            </a-button>
          </div>
        </a-layout-sider>
        <a-layout>
          <a-layout-content :class="{
              'layout-content-collapse': collapse,
              'layout-content-no-top': tableClass,
            }">
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
      <WebSocket></WebSocket>
    </a-layout>
  </div>
</template>

<script>
import Header from "./Header";
import SideMenu from "./SideMenu";
import { mapState, mapMutations } from "vuex";
import WebSocket from "@/components/WebSocket.vue";
// import GlobalScroll from '@/components/common/GlobalScroll.vue'
export default {
  data() {
    return {
      tableClass: false
    };
  },
  watch: {
    "$route.path": function (val) {
      if (val.includes("/TimetableAdjust") || val.includes("/TimetableQuer")) {
        if (
          val.includes("/SpelledAdjustment") ||
          val.includes("ScheduleAdjustment")
        ) {
          this.tableClass = false;
        } else {
          this.tableClass = true;
        }
      } else {
        this.tableClass = false;
      }
    }
  },
  created() {
    this.initClass(this.$route.path);
  },
  computed: {
    navTheme() {
      return this.$route.query.navTheme || "light";
    },
    navLayout() {
      return this.$route.query.navLayout || "left";
    },
    ...mapState("app", ["collapse"])
  },
  methods: {
    ...mapMutations("app", ["onCollapse"]),
    toggleCollapsed() {
      this.onCollapse();
    },
    initClass(val) {
      if (val.includes("/TimetableAdjust") || val.includes("/TimetableQuer")) {
        if (
          val.includes("/SpelledAdjustment") ||
          val.includes("ScheduleAdjustment")
        ) {
          this.tableClass = false;
        } else {
          this.tableClass = true;
        }
      } else {
        this.tableClass = false;
      }
    }
  },
  components: {
    Header,
    SideMenu,
    WebSocket
  }
};
</script>

<style lang="less" scoped>
.layout-sider {
  position: fixed;
  z-index: 1000;
  background: #fff;
  height: calc(100vh - 60px);
  top: 64px;
  left: 0;
  overflow-y: auto;
  padding-top: 22px;
  .toggle-item {
    position: fixed;
    bottom: 0px;
    left: 0px;
    height: 42px;
    background: #ffffff;
    .toggle-btn {
      width: 232px;
      margin-bottom: 10px;
      margin-left: 6px;
      background: @primary-bg;
      color: @primary-color;
      border: none;
    }
    .toggle-btn-collapsed {
      width: 32px;
      margin-left: 6px;
      margin-bottom: 10px;
      text-align: center;
      background: @primary-bg;
      color: @primary-color;
      border: none;
    }
  }
  /deep/.ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0;
  }
}

/deep/.ant-btn .anticon {
  transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  margin-left: -6px;
}
.layout-header {
  background: #fff;
  position: fixed;
  border-bottom: 1px solid #e1e3e5;
  z-index: 999;
  width: 100%;
  top: 0;
  right: 0;
}

.ant-layout-content {
  background: #fff;
  margin: 90px 24px 26px 270px;
  // min-height: calc(100vh - 90px);
  min-height: calc(100vh - 120px);
}
.layout-content-collapse {
  margin: 90px 24px 24px 72px;
}
.layout-content-no-top {
  margin-top: 64px;
  min-height: calc(100vh - 90px);
}
</style>
