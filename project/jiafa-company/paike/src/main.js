import "babel-polyfill";
import Vue from "vue";
import {
  Button,
  Layout,
  Icon,
  Breadcrumb,
  Card,
  Checkbox,
  Notification,
  Switch,
  Drawer,
  Radio,
  Popconfirm,
  Spin,
  Popover,
  Menu,
  Dropdown,
  Avatar,
  Tabs,
  Form,
  Input,
  Progress,
  Select,
  Table,
  Divider,
  Modal,
  FormModel,
  Message,
  DatePicker,
  Pagination,
  Upload,
  Tag,
  Tree,
  TreeSelect,
  List,
  Row,
  Col,
  Empty,
  Transfer,
  Tooltip,
  InputNumber,
  Space,
  Anchor,
} from "ant-design-vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "./http";

import Auth from "./directives/auth";
import Authorized from "./components/Anthorized.vue";
import svgIcon from "./components/common/svgIcon.vue";
import uploadImg from "./components/common/uploadImg";
import Debounce from "./components/common/Debounce.js";
import { fliterTimestamp } from "./filters/index";
import "./icon";
// 路由重复点击问题
import Router from "vue-router";
import VueAreaSelect from "./components/common/_v-area-select@1.0.7@v-area-select/index";
// import VueAreaSelect from '_v-area-select@1.0.7@v-area-select' //需要 Babel 显式转译该依赖，vue.config.js chainWebpack配置
import Es6Promise from "es6-promise";
// 说明页面点击图片放大的插件
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
Es6Promise.polyfill();
Vue.prototype.bus = new Vue();
Vue.filter("fliterTimestamp", fliterTimestamp);
// import moment from 'moment'
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.component("svgIcon", svgIcon);
Vue.component("Authorized", Authorized);
Vue.component("uploadImg", uploadImg);
Vue.component("Debounce", Debounce);
Vue.use(Button)
  .use(Layout)
  .use(Icon)
  .use(Transfer)
  .use(Notification)
  .use(Empty)
  .use(Drawer)
  .use(Radio)
  .use(Menu)
  .use(Form)
  .use(Input)
  .use(Spin)
  .use(Space)
  .use(Auth)
  .use(api)
  .use(Select)
  .use(Table)
  .use(Divider)
  .use(Modal)
  .use(FormModel)
  .use(DatePicker)
  .use(Pagination)
  .use(Upload)
  .use(Dropdown)
  .use(Progress)
  .use(Avatar)
  .use(Popconfirm)
  .use(Card)
  .use(Tag)
  .use(Popover)
  .use(Tabs)
  .use(Tree)
  .use(TreeSelect)
  .use(List)
  .use(Switch)
  .use(Checkbox)
  .use(Breadcrumb)
  .use(InputNumber)
  .use(Tooltip)
  .use(Row)
  .use(Col)
  .use(Anchor)
  .use(VueAreaSelect);
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
  },
});
Vue.prototype.$message = Message;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$info = Modal.info;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$notification = Notification;
Notification.config({
  placement: "topRight",
  top: "50px",
  duration: 150,
});
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
