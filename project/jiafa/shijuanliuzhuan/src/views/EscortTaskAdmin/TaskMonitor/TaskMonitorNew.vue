<template>
  <div id="task_monitor">
    <!-- 页面头部 -->
    <moni-header></moni-header>
    <!-- 地图 -->
    <div class="task_monitor_map">
      <!-- 地图容器 -->
      <div id="container"></div>
      <!-- 任务预警滚动小窗 -->
      <div class="task_alarm_polling" v-if="hasAlarmList">
        <vue-seamless-scroll class="seamless-warp" :data="allAlarmList" :class-option="classOption">
          <ul>
            <li class="seamless-warp-li" v-for="(item, index) in allAlarmList" :key="index" @click="handleAlarm(item)">
              <span>
                <img src="../../../assets/alarm_log.png" alt />
              </span>
              <span>
                <a-button size="small"
                  style="width:54px;height:24px;background:rgba(255,255,255,.1);color:white;text-aligncenter">{{
                    item.actionStatus === 0
                      ? "未处置"
                      : item.actionStatus === 1
                      ? "正常"
                      : "异常"
                  }}</a-button>
              </span>
              <span :title="item.taskName" class="seamless-warp-li-taskname">{{
                item.taskName
              }}</span>
              <span>{{ item.alarmTime }}</span>
              <span :title="returnAlarmType(item.alarmType)">{{
                returnAlarmType(item.alarmType)
              }}</span>
              <span :title="item.remark ? item.remark : '--'">{{
                item.remark ? item.remark : "--"
              }}</span>
            </li>
          </ul>
        </vue-seamless-scroll>
        <AlarmHandleModal v-if="modalVisible" ref="AlarmHandleModal" :modalData="modalData" />
      </div>
      <!-- 进行中任务列表 -->
      <div class="task_list">
        <a-popover trigger="click">
          <template slot="content">
            <ul style="height: 280px; overflow-y: scroll">
              <li v-for="(taskItem, index) in taskList" :key="index">
                <span>
                  <a-checkbox @change="(e) => taskCheck(e, taskItem)" :checked="taskItem.isSelect"
                    :defaultChecked="taskItem.isSelect"></a-checkbox>
                </span>
                <span class="task-select-option-title">【起】</span>
                <span :title="taskItem.startOrgName" class="task-select-option-start">{{ taskItem.startOrgName }}</span>
                <span class="task-select-option-title">【止】</span>
                <span :title="taskItem.endOrgName" class="task-select-option-end">{{ taskItem.endOrgName }}</span>
              </li>
            </ul>
            <div>
              <div class="task-select-option-render" style="display: inline-block; height: 60px; line-height: 60px">
                <a-checkbox :defaultChecked="true" @change="(e) => changeAll(e)">全部</a-checkbox>
                <label for="intervalTime" style="margin-left: 70px">轮询间隔时间（s）：</label>
                <a-input-search id="intervalTime" style="display: inline-block; width: 120px; margin-top: 14px"
                  :defaultValue="intervalTime" @search="(e) => changeInTime(e)">
                  <a-button slot="enterButton">
                    <a-icon type="check" />
                  </a-button>
                </a-input-search>
              </div>
            </div>
          </template>
          <a-button style="position: absolute; right: 0px; width: 420px" v-if="isGettedTaskList">
            <span class="task-select-option-title" style="margin-left: -10px">【起】</span>
            <span class="task-select-option-start">{{
              curTask.startOrgName
            }}</span>
            <span class="task-select-option-title">【止】</span>
            <span class="task-select-option-end">{{ curTask.endOrgName }}</span>
          </a-button>
        </a-popover>
      </div>

      <transition>
        <!-- <div class="deviceList" v-show="isShow">
          <a-card title="车辆设备">
            <a-radio-group
              v-if="isShowRadio"
              @change="onChange"
              :default-value="carDeviceArr[0].key"
            >
              <a-radio
                v-for="(item,index) in carDeviceArr"
                style="width: 420px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-left:20px"
                :key="index"
                :style="radioStyle"
                :value="item.key"
              >{{item.name}}</a-radio>
            </a-radio-group>
          </a-card>
        </div>-->
      </transition>
      <!-- 视频会议 -->
      <div class="task-contact" v-show="!isFinish">
        <a-popover class="task-popover task-message" trigger="click" placement="leftTop" v-model="messagePopover"
          overlayClassName="messagePopClass" :destroyTooltipOnHide="true">
          <template slot="content">
            <send-msg ref="sendMsg" :selectedTask="selectedTaskList" />
          </template>
          <div class="task-button">
            <icon name="xiaoxi" scale="3"></icon>
            <div>沟通联系</div>
          </div>
        </a-popover>
      </div>
      <!-- 任务信息 -->
      <div class="task-up">
        <a-popover class="task-popover task-details" trigger="click" placement="leftBottom">
          <a-badge :count="alarmCount" style="visibility: hidden">
            <a href="#" class="head-example" />
          </a-badge>
          <template slot="content">
            <task-info :selectedTask="selectedTaskList"></task-info>
          </template>
          <div class="task-button">
            <icon class="icon" name="renwuxinxi" scale="3"></icon>
            <div>任务信息</div>
          </div>
        </a-popover>
        <!-- 任务预警 -->
        <a-popover class="task-popover task-alarm" trigger="click" placement="leftBottom" v-model="alarmPopover">
          <a-badge :count="alarmCount" showZero>
            <a href="#" class="head-example" />
          </a-badge>
          <template slot="content">
            <task-alarm :selectedTask="selectedTaskList"></task-alarm>
          </template>

          <div class="task-button">
            <icon class="icon" name="renwuyujing" scale="3"></icon>
            <div>任务预警</div>
          </div>
        </a-popover>
        <!-- 任务上报 -->
        <a-popover class="task-popover task-report" trigger="click" placement="leftBottom">
          <a-badge :count="reportCount" showZero>
            <a href="#" class="head-example" />
          </a-badge>
          <template slot="content">
            <task-up :selectedTask="selectedTaskList"></task-up>
          </template>
          <div class="task-button">
            <icon class="icon" name="renwushangbao" scale="3"></icon>
            <div>任务上报</div>
          </div>
        </a-popover>
      </div>
    </div>
    <!-- 视频列表 -->
    <div class="video_list">
      <section class="video_item">
        <!-- <div id="J_prismPlayer1" v-if="isGetedVideo" ref="myref" style="width:100%; height:100%;">
          <div class="no_video" v-show="isAllOneVideo">
            <img style="width:100%;height:100%" alt src="@/assets/false_video.jpg" />
          </div>
        </div>-->

        <!-- <div class="no_video" v-else>
          <img style="width:100%;height:100%" alt src="@/assets/no_video.png" />
        </div>-->
        <div class="mainContainer" style="width: 100%; height: 200px">
          <video id="videoElementO" style="width: 100%; height: 200px" class="centeredVideo" controls autoplay muted
            width="1024" height="576">
            Your browser is too old which doesn't support HTML5 video.
          </video>
        </div>
        <div class="enlarge_logo" @click="enlargeVideo(1)">
          <img src="../../../assets/enlarge_logo.png" alt />
        </div>
        <a-select class="video_change" placeholder="切换设备" dropdownClassName="select-class-modal" v-model="defaultDevice"
          @change="(v, op) => videoChange(v, op, 1)">
          <a-select-option v-for="(item, index) in aioDevice" :key="index" :type="item.devType" :value="item.deviceId">
            {{ item.devName }}</a-select-option>
          <a-select-option v-for="(item, index) in cameraDevice" :key="index" :type="item.devType"
            :value="item.deviceId">{{ item.devName }}</a-select-option>
          <a-select-opt-group v-for="(item, index) in vehicleDeviceList" :key="index">
            <span slot="label" style="font-size: 14px">车载设备{{ index + 1 }}</span>
            <a-select-option :type="item1.devType" :parentId="item1.deviceId" :channelNum="item1.deviceIndex"
              v-for="item1 in item" :key="item1.deviceId">{{ item1.deviceName }}</a-select-option>
          </a-select-opt-group>
        </a-select>
        <p>{{ curTask.taskName }}</p>
      </section>
      <section class="video_item" style="margin-top: 10px" v-if="!isOneTask">
        <!-- <div id="J_prismPlayer2" v-if="isGetedVideo" style="width:100%; height:100%;">
          <div class="no_video" v-show="isAllOneVideo">
            <img style="width:100%;height:100%" alt src="@/assets/false_video.jpg" />
          </div>
        </div>

        <div class="no_video" v-else>
          <img style="width:100%;height:100%" alt src="@/assets/no_video.png" />
        </div>-->
        <div class="mainContainer">
          <video id="videoElementT" style="width: 100%; height: 200px" class="centeredVideo" controls autoplay muted
            width="1024" height="576">
            Your browser is too old which doesn't support HTML5 video.
          </video>
        </div>
        <div class="enlarge_logo" @click="enlargeVideo(2)">
          <img src="../../../assets/enlarge_logo.png" alt />
        </div>
        <a-select placeholder="切换设备" class="video_change" dropdownClassName="select-class-modal"
          v-model="defaultDevice2" @change="(v, op) => videoChange(v, op, 2)">
          <a-select-option v-for="(item, index) in aioDevice2" :key="index" :type="item.devType" :value="item.deviceId">
            {{ item.devName }}</a-select-option>
          <a-select-option v-for="(item, index) in cameraDevice2" :key="index" :type="item.devType"
            :value="item.deviceId">{{ item.devName }}</a-select-option>
          <a-select-opt-group v-for="(item, index) in vehicleDeviceList2" :key="index">
            <span slot="label" style="font-size: 14px">车载设备{{ index + 1 }}</span>
            <a-select-option :type="item1.devType" :parentId="item1.deviceId" :channelNum="item1.deviceIndex"
              v-for="item1 in item" :key="item1.deviceId">{{ item1.deviceName }}</a-select-option>
          </a-select-opt-group>
        </a-select>
        <p>{{ curTask2.taskName }}</p>
      </section>

      <!-- 视频拉流模态框 -->
      <large-video :aioDevice="aioDevice" :cameraDevice="cameraDevice" :vehicleDeviceList="vehicleDeviceList"
        :isGetedVideo="isGetedVideo" :isAllOneVideo="isAllOneVideo" ref="largeVideo"></large-video>
      <large-video2 :aioDevice="aioDevice2" :cameraDevice="cameraDevice2" :vehicleDeviceList="vehicleDeviceList2"
        :isGetedVideo="isGetedVideo" :isAllOneVideo="isAllOneVideo" ref="largeVideo2"></large-video2>
    </div>
  </div>
