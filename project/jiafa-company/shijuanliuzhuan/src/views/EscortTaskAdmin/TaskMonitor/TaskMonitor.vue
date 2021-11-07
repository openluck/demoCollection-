<template>
  <div id="task-monitor">
    <!-- 页面头部 -->
    <moni-header></moni-header>
    <div class="task_monitor_map">
      <!-- 地图容器 -->
      <div id="container"></div>
      <!-- 任务预警小窗 -->
      <div class="task_alarm_polling">
        <vue-seamless-scroll
          class="seamless-warp"
          :data="allAlarmList"
          :class-option="classOption"
        >
          <ul>
            <li
              class="seamless-warp-li"
              v-for="(item, index) in allAlarmList"
              :key="index"
              @click="handleAlarm(item)"
            >
              <span>
                <img src="../../../assets/alarm_log.png" alt />
              </span>
              <span>
                <a-button
                  size="small"
                  style="width:54px;height:24px;background:rgba(255,255,255,.1);color:white;text-aligncenter"
                  >处置</a-button
                >
              </span>
              <span class="seamless-warp-li-taskname" :title="item.taskName">{{
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
      </div>
      <div class="task-list">
        <!-- <span class="iconBox" @click="showModal" v-if="isReadyTask">
          <icon name="lx" scale="3"></icon>
        </span>-->
        <!-- 视频拉流模态框 -->
        <a-modal
          v-model="appVideoModalVisible"
          footer
          @cancel="this.videoPause"
          wrapClassName="my-modal"
          :destroyOnClose="true"
        >
          <span slot="title">
            <a-select
              style="width: 200px"
              :defaultValue="aioDevice.deviceId"
              @change="videoChange"
            >
              <a-select-option
                :type="aioDevice.devType"
                :value="aioDevice.deviceId"
                >{{ aioDevice.devName }}</a-select-option
              >
              <a-select-option
                v-for="(item, index) in cameraDevice"
                :key="index"
                :type="item.devType"
                :value="item.deviceId"
                >{{ item.devName }}</a-select-option
              >
              <a-select-opt-group
                v-for="(item, index) in vehicleDeviceList"
                :key="index"
              >
                <span slot="label" style="font-size: 14px"
                  >车载设备{{ index + 1 }}</span
                >
                <a-select-option
                  :type="item1.devType"
                  :parentId="item1.deviceId"
                  :channelNum="item1.deviceIndex"
                  v-for="item1 in item"
                  :key="item1.deviceId"
                  >{{ item1.deviceName }}</a-select-option
                >
              </a-select-opt-group>
            </a-select>
          </span>
          <section class="modal-select">
            <!-- <div id="J_prismPlayer" v-if="isGetedVideo" style="width:100%; height:100%;">
              <div class="no_video" v-show="isAllOneVideo">
                <img style="width:100%;height:100%" alt src="@/assets/false_video.jpg" />
                <div class="false_video">一体机视频流获取失败，请选择其他设备</div>
              </div>
            </div>

            <div class="no_video" v-else>
              <img style="width:100%;height:100%" alt src="@/assets/no_video.png" />
            </div>-->
          </section>
        </a-modal>
        <!-- 进行中任务列表 -->
        <a-select
          v-if="isReadyTask"
          style="width: 85%"
          class="task-select"
          dropdownClassName="select-class"
          :defaultValue="$route.query.taskId"
          @change="handleChange"
        >
          <a-select-option
            v-for="(taskItem, index) in taskList"
            :data="taskItem"
            :value="taskItem.taskId"
            :key="index"
            class="task-select-option"
          >
            <span class="task-select-option-title">【起】</span>
            <span
              :title="taskItem.startOrgName"
              class="task-select-option-start"
              >{{ taskItem.startOrgName }}</span
            >
            <span class="task-select-option-title">【终】</span>
            <span :title="taskItem.endOrgName" class="task-select-option-end">{{
              taskItem.endOrgName
            }}</span>
          </a-select-option>
        </a-select>
      </div>
      <transition>
        <div class="deviceList" v-show="isShow">
          <a-card title="车辆设备">
            <!-- <span class="close-tree" @click="toggle()">
            <icon name="close" scale="2"></icon>
            </span>-->
            <a-radio-group
              v-if="isShowRadio"
              @change="onChange"
              :default-value="carDeviceArr[0].key"
            >
              <a-radio
                v-for="(item, index) in carDeviceArr"
                style="
                  width: 420px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  margin-left: 20px;
                "
                :key="index"
                :style="radioStyle"
                :value="item.key"
                >{{ item.name }}</a-radio
              >
            </a-radio-group>
          </a-card>
        </div>
      </transition>
      <!-- 视频会议 -->
      <div class="task-contact" v-show="!isFinish">
        <a-popover
          class="task-popover"
          trigger="click"
          placement="leftTop"
          v-model="messagePopover"
          overlayClassName="messagePopClass"
          :destroyTooltipOnHide="true"
        >
          <template slot="content">
            <send-msg v-if="taskId" :selectedTask="selectedTask" />
          </template>
          <div class="task-button">
            <icon name="xiaoxi" scale="3"></icon>
            <div>沟通联系</div>
          </div>
        </a-popover>
      </div>
      <!-- 任务信息 -->
      <div class="task-up">
        <a-popover
          class="task-popover task-details"
          trigger="click"
          placement="leftBottom"
        >
          <a-badge :count="alarmCount" style="visibility: hidden">
            <a href="#" class="head-example" />
          </a-badge>
          <template slot="content">
            <div class="detail-content">
              <ul>
                <li>
                  <span>任务名称：</span>
                  {{ this.taskDetail.taskName }}
                </li>
                <li>
                  <span>起始机构：</span>
                  {{ this.taskDetail.startOrgName }}
                </li>
                <li>
                  <span>目标机构：</span>
                  {{ this.taskDetail.endOrgName }}
                </li>
                <li>
                  <span>押运人：</span>
                  {{ this.taskDetail.escortPerson }}
                </li>
                <div class="car_info">
                  <span>车辆（司机/其他人员）：</span>
                  <div class="car_content">
                    <span v-for="(item, index) in carInfo" :key="index">{{
                      carContent(item)
                    }}</span>
                  </div>
                </div>
                <!-- <li>
                  <span>交接人</span>
                  {{ this.taskDetail.personName }}
                </li> -->
                <li>
                  <span>开始时间:</span>
                  {{ this.taskDetail.startTime }}
                </li>
                <li>
                  <span>结束时间:</span>
                  {{ this.taskDetail.endTime }}
                </li>
              </ul>
            </div>
          </template>
          <div class="task-button">
            <icon class="icon" name="renwuxinxi" scale="3"></icon>
            <div>任务信息</div>
          </div>
        </a-popover>
        <!-- 任务预警 -->
        <a-popover
          class="task-popover task-alarm"
          trigger="click"
          placement="leftBottom"
          v-model="alarmPopover"
        >
          <a-badge :count="alarmCount" showZero>
            <a href="#" class="head-example" />
          </a-badge>
          <template slot="content">
            <div class="alarm-content" v-if="isAlarmShow">
              <div class="alarm-content-header">
                <span style="width: 80px">操作</span>
                <span style="width: 140px">预警时间</span>
                <span style="width: 100px">预警类型</span>
                <span style="width: 200px">备注</span>
              </div>
              <ul>
                <li
                  v-for="(item, index) in alarmList"
                  :key="index"
                  class="alarm-li"
                  @click="handleAlarm(item)"
                >
                  <span class="task-status" style="width: 80px">
                    <a-button size="small">{{
                      item.actionStatus === 0
                        ? "未处置"
                        : item.actionStatus === 1
                        ? "正常"
                        : "异常"
                    }}</a-button>
                  </span>
                  <span class="task-time" style="width: 140px">{{
                    item.alarmTime
                  }}</span>
                  <span
                    class="task-type"
                    style="width: 100px"
                    :title="returnAlarmType(item.alarmType)"
                    >{{ returnAlarmType(item.alarmType) }}</span
                  >
                  <span
                    class="task-remark"
                    style="width: 200px"
                    :title="item.remark"
                    >{{ item.remark }}</span
                  >
                </li>
              </ul>
            </div>
            <div class="alarm-content" style="padding-top: 80px" v-else>
              <a-empty />
            </div>
          </template>
          <!-- <div class="task-button" @click="()=>getTaskAlarm(taskId)">
          <icon class="icon" name="renwuyujing" scale="3"></icon>
          <div>任务预警</div>
          </div>-->
          <div class="task-button">
            <icon class="icon" name="renwuyujing" scale="3"></icon>
            <div>任务预警</div>
          </div>
        </a-popover>
        <!-- 任务上报 -->
        <a-popover
          class="task-popover task-report"
          trigger="click"
          placement="leftBottom"
        >
          <a-badge :count="reportCount" showZero>
            <a href="#" class="head-example" />
          </a-badge>
          <template slot="content">
            <div class="report-content" v-if="isReportShow">
              <div class="report-content-header">
                <span style="width: 80px">状态</span>
                <span style="width: 140px">上报时间</span>
                <span style="width: 80px">上报类型</span>
                <span style="width: 200px">备注</span>
              </div>
              <ul>
                <li
                  v-for="(item, index) in reportList"
                  :key="index"
                  class="report-li"
                >
                  <span style="width: 80px" class="task-status">{{
                    item.taskStatus === "0"
                      ? "未报"
                      : item.taskStatus === "1"
                      ? "正常"
                      : "异常"
                  }}</span>
                  <span style="width: 140px" class="task-time">{{
                    item.taskTime
                  }}</span>
                  <span style="width: 80px" class="task-type">{{
                    item.taskType === "1" ? "定时上报" : "自主上报"
                  }}</span>
                  <span
                    class="task-remark"
                    style="width: 200px"
                    :title="item.remark"
                    >{{ item.remark }}</span
                  >
                </li>
              </ul>
            </div>
            <div class="report-content" style="padding-top: 80px" v-else>
              <a-empty />
            </div>
          </template>
          <div class="task-button">
            <icon class="icon" name="renwushangbao" scale="3"></icon>
            <div>任务上报</div>
          </div>
        </a-popover>
      </div>

      <!-- 任务预警小窗 -->
      <!-- <TaskAlarm /> -->
      <AlarmHandleModal
        v-if="modalVisible"
        ref="AlarmHandleModal"
        :modalData="modalData"
      />
    </div>
    <!-- 视频列表 -->
    <div class="video_list">
      <section class="video_item">
        <div class="mainContainer" style="width: 100%; height: 200px">
          <video
            id="videoElementT"
            style="width: 100%; height: 200px"
            class="centeredVideo"
            controls
            autoplay
            muted
            width="1024"
            height="576"
          >
            Your browser is too old which doesn't support HTML5 video.
          </video>
        </div>
        <div class="enlarge_logo" @click="enlargeVideo()">
          <img src="../../../assets/enlarge_logo.png" alt />
        </div>
        <a-select
          class="video_change"
          placeholder="切换设备"
          dropdownClassName="select-class-modal-single"
          @change="(v, op) => videoChange(v, op, 1)"
        >
          <a-select-option
            v-for="(item, index) in aioDevice"
            :key="index"
            :type="item.devType"
            :value="item.deviceId"
            >{{ item.devName }}</a-select-option
          >
          <a-select-option
            v-for="(item, index) in cameraDevice"
            :key="index"
            :type="item.devType"
            :value="item.deviceId"
            >{{ item.devName }}</a-select-option
          >
          <a-select-opt-group
            v-for="(item, index) in vehicleDeviceList"
            :key="index"
          >
            <span slot="label" style="font-size: 14px"
              >车载设备{{ index + 1 }}</span
            >
            <a-select-option
              :type="item1.devType"
              :parentId="item1.deviceId"
              :channelNum="item1.deviceIndex"
              v-for="item1 in item"
              :key="item1.deviceId"
              >{{ item1.deviceName }}</a-select-option
            >
          </a-select-opt-group>
        </a-select>
      </section>
      <!-- 视频拉流模态框 -->
      <large-video
        :aioDevice="aioDevice"
        :cameraDevice="cameraDevice"
        :vehicleDeviceList="vehicleDeviceList"
        :isGetedVideo="isGetedVideo"
        :isAllOneVideo="isAllOneVideo"
        ref="largeVideo"
      ></large-video>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import vueSeamlessScroll from "vue-seamless-scroll";
import flvjs from "flv.js";
import { getBrowse } from "@/utils/util";
import LargeVideo from "./ChildCon/components/LVideoModal";
import AlarmHandleModal from "@/views/EscortTaskAdmin/EscortAlarm/ChildCon/AlarmHandleModal";
import SendMsg from "@/views/EscortTaskAdmin/TaskMonitor/ChildCon/SendMsg";
import MoniHeader from "./ChildCon/components/moniHeaderSingle";

import { AudioPlayer } from "@liripeng/vue-audio-player";
import "@liripeng/vue-audio-player/lib/vue-audio-player.css";
import { baseUrl } from "@/utils/global";
import { mapState } from "vuex";
let Hls = require("hls.js");
import { createNamespacedHelpers } from "vuex";
import { findParent, getArrayObj, getStore } from "../../../utils/util.js";
import Vue from "vue";
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
} from "ant-design-vue";

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
  .use(Radio);
export default {
  components: {
    AlarmHandleModal,
    SendMsg,
    AudioPlayer,
    MoniHeader,
    vueSeamlessScroll,
    LargeVideo,
  },
  data() {
    return {
      selectedTask: [],
      isGetedVideo: false,
      isAllOneVideo: false,
      isReadyTask: false,
      //预警滚动框
      allAlarmList: [],
      hasAlarmList: false,
      //拉流
      baseAppVideoReal: "",
      dssServerReal: "",
      aioDevice: [],
      cameraDevice: [],
      vehicleDevice: [],
      vehicleDeviceList: [],
      player: null,
      player1: null,
      videoObject: {
        width: 1015, // 宽度，也可以支持百分比(不过父元素宽度要有)
        height: 574, // 高度，也可以支持百分比
        container: "#J_prismPlayer", //“#”代表容器的ID，“.”或“”代表容器的class
        variable: "player", //该属性必需设置，值等于下面的new chplayer()的对象
        autoplay: true, //自动播放
        live: true,
        video: "", //视频地址(必填)
      },
      aioHeartTimer: null,
      //
      serverTime: "",
      lastPoint: [],
      filterGPS: {},
      timer: null, //轨迹定时
      taskTimer: null, //任务实时
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
      //others
      examId: "",
      taskList: [],
      appVideoModalVisible: false,
      taskDetail: {},
      alarmList: [],
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
      taskVideoStatus: "",
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
      taskId: "",
      endOrgCode: "",
      //滚动预警信息
      taskAlarmPolling: [
        {
          actionStatus: 1,
          alarmTime: "2021/2/18",
          alarmType: "预警类型",
          remark: "这是一条预警信息11111111111111",
        },
        {
          actionStatus: 1,
          alarmTime: "2021/2/18",
          alarmType: "预警类型",
          remark: "这是一条预警信息22222222222222",
        },
        {
          actionStatus: 1,
          alarmTime: "2021/2/18",
          alarmType: "预警类型",
          remark: "这是一条预警信息333333333333333",
        },
        {
          actionStatus: 1,
          alarmTime: "2021/2/18",
          alarmType: "预警类型",
          remark: "这是一条预警信息4444444444444444",
        },
      ],
      infoWindow: {},
      flvPlayerObj: null,
    };
  },
  computed: {
    ...mapState({
      orgs: (state) => state.app.orgs,
    }),
    carContent() {
      return (item) => {
        return `${item.carNum == null ? "--" : item.carNum}（${
          item.driver == null ? "--" : item.driver
        }/${item.otherperson == null ? "--" : item.otherperson}）;`;
      };
    },
    //返回预警类型
    // returnAlarmType() {
    //   const arr = JSON.parse(sessionStorage.getItem("systemConf")).alarmType;
    //   return id => {
    //     if (!arr || arr.length == 0) {
    //       return "-";
    //     } else {
    //       for (let item of arr) {
    //         if (id == item.id) return item.name;
    //       }
    //     }
    //   };
    // },
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
    allAlarmList(val) {
      if (val.length > 0) {
        this.hasAlarmList = true;
      } else {
        this.hasAlarmList = false;
      }
    },
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.initMap();
      let currentTaskId = this.$route.query.taskId;
      this.getTaskDetail(currentTaskId);
      this.queryEscort();
      this.getAllTaskAlarm();

      this.taskTimer = setInterval(() => {
        this.getEscortReport(currentTaskId);
        this.getTaskAlarm(currentTaskId);
      }, 10000);
    }, 500);

    this.examId = sessionStorage.getItem("examId");
    let currentStatus = this.$route.query.taskStatus;
    this.taskVideoStatus = this.$route.query.taskStatus;
    this.taskId = this.$route.query.taskId;
    this.endOrgCode = this.$route.query.endOrgCode;
    if (currentStatus === "4" || currentStatus === "5") {
      this.isFinish = true;
    }
    this.getVideoList();
  },
  methods: {
    onBeforePlay() {
      console.log("这里可以做一些事情...");
      next(); // 开始播放
    },
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
      // console.log(this.firstArr, this.lineArr);
      this.map.remove(this.marker);
      this.marker = new AMap.Marker({
        map: this.map,
        // position: this.firstArr,
        icon: "https://webapi.amap.com/images/car.png",
        autoRotation: true, //自动旋转
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
        // console.log(this.curPassedPolyline , "qwddddddddddddddddddddd");
        if (that.anglePonit != that.marker.getAngle()) {
          that.anglePonit = that.marker.getAngle();
          that.initLabel(taskInfo);
        }
        that.initLabel(taskInfo);
        that.curPassedPolyline.setPath(e.passedPath);
      });
    },

    // 初始化面板
    initLabel(taskInfo) {
      let that = this;
      this.marker.setLabel({
        // offset: new AMap.Pixel(80, 60), //设置文本标注偏移量
        content:
          `<div class='task-wininfo' style='transform: rotate(-${that.anglePonit}deg)'><h2 class='title'>` +
          that.filterInfoItem(taskInfo.taskName) +
          "</h2><p class='title_p'>" +
          that.filterCar(taskInfo.cars) +
          "</p><div class='task_info_polling'><ul class='test-rowup'><li>起始机构：<span>" +
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
      let angle = this.computAngle(
        option[option.length - 3].P,
        option[option.length - 3].O,
        option[option.length - 1].P,
        option[option.length - 1].O
      );

      this.map.add(this.passedPolyline);
      this.marker.setPosition(markerPoint);
      this.initLabel(taskInfo.taskInfo);
      // this.marker.setAngle(angle);
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
      this.filterGPS = {
        examId: sessionStorage.getItem("examId"),
        taskId:
          this.vehicleDevice.length > 0
            ? this.vehicleDevice[0].deviceId
            : option.taskId,
        deviceType: "",
        deviceId: option.deviceId,
        lastTime: "",
      };
      this.lastPoint = [];
      this.$api.taskMonitor.getDeviceGPS(this.filterGPS).then((data) => {
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
          this.initroad(this.lineArr, this.lastPoint, option); //直接画出历史轨迹，不做动画
          if (this.firstArr.length > 0) {
            this.timer = setInterval(() => {
              this.$api.taskMonitor
                .getDeviceGPS({
                  examId: sessionStorage.getItem("examId"),
                  taskId:
                    this.vehicleDevice.length > 0
                      ? this.vehicleDevice[0].deviceId
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
            // this.timer = null;
          }
        } else {
          //debugger;
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
      // console.log(option);
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
      this.map.clearMap();
      this.polygon = new AMap.Polygon({
        path: elecPath,
        fillColor: "rgba(255,255,255)", // 多边形填充颜色
        fillOpacity: "0.6",
        borderWeight: 1, // 线条宽度，默认为 1
        strokeColor: "red", // 线条颜色
      });

      this.map.add(this.polygon);
      this.polygon = null;
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
          this.isReadyTask = true;
          res.data.list.forEach((item) => {
            if (
              item.taskStatus === "3" ||
              item.taskStatus === "4" ||
              item.taskStatus === "5"
            ) {
              this.taskList.push(item);
              // sessionStorage.setItem('taskId',item.taskId)

              const taskList = this.taskList.filter(
                (item) => this.$route.query.taskId === item.taskId
              );
              this.selectedTask = taskList;
            }
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    /**
     * 任务切换
     * @param {}
     */
    handleChange(value, item) {
      const selectedTask = item.data.attrs.data;
      this.selectedTask = [selectedTask];
      if (this.timer || this.taskTimer) {
        clearInterval(this.timer);
        clearInterval(this.taskTimer);
        this.timer = null;
        this.taskTimer = null;
      }
      const taskId = item.data.attrs.data.taskId;
      const endOrgCode = item.data.attrs.data.endOrgCode;
      const curTaskStatus = item.data.attrs.data.taskStatus;

      this.taskId = taskId;
      this.endOrgCode = endOrgCode;
      if (curTaskStatus === "4" || curTaskStatus === "5") {
        this.isFinish = true;
      } else {
        this.isFinish = false;
      }
      this.getVideoList();
      this.getTaskDetail(taskId);
      this.getEscortReport(taskId);
      this.getTaskAlarm(taskId);
      this.taskTimer = setInterval(() => {
        this.getEscortReport(taskId);
        this.getTaskAlarm(taskId);
      }, 15000);
    },

    /**
     * @param {*} option 任务id
     */
    getTaskDetail(option) {
      const filterDetail = {
        examId: this.examId,
        OrgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
        taskId: option,
      };
      this.$api.taskMonitor.getEscortDetail(filterDetail).then((res) => {
        if (res.data) {
          this.taskDetail = res.data;
          this.carInfo = res.data.cars;

          // this.carInfo.forEach(item => {
          //   this.ishasCarDevice = item.deviceInfo.some(item => {
          //     return item.deviceType === "602";
          //   });
          //   item.deviceInfo.forEach(item1 => {
          //     if (item1.deviceType === "602") {
          //       this.carDeviceList.push(item1);
          //     }
          //   });
          // });

          if (this.ishasCarDevice) {
            this.isShow = true;
            this.carDeviceId = this.carDeviceList[0].deviceId;
            this.getDevice(this.carInfo);
          } else {
            this.isShow = false;
          }
          let mapCircuit = res.data.mapCircuit;
          this.taskId = res.data.taskId;
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
          // let deviceType = JSON.parse(sessionStorage.getItem("systemConf"))
          //   .equipType;
          // if (deviceType === 1) {
          // } else {
          //   this.setCurAnimation({
          //     taskId: this.taskId,
          //     deviceId: this.carDeviceId
          //   });
          // }
        }
      });
    },
    /**
     * 获取任务预警信息
     * @param {*} option 任务ID
     */
    getTaskAlarm(option) {
      const filterAlarm = {
        examId: this.examId,
        OrgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
        TaskTypeId: "1",
        TaskStatusId: "",
        TaskInfo: "",
        PageIndex: 1,
        PageSize: 100,
        taskId: option,
        startTime: "",
        endTime: "",
      };
      this.$api.taskMonitor.queryEscortAlarm(filterAlarm).then((res) => {
        if (res.data) {
          let resList = res.data.list;
          if (resList.length > this.alarmCount) {
            //有新的报警信息，语音播报
            this.playSound(`${baseUrl}mp3/tts.mp3`);
          }
          this.alarmList = resList;
          this.alarmCount = resList.length;
          this.isAlarmShow = true;
        } else {
          this.$message.error(res.message);
        }
      });
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
        taskId: this.taskId,
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
     * 获取任务上报
     * @param {*} option 任务ID
     */
    getEscortReport(option) {
      const filterReport = {
        examId: this.examId,
        OrgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
        taskId: option,
      };
      this.$api.taskMonitor
        .getEscortReport(filterReport)
        .then((res) => {
          if (res.data) {
            let resList = res.data.list;
            if (resList.length > this.reportCount) {
              //有新的上报信息，语音播报
              this.playSound(`${baseUrl}mp3/tts.mp3`);
            }
            this.reportList = resList;
            this.reportCount = resList.length;
            this.isReportShow = true;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log("getEscortReport error====" + err);
        });
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
    /**
     * 视频流弹框，默认播放一体机视频
     */
    showModal() {
      this.appVideoModalVisible = true;
      if (this.isGetedVideo == true) {
        setTimeout(() => {
          this.initPlay();
        }, 100);
      }
    },
    /**
     * 获取视频流设备列表
     */
    getVideoList() {
      this.$api.taskMonitor
        .getEscortCameraDevice({ escortId: this.taskId })
        .then((res) => {
          if (res.result) {
            let device = res.data;
            // debugger
            if (device.length > 0) {
              this.isGetedVideo = true;
              this.vehicleDeviceList = [];
              this.aioDevice = [];
              this.cameraDevice = [];
              device.forEach((item) => {
                if (item.devType == "606") {
                  this.aioDevice.push(item); //一体机
                } else if (item.devType == "604") {
                  this.cameraDevice.push(item); //摄像机
                } else if (item.devType == "602") {
                  //车载设备
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
              this.initPlay();
              // console.log("   this.vehicleDeviceList=", this.vehicleDeviceList);
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
        .then((res) => {});
    },
    /**
     * 视频1播放flv
     * @param {Object} flvPlayerRefO 视频1挂在的dom节点
     */
    initFlv(url) {
      let flvPlayerRef = document.getElementById("videoElementT");
      let that = this;
      if (flvjs.isSupported()) {
        that.flvPlayerObj = flvjs.createPlayer(
          {
            type: "flv",
            isLive: true, //<====加个这个
            url: url,
          },
          {
            cors: true, // 是否跨域
            stashInitialSize: 128, // 缓存大小(kb)  默认384kb
            enableStashBuffer: false, // 是否启用缓存
            enableWorker: false, // 是否多线程工作
            autoCleanupSourceBuffer: true, // 是否自动清理缓存
          }
        );
        that.flvPlayerObj.attachMediaElement(flvPlayerRef);
        that.flvPlayerObj.load(); //加载
        that.flvPlayerObj.play();
        // 画面卡死
        that.flvPlayerObj.on(flvjs.Events.STATISTICS_INFO, function (res) {
          if (this.lastDecodedFrame == 0) {
            this.lastDecodedFrame = res.decodedFrames;
            return;
          }
          if (this.lastDecodedFrame != res.decodedFrames) {
            this.lastDecodedFrame = res.decodedFrames;
          } else {
            this.lastDecodedFrame = 0;
            if (that.flvPlayerObj) {
              that.flvPlayerObj.pause();
              that.flvPlayerObj.unload();
              that.flvPlayerObj.detachMediaElement();
              that.flvPlayerObj.destroy();
              that.flvPlayerObj = null;
              that.initFlv(url);
            }
          }
        });
        // 断流重连
        that.flvPlayerObj.on(
          flvjs.Events.ERROR,
          (errorType, errorDetail, errorInfo) => {
            console.log("errorType:", errorType);
            console.log("errorDetail:", errorDetail);
            console.log("errorInfo:", errorInfo);
            //视频出错后销毁重新创建
            if (that.flvPlayerObj) {
              setTimeout(() => {
                that.flvPlayerObj.pause();
                that.flvPlayerObj.unload();
                that.flvPlayerObj.detachMediaElement();
                that.flvPlayerObj.destroy();
                that.flvPlayerObj = null;
                that.initFlv(url);
              }, 1000);
            }
          }
        );

        // 视频卡顿监听
        that.flvPlayerObj.on(
          flvjs.Events.VIDEO_FROZEN,
          (errorType, errorDetail, errorInfo) => {
            console.log("errorType:", errorType);
            console.log("errorDetail:", errorDetail);
            console.log("errorInfo:", errorInfo);
            //视频出错后销毁重新创建
            if (that.flvPlayerObj) {
              setTimeout(() => {
                that.flvPlayerObj.pause();
                that.flvPlayerObj.unload();
                that.flvPlayerObj.detachMediaElement();
                that.flvPlayerObj.destroy();
                that.flvPlayerObj = null;
                that.initFlvM1(url);
              }, 1000);
            }
          }
        );
      }
    },
    /**
     * 播放一体机视频
     */
    initPlay() {
      // 不拉流
      if (this.taskVideoStatus == "5") {
        return;
      } else {
        if (this.aioDevice) {
          // console.log(this.taskVideoStatus);
          //如果有一体机则默认播放一体机视频
          //从基础配置接口中获取一体机基础地址
          let baseAppVideo = JSON.parse(sessionStorage.getItem("systemConf"))
            .appStreamingAddr;
          // baseAppVideo = "https://125.70.9.114:31111/live/";
          //拼接完整flv格式的一体机拉流地址
          this.baseAppVideoReal = `${baseAppVideo}${this.taskId}.flv`;
          // let baseAppVideo = `http://10.20.5.95:8080/live/livestream_${
          //   Math.random * 200
          // }.flv`;
          //一体机拉流要发送接口请求表示开始拉流
          this.$api.taskMonitor
            .askMobileVideo({ taskId: this.taskId, type: 1 })
            .then((res) => {
              if (res.result) {
                //将之前的flv播放对象销毁，不然内存溢出
                if (this.flvPlayerObj !== null) {
                  this.flvPlayerObj.pause();
                  this.flvPlayerObj.unload();
                  this.flvPlayerObj.detachMediaElement();
                  this.flvPlayerObj.destroy();
                  this.flvPlayerObj = null;
                }
                //播放flv格式视频
                this.initFlv(this.baseAppVideoReal);
                //一体机拉流要发送心跳
                this.aioHeartTimer = setInterval(() => {
                  this.aioVideoStreamHeart(this.taskId);
                }, 15000);
              } else {
                this.isAllOneVideo = true;
                this.$message.error("一体机视频流获取失败，请切换其他视频流");
              }
            });
        } else {
          //没有一体机则默认播放摄像机视频
          this.$api.taskMonitor
            .getEscortCameraUrl({
              deviceId: this.cameraDevice[0].deviceId,
              escortId: this.taskId,
            })
            .then((res) => {
              if (res.result) {
                var cameraUrl = res.data;
                setTimeout(() => {
                  this.videoObject.video = cameraUrl;
                  new ckplayer(this.videoObject);
                }, 100);
              }
            });
        }
      }
    },
    /**
     * 打开视频放大弹窗
     */
    enlargeVideo() {
      this.$refs.largeVideo.appVideoModalVisible = true;
      this.$nextTick(() => {
        this.$refs.largeVideo.playVideo(this.baseAppVideoReal);
      });
    },
    /**
     * 视频流设备切花
     * @param {*} value 设备id
     */
    videoChange(value, option) {
      let deviceType = option.data.attrs.type;
      if (deviceType !== "606") {
        this.$api.taskMonitor
          .askMobileVideo({ taskId: this.taskId, type: 0 })
          .then((res) => {});
        clearInterval(this.aioHeartTimer);
        this.aioHeartTimer = null;
      }

      if (deviceType === "606") {
        setTimeout(() => {
          this.initPlay();
        }, 100);
      } else if (deviceType === "604") {
        this.$api.taskMonitor
          .getEscortCameraUrl({ deviceId: value, escortId: this.taskId })
          .then((res) => {
            if (res.result) {
              var cameraUrl = res.data;
              setTimeout(() => {
                this.playCamera(value, this.taskId);
              }, 100);
            }
          });
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

        setTimeout(() => {
          this.videoObject.video = this.dssServerReal;
          new ckplayer(this.videoObject);
        }, 100);
      } else {
        this.$message.error("设备类型错误");
      }
    },
    /**
     * 摄像机拉流
     */
    playCamera(value, taskId) {
      this.$api.taskMonitor
        .getEscortCameraUrl({ deviceId: value, escortId: taskId })
        .then((res) => {
          if (res.result) {
            let cameraUrl = res.data;
            setTimeout(() => {
              this.videoObject.video = cameraUrl;
              new ckplayer(this.videoObject);
            }, 100);
          }
        });
    },
    /**
     * 停止播放
     */
    videoPause() {
      clearInterval(this.aioHeartTimer);
      this.aioHeartTimer = null;
      this.$api.taskMonitor
        .askMobileVideo({ taskId: this.taskId, type: 0 })
        .then((res) => {});
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.taskTimer);
    clearInterval(this.aioHeartTimer);
    this.timer = null;
    this.taskTimer = null;
    this.aioHeartTimer = null;

    this.$api.taskMonitor
      .askMobileVideo({ taskId: this.taskId, type: 0 })
      .then((res) => {});
  },
};
</script>
<style   lang='less'>
.ant-popover-placement-leftBottom {
  position: fixed;
  top: 582px !important;
  .ant-popover-arrow {
    display: none;
  }
}
@media screen and(max-width: 1800px) {
  .ant-popover-placement-leftBottom {
    position: fixed;
    top: 510px !important;
    .ant-popover-arrow {
      display: none;
    }
  }
}
@media screen and(max-width: 1680px) {
  .ant-popover-placement-leftBottom {
    position: fixed;
    top: 410px !important;
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
    padding: 0;
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
.task-select-option-title {
  width: 40px;
  color: rgba(54, 135, 217);
  display: inline-block;
  vertical-align: middle;
}
.task-select-option-start {
  width: 130px;
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
.ant-select-dropdown.select-class-modal-single {
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.4);
  .ant-select-dropdown-menu-item {
    position: relative;
    display: block;
    padding: 5px 12px;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.8);
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    -webkit-transition: background 0.3s ease;
    transition: background 0.3s ease;
  }
  .ant-select-dropdown-menu-item-active {
    position: relative;
    display: block;
    padding: 5px 12px;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.4);
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    -webkit-transition: background 0.3s ease;
    transition: background 0.3s ease;
  }
}
#task-monitor {
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
        }
      }
    }
    .task-list {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 500px;
      .iconBox {
        display: inline-block;
        width: 40px;
        height: 30px;
        background-color: #fff;
        color: #3687d9;
        cursor: pointer;
        .svg-icon {
          margin-right: 5px;
          vertical-align: -12px;
          margin: 3px 7px;
        }
      }
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
      top: 2px;
      left: 2px;
      width: 100px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
.video-content {
  width: 600px;
  height: 306px;
}

.detail-content {
  width: 600px;
  height: 306px;
  ul {
    height: 300px;
    overflow-y: auto;
    li {
      span {
        width: 160px;
        color: #3380cc;
        display: inline-block;
      }
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:last-of-type {
        border-bottom: none;
      }
    }
    .car_info {
      border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
      span {
        width: 160px;
        color: #3380cc;
        vertical-align: top;
        line-height: 40px;
      }
      .car_content {
        display: inline-block;
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
        width: 410px;
        span {
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
}
.alarm-content {
  width: 600px;
  height: 306px;
  .alarm-content-header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.2);
    span {
      display: inline-block;
      text-align: center;
      margin: 0 4px;
    }
  }
  ul {
    height: 260px;
    overflow-y: auto;
    li {
      span {
        margin: 0 4px;
        display: inline-block;
        vertical-align: bottom;
      }
      .task-remark {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .task-type {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
      cursor: pointer;
      &:first-of-type {
        border-bottom: none;
      }
    }
  }
}
.report-content {
  width: 600px;
  height: 306px;

  .report-content-header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.2);
    span {
      display: inline-block;
      text-align: center;
      margin: 0 4px;
    }
  }
  .ulHeader {
    background-color: #ddd;
    padding: 5px 0px;
    span {
      display: inline-block;
      margin: 0px 4px;
      text-align: center;
    }
  }
  ul {
    overflow-y: auto;
    height: 260px;
    li {
      width: 100%;
      height: 40px;
      border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
      cursor: pointer;
      line-height: 40px;
      span {
        color: rgba(0, 0, 0, 0.6);
        margin: 0 4px;
        text-align: center;
        display: inline-block;
        vertical-align: bottom;
      }
      .task-remark {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .task-time {
        width: 140px;
        display: inline-block;
      }
    }
  }
}
.ant-card {
  line-height: 1 !important;
}
.ant-card-head {
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
.task-wininfo .title_p {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 20px;
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
</style>