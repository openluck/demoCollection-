<template>
  <div class="headbar">
    <header>
      <div class="head-title">试卷流转系统</div>
      <div class="head-content">
        <a-select
          style="width: 400px;"
          dropdownClassName="select-class"
          defaultValue="content"
          @change="handleChange"
        >
          <a-select-option value="content">2020年全国普通高等院校统一招生考试</a-select-option>
        </a-select>
      </div>
      <div class="head-profile">
        <a-popover placement="bottom">
          <template slot="content">
            <p>Content</p>
            <p>Content</p>
          </template>
          <template slot="title">
            <span>Title</span>
          </template>
          <div>
            <icon name="user" scale="3"></icon>
            <span class="user">{{userName}}</span>
          </div>
        </a-popover>
      </div>
    </header>
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
export default {
  data() {
    return {
      current: ["mail"],
      userName: "userman"
    };
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    }
  }
};
</script>
<style  lang='less'>
.headbar{
  width: 100%;
}
header {
  display: flex;
  min-width: 1080px;
  height: 100px;
  background-color: #3380cc;
  position: relative;
  .head-title {
    width: 200px;
    letter-spacing: 2px;
    padding: 10px 20px;
    line-height: 24px;
    color: #fff;
    display: inline-block;
    font-weight: 400;
    font-size: 24px;
  }
  .head-content {
     width: 400px;
    vertical-align: middle;
    padding: 10px 15px;
display: inline-block;
    color: #fff;
    font-weight: 400;
    .ant-select-selection--single {
      border: 0;
      background-color: #2b6dae;
      color: #fefefe;
    }
  }
  .head-profile {
    position: absolute;
    float: right;
    color: #fff;
    font-size: 16px;
    vertical-align: middle;
    top: 10px;
    right: 20px;
    color: #fff;
    .svg-icon {
      cursor: pointer;
      margin-right: 5px;
      vertical-align: -8px;
    }
  }
}
</style>