</template>

<script>
import { AudioPlayer } from "@liripeng/vue-audio-player";
import { baseUrl } from "@/utils/global";
import { mapState } from "vuex";
import { createNamespacedHelpers } from "vuex";
import { findParent, getArrayObj, getStore } from "../../../utils/util.js";
import { getBrowse } from "@/utils/util";
import vueSeamlessScroll from "vue-seamless-scroll"; //第三方滚动组件
import AlarmHandleModal from "@/views/EscortTaskAdmin/EscortAlarm/ChildCon/AlarmHandleModal";
import SendMsg from "@/views/EscortTaskAdmin/TaskMonitor/ChildCon/SendMsg";
import TaskInfo from "@/views/EscortTaskAdmin/TaskMonitor/ChildCon/taskInfo";
import TaskAlarm from "@/views/EscortTaskAdmin/TaskMonitor/ChildCon/TaskAlarm";
import TaskUp from "@/views/EscortTaskAdmin/TaskMonitor/ChildCon/TaskUp";
import MoniHeader from "./ChildCon/components/moniHeader";
import LargeVideo from "./ChildCon/components/LVideoModal";
import LargeVideo2 from "./ChildCon/components/LVideoModal2";
import flvjs from "flv.js";
import Vue from "vue";
const { mapActions } = createNamespacedHelpers("videoCall");
import {
  Button,
  Icon,
  Input,
  Select,
  card,
  message,
  Tree,
  empty,
  Popover,
  FormModel,
  modal,
  Popconfirm,
  Badge,
  Radio,
  Checkbox,
  Breadcrumb,
  Tooltip,
} from "ant-design-vue";
//判断浏览器是否为Chrome 等，不是就加载空组件
if (
  getBrowse() === "Chrome" ||
  getBrowse() === "Firefox" ||
  getBrowse() === "Safari"
) {
  var VideoCall = () => import("./ChildCon/VideoCall");
} else {
  var VideoCall = () => import("./ChildCon/Temp");
}
Vue.prototype.$message = message;
Vue.use(Input)
  .use(Select)
  .use(card)
  .use(Tree)
  .use(empty)
  .use(Popover)
  .use(FormModel)
  .use(modal)
  .use(Popconfirm)
  .use(Badge)
  .use(Radio)
  .use(Checkbox)
  .use(Breadcrumb)
  .use(Tooltip);
