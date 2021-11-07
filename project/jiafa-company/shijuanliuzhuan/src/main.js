import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import VueAMap from 'vue-amap'
import api from './http'
import store from './store/index';
import icon from 'vue-svg-icon/Icon.vue'

import {
  Select,
  Checkbox,
  Cascader,
  Button,
  Icon,
  Table,
  Tag,
  Divider,
  Input,
  Pagination,
  Modal,
  Radio, Form,
  FormModel,
  DatePicker,
  message,
  Popconfirm, Spin,
  TreeSelect, Tooltip, Tabs,
} from "ant-design-vue";
Vue.use(Select)
  .use(Checkbox)
  .use(TreeSelect)
  .use(Button)
  .use(Cascader)
  .use(Table)
  .use(Tag)
  .use(Divider).use(Form)
  .use(FormModel)
  .use(Input)
  .use(Pagination)
  .use(Modal)
  .use(Spin)
  .use(DatePicker)
  .use(Icon).use(Tooltip).use(Tabs)
  .use(message)
  .use(Popconfirm)
  .use(Radio);
Vue.prototype.$message = message;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1814330_pl18gus56wg.js",
});

Vue.component("IconFont", IconFont)
// import router from './router/indexDev' //生产
import router from './router/index'   //开发

Vue.component('icon', icon)
import { setStore, getQueryString } from './utils/util';

//require('./mock')

// 全局引入 Reset-css
import 'reset-css'
import less from 'less'

Vue.use(less)
Vue.use(VueAMap);
Vue.use(api);
Vue.config.productionTip = false;

if (process.env.NODE_ENV == "production") {
  let token = getQueryString("token");
  let examId = getQueryString("exid");;
  if (!token) {
    token = sessionStorage.getItem("token")
  }
  setStore("CToken", token);
  setStore("examId", examId);
} else if (process.env.NODE_ENV == "development") {
  setStore("CToken", 'NDdBQkFGRUU2MDFFNDVFNDhDNkVFRDA0RDNBOEI0OEY=.MjAyMS0wNC0yMSAxNDoyMDoyOA==.D7AFCDBC3C744A1FD6076A8D1858DB66');
  setStore("examId", '20201001');
}

//vue-amap初始化
VueAMap.initAMapApiLoader({
  key: "d2ebccf8d0bca198da4e3521d96d6f05",
  plugin: [
    "AMap.Autocomplete", //输入提示插件
    "AMap.PlaceSearch", //POI搜索插件
    "AMap.Scale", //右下角缩略图插件 比例尺
    "AMap.OverView", //地图鹰眼插件
    "AMap.ToolBar", //地图工具条
    "AMap.MapType", //类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    "AMap.PolyEditor", //编辑 折线多，边形
    "AMap.CircleEditor", //圆形编辑器插件
    "AMap.Geolocation", //定位控件，用来获取和展示用户主机所在的经纬度位置
    'AMap.Driving'
  ],
  uiVersion: "1.0"
});

//路由重复点击问题
import Router from 'vue-router'
const originalPush = Router.prototype.push

Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}








/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //使用store vuex状态管理
  render: h => h(App)
})
