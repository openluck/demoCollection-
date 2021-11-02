<template>
  <div class="nav-bar">
    <!-- <a-button type="primary" style="margin-bottom: 16px" @click="toggleCollapsed">
      <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
    </a-button>-->
    <a-menu
      class="nav-menu"
      mode="inline"
      :defaultOpenKeys="openKeys"
      :inline-collapsed="collapsed"
    >
      <a-menu-item key="1">
        <icon name="fangzi" scale="2.4"></icon>
        <span>总览</span>
      </a-menu-item>
      <a-menu-item key="/WorkRequirement" @click="getKeyFromRouter">
        <icon name="setting" scale="2.4"></icon>
        <span>工作要求设置</span>
      </a-menu-item>
      <a-sub-menu key="sub1">
        <span slot="title">
          <icon name="dengpao" scale="2.4"></icon>
          <span>试卷需求管理</span>
        </span>
        <!-- <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-menu-item key="7">Option 7</a-menu-item>
        <a-menu-item key="8">Option 8</a-menu-item>-->
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title">
          <icon name="down" scale="2"></icon>
          <span>表单打印</span>
        </span>
        <a-menu-item key="/PrintPuPdf" @click="getKeyFromRouter">普通考试领卷清单打印</a-menu-item>
        <a-menu-item key="/PrintDuPdf" @click="getKeyFromRouter">对口考试领卷清单打印</a-menu-item>
        <a-menu-item key="/PrintYiPdf" @click="getKeyFromRouter">一类考试领卷清单打印</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <span slot="title">
          <icon name="yayun" scale="2.4"></icon>
          <span>押运任务管理</span>
        </span>
        <a-menu-item key="/EscortPlan" @click="getKeyFromRouter">押运计划管理</a-menu-item>
        <a-menu-item key="/EscortTask" @click="getKeyFromRouter">押运任务管理</a-menu-item>
         <!-- <a-menu-item key="/TaskMonitor" @click="getKeyFromRouter">押运任务监控</a-menu-item> -->
        <a-menu-item key="/EscortAlarm" @click="getKeyFromRouter">押运预警管理</a-menu-item>
        <a-menu-item key="/EscortPlayback" @click="getKeyFromRouter">押运回放记录</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <span slot="title">
          <icon name="dunpai" scale="2.4"></icon>
          <!-- <icon name="onTheWay" scale="2.4"></icon> -->
          <span>试卷值守管理</span>
        </span>
        <!-- <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-menu-item key="7">Option 7</a-menu-item>
        <a-menu-item key="8">Option 8</a-menu-item>-->
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
import Vue from "vue";
import {
  Button,
  Icon,
  Cascader,
  Select,
  DatePicker,
  Input,
  Table,
  Menu,
  Popover
} from "ant-design-vue";
Vue.use(Select)
  .use(Input)
  .use(Menu)
  .use(Icon)
  .use(Popover)
  .use(Button);
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1814330_pl18gus56wg.js"
});
export default {
  components: { IconFont },
  data() {
    return {
      collapsed: false,
      openKeys: [""],
      defaultMenu: []
    };
  },
  created() {
    //生产环境路由会改变，这里应该再加一个判断(开发环境不会受此影响)  time:5-12
    // let item = location.hash.split("#")[1];
    // this.defaultMenu.push(item);
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    getKeyFromRouter(key) {
      // console.log(key)
      this.$router.push({
        path: key.key
      });
    }
  }
};
</script>
<style scoped lang='less'>
.nav-bar {
  width: 240px;
  height: 100%;
  // padding-bottom: 10px;
  // background-color: #ebf0f5;
  // position: absolute;
  // top: 50px;
  // left: 0;
  // bottom: 0;
  // .nav-menu{
  //   height: 100%;
  // }
  // .ant-menu-sub {
  //   .ant-menu-item-selected {
      // padding-left: 43px !important;
    // }
  // }
  .ant-menu-item {
    color: #8a9199;
    &:hover {
      color: #3380cc;
      background: #ebf0f5;
    }
    // span{
    //   color: #000;
    // }
  }
  .ant-menu-item-selected {
    background: #ebf0f5;
    color: #3380cc;
    border-left: 5px solid #3380cc;
    font-weight: 700;
  }
  .ant-menu-inline .ant-menu-item::after {
    border-right: 0;
  }
  .ant-menu-submenu-selected {
    color: #3380cc;
  }
  .svg-icon {
    margin-right: 2px;
    vertical-align: -6px;
  }

  .ant-menu-submenu {
    color: #8a9199;
  }
  .ant-menu-submenu-selected {
    color: #3380cc;
  }
  // .nav-menu {
  //   height: 100%;
  // }
  .ant-menu-submenu-title {
    &:hover {
      font-size: 30px;
      color: #3380cc;
    }
  }
}
</style>