export default {
  components: {
    AlarmHandleModal,
    VideoCall,
    SendMsg,
    TaskInfo,
    TaskAlarm,
    TaskUp,
    AudioPlayer,
    MoniHeader,
    LargeVideo,
    LargeVideo2,
    vueSeamlessScroll,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      //任务列表
      taskList: [],
      selectedTaskList: [],
      isGettedTaskList: false,
      curTask: {},
      curTask2: {},
      nowTask1: 0,
      nowTask2: 0,
      //轮询控制
      suspendState: true,
      refreshState: false,
      isLastState: false,
      indey: 1,
      intervalTime: 30,
      //预警滚动框
      allAlarmList: [],
      hasAlarmList: false,
      // 拉流开关控制
      isClose: false,
      oneSelect: [],
      //拉流
      isGetedVideo: false,
      isAllOneVideo: false,
      isReadyTask: false,
      baseAppVideoReal: "",
      dssServerReal: "",
      aioDevice: [],
      cameraDevice: [],
      vehicleDevice: [],
      vehicleDeviceList: [],
      player: null,
      appVideoModalVisible: false,
      defaultDevice: "",
      flvPlayerRefO: null,
      flvPlayerObjO: null,
      //拉流2
      aioDevice2: [],
      cameraDevice2: [],
      vehicleDevice2: [],
      vehicleDeviceList2: [],
      baseAppVideoReal2: "",
      player2: null,
      appVideoModalVisible2: false,
      defaultDevice2: "",
      flvPlayerRefT: null,
      flvPlayerObjT: null,
      isOneTask: false,
      //轨迹1
      serverTime: "",
      lastPoint: [],
      timer: null, //轨迹定时
      taskTimer: null, //任务实时
      aioHeartTimer: null,
      zoom: 20,
      markerSpeed: 200,
      speedCount: 1,
      lineArr: [104.163581, 30.742483],
      marker: {},
      map: {},
      driving: {},
      showDriving: {},
      firstArr: [104.163581, 30.742483],
      polyline: {},
      passedPolyline: {},
      curPassedPolyline: {},
      anglePonit: 0,
      flag: false,
      infoWindow: {},
      polygon: null,
      //轨迹2
      serverTime2: "",
      lastPoint2: [],
      timer2: null, //轨迹定时
      taskTimer2: null, //任务实时
      aioHeartTimer2: null,
      zoom2: 20,
      markerSpeed2: 200,
      speedCount2: 1,
      lineArr2: [104.163581, 30.742483],
      marker2: {},
      driving2: {},
      showDriving2: {},
      firstArr2: [104.463581, 30.742483],
      polyline2: {},
      passedPolyline2: {},
      anglePonit2: 0,
      curPassedPolyline2: {},
      lastDecodedFrame1: null,
      lastDecodedFrame2: null,
      flag: false,
      infoWindow2: {},
      polygon2: null,
      //others
      examId: "",

      appVideoModalVisible: false,
      taskDetail: {},
      alarmList: [],
      heartbeat: false, //开闭流控制
      alarmSrc:
        "http://downsc.chinaz.net/Files/DownLoad/sound1/201901/11133.mp3",
      reportList: [],
      //device-tree
      isShow: false,
      isFinish: false,
      alarmCount: 0,
      reportCount: 0,
      //无数据显示空
      isReportShow: false,
      isAlarmShow: false,
      treeData: [
        {
          name: "",
          key: "",
          disabled: false,
          child: [
            {
              name: "",
              key: "",
            },
          ],
        },
      ],
      isShowRadio: false,
      carInfo: [],
      carDeviceId: "",
      ishasCarDevice: false,
      carDeviceList: [],
      carDeviceArr: [],
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      replaceFields: {
        children: "child",
        title: "name",
      },
      //控制确认异常的弹窗的数据
      modalData: {},
      modalVisible: false,
      alarmPopover: false,
      messagePopover: false,
      gTaskId: "",
      gTaskId2: "",
      endOrgCode: "",
      videoObject: {
        width: 1015, // 宽度，也可以支持百分比(不过父元素宽度要有)
        height: 574, // 高度，也可以支持百分比
        container: "#J_prismPlayer1", //“#”代表容器的ID，“.”或“”代表容器的class
        variable: "player", //该属性必需设置，值等于下面的new chplayer()的对象
        autoplay: true, //自动播放
        live: true,
        video: "", //视频地址(必填)
      },
      videoObject2: {
        width: 1015, // 宽度，也可以支持百分比(不过父元素宽度要有)
        height: 574, // 高度，也可以支持百分比
        container: "#J_prismPlayer2", //“#”代表容器的ID，“.”或“”代表容器的class
        variable: "player", //该属性必需设置，值等于下面的new chplayer()的对象
        autoplay: true, //自动播放
        live: true,
        video: "", //视频地址(必填)
      },
      timerout: null,
      playerFlv: null,
      flvUrl1: "",
      flvUrl2: "",
      flvPlayerRefO: null,
      flvPlayerRefT: null,
    };
  },
  computed: {
    ...mapState({
      orgs: (state) => state.app.orgs,
    }),
    carContent() {
      return (item) => {
        return `${item.carNum == null ? "--" : item.carNum}（${item.driver == null ? "--" : item.driver
          }/${item.otherperson == null ? "--" : item.otherperson}）;`;
      };
    },
    defaultCneter() {
      return getArrayObj(
        this.$store.state.app.orgTree,
        JSON.parse(getStore("userInfo")).orgcode
      );
    },
    classOption() {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  watch: {
    selectedTaskList(val) {
      if (val.length > 0) {
        this.suspendState = true;
      } else {
        this.suspendState = false;
      }
    },
    allAlarmList(val) {
      if (val.length > 0) {
        this.hasAlarmList = true;
      } else {
        this.hasAlarmList = false;
      }
    },
  },
  created() { },
  mounted() {
    setTimeout(() => {
      this.initMap();
      this.queryEscort();
      this.getAllTaskAlarm();
      //任务轮询
      setTimeout(() => {
        this.taskPolling(
          this.intervalTime * 1000,
          this.selectedTaskList,
          0,
          this.suspendState
        );
      }, 500);

      this.taskTimer = setInterval(() => {
        this.getAllTaskAlarm();
      }, 10000);
    }, 500);

    this.examId = sessionStorage.getItem("examId");
    let currentStatus = this.$route.query.taskStatus;
    this.taskId = this.$route.query.taskId;
    this.endOrgCode = this.$route.query.endOrgCode;
    if (currentStatus === "4" || currentStatus === "5") {
      this.isFinish = true;
    }
  },
  methods: {
    /**
     * 获取任务列表
     */
    queryEscort() {
      const filterTask = {
        OrgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
        //  OrgCode: "01",
        TaskTypeId: "",
        TaskStatusId: "",
        TaskInfo: "",
        PageIndex: 1,
        PageSize: 10000,
      };
      this.$api.taskMonitor.queryEscort(filterTask).then((res) => {
        if (res.data) {
          let arr = [];
          this.isReadyTask = true;
          res.data.list.forEach((item) => {
            if (item.taskStatus === "3") {
              item.isSelect = true;
              arr.push(item);
            }
          });
          this.taskList = JSON.parse(JSON.stringify(arr));
          this.selectedTaskList = this.taskList.filter((item) => {
            return item.isSelect === true;
          });
          this.isGettedTaskList = true;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    /**
     * 任务勾选
     */
    taskCheck(e, text) {
      const checkStatus = e.target.checked;
      if (checkStatus) {
        this.suspendState = true;
      }
      text.isSelect = checkStatus;
      this.selectedTaskList = this.taskList.filter((item) => {
        return item.isSelect === true;
      });

      this.oneSelect = this.taskList.filter((item) => item.isSelect === true);

      console.log(this.oneSelect);

      // 判断选中一个时
      this.taskPolling(
        this.intervalTime * 1000,
        this.selectedTaskList,
        0,
        this.suspendState
      );
    },
    /**
     * 任务全选
     */
    changeAll(e) {
      console.log("allcheck", e);
      if (e.target.checked === true) {
        this.taskList.map((item) => {
          item.isSelect = true;
        });
      } else {
        this.taskList.map((item) => {
          item.isSelect = false;
        });
      }
      this.selectedTaskList = this.taskList.filter((item) => {
        return item.isSelect === true;
      });
      setTimeout(() => {
        this.taskPolling(
          this.intervalTime * 1000,
          this.selectedTaskList,
          0,
          this.suspendState
        );
      }, 500);
    },
    /**
     * 修改间隔时间
     */
    changeInTime(e) {
      this.timer = null;
      this.timer2 = null;
      clearInterval(this.timer);
      clearInterval(this.timer2);

      if (e >= 1) {
        this.intervalTime = e;
        this.$message.info("轮询间隔时间已修改");
        // this.taskPolling(
        //   this.intervalTime * 1000,
        //   this.selectedTaskList,
        //   0,
        //   this.suspendState
        // );
      } else {
        this.$message.error("轮询间隔时间不得小于10s");
      }
    },

    /**
     * 轮询奇数长度任务列表
     */
    opOddArr(delay, arr, index, status) {
      if (arr.length) {
        // 判断是否要轮询
        if (status) {
          if (this.selectedTaskList.length === 1) {
            index = this.indey = 0;
            this.isOneTask = true;
            this.curTask = arr[index];
            this.gTaskId = arr[index].taskId;
            this.getTaskDetail(arr[index].taskId, 1);
            // console.log("111111111111", arr[index].taskId); //执行轮询操作
            // console.log("222222222222", arr[this.indey].taskId); //执行轮询操作

            this.timerout = setTimeout(() => {
              this.taskPolling(
                this.intervalTime * 1000,
                arr,
                index,
                this.suspendState
              );
            }, this.intervalTime * 1000);
            clearTimeout(this.timerout);
            return;
          } else {
            this.isOneTask = false;
            if (
              this.isLastState === true &&
              this.selectedTaskList.length % 2 !== 0
            ) {
              this.indey = 0; //如果是最后一项，将indey置为0，从头开始轮询
            } else {
              this.indey = index + 1;
            }
          }

          if (index === undefined) {
            index = 0;
          }

          //处理第x项 (x)
          if (!arr[index]) {
            arr[index] = this.selectedTaskList[0]; //轮询到某项，该项一取消勾选，则从第一项从新轮询
          }
          this.curTask = arr[index];
          this.gTaskId = arr[index].taskId;
          this.getTaskDetail(arr[index].taskId, 1);
          console.log("111111111111", arr[index].taskId); //执行轮询操作
          console.log("111111111111====", index);
          //处理第x+1项 (x+1)
          if (!arr[this.indey]) {
            arr[this.indey] = this.selectedTaskList[0];
          }
          this.curTask2 = arr[this.indey];
          console.log("222222222222", arr[this.indey].taskId);
          console.log("222222222222====", this.indey);
          this.gTaskId2 = arr[this.indey].taskId;
          this.getTaskDetail(arr[this.indey].taskId, 2);

          index += 2;
          if (index === arr.length - 1) {
            this.indey = 0;
            index = index;
            this.isLastState = true;
          } else if (index === arr.length) {
            this.indey = 1;
            index = 0;
            this.isLastState = false;
          } else {
            this.isLastState = false;
          }
          if (index > arr.length) {
            index = 1;
            this.isLastState = false;
          }

          this.timerout = setTimeout(() => {
            this.taskPolling(
              this.intervalTime * 1000,
              arr,
              index,
              this.suspendState
            );
          }, this.intervalTime * 1000);
          if (this.selectedTaskList.length === 2) {
            clearTimeout(this.timerout);
          }
        } else {
          //停止任务轮询
          this.suspendStep = index;
          return;
        }
      }
    },
    /**
     * 每次轮询初始化
     */
    taskPolling(delay, arr, index, status) {
      //轮询切换时清除定时器
      clearInterval(this.timer);
      clearInterval(this.timer2);
      clearTimeout(this.timerout);
      this.timerout = null;
      //清除前一次一体机的拉流请求和心跳
      this.videoPause();
      this.map.clearMap();
      //轮询时清除前一次设备下拉框的值
      this.defaultDevice = "";
      this.defaultDevice2 = "";
      //任务轮询
      this.opOddArr(delay, this.selectedTaskList, index, status);
    },
    /**
     * @param {*} option 任务id
     */
    getTaskDetail(option, sort) {
      this.getVideoList(option, sort);
      const filterDetail = {
        examId: this.examId,
        OrgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
        taskId: option,
      };
      this.$api.taskMonitor.getEscortDetail(filterDetail).then((res) => {
        if (res.data) {
          this.taskDetail = res.data;
          this.carInfo = res.data.cars;
          if (this.carInfo) {
            this.carInfo.forEach((item) => {
              this.ishasCarDevice = item.deviceInfo.some((item) => {
                return item.deviceType === "602";
              });
              item.deviceInfo.forEach((item1) => {
                if (item1.deviceType === "602") {
                  this.carDeviceList.push(item1);
                }
              });
            });
          }
          // if (this.ishasCarDevice) {
          //   this.isShow = true;
          //   this.carDeviceId = this.carDeviceList[0].deviceId;
          //   this.getDevice(this.carInfo);
          // } else {
          //   this.isShow = false;
          // }
          let mapCircuit = res.data.mapCircuit;
          this.taskId = res.data.taskId;

          if (sort === 1) {
            if (mapCircuit.circuitArea) {
              this.showArea(JSON.parse(mapCircuit.circuitArea));
            }
            if (mapCircuit.circuitType) {
              this.showLine(
                mapCircuit.circuitType,
                res.data.startOrgCode,
                res.data.endOrgCode
              );
            }
            this.setCurAnimation({
              taskId: this.taskId,
              deviceId: this.carDeviceId,
              taskInfo: res.data,
            });
          } else {
            if (mapCircuit.circuitArea) {
              this.showArea2(JSON.parse(mapCircuit.circuitArea));
            }
            if (mapCircuit.circuitType) {
              this.showLine2(
                mapCircuit.circuitType,
                res.data.startOrgCode,
                res.data.endOrgCode
              );
            }
            this.setCurAnimation2({
              taskId: this.taskId,
              deviceId: this.carDeviceId,
              taskInfo: res.data,
            });
          }
        }
      });
    },
    /*********************************************************************地图元素模块 ************************************************************ */
    /**
     * 初始化地图，组件初始化后mounted调用
     */
    initMap() {
      let orgCode = JSON.parse(getStore("userInfo")).orgcode;
      let startPoint = getArrayObj(this.$store.state.app.orgTree, orgCode);
      if (startPoint) {
        this.firstArr = startPoint;
      }
      this.map = new AMap.Map("container", {
        resizeEnable: true, //窗口大小调整
        center: this.defaultCneter, //中心
      });
    },
    /**
     * 初始化轨迹
     */
    initTrack(taskInfo) {
      this.map.remove(this.marker);
      this.map.remove(this.passedPolyline);
      this.marker = new AMap.Marker({
        map: this.map,
        position: this.firstArr,
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13), //调整图片偏移
        autoRotation: true, //自动旋转
        // angle: -90 //图片旋转角度
      });
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArr,
        showDir: true,
        strokeColor: "#8e8e8e", //线颜色
        strokeOpacity: 0, //线透明度
        strokeWeight: 6, //线宽
      });
      this.curPassedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: "#28F", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 6, //线宽
        zIndex: 100,
      });
      let that = this;
      this.marker.on("moving", function (e) {
        if (that.anglePonit != that.marker.getAngle()) {
          that.anglePonit = that.marker.getAngle();
          that.initLabe(taskInfo);
        }
        that.initLabe(taskInfo);
        that.curPassedPolyline.setPath(e.passedPath);
      });
    },
    // 初始化信息面板
    initLabe(taskInfo) {
      let that = this;
      this.marker.setLabel({
        // offset: new AMap.Pixel(80, 60), //设置文本标注偏移量
        content:
          `<div class='task-wininfo' style='transform: rotate(-${that.anglePonit}deg)' ><h2 class='title'>` +
          that.filterInfoItem(taskInfo.taskName) +
          "</h2><h2 class='title'>" +
          that.filterCar(taskInfo.cars) +
          "</h2><div class='task_info_polling'><ul class='test-rowup'><li>起始机构：<span>" +
          that.filterInfoItem(taskInfo.startOrgName) +
          "</span></li><li> 目标机构： <span >" +
          that.filterInfoItem(taskInfo.endOrgName) +
          "</span></li><li> 押运人： <span >" +
          that.filterInfoItem(taskInfo.escortPerson) +
          "</span></li><li> 车辆（司机/其他人员）： <span >" +
          that.filterCar(taskInfo.cars) +
          // "</span></li><li> 交接人： <span >" +
          // that.filterInfoItem(taskInfo.personName) +
          "</span></li><li> 开始时间： <span >" +
          that.filterInfoItem(taskInfo.startTime) +
          "</span></li>" +
          "<li>结束时间：<span>" +
          that.filterInfoItem(taskInfo.endTime) +
          "  </span></li></ul></div></div>", //设置文本标注内容
        direction: "top", //设置文本标注方位
      });
      // this.map.setFitView();
    },
    /**
     * 初始化轨迹2
     */
    initTrack2(taskInfo) {
      this.map.remove(this.marker2);
      this.map.remove(this.passedPolyline);
      this.marker2 = new AMap.Marker({
        map: this.map,
        position: this.firstArr2,
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13), //调整图片偏移
        autoRotation: true, //自动旋转
        // angle: -90 //图片旋转角度
      });
      this.polyline2 = new AMap.Polyline({
        map: this.map,
        path: this.lineArr2,
        showDir: true,
        strokeColor: "#8e8e8e", //线颜色
        strokeOpacity: 0, //线透明度
        strokeWeight: 6, //线宽
      });
      this.curPassedPolyline2 = new AMap.Polyline({
        map: this.map,
        strokeColor: "#28F", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 6, //线宽
        zIndex: 100,
      });
      let that = this;
      this.marker2.on("moving", function (e) {
        if (that.anglePonit != that.marker.getAngle()) {
          that.anglePonit = that.marker.getAngle();
          that.initLabe(taskInfo);
        }
        that.initLabe(taskInfo);
        that.curPassedPolyline2.setPath(e.passedPath);
      });
    },
    /**
     * 格式化车辆人员信息
     */
    filterCar(op) {
      if (!op) {
        return "--";
      } else {
        return `${op[0].carNum}`;
      }
    },
    filterInfoItem(op) {
      if (!op) {
        return "--";
      } else {
        return op;
      }
    },
    /**
     * 计算初始轨迹车辆角度
     */
    computAngle(lng_a, lat_a, lng_b, lat_b) {
      var a = ((90 - lat_b) * Math.PI) / 180;
      var b = ((90 - lat_a) * Math.PI) / 180;
      var AOC_BOC = ((lng_b - lng_a) * Math.PI) / 180;
      var cosc =
        Math.cos(a) * Math.cos(b) +
        Math.sin(a) * Math.sin(b) * Math.cos(AOC_BOC);
      var sinc = Math.sqrt(1 - cosc * cosc);
      var sinA = (Math.sin(a) * Math.sin(AOC_BOC)) / sinc;
      var A = (Math.asin(sinA) * 180) / Math.PI;
      var res = 0;
      if (lng_b > lng_a && lat_b > lat_a) res = A;
      else if (lng_b > lng_a && lat_b < lat_a) res = 180 - A;
      else if (lng_b < lng_a && lat_b < lat_a) res = 180 - A;
      else if (lng_b < lng_a && lat_b > lat_a) res = 360 + A;
      else if (lng_b > lng_a && lat_b == lat_a) res = 90;
      else if (lng_b < lng_a && lat_b == lat_a) res = 270;
      else if (lng_b == lng_a && lat_b > lat_a) res = 0;
      else if (lng_b == lng_a && lat_b < lat_a) res = 180;
      return res;
    },
    /**
     * 初始化历史轨迹
     * @param {*} option GPS路径组标点
     * @param {*} markerPoint 初始轨迹最后一个点
     */
    initroad(option, markerPoint, taskInfo) {
      this.map.remove(this.passedPolyline);
      this.passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: "#28F",
        path: option,
        zIndex: 100,
        strokeWeight: 6, //线宽
      });
      // let angle = this.computAngle(
      //   option[option.length - 3].lat,
      //   option[option.length - 3].lng,
      //   option[option.length - 1].lat,
      //   option[option.length - 1].lng
      // );
      this.map.add(this.passedPolyline);
      this.marker.setPosition(markerPoint);
      this.initLabe(taskInfo);
      // this.marker.setAngle(angle);    //设置角度后会导致label框一起旋转
    },
    /**
     * 初始化历史轨迹2
     * @param {*} option GPS路径组标点
     * @param {*} markerPoint 初始轨迹最后一个点
     */
    initroad2(option, markerPoint, taskInfo) {
      this.map.remove(this.passedPolyline2);
      this.passedPolyline2 = new AMap.Polyline({
        map: this.map,
        strokeColor: "#28F",
        path: option,
        zIndex: 100,
        strokeWeight: 6, //线宽
      });
      // let angle = this.computAngle(
      //   option[option.length - 3].lat,
      //   option[option.length - 3].lng,
      //   option[option.length - 1].lat,
      //   option[option.length - 1].lng
      // );
      this.map.add(this.passedPolyline2);
      this.marker2.setPosition(markerPoint);
      this.initLabe(taskInfo);
      // this.marker2.setAngle(angle);     //设置角度后会导致label框一起旋转
    },
    /**
     * 车辆轨迹动画
     */
    startAnimation(option, markerPoint) {
      this.marker.moveAlong(this.lineArr, option);
    },
    /**
     * 通过任务id或设备id获取GPS信息，显示轨迹
     * @param {*} option {任务id,设备id}
     */
    setCurAnimation(option) {
      this.map.remove(this.curPassedPolyline);
      this.map.remove(this.passedPolyline);
      let filterGPS = {
        examId: sessionStorage.getItem("examId"),
        taskId:
          this.vehicleDeviceList.length > 0
            ? this.vehicleDeviceList[0].deviceId
            : option.taskId,
        deviceType: "",
        deviceId: option.deviceId,
        lastTime: "",
      };
      this.lastPoint = [];
      this.$api.taskMonitor.getDeviceGPS(filterGPS).then((data) => {
        let currentGPS = data.data.gps;
        this.serverTime = data.data.serverTime;
        this.initTrack(option.taskInfo);
        if (currentGPS) {
          this.lineArr = [];
          let gps = JSON.parse(currentGPS);
          gps.forEach((item) => {
            this.lineArr.push([item[0], item[1]]);
            this.firstArr.push([item[0], item[1]]);
          });
          this.lastPoint = gps[gps.length - 1];
          this.initroad(this.lineArr, this.lastPoint, option.taskInfo); //直接画出历史轨迹，不做动画
          if (this.firstArr.length > 0) {
            this.timer = setInterval(() => {
              this.$api.taskMonitor
                .getDeviceGPS({
                  examId: sessionStorage.getItem("examId"),
                  taskId:
                    this.vehicleDeviceList.length > 0
                      ? this.vehicleDeviceList[0].deviceId
                      : option.taskId,
                  deviceType: "",
                  deviceId: "",
                  lastTime: this.serverTime,
                })
                .then((data) => {
                  let currentGPS1 = data.data.gps;
                  if (currentGPS1) {
                    this.serverTime = data.data.serverTime;
                  }
                  if (currentGPS1) {
                    this.lineArr.length = 0;
                    this.lineArr.push(this.lastPoint);
                    let newGPS = JSON.parse(currentGPS1);
                    newGPS.forEach((item) => {
                      this.lineArr.push([item[0], item[1]]);
                    });
                    let countArr = this.lineArr;
                    this.initTrack(option.taskInfo);
                    this.startAnimation(10000);
                    this.lastPoint = newGPS[newGPS.length - 1];
                  }
                });
            }, 30000);
          }
        } else {
          this.$message.error("没有实时轨迹信息");
          return;
        }
      });
    },
    /**
     * 通过任务id或设备id获取GPS信息，显示轨迹
     * @param {*} option {任务id,设备id}
     */
    setCurAnimation2(option) {
      this.map.remove(this.curPassedPolyline2);
      this.map.remove(this.passedPolyline2);
      let filterGPS = {
        examId: sessionStorage.getItem("examId"),
        taskId:
          this.vehicleDeviceList2.length > 0
            ? this.vehicleDeviceList[0].deviceId
            : option.taskId,
        deviceType: "",
        deviceId: option.deviceId,
        lastTime: "",
      };
      this.lastPoint2 = [];
      this.$api.taskMonitor.getDeviceGPS(filterGPS).then((data) => {
        let currentGPS = data.data.gps;
        this.serverTime2 = data.data.serverTime;
        this.initTrack2(option.taskInfo);
        if (currentGPS) {
          this.lineArr2 = [];
          let gps = JSON.parse(currentGPS);
          gps.forEach((item) => {
            this.lineArr2.push([item[0], item[1]]);
            this.firstArr2.push([item[0], item[1]]);
          });
          this.lastPoint2 = gps[gps.length - 1];

          this.initroad2(this.lineArr2, this.lastPoint2, option.taskInfo); //直接画出历史轨迹，不做动画
          if (this.firstArr2.length > 0) {
            this.timer2 = setInterval(() => {
              this.$api.taskMonitor
                .getDeviceGPS({
                  examId: sessionStorage.getItem("examId"),
                  taskId:
                    this.vehicleDeviceList2.length > 0
                      ? this.vehicleDeviceList[0].deviceId
                      : option.taskId,
                  deviceType: "",
                  deviceId: "",
                  lastTime: this.serverTime2,
                })
                .then((data) => {
                  let currentGPS1 = data.data.gps;
                  if (currentGPS1) {
                    this.serverTime = data.data.serverTime;
                  }
                  if (currentGPS1) {
                    this.lineArr.length = 0;
                    this.lineArr.push(this.lastPoint);
                    let newGPS = JSON.parse(currentGPS1);
                    newGPS.forEach((item) => {
                      this.lineArr.push([item[0], item[1]]);
                    });
                    let countArr = this.lineArr;
                    this.initTrack2(option.taskInfo);
                    this.startAnimation(10000);
                    this.lastPoint = newGPS[newGPS.length - 1];
                  }
                });
            }, 30000);
          }
        } else {
          this.$message.error("没有实时轨迹信息");
          return;
        }
      });
    },
    /**
     * 切换车载设备
     */
    onChange(e) {
      this.setCurAnimation({
        taskId: this.taskId,
        deviceId: e.target.value,
      });
    },
    /**
     * 显示车载设备
     * @param {*} option 车辆信息
     */
    getDevice(option) {
      this.treeData.length = 0;
      this.carDeviceArr = [];
      option.forEach((item, index) => {
        let arr = { name: "", title: "", key: "", child: [] };
        let carDeviceItem = [...this.carDeviceList];

        arr.key = this.carDeviceList[index].deviceId;
        let deviceName = this.carDeviceList[index].deviceId;
        if (deviceName == null) {
          deviceName = "无";
        }
        if (this.carDeviceList[index].deviceType === "602") {
          arr.name = `车牌号：${item.carNum} 车载设备：${deviceName}`;
          arr.title = item.deviceId;
        }
        this.carDeviceArr.push(arr);
      });
      this.isShowRadio = true;
    },
    /**
     * 显示电子围栏
     * @param {*} elecPath 电子围栏坐标点数据
     */
    showArea(elecPath) {
      this.polygon = new AMap.Polygon({
        path: elecPath,
        fillColor: "rgba(255,255,255)", // 多边形填充颜色
        fillOpacity: "0.6",
        borderWeight: 1, // 线条宽度，默认为 1
        strokeColor: "red", // 线条颜色
      });

      this.map.add(this.polygon);
    },
    showArea2(elecPath) {
      //this.map.clearMap();
      this.polygon2 = new AMap.Polygon({
        path: elecPath,
        fillColor: "rgba(255,255,255)", // 多边形填充颜色
        fillOpacity: "0.6",
        borderWeight: 1, // 线条宽度，默认为 1
        strokeColor: "red", // 线条颜色
      });

      this.map.add(this.polygon2);
    },
    /**
     * 显示规划路径
     * @param {*} option 规划路径方案：最快、最短....
     * @param {*} startOrgCode 起始机构码
     * @param {*} endOrgCode 目的机构码
     */
    showLine(option, startOrgCode, endOrgCode) {
      switch (option) {
        case "1":
          this.policy = "AMap.DrivingPolicy.LEAST_TIME";
          break;
        case "2":
          this.policy = "AMap.DrivingPolicy.LEAST_FEE";
          break;
        case "3":
          this.policy = "AMap.DrivingPolicy.LEAST_DISTANCE";
          break;
        case "4":
          this.policy = "AMap.DrivingPolicy.REAL_TRAFFIC";
          break;
      }
      if (option) {
        this.drivingOptionPolicy = {
          policy: this.policy,
        };
      } else {
        // this.$message.warning("未获取到路径类型");
        this.drivingOptionPolicy = {
          policy: "AMap.DrivingPolicy.LEAST_TIME",
        };
      }
      this.showDriving = new AMap.Driving({
        map: this.map,
      });
      let startOrg = getArrayObj(this.$store.state.app.orgTree, startOrgCode);
      let endOrg = getArrayObj(this.$store.state.app.orgTree, endOrgCode);
      this.showDriving.setPolicy(this.drivingOptionPolicy);
      if (startOrg && endOrg) {
        this.showDriving.search(startOrg, endOrg, (status, result) => {
          console.log("000000000000000000000");
          if (status === "complete") {
          } else {
            console.log("获取驾车数据失败：" + result);
          }
        });
      } else {
        this.$message.error("起始点或目的点位置信息错误");
      }
    },
    showLine2(option, startOrgCode, endOrgCode) {
      switch (option) {
        case "1":
          this.policy = "AMap.DrivingPolicy.LEAST_TIME";
          break;
        case "2":
          this.policy = "AMap.DrivingPolicy.LEAST_FEE";
          break;
        case "3":
          this.policy = "AMap.DrivingPolicy.LEAST_DISTANCE";
          break;
        case "4":
          this.policy = "AMap.DrivingPolicy.REAL_TRAFFIC";
          break;
      }
      if (option) {
        this.drivingOptionPolicy = {
          policy: this.policy,
        };
      } else {
        // this.$message.warning("未获取到路径类型");
        this.drivingOptionPolicy = {
          policy: "AMap.DrivingPolicy.LEAST_TIME",
        };
      }
      this.showDriving2 = new AMap.Driving({
        map: this.map,
      });
      let startOrg = getArrayObj(this.$store.state.app.orgTree, startOrgCode);
      let endOrg = getArrayObj(this.$store.state.app.orgTree, endOrgCode);
      this.showDriving2.setPolicy(this.drivingOptionPolicy);
      if (startOrg && endOrg) {
        this.showDriving2.search(startOrg, endOrg, (status, result) => {
          //   console.log("11111111111111111111111");
          if (status === "complete") {
          } else {
            console.log("获取驾车数据失败：" + result);
          }
        });
      } else {
        this.$message.error("起始点或目的点位置信息错误");
      }
    },
    /**
     * 获取任务预警信息
     * @param {*} option 任务ID
     */
    getAllTaskAlarm() {
      const filterAlarm = {
        examId: this.examId,
        orgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
        alarmType: "",
        keyWord: "",
        startTime: "",
        endTime: "",
        pageIndex: 1,
        pageSize: 100,
        taskId: "",
      };
      this.$api.taskMonitor.queryEscortAlarm(filterAlarm).then((res) => {
        if (res.data) {
          let resList = res.data.list;
          this.allAlarmList = resList;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //返回预警类型
    returnAlarmType(id) {
      let arr =
        JSON.parse(sessionStorage.getItem("systemConf")).alarmType || [];

      if (!arr || arr.length == 0) {
        return "-";
      } else {
        for (let item of arr) {
          if (id == item.id) return item.name;
        }
      }
    },
    /**
     * 预警信息处置
     * @param {*} data 该预警项
     */
    handleAlarm(data) {
      this.alarmPopover = false;
      this.modalVisible = true;
      this.modalData = data;
      setTimeout(() => (this.$refs.AlarmHandleModal.visible = true), 0);
    },

    /**
     * 播放预警/上报语音提醒
     * @param {*} sound 音频资源地址
     */
    playSound(sound) {
      if (sound) {
        var audio = new Audio(sound);
        audio.src = sound;
        try {
          audio.play();
        } catch (e) {
          console.log(e);
        }
      }
    },
    /**
     * 关闭车辆设备弹窗
     */
    toggle() {
      this.isShow = false;
    },
    /******************************************************************************* 视频拉流****************************************************************************************/

    /**
     * 获取视频流设备列表
     */
    getVideoList(taskId, sort) {
      this.$api.taskMonitor
        .getEscortCameraDevice({ escortId: taskId })
        .then((res) => {
          if (res.result) {
            let device = res.data;
            if (device.length > 0) {
              this.isGetedVideo = true;
              if (sort === 1) {
                this.aioDevice = [];
                this.vehicleDeviceList = [];
                this.cameraDevice = [];
                device.forEach((item) => {
                  if (item.devType == "606") {
                    this.aioDevice.push(item);
                  } else if (item.devType == "604") {
                    this.cameraDevice.push(item);
                  } else if (item.devType == "602") {
                    this.vehicleDevice = [];
                    for (let i = 0; i < item.channelNum; i++) {
                      let obj = {
                        deviceId: item.deviceId,
                        devType: item.devType,
                        deviceName: `通道${i + 1}`,
                        deviceIndex: i,
                      };
                      this.vehicleDevice.push(obj);
                    }
                    this.vehicleDeviceList.push(this.vehicleDevice);
                  } else {
                    this.$message.warning(`未知设备类型${item.devType}`);
                  }
                });
                this.initPlay(taskId, sort, this.aioDevice, this.cameraDevice);
              } else {
                this.aioDevice2 = [];
                this.vehicleDeviceList2 = [];
                this.cameraDevice2 = [];
                device.forEach((item) => {
                  if (item.devType == "606") {
                    this.aioDevice2.push(item);
                  } else if (item.devType == "604") {
                    this.cameraDevice2.push(item);
                  } else if (item.devType == "602") {
                    this.vehicleDevice2 = [];
                    for (let i = 0; i < item.channelNum; i++) {
                      let obj = {
                        deviceId: item.deviceId,
                        devType: item.devType,
                        deviceName: `通道${i + 1}`,
                        deviceIndex: i,
                      };
                      this.vehicleDevice2.push(obj);
                    }
                    this.vehicleDeviceList2.push(this.vehicleDevice2);
                  } else {
                    this.$message.warning(`未知设备类型${item.devType}`);
                  }
                });
                this.initPlay(
                  taskId,
                  sort,
                  this.aioDevice2,
                  this.cameraDevice2
                );
              }
            } else {
              this.$message.error("没有视频设备");
            }
          } else {
            this.$message.error("获取视频流设备失败");
          }
        });
    },
    /**
     * 一体机拉流心跳
     */
    aioVideoStreamHeart(taskId) {
      this.$api.taskMonitor
        .aioVideoStreamHeart({ escortId: taskId })
        .then((res) => { });
    },
    /**
     * 视频1播放flv
     * @param {Object} flvPlayerRefO 视频1挂在的dom节点
     */
    initFlv(flvPlayerRefO) {
      this.$nextTick(() => {
        if (flvjs.isSupported()) {
          this.flvPlayerObjO = flvjs.createPlayer(
            {
              type: "flv",
              isLive: true, //<====加个这个
              url: this.flvUrl1,
              hasAudio: true,
              hasVideo: true,
            },
            {
              cors: true, // 是否跨域
              stashInitialSize: 128, // 缓存大小(kb)  默认384kb
              enableStashBuffer: false, // 是否启用缓存
              enableWorker: true, // 是否多线程工作
              autoCleanupSourceBuffer: true, // 是否自动清理缓存
            }
          );
          this.flvPlayerObjO.attachMediaElement(flvPlayerRefO);
          this.flvPlayerObjO.load(); //加载
          this.flvPlayerObjO.play();
          this.replayVideo(
            this.flvPlayerObjO,
            this.initFlv,
            document.getElementById("videoElementO")
          );
        }
      });
    },
    /**
     * 视频2播放flv
     * @param {Object} flvPlayerRefT 视频2挂在的dom节点
     */
    initFlv2(flvPlayerRefT) {
      this.$nextTick(() => {
        if (flvjs.isSupported()) {
          this.flvPlayerObjT = flvjs.createPlayer(
            {
              type: "flv",
              isLive: true, //<====加个这个
              url: this.flvUrl2,
              hasAudio: true,
              hasVideo: true,
            },
            {
              cors: true, // 是否跨域
              stashInitialSize: 128, // 缓存大小(kb)  默认384kb
              enableStashBuffer: false, // 是否启用缓存
              enableWorker: true, // 是否多线程工作
              autoCleanupSourceBuffer: true, // 是否自动清理缓存
            }
          );
          this.flvPlayerObjT.attachMediaElement(flvPlayerRefT);
          this.flvPlayerObjT.load(); //加载
          this.flvPlayerObjT.play();
          this.replayVideo(
            this.flvPlayerObjT,
            this.initFlv2,
            document.getElementById("videoElementT")
          );
        }
      });
    },
    // 重载视频
    replayVideo(obj, func, ele) {
      // 画面卡死
      obj.on(flvjs.Events.STATISTICS_INFO, function (res) {
        if (this.lastDecodedFrame == 0) {
          this.lastDecodedFrame = res.decodedFrames;
          return;
        }
        if (this.lastDecodedFrame != res.decodedFrames) {
          this.lastDecodedFrame = res.decodedFrames;
        } else {
          this.lastDecodedFrame = 0;
          if (obj) {
            obj.pause();
            obj.unload();
            obj.detachMediaElement();
            obj.destroy();
            obj = null;
            func(ele);
          }
        }
      });
      // 断流重连
      obj.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
        console.log("errorType:", errorType);
        console.log("errorDetail:", errorDetail);
        console.log("errorInfo:", errorInfo);
        //视频出错后销毁重新创建
        if (obj) {
          setTimeout(() => {
            obj.pause();
            obj.unload();
            obj.detachMediaElement();
            obj.destroy();
            obj = null;
            func(ele);
          }, 1000);
        }
      });
      // 视频卡顿监听
      obj.on(flvjs.Events.VIDEO_FROZEN, (errorType, errorDetail, errorInfo) => {
        console.log("errorType:", errorType);
        console.log("errorDetail:", errorDetail);
        console.log("errorInfo:", errorInfo);
        //视频出错后销毁重新创建
        if (obj) {
          setTimeout(() => {
            obj.pause();
            obj.unload();
            obj.detachMediaElement();
            obj.destroy();
            obj = null;
            func(ele);
          }, 1000);
        }
      });
    },
    /**
     *  初始化播放 包含一体机和摄像机播放
     */
    initPlay(taskId, sort, aio, camera) {
      if (aio[0]) {
        //如果有一体机则默认播放一体机视频
        //从基础配置接口中获取一体机基础地址
        let baseAppVideo = JSON.parse(sessionStorage.getItem("systemConf"))
          .appStreamingAddr;
        // let baseAppVideo = `http://10.20.5.95:8080/live/livestream_${
        //   Math.random * 200
        // }.flv`;
        // baseAppVideo =
        //   baseAppVideo.slice(0, 4) +
        //   "s" +
        //   baseAppVideo.slice(4, baseAppVideo.length);
        //一体机拉流要发送接口请求表示开始拉流
        this.$api.taskMonitor
          .askMobileVideo({ taskId: taskId, type: 1 })
          .then((res) => {
            this.isClose = true;
            //接口返回result不对(有流返回true,没有返回false)，故临时改成！res.result
            if (res.result) {
              if (sort === 1) {
                //处理视频1播放flv
                this.defaultDevice = aio[0].deviceId;
                //拼接完整flv格式的一体机拉流地址
                this.baseAppVideoReal = `${baseAppVideo}${taskId}.flv`;
                // this.baseAppVideoReal = `http://10.20.5.95:8080/live/livestream_${parseInt(
                //   Math.random() * 200
                // )}.flv`;
                this.flvUrl1 = this.baseAppVideoReal;
                //将之前的flv播放对象销毁，不然内存溢出
                if (this.flvPlayerObjO !== null) {
                  this.flvPlayerObjO.unload();
                  this.flvPlayerObjO.detachMediaElement();
                  this.flvPlayerObjO.destroy();
                  this.flvPlayerObjO = null;
                }
                //播放当前轮询到这次的视频
                this.initFlv(document.getElementById("videoElementO"));
                //一体机拉流要发送心跳
                this.aioHeartTimer = setInterval(() => {
                  this.aioVideoStreamHeart(taskId);
                }, 15000);
              } else {
                //处理视频2播放flv
                this.defaultDevice2 = aio[0].deviceId;
                //拼接完整flv格式的一体机拉流地址
                this.baseAppVideoReal2 = `${baseAppVideo}${taskId}.flv`;
                // this.baseAppVideoReal2 = `http://10.20.5.95:8080/live/livestream_${parseInt(
                //   Math.random() * 200
                // )}.flv`;
                this.flvUrl2 = this.baseAppVideoReal2;
                //将之前的flv播放对象销毁，不然内存溢出
                if (this.flvPlayerObjT !== null) {
                  this.flvPlayerObjT.unload();
                  this.flvPlayerObjT.detachMediaElement();
                  this.flvPlayerObjT.destroy();
                  this.flvPlayerObjT = null;
                }
                //播放当前轮询到这次的视频
                this.initFlv2(document.getElementById("videoElementT"));
                //一体机拉流要发送心跳
                this.aioHeartTimer2 = setInterval(() => {
                  this.aioVideoStreamHeart(taskId);
                }, 15000);
              }
            } else {
              // if()
              this.$message.error("一体机视频流获取失败，请切换其他视频流");
            }
          });
      } else {
        //没有一体机则默认播放摄像机视频
        this.$api.taskMonitor
          .getEscortCameraUrl({
            deviceId: camera[0].deviceId,
            escortId: taskId,
          })
          .then((res) => {
            if (res.result) {
              var cameraUrl = res.data;
              setTimeout(() => {
                if (sort === 1) {
                  this.defaultDevice = this.cameraDevice[0].deviceId;
                  this.$refs.largeVideo.playVideo(cameraUrl);
                  this.videoObject.video = cameraUrl;
                  new ckplayer(this.videoObject);
                } else {
                  this.defaultDevice2 = this.cameraDevice2[0].deviceId;
                  this.$refs.largeVideo2.playVideo(cameraUrl);
                  this.videoObject2.video = cameraUrl;
                  new ckplayer(this.videoObject2);
                }
              }, 100);
            }
          });
      }
    },

    /**
     * 视频流设备切花
     * @param {*} value 设备id
     */
    videoChange(value, option, sort) {
      let deviceType = option.data.attrs.type;
      if (deviceType !== "606") {
        if (sort === 1) {
          this.$api.taskMonitor
            .askMobileVideo({ taskId: this.gTaskId, type: 0 })
            .then((res) => { });
          clearInterval(this.aioHeartTimer);
          this.aioHeartTimer = null;
        } else {
          this.$api.taskMonitor
            .askMobileVideo({ taskId: this.gTaskId2, type: 0 })
            .then((res) => { });
          clearInterval(this.aioHeartTimer2);
          this.aioHeartTimer2 = null;
        }
      }

      if (deviceType === "606") {
        setTimeout(() => {
          this.initPlay();
        }, 100);
      } else if (deviceType === "604") {
        if (sort === 1) {
          this.playCamera(value, sort, this.gTaskId);
        } else {
          this.playCamera(value, sort, this.gTaskId2);
        }
      } else if (deviceType === "602") {
        //车载设备
        this.isAllOneVideo = false;
        let channelNum = option.data.attrs.channelNum;
        let parentId = option.data.attrs.parentId;
        let basevehivleVideo = JSON.parse(sessionStorage.getItem("systemConf"))
          .dssServer;
        let endPosition = basevehivleVideo.indexOf("{SourceId}");
        basevehivleVideo = basevehivleVideo.slice(0, endPosition);
        this.dssServerReal = `${basevehivleVideo}${parentId}%24${channelNum}/substream/1.m3u80`;
        if (sort === 1) {
          this.videoObject.video = this.dssServerReal;
          new ckplayer(this.videoObject);
        } else {
          this.videoObject2.video = this.dssServerReal;
          new ckplayer(this.videoObject2);
        }
      } else {
        this.$message.error("设备类型错误");
      }
    },
    /**
     * 摄像机拉流
     */
    playCamera(value, sort, taskId) {
      this.$api.taskMonitor
        .getEscortCameraUrl({ deviceId: value, escortId: taskId })
        .then((res) => {
          if (res.result) {
            let cameraUrl = res.data;
            setTimeout(() => {
              if (sort === 1) {
                this.videoObject.video = cameraUrl;
                new ckplayer(this.videoObject);
              } else {
                this.videoObject2.video = cameraUrl;
                new ckplayer(this.videoObject2);
              }
            }, 100);
          }
        });
    },
    /**
     * 打开视频放大弹窗
     */
    enlargeVideo(num) {
      if (num === 1) {
        this.$refs.largeVideo.appVideoModalVisible = true;
        this.$nextTick(() => {
          this.$refs.largeVideo.playVideo(this.baseAppVideoReal);
        });
      } else {
        this.$refs.largeVideo2.appVideoModalVisible2 = true;
        this.$nextTick(() => {
          this.$refs.largeVideo2.playVideo(this.baseAppVideoReal2);
        });
      }
    },
    /**
     * 一体机关闭推流和心跳
     */
    videoPause() {
      // this.aioHeartTimer = null;
      // this.aioHeartTimer2 = null;
      clearInterval(this.aioHeartTimer);
      clearInterval(this.aioHeartTimer2);
      if (this.isClose) {
        this.$api.taskMonitor
          .askMobileVideo({ taskId: this.gTaskId, type: 0 })
          .then((res) => {
            this.isClose = false;
          });
        if (this.oneSelect.length > 1) {
          this.$api.taskMonitor
            .askMobileVideo({ taskId: this.gTaskId2, type: 0 })
            .then((res) => {
              this.isClose = false;
            });
        }
      }
    },
  },
  beforeDestroy() {
    if (this.timer || this.taskTimer) {
      clearInterval(this.timer);
      clearInterval(this.taskTimer);
      clearInterval(this.timer2);
      clearInterval(this.taskTimer2);
    }
    this.timer = null;
    this.timer2 = null;

    this.videoPause();
    this.suspendState = false;
  },
};
</script>
<style  lang='less'>
.ant-popover-placement-leftBottom {
  position: fixed;
  top: 528px !important;
  .ant-popover-arrow {
    display: none;
  }
}
@media screen and(max-width: 1800px) {
  .ant-popover-placement-leftBottom {
    position: fixed;
    top: 460px !important;
    .ant-popover-arrow {
      display: none;
    }
  }
}
@media screen and(max-width: 1680px) {
  .ant-popover-placement-leftBottom {
    position: fixed;
    top: 360px !important;
    .ant-popover-arrow {
      display: none;
    }
  }
}

