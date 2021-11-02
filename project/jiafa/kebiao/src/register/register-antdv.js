/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-26 10:21:19
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-08 10:09:06
 */
import {
  Button,
  Layout,
  Icon,
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
  Row,
  Col,
  Tooltip,
  List,
  TreeSelect,
  Space,
  Empty,
  Skeleton,
  TimePicker,
  Timeline,
  InputNumber
} from "ant-design-vue";
import "ant-design-vue/dist/antd.less";
export default function (Vue) {
  Vue.prototype.$message = Message;
  Vue.use(Button)
    .use(Timeline)
    .use(Layout)
    .use(Empty)
    .use(Icon)
    .use(Drawer)
    .use(Radio)
    .use(Menu)
    .use(Form)
    .use(Input)
    .use(Spin)
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
    .use(Switch)
    .use(Col)
    .use(Row)
    .use(Tooltip)
    .use(List)
    .use(Checkbox)
    .use(Space)
    .use(Skeleton)
    .use(InputNumber)
    .use(TimePicker);

  Vue.prototype.$message = Message;
  Vue.prototype.$confirm = Modal.confirm;
  Vue.prototype.$warning = Modal.warning;
  Vue.prototype.$error = Modal.error;
  Vue.prototype.$success = Modal.success;
  Vue.prototype.$notification = Notification;
  Notification.config({
    placement: "topRight",
    top: "50px",
    duration: 15
  });
}
