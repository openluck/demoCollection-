import Vue from 'vue'
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
  List,
  Row,
  Col,
  Empty,
  Transfer,
  Tooltip,
  InputNumber

} from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './http'

import Auth from './directives/auth'
import Authorized from './components/Anthorized.vue'
import svgIcon from './components/common/svgIcon.vue'
import uploadImg from './components/common/uploadImg'
import Debounce from './components/common/Debounce.js'
import techerRouter from './router/teacher'
import adminRouter from './router/admin'
import './icon'
import { fliterTimestamp } from './filters/index'
// 路由重复点击问题
import Router from 'vue-router'
// import './mock'
// 可视化组件引入
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)
Vue.prototype.bus = new Vue()
Vue.filter('fliterTimestamp', fliterTimestamp)
// import moment from 'moment'
Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.component('svgIcon', svgIcon)
Vue.component('Authorized', Authorized)
Vue.component('uploadImg', uploadImg)
Vue.component('Debounce', Debounce)
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
  .use(List)
  .use(Switch)
  .use(Checkbox)
  .use(Breadcrumb)
  .use(InputNumber)
  .use(Tooltip)
  .use(Row)
  .use(Col)
Vue.prototype.$message = Message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$warning = Modal.warning
Vue.prototype.$notification = Notification
Notification.config({
  placement: 'topRight',
  top: '50px',
  duration: 150,
})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

if (sessionStorage.getItem('role') === '1') {
  //老师
  store.dispatch('add_Routes', techerRouter)
} else if (sessionStorage.getItem('role') === '0') {
  //管理员
  store.dispatch('add_Routes', adminRouter)
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')