.operators {
  display: none !important;
}
.my-modal {
  .ant-modal {
    width: 1000px !important;
  }
  .ant-modal-body {
    height: 600px !important;
    margin: 0 auto;
    padding: 0px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    .modal-select {
      height: 100%;
      position: relative;
      video {
        width: 100%;
        height: 100%;
      }
      .no_video {
        .false_video {
          position: absolute;
          font-size: 40px;
          color: rgba(0, 0, 0, 0.4);
          bottom: 20%;
          left: 12%;
        }
      }
    }
  }
}

.ant-select-dropdown-menu-item-disabled {
  color: rgba(87, 94, 102, 1);
  cursor: auto;
}
.ant-select-dropdown-menu-item-disabled:hover {
  color: rgba(87, 94, 102, 1);
  cursor: auto;
}

.task-select-option-title {
  width: 40px;
  color: rgba(51, 128, 204);
  display: inline-block;
  vertical-align: middle;
}
.task-select-option-start {
  width: 130px;
  // color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.task-select-option-end {
  width: 130px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}

#task_monitor {
  width: 100%;
  height: 92%;
  padding-left: 10px;
  margin-bottom: 0px;
  .task_monitor_map {
    display: inline-block;
    width: 80%;
    height: 100%;
    position: relative;
    float: left;
    #container {
      width: 100%;
      height: 100%;
    }
    .task_alarm_polling {
      width: 46%;
      height: 80px;
      display: inline-block;
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      bottom: 10px;
      right: 90px;
      border-radius: 5px;
      overflow: hidden;
      padding-left: 10px;
      color: rgba(255, 255, 255, 0.8);
      .seamless-warp {
        width: 100%;
        height: calc(100% - 16px);
        overflow: hidden;
        .seamless-warp-li {
          width: 90%;
          height: 36px;
          line-height: 36px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .seamless-warp-li-taskname {
            display: inline-block;
            width: 160px;
            vertical-align: middle;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
          span {
            margin-right: 6px;
          }
        }
      }
    }
    .task_list {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 500px;
    }

    //device-tree
    .deviceList {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 480px;
      .close-tree {
        position: absolute;
        top: 14px;
        right: 10px;
      }
    }
    .map-operation {
      position: absolute;
      left: 10px;
      bottom: 10px;
    }
    .task-contact {
      position: absolute;
      right: 10px;
      bottom: 300px;
      width: 70px;
      height: 80px;
      background-color: #fff;

      .task-popover {
        width: 52px;
        height: 80px;
        margin: 10px;
        font-size: 12px;
        div {
          width: 100%;
          text-align: center;
        }
        .icon {
          margin: 10px auto;
          width: 100%;
          height: 20px;
          font-size: 20px;
          text-align: center;
        }
      }
      .task-message {
        // border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }
      //icon样式
      .task-button {
        color: #737980;
        cursor: pointer;
        &:hover {
          color: #3687d9;
        }
      }
      .ant-popover-open {
        color: #3687d9;
      }
      .svg-icon {
        margin: 5px 0 5px 12px;
      }
    }

    .task-up {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 70px;
      height: 280px;
      background-color: #fff;
      .task-popover {
        width: 52px;
        height: 70px;
        margin: 10px;
        //background: red;
        font-size: 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        div {
          width: 100%;
          text-align: center;
        }
        .icon {
          margin: 10px auto;
          width: 32px;
          height: 32px;
          // font-size: 30px;
          text-align: center;
        }
        .ant-badge-count,
        .ant-badge-dot,
        .ant-badge .ant-scroll-number-custom-component {
          position: absolute;
          top: 0px;
          right: 0;
          -webkit-transform: translate(50%, -50%);
          transform: translate(50%, -50%);
          -webkit-transform-origin: 100% 0%;
          transform-origin: 100% 0%;
        }
      }
      .task-details,
      .task-alarm {
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }
      //icon样式
      .task-button {
        color: #737980;
        cursor: pointer;
        &:hover {
          color: #3687d9;
        }
      }
      .ant-popover-open {
        color: #3687d9;
      }
      .svg-icon {
        margin: 5px 0 5px 12px;
      }
    }
  }
}
//视频列表样式
.video_list {
  display: inline-block;
  width: 20%;
  height: 100%;
  padding: 0 10px;
  .ant-select-selection--single {
    position: relative;
    height: 22px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0);
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
  .ant-select-selection__rendered {
    position: relative;
    display: block;
    margin-right: 11px;
    margin-left: 11px;
    line-height: 18px;
  }
  .ant-select-arrow {
    display: inline-block;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    top: 50%;
    right: 11px;
    margin-top: -6px;
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
    line-height: 1;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    color: white;
  }
  .ant-select-dropdown-menu-item-selected {
    color: rgba(0, 0, 0, 0.65);
    font-weight: 600;
    background-color: red;
  }
  .video_item {
    position: relative;
    .enlarge_logo {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background: #3380cc;
      text-align: center;
    }
    .video_change {
      position: absolute;
      top: 0;
      left: 0;
      width: 100px;
      color: rgba(255, 255, 255, 0.8);
      margin: 2px;
    }
  }
}

