import "babel-polyfill"
import Vue from "vue"
import { Button, Layout, Icon, Checkbox, Steps, Notification, FormModel, Switch, ConfigProvider, Dropdown, Col, Row, TreeSelect, Popconfirm, Spin, Popover, Menu, Avatar, Tabs, Input, Select, Table, Divider, Modal, Message, DatePicker, Upload, Tag, Badge, Radio, Breadcrumb, Tooltip, InputNumber } from "ant-design-vue"
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from './http'
import { getQueryString } from "./utils/util";
import svgIcon from "./components/common/svgIcon.vue"
import Page from "./components/common/page.vue";
import Debounce from './components/common/Debounce.js'
import './icon'
import { fliterTimestamp } from "./filters/index"
// 路由重复点击问题
import Router from 'vue-router'

// import "./mock"
Vue.filter('fliterTimestamp', fliterTimestamp)
// import moment from 'moment'
Vue.config.productionTip = false;
Vue.prototype.$message = Message
Vue.prototype.$error = Modal.error
Vue.prototype.bus = new Vue()
Vue.component("svgIcon", svgIcon)
Vue.component("Page", Page)
Vue.component('Debounce', Debounce)
Vue.use(Button)
  .use(InputNumber)
  .use(Radio)
  .use(Layout)
  .use(Icon)
  .use(Notification)
  .use(Menu)
  .use(Input)
  .use(Spin)
  .use(api)
  .use(Select)
  .use(Table)
  .use(Divider)
  .use(Modal)
  .use(DatePicker)
  .use(Upload)
  .use(Avatar)
  .use(Popconfirm)
  .use(Tag)
  .use(Popover)
  .use(Tabs)
  .use(Switch)
  .use(TreeSelect)
  .use(ConfigProvider)
  .use(Steps)
  .use(Dropdown)
  .use(FormModel)
  .use(Checkbox)
  .use(Breadcrumb)
  .use(Tooltip)
  .use(Badge)
  .use(Row)
  .use(Col);
Vue.prototype.$message = Message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$success = Modal.success
Vue.prototype.$notification = Notification
Notification.config({
  placement: 'topRight',
  top: '50px',
  duration: 15
});
Message.config({
  top: `30px`,
  duration: 2,
  maxCount: 3,
});
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

if (!sessionStorage.getItem("temporaryV1.20_token")) {
  sessionStorage.setItem("temporaryV1.20_token", getQueryString("token") || "");
}
if (!sessionStorage.getItem("temporaryV1.20_userName")) {
  sessionStorage.setItem("temporaryV1.20_userName", getQueryString("userName"));
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
