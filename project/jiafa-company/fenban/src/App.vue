<template>
  <div id="app" class="app">
    <a-config-provider :locale="zhCN">
      <transition name="component-fade" mode="out-in">
        <router-view />
      </transition>
    </a-config-provider>
  </div>
</template>
<script>
import zhCN from "ant-design-vue/es/locale/zh_CN";
import Vue from "vue";

import { ConfigProvider, message } from "ant-design-vue";

// import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
Vue.use(ConfigProvider);

message.config({
  duration: 2,
  maxCount: 2,
});
export default {
  name: "App",
  data() {
    return {
      zhCN,
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="less">
@import '~ant-design-vue/dist/antd.less'; // 引入官方提供的 less 样式入口文件
@import './myLess.less'; // 用于覆盖上面定义的变量
// 字体
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 模态框标题居中 */
html {
  .ant-modal-header {
    text-align: center;
  }
  h1 {
    font-size: 2rem;
    font-weight: bold;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }
  h3 {
    font-size: 1.17rem;
    font-weight: bold;
  }
  h4 {
    font-size: 1rem;
    font-weight: bold;
  }
}
/*
 *定义的按钮颜色
 *建议统一
*/
@theme-color: #1ba4b3;
@theme-hover-color: #1ba4b3;
@danger-color: #f47171;
// @primary-color: #3b98f7;
@yellow-color: #e09140;
@yellow-hover-color: #e09140;
.anticon-play-circle,
.anticon-form,
.anticon-delete {
  padding-right: 5px;
}
/deep/.ant-btn-primary {
  background-color: #1ba4b3 !important;
  border-color: #1ba4b3 !important;
}
/* 添加按钮 */
.themeBtn {
  color: #fff;
  background: @theme-color;
  border-color: @theme-color;
  &:hover {
    color: #fff;
    background: @theme-hover-color;
    border-color: @theme-hover-color;
  }
  &:focus {
    color: #fff;
    background: @theme-hover-color;
    border-color: @theme-hover-color;
  }
}
// 黄色按钮
.yellowBtn {
  color: #fff;
  background: @yellow-color;
  border-color: @yellow-color;
  &:hover {
    color: #fff;
    background: @yellow-hover-color;
    border-color: @yellow-hover-color;
  }
  &:focus {
    color: #fff;
    background: @yellow-hover-color;
    border-color: @yellow-hover-color;
  }
}
// .btn {
//   width: 100px;
// }
.defaultBtn {
  color: #595959;
  &:hover {
    color: #595959;
    border-color: #ccc;
  }
  &:focus {
    color: #595959;
    border-color: #ccc;
  }
}
/* 批量删除按钮 */
.danger {
  background: @danger-color;
  border-color: @danger-color;
}
/*
 *刷新数据按钮
 *搜索按钮
 *确定按钮
*/
.primary {
  background: @primary-color;
  border-color: @primary-color;
}
/* 滑过旋转css */
.ant-modal-close-icon {
  color: #1ba4b3;
}
.ant-modal-close-icon {
  transition: transform 0.4s ease-out;
}
.ant-modal-close-x:hover .ant-modal-close-icon {
  transform: rotateZ(180deg);
}

html,
body {
  overflow-y: auto;
  /* 滚动条 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 4px;
    background-color: #eff3f5;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    border-radius: 3px;
    background-color: #eff3f5;
  }
  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    // background-color: #36b4f3;
    background-color: #ccc;
    // background-image: linear-gradient(25deg, #3c1b5a, #516470, #52ad84, #27fb96);
    // background-image: linear-gradient(258deg, #3b1a66, #424988, #3d76ac, #1ba4d1);
    // background-image: linear-gradient(25deg, #feb84f, #f2d045, #e3e837, #d1fe22);
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    cursor: pointer;
    background: #25b6ff;
  }
  /* a标签 */
  a {
    color: @primary-color;
  }
  /* 模态框header居中 */
  .ant-modal-header {
    text-align: center;
  }
}
.app {
  // 选择checkbox的样式
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #1ba4b3 !important;
    border-color: #1ba4b3 !important;
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: #1ba4b3;
  }
  //分页器样式
  .ant-table-pagination {
    width: 100%;
    padding: 16px 20px;
    text-align: right;
    margin: 0;
    .ant-pagination-total-text {
      float: left;
    }
    .ant-pagination-item-active {
      background-color: #1ba4b3;
      border-color: #1ba4b3;
      a {
        color: #fff;
      }
    }
  }
  //带图标的输入框，内前置图标位置
  .ant-input-affix-wrapper .ant-input-prefix {
    left: 10px;
  }

  //空数据表格 提示
  .no-promission {
    .ant-table-empty .ant-table-placeholder {
      height: 100px;
      line-height: 70px;
      font-size: 18px;
    }
  }
}
</style>