.ant-card {
  line-height: 1 !important;
}
/deep/.ant-card-head {
  min-height: 48px;
  margin-bottom: -1px;
  padding: 0 24px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  background: transparent;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 2px 2px 0 0;
}
.ant-card-body {
  padding: 0;
}
.messagePopClass {
  .ant-popover-inner-content {
    height: 360px;
  }
}
// 任务信息滚动样式
@keyframes rowup {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(0, -90px, 0);
    transform: translate3d(0, -90px, 0);
  }
}
.amap-marker-label {
  border: 0;
  background-color: transparent;
  //  transform: rotate(90deg);
  position: absolute;
  z-index: 2;
}
.task-wininfo {
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
  color: #fff;
  width: 220px;
}
.task-wininfo .title {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 24px;
  color: #ffffff;
  opacity: 1;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task_info_polling {
  width: 200px;
  position: relative;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task_info_polling .test-rowup {
  position: relative;
}
.task_info_polling .test-rowup li {
  margin: 4px 0;
  -webkit-animation: 15s rowup linear infinite normal;
  animation: 15s rowup linear infinite normal;
}
//用于重置任务列表下拉的层级样式（解决遮挡视频弹窗问题）
.ant-select-dropdown.select-class {
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
  position: absolute;
  top: -9999px;
  left: -9999px;
  z-index: 10; //*
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 14px;
  font-variant: initial;
  background-color: #fff;
  border-radius: 4px;
  outline: none;
  -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>