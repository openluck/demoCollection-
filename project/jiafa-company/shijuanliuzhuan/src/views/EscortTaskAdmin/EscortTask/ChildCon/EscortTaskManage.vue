
<template>
  <div class="EscortTaskManage">
    <div class="taskcontainer">
      <div class="taskTitle">
        <div class="tit">
          <span style="cursor: pointer" @click="goToTaskList">任务列表</span>
          / 任务管理{{ changeItem }}
        </div>
        <div>
          <!-- 已结束并进行过强制操作 -->
          <!-- v-else-if="orgTypeId === '2' && form.canForce && taskStatus === '4'" -->
          <!-- <a-button type="primary" class="btn" @click="forceHandle('3')"><a-icon type="play-circle" />强制开始</a-button> -->
          <!-- <a-button type="primary" class="btn" @click="forceHandle('5')"><a-icon type="play-circle" />强制结束</a-button> -->
          <template>
            <span
              v-if="forceRecordListAction.includes('强制结束')"
              class="force-stop-text"
              @click="forceRecordModal = true"
              ><i></i> 已强制结束
            </span>
            <span
              v-else-if="forceRecordListAction.includes('强制开始')"
              class="force-start-text"
              @click="forceRecordModal = true"
              ><i></i> 已强制开始
            </span>
          </template>

          <!-- 时间限制版本 -->
          <!-- 强制开始按钮 -->
          <template
            v-if="
              orgTypeId === '2' &&
              form.canForce &&
              taskStatus === '2' &&
              moment(form.planStartTime) < moment(new Date())
            "
          >
            <a-button type="primary" class="btn" @click="forceHandle('3')"
              ><a-icon type="play-circle" />强制开始</a-button
            >
          </template>

          <!-- 强制结束按钮 -->
          <template
            v-else-if="
              orgTypeId === '2' &&
              form.canForce &&
              taskStatus === '3' &&
              moment(form.planEndTime) < moment(new Date())
            "
          >
            <a-button type="primary" class="btn" @click="forceHandle('5')"
              ><a-icon type="pause" /> 强制结束</a-button
            >
          </template>

          <!-- 时间不加限制版本 -->
          <!-- 强制开始按钮 -->
          <!-- <template
            v-if="orgTypeId === '2' && form.canForce && taskStatus === '2'"
          >
            <a-button type="primary" class="btn" @click="forceHandle('3')"
              ><a-icon type="play-circle" />强制开始</a-button
            >
          </template>

          强制结束按钮
          <template
            v-else-if="orgTypeId === '2' && form.canForce && taskStatus === '3'"
          >
            <a-button type="primary" class="btn" @click="forceHandle('5')"
              ><a-icon type="pause" /> 强制结束</a-button
            >
          </template> -->

          <template v-else>
            <a-button
              type="primary"
              class="btn"
              v-if="taskStatus === '0'"
              @click="affirmTask"
              :loading="loading"
              >{{ comfirmOrSave }}</a-button
            >
          </template>
        </div>
      </div>
      <div class="taskInfo">
        <div>
          <h3>任务基础信息</h3>
        </div>
        <a-form-model
          class="from_model"
          ref="ruleForm"
          :model="form"
          layout="inline"
        >
          <a-form-model-item label="任 务 类 型" prop="escortTypeId">
            <a-select
              :disabled="disableInfo"
              v-model="form.escortTypeId"
              placeholder="请选择~"
            >
              <a-select-option value="1">领卷</a-select-option>
              <a-select-option value="2">返卷</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="taskName" label="任 务 名 称" prop="taskName">
            <a-input :disabled="disableInfo" v-model="form.taskName" />
          </a-form-model-item>

          <a-form-model-item label="起 始 机 构" prop="startOrgCode">
            <a-tree-select
              :disabled="disableInfo"
              v-model="form.startOrgName"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="[]"
              placeholder="起 始 机 构"
            />
          </a-form-model-item>
          <a-form-model-item label="目 的 机 构" prop="endOrgCode">
            <a-tree-select
              :disabled="disableInfo"
              v-model="form.endOrgName"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="[]"
              placeholder="目 的 机 构"
            ></a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="计划开始时间">
            <a-date-picker
              :disabled="disableInfo"
              format="YYYY-MM-DD HH:mm:ss"
              v-model="changeInfoX.planStartTime"
              placeholder="--"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item label="计划结束时间">
            <a-date-picker
              format="YYYY-MM-DD HH:mm:ss"
              :disabled="disableInfo"
              v-model="changeInfoX.planEndTime"
              placeholder="--"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item label="任务开始时间">
            <a-date-picker
              disabled
              format="YYYY-MM-DD HH:mm:ss"
              v-model="changeInfoX.startTime"
              placeholder="--"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item label="任务结束时间">
            <a-date-picker
              disabled
              format="YYYY-MM-DD HH:mm:ss"
              v-model="changeInfoX.endTime"
              placeholder="--"
              style="width: 100%"
            />
          </a-form-model-item>
        </a-form-model>
      </div>

      <div class="tabs_container">
        <a-tabs
          class="paperInfo"
          tabPosition="top"
          animated
          type="card"
          default-active-key="4"
        >
          <a-tab-pane class="carsInfo" key="4" tab="人员车辆" forceRender>
            <div>
              <div class="personInfoRow">
                <div>
                  <span class="text text1">押运负责人：</span>
                  <!-- v-model="changeInfoX.escortPerson" -->
                  <a-select
                    style="width: 120px; margin-right: 20px"
                    :disabled="updatePerson"
                    v-model="duePerson.id"
                    @change="changeUpdataPerson"
                  >
                    <a-select-opt-group label="起始机构" key="1">
                      <a-select-option
                        :disabled="duePersonArr.arr1.includes(item.id)"
                        v-for="item in startPerson"
                        :key="item.index"
                        :value="item.id"
                        >{{ item.name }}</a-select-option
                      >
                      <a-select-option
                        v-if="startPerson.length === 0"
                        :value="-1"
                        :disabled="true"
                        >无</a-select-option
                      >
                    </a-select-opt-group>

                    <a-select-opt-group label="目的机构" key="2">
                      <a-select-option
                        :disabled="duePersonArr.arr1.includes(item.id)"
                        v-for="item in endPerson"
                        :key="item.index"
                        :value="item.id"
                        >{{ item.name }}</a-select-option
                      >
                      <a-select-option
                        v-if="endPerson.length === 0"
                        :value="-1"
                        :disabled="true"
                        >无</a-select-option
                      >
                    </a-select-opt-group>

                    <!-- <a-select-option
                      :disabled="duePersonArr.arr1.includes(item.id)"
                      v-for="item in curPerson"
                      :key="item.index"
                      :value="item.id"
                      >{{ item.name }}</a-select-option
                    >
                    <a-select-option
                      v-if="curPerson.length === 0"
                      :value="-1"
                      :disabled="true"
                      >无</a-select-option
                    > -->
                  </a-select>
                  <span class="text text2">押运工作人员：</span>
                  <!-- v-model="changeInfoX.escortPerson" -->
                  <a-select
                    style="width: 400px"
                    :disabled="updatePerson"
                    @change="changeUpdataPersonSome"
                    mode="multiple"
                    v-model="duePersonArr.arr1"
                  >
                    <a-select-opt-group label="起始机构" key="1">
                      <a-select-option
                        :disabled="duePerson.id == item.id"
                        v-for="item in startPerson"
                        :key="item.index"
                        :value="item.id"
                        >{{ item.name }}</a-select-option
                      >
                      <a-select-option
                        v-if="startPerson.length === 0"
                        :value="-1"
                        :disabled="true"
                        >无</a-select-option
                      >
                    </a-select-opt-group>

                    <a-select-opt-group label="目的机构" key="2">
                      <a-select-option
                        :disabled="duePerson.id == item.id"
                        v-for="item in endPerson"
                        :key="item.index"
                        :value="item.id"
                        >{{ item.name }}</a-select-option
                      >
                      <a-select-option
                        v-if="endPerson.length === 0"
                        :value="-1"
                        :disabled="true"
                        >无</a-select-option
                      >
                    </a-select-opt-group>
                  </a-select>
                </div>
                <div style="width: 211px; flex-shrink: 1">
                  <a-button
                    :disabled="updatePerson || editingKey > -1"
                    @click="personSubmit()"
                    class="btn"
                    >人员提交</a-button
                  >
                  <a-button
                    :disabled="updatePerson || editingKey > -1"
                    @click="addCar"
                    class="btn"
                    >添加车辆</a-button
                  >
                </div>
              </div>
              <a-table
                v-if="tempCars"
                :columns="carsColumns"
                :data-source="tempCars"
                :rowKey="(row) => row.carNum"
                :pagination="false"
              >
                <template
                  v-for="col in ['carNum', 'driver', 'phone', 'otherperson']"
                  :slot="col"
                  slot-scope="text, record, index"
                >
                  <div :key="col">
                    <a-tooltip v-if="record.editable">
                      <template
                        v-if="col === 'carNum'"
                        slot="title"
                        trigger="focus"
                        >例：京A8888S (仅大写)</template
                      >
                      <a-input
                        :maxLength="col === 'phone' ? 11 : 50"
                        style="margin: -5px 0; width: 120px"
                        v-model="editRowData[col]"
                        @change="
                          (e) => handleChange(e.target.value, index, col)
                        "
                        @blur="(e) => inputBlur(e.target.value, index, col)"
                        :ref="col + index"
                      />
                    </a-tooltip>
                    <template v-else>{{ text }}</template>
                  </div>
                </template>

                <template
                  v-for="(col, index) in [
                    { name: 'carType', arr: carTypeType },
                    { name: 'device', arr: deviceType },
                    { name: 'paperBox', arr: paperBoxType },
                    { name: 'cordlessCamera', arr: cordlessCameraType },
                  ]"
                  :slot="col.name"
                  slot-scope="text, record"
                >
                  <a-select
                    :mode="index <= 1 ? 'default' : 'multiple'"
                    :dropdownClassName="
                      col.name === 'device' ? 'maxcontent' : ''
                    "
                    v-if="record.editable"
                    v-model="editRowData[col.name]"
                    :key="col.name"
                    :filter-option="filterOption"
                    style="width: 120px"
                    @select="
                      (value, option) => selectDevice(value, option, col.name)
                    "
                  >
                    <template v-if="col.name === 'device'">
                      <a-select-opt-group
                        v-for="item in col.arr"
                        :key="item.orgCode"
                      >
                        <span slot="label">{{ item.orgName }}</span>
                        <a-select-option
                          v-for="i in item.devInfo"
                          :key="i.deviceId"
                          :value="i.deviceId"
                          >{{ i.deviceName }}</a-select-option
                        >
                      </a-select-opt-group>
                      <a-select-option
                        v-for="i in currentDevice"
                        :key="i.deviceId"
                        :value="i.deviceId"
                        >{{ i.deviceName }}</a-select-option
                      >
                    </template>
                    <template v-else>
                      <a-select-option
                        v-for="item in col.arr"
                        :key="item.id"
                        :value="item.value"
                      >
                        {{ item.name }}
                      </a-select-option>
                    </template>
                  </a-select>
                  <template v-else>
                    <span :key="col.name" v-if="col.name !== 'device'">{{
                      findNameById(text, col.arr, col.name)
                    }}</span>
                    <span :key="col.name" v-else>{{
                      record.deviceList.length
                        ? record.deviceList[0].deviceName
                        : ""
                    }}</span>
                  </template>
                </template>

                <template slot="operation" slot-scope="text, record, index">
                  <div class="editable-row-operations">
                    <template v-if="record.editable">
                      <a-button
                        type="primary"
                        @click="() => save(index)"
                        :disabled="updatePerson"
                        >保存</a-button
                      >
                      <a-button type="danger" @click="() => cancelCar(index)"
                        >取消</a-button
                      >
                    </template>
                    <template v-else>
                      <!-- <a :disabled="editingKey !== ''" @click="() => edit(index)">Edit</a> -->
                      <a-button
                        type="primary"
                        :disabled="updatePerson || editingKey > -1"
                        @click="() => edit(index, record)"
                        >编辑</a-button
                      >

                      <a-popconfirm
                        :disabled="updatePerson || editingKey > -1"
                        title="确认删除这条车辆信息吗?"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="() => delete1(index, record)"
                      >
                        <!-- @click="() => delete1(index,record)" -->
                        <a-button
                          type="danger"
                          class="btn"
                          :disabled="updatePerson || editingKey > -1"
                          >删除</a-button
                        >
                      </a-popconfirm>
                    </template>
                  </div>
                </template>
                <span slot="deviceId" slot-scope="text">{{
                  text || "--"
                }}</span>
              </a-table>
            </div>
          </a-tab-pane>

          <a-tab-pane
            class="paperContent"
            key="1"
            tab="试卷清单"
            v-if="form.escortTypeId === '1' && isSpotTask"
            :disabled="editingKey > -1"
          >
            <PaperList
              v-if="form.endOrgCode"
              :orgCode="form.endOrgCode"
              :orgName="form.endOrgName"
              :esCode="form.session"
            />
          </a-tab-pane>

          <a-tab-pane
            class="line-plan"
            key="2"
            tab="线路规划"
            :forceRender="true"
            :disabled="editingKey > -1"
          >
            <div>
              <div class="taskMap">
                <line-plan
                  ref="linePlan"
                  :startPo="this.startOrg"
                  :planType="this.planType"
                  :newDriveArea="this.driveArea"
                  :taskStatus="this.taskStatus"
                  :endPo="this.endOrg"
                ></line-plan>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane
            class="taskLog"
            key="5"
            tab="任务日志"
            forceRender
            :disabled="editingKey > -1"
          >
            <div>
              <TaskLog :taskId="istaskId" />
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <a-modal
      title="提交签名"
      :visible="forceQRCodeModal"
      wrapClassName="forceQRCodeModal"
      :footer="false"
      :maskClosable="false"
      @cancel="forceQRCodeModal = false"
      :width="340"
    >
      <div class="box">
        <canvas id="QRCode"></canvas>
      </div>
      <div style="text-align: center; margin-top: 20px">
        <p>请扫描上方二维码进行签名确认，</p>
        <p>确认后将会强制修改押运任务状态，</p>
        <p>请谨慎执行!</p>
      </div>
      <div style="margin-top: 20px">
        <p v-if="forceStatus == 0">
          <a-icon
            type="close-circle"
            style="
              color: #ff4d4f;
              font-size: 16px;
              margin-right: 10px;
              vertical-align: inherit;
            "
          />无此签名Id或签名过期
        </p>
        <p v-else-if="forceStatus == 2">
          <a-icon
            type="close-circle"
            style="
              color: #ff4d4f;
              font-size: 16px;
              margin-right: 10px;
              vertical-align: inherit;
            "
          />被扫描！
        </p>
        <p v-else-if="forceStatus == 3">
          <a-icon
            type="check-circle"
            style="
              color: #3dbf7e;
              font-size: 16px;
              margin-right: 10px;
              vertical-align: inherit;
            "
          />签名提交成功！{{ countDownTime }}秒后关闭
        </p>
        <p v-else-if="forceStatus == 4">
          <a-icon
            type="close-circle"
            style="
              color: #ff4d4f;
              font-size: 16px;
              margin-right: 10px;
              vertical-align: inherit;
            "
          />签名提交失败！
        </p>
        <p v-else-if="forceStatus == 1">
          <a-icon
            type="loading"
            style="font-size: 16px; margin-right: 10px; vertical-align: inherit"
          />签名中
        </p>
      </div>
    </a-modal>

    <a-modal
      title="强制信息提示"
      :visible="forceRecordModal"
      wrapClassName="forceRecordModal"
      :footer="false"
      @cancel="forceRecordModal = false"
    >
      <div
        class="force-content"
        v-for="item in forceRecordList"
        :key="item.time"
      >
        <div class="force-content-left">
          <p class="blod">操作：{{ item.action }}</p>
          <p>操作人：{{ item.person }}</p>
          <p>操作时间：{{ item.time }}</p>
        </div>
        <div class="force-content-right">
          <span> 签名: </span>
          <img :src="imgBaseUrl + item.sign" alt="" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { baseUrl } from "@/utils/global";
import QRCode from "qrcode"; //引入生成二维码插件
import TaskLog from "./TaskLog";
import PaperList from "./PaperList";
import {
  getArrayObj,
  getStore,
  Base64,
  debounce,
} from "../../../../utils/util.js";
import LinePlan from "../../EscortPlan/ChildCon/LinePlan";
import moment from "moment";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapMutations } = createNamespacedHelpers(
  "escortPlan"
);

const carsColumns = [
  {
    align: "center",
    title: "车辆",
    dataIndex: "carNum",
    // width: "15%",
    scopedSlots: { customRender: "carNum" },
  },
  {
    align: "center",
    title: "车型",
    dataIndex: "carType",
    // width: "25%",
    scopedSlots: { customRender: "carType" },
  },
  {
    align: "center",
    title: "车载设备",
    dataIndex: "device",
    // width: "25%",
    scopedSlots: { customRender: "device" },
  },
  {
    align: "center",
    title: "试卷箱",
    dataIndex: "paperBox",
    // width: "25%",
    scopedSlots: { customRender: "paperBox" },
  },
  {
    align: "center",
    title: "无线摄像机",
    dataIndex: "cordlessCamera",
    // width: "25%",
    scopedSlots: { customRender: "cordlessCamera" },
  },
  {
    align: "center",
    title: "司机",
    dataIndex: "driver",
    // width: "25%",
    scopedSlots: { customRender: "driver" },
  },
  {
    align: "center",
    title: "联系电话",
    dataIndex: "phone",
    // width: "25%",
    scopedSlots: { customRender: "phone" },
  },
  {
    align: "center",
    title: "其他人员",
    dataIndex: "otherperson",
    // width: "25%",
    scopedSlots: { customRender: "otherperson" },
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
const qrcodeStatus = [
  { value: "0", text: "无此签名Id或签名过期" },
  { value: "1", text: "签名id生成" },
  { value: "2", text: "被扫描" },
  { value: "3", text: "签名提交成功" },
  { value: "4", text: "签名提交失败" },
];

export default {
  data() {
    return {
      baseUrl,
      forceRecordModal: false,
      forceQRCodeModal: false,
      forceRecordList: [],
      carTypeType: [
        {
          name: "厢式货车",
          value: "厢式货车",
        },
        {
          name: "轿车",
          value: "轿车",
        },
        {
          name: "SUV",
          value: "SUV",
        },
      ],
      paperBoxType: [],
      cordlessCameraType: [],
      iframeUrlOrgCode: "",
      carsColumns,
      curPerson: [],
      tempCars: [],
      tempCars2: [],
      isPhone: false,
      hasPhone: false,
      tempPersons: [],
      editingKey: -1, //正在编辑的行索引
      editRowData: {
        deviceList: [],
      }, //正在编辑的行数据
      currentDevice: [], //当前编辑行车载设备数据
      // personInfoRowData: {
      //   id: "",
      //   name: "",
      //   type: "",
      // },
      // taskStatus: "",
      disableInfo: true,

      startArr: [],
      statusArrSE: true,
      endArr: [],
      startDevice: [], //开始机构车载设备
      endDevice: [], //结束机构车载设备

      istaskId: "",
      isShow: false,
      planType: "", //传到地图组件的线路类型
      driveArea: "", //电子围栏
      startOrg: [], //起始点坐标
      endOrg: [], // 结束点坐标
      // personList:,
      // startOrgName: "",
      // endOrgName: "",
      form: {
        escortTypeId: null,
        taskId: "",
        taskName: "",
        escortPerson: "",
        escortPersonId: "",
        startOrgCode: "",
        endOrgCode: "",
        startOrgName: "",
        endOrgName: "",
        startTime: null,
        endTime: null,
        planStartTime: null,
        planEndTime: null,
        paperCnt: "",
        createOrgCode: JSON.parse(getStore("userInfo")).orgcode,
        mapCircuit: {
          circuitType: "",
          circuitArea: "",
        },
        examId: "",
        cars: [],
      },
      loading: false,
      options: this.$store.state.app.orgsAll,
      updatePerson: false,
      updateCar: false,

      isAdding: false,
      orgTypeId: JSON.parse(getStore("userInfo")).orgtypeid, //登录机构类型
      taskForceStatus: null, //当前任务可强制操作的状态
      QRCodeUrl: null, //当前点击任务可强制操作二维码路径
      forceStatus: 1,
      timer: null, //轮询定时器
      countDown: null,
      countDownTime: 0,
      // isPaperDemand: JSON.parse(getStore("systemConf")).functionStatus
      //   .paperDemand,
      // isEscortPaperList: JSON.parse(getStore("systemConf")).functionStatus
      //   .escortPaperList,
    };
  },
  components: {
    LinePlan,
    TaskLog,
    PaperList,
  },
  async created() {
    // this.taskStatus = getStore("currentTaskStatus");
    this.istaskId = this.$route.query.taskId;
    this.delateX();
    if (this.istaskId != "") {
      await this.getEscortDetailAsync(this.istaskId, "Task");
      if (
        // this.taskStatus == "2" ||
        this.taskStatus == "3" ||
        this.taskStatus == "4" ||
        this.taskStatus == "5"
      ) {
        // this.disableInfo = true; //当任务状态为完成时任务不能修改，disabled为true
        this.updatePerson = true;
      }
      if (this.taskStatus == "4" || this.taskStatus == "5") {
        this.updateCar = true;
      }
      await this.getEscortDetailAsync(this.istaskId, "Task");

      this.getPersonSCurAsync();
    } else {
    }

    // this.queryDeviceList()
    this.getForceActionRecord();
  },
  async mounted() {},
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
    clearInterval(this.countDown);
    this.countDown = null;
  },
  computed: {
    ...mapState([
      "changeInfoX",
      "addPersonList",
      "startPerson",
      "endPerson",
      "taskStatus",
    ]),
    changeItem() {
      if (this.istaskId != "") {
        this.form = this.changeInfoX;
        if (this.form.startTime) {
          this.form.startTime = moment(this.changeInfoX.startTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        if (this.form.endTime) {
          this.form.endTime = moment(this.changeInfoX.endTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        if (this.form.escortTypeId == "1") {
          //判断tab页试卷详情是否显示
          this.isShow = true;
        }
        if (
          this.form.startOrgCode != undefined ||
          this.form.endOrgCode != undefined
        ) {
          if (this.statusArrSE) {
            // console.log("this.$store.state.app.orgTree,",this.$store.state.app.orgTree,);
            // console.log("this.form.startOrgCode",this.form.startOrgCode);
            // console.log("this.form.endOrgCode",this.form.endOrgCode);
            this.startOrg = getArrayObj(
              this.$store.state.app.orgTree,
              this.form.startOrgCode
            );
            this.endOrg = getArrayObj(
              this.$store.state.app.orgTree,
              this.form.endOrgCode
            );
            // console.log("this.startOrg",this.startOrg);
            // console.log("this.endOrg",this.endOrg);
          }
          this.getPersonStartAsync(
            // JSON.parse(sessionStorage.getItem("userInfo")).orgcode
            this.form.startOrgCode
          );
          this.getPersonendAsync(
            // JSON.parse(sessionStorage.getItem("userInfo")).orgcode
            this.form.endOrgCode
          );
          if (this.form.mapCircuit.circuitType) {
            this.planType = this.form.mapCircuit.circuitType;
          }
          if (this.form.mapCircuit.circuitArea) {
            this.driveArea = this.form.mapCircuit.circuitArea;
          }

          if (this.form.startOrgCode) {
            this.getAvailableCars(this.form.startOrgCode, 1);
          }
          if (this.form.endOrgCode) {
            this.getAvailableCars(this.form.endOrgCode, 2);
          }
        }
      }
      return "";
    },
    comfirmOrSave() {
      return this.taskStatus < 2 ? "确认任务" : "保存任务";
    },
    imgBaseUrl() {
      let str = baseUrl.replace("/EXPCM/", "");
      return str;
    },
    tempCars1: {
      get: function () {
        if (this.changeInfoX.cars) {
          return [...this.changeInfoX.cars];
        }
        return "";
      },
    },
    tempPersons1() {
      if (this.changeInfoX.carsPersons) {
        if (this.changeInfoX.carsPersons.escortWorker) {
          return [...this.changeInfoX.carsPersons.escortWorker];
        }
      }

      return [];
    },
    duePerson() {
      if (this.tempPersons.length) {
        let arr = this.tempPersons.filter((item) => item.type === "1");
        if (arr.length) {
          return arr[0];
        }
      }
      return {
        type: "",
        id: "",
        name: "",
      };
    },
    duePersonArr() {
      if (this.tempPersons.length) {
        let arr = this.tempPersons.filter((item) => item.type === "2");
        return { arr1: arr.map((item) => item.id) };
      }
      return {
        arr1: [],
      };
    },

    //强制操作记录名称
    forceRecordListAction() {
      return this.forceRecordList.map((i) => i.action);
    },

    deviceType() {
      return [...this.startDevice, ...this.endDevice];
    },

    //返回目的机构是否是非考点
    isSpotTask() {
      const tree = this.$store.state.app.orgTree;
      // let type = null
      for (let item of tree) {
        if (item.orgCode === this.form.endOrgCode) {
          // console.log("item", item);
          // console.log("this.form.endOrgCode", this.form.endOrgCode);
          return item.orgTypeId !== "4";
          type = item.orgTypeId;
        }
      }
    },
  },
  watch: {
    tempCars1(newValue) {
      this.tempCars = newValue;
      this.tempCars2 = JSON.parse(JSON.stringify(newValue));
    },
    tempPersons1(newValue) {
      this.tempPersons = newValue;
    },

    //监听弹框显隐
    forceQRCodeModal(newValue, oldValue) {
      if (!newValue && oldValue) {
        clearInterval(this.timer);
        this.timer = null;
        clearInterval(this.countDown);
        this.countDown = null;
      }
    },
  },
  methods: {
    moment,
    debounce,
    ...mapActions([
      "getEscortDetailAsync",
      "setEscortAsync",
      "setEscortDetailAsync",
      "getPersonAsync",
      "getPersonStartAsync",
      "getPersonendAsync",
    ]),
    ...mapMutations([
      "changeEscortTypeId",
      "addPlanFabu",
      "assionPerson",
      "delateX",
    ]),
    filterOption(input, option) {
      console.log("input, option", input, option);
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    findNameById(id, list, type) {
      if (type === "device") {
        let arr = [];
        for (const item of list) {
          if (item.devInfo) {
            arr = [...arr, ...item.devInfo];
          }
        }
        for (const item of arr) {
          if (item.deviceId === id) {
            return item.deviceName;
          }
        }
        return "";
      }
      if (id === null) {
        return "";
      } else if (typeof id === "string") {
        return list
          .filter((i) => i.value === id)
          .map((i) => i.name)
          .join(" , ");
      } else if (typeof id === "object") {
        return list
          .filter((i) => id.includes(i.value))
          .map((i) => i.name)
          .join(" , ");
      }
    },
    //人员提交
    personSubmit() {
      this.saveCarsPersons();
    },
    //获取当前机构人员
    getPersonSCurAsync() {
      let data = {
        orgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
      };
      this.$api.escortPlan.getPerson(data).then((res) => {
        if (res.result) {
          this.curPerson = res.data.escorts;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    goToTaskList() {
      this.$router.push({
        path: "/EscortTask",
      });
    },
    addCar() {
      this.isAdding = true;
      const obj = {
        carNum: "",
        carType: "",
        deviceList: [],
        driver: "",
        otherperson: "",
        phone: "",
      };
      this.tempCars.push(obj);
      this.tempCars2.push(obj);
      let index = this.tempCars.length - 1;
      this.edit(index, this.tempCars[index]);
    },

    //更改押运负责人
    changeUpdataPerson(value, option) {
      for (let item in this.tempPersons) {
        if (this.tempPersons[item].type == 1) {
          // this.personInfoRowData = this.tempPersons[item];
          return this.tempPersons.splice(item, 1, {
            type: "1",
            id: value,
            name: option.componentOptions.children[0].text,
          });
        }
      }
      this.tempPersons.push({
        type: "1",
        id: value,
        name: option.componentOptions.children[0].text,
      });
      this.changeInfoX.carsPersons.escortWorker = JSON.parse(
        JSON.stringify(this.tempPersons)
      );
    },

    //更改押运工作人员
    changeUpdataPersonSome(value, option) {
      let arr = this.tempPersons.filter((item) => item.type == 1);
      for (let i in value) {
        arr.push({
          type: "2",
          id: value[i],
          name: option[i].componentOptions.children[0].text,
        });
      }
      this.tempPersons = JSON.parse(JSON.stringify(arr));
      this.changeInfoX.carsPersons.escortWorker = JSON.parse(
        JSON.stringify(arr)
      );
    },
    // affirmTaskDebounce(){
    //   debounce(this.affirmTask(), 20000, false);

    // },
    // 确认任务
    affirmTask() {
      const { changeInfoX } = this;
      if (!changeInfoX.cars.length) {
        return this.$message.error("请添加车辆！");
      }
      // changeInfoX.escortPersons = changeInfoX.escortPersons || [];
      const dutyPersonList = changeInfoX.carsPersons.escortWorker.filter(
        (i) => i.id && i.type === "1"
      );
      if (dutyPersonList.length === 0) {
        return this.$message.error("请添加押运负责人！");
      }

      if (this.$refs.linePlan.isDriveArea == true) {
        this.$refs.linePlan.saveArea();
      } else {
        this.$refs.linePlan.driveArea = "";
      }
      this.changeInfoX.mapCircuit = {
        circuitType: this.$refs.linePlan.drivingOption,
        circuitArea: this.$refs.linePlan.driveArea,
      };
      let data = JSON.parse(JSON.stringify(this.changeInfoX));
      this.loading = true;
      // return console.log("data------", data);
      this.$api.escortTask.releaseTaskDetail(data).then((res) => {
        if (res.result) {
          this.$message.success("确认成功！");
          // this.getEscortDetailAsync(this.istaskId);
          this.$router.push({
            name: "EscortTask",
          });
          this.loading = false;
        } else {
          this.$message.error(res.message);
          this.loading = false;
        }
      });
    },

    //点击强制开始或结束
    async forceHandle(type) {
      const result = await this.getForceActionQRCode(this.istaskId);
      if (result) {
        this.forceQRCodeModal = true;
        await this.getQRCode(this.istaskId);
        this.getForceSignStatus(this.istaskId);
        this.timer = setInterval(() => {
          this.getForceSignStatus(this.istaskId);
        }, 5000);
      }
    },

    // 生成二维码
    getQRCode(taskId, type) {
      const options = {
        errorCorrectionLevel: "H", //容错级别
        type: "image/png", //生成的二维码类型
        quality: 0.3, //二维码质量
        margin: 1, //二维码留白边距
        width: 250, //宽
        height: 250, //高
        color: {
          dark: "#333333", //前景色
          light: "#fff", //背景色
        },
      };
      // this.QRCodeMsg = this.QRcodeUrl; //生成的二维码为URL地址js
      const orgname = JSON.parse(getStore("userInfo")).orgname;
      const realname = JSON.parse(getStore("userInfo")).realname;
      let name = realname ? orgname + "-" + realname : orgname;
      name = Base64.encode(name);
      // const signServerPage = this.QRCodeUrl;
      const signServerPage = JSON.parse(getStore("systemConf")).signServerPage;
      const obj = { u: name, t: taskId, f: this.taskForceStatus };

      this.QRCodeMsg = `${signServerPage}?p=${JSON.stringify(
        obj
      )}&cb=${baseUrl}saveForceSign`;
      console.log("this.QRCodeMsg", this.QRCodeMsg);
      this.$nextTick(() => {
        const ele = document.getElementById("QRCode");
        // 将获取到的数据（val）画到msg（canvas）上
        QRCode.toCanvas(ele, this.QRCodeMsg, options, (error) => {
          console.log(error);
        });
      });
    },

    //表格编辑行
    selectDevice(value, option, name) {
      console.log("option", option);
      const deviceName = option.componentOptions.children[0].text;
      console.log("deviceName", deviceName);
      if (name === "device") {
        this.editRowData.deviceList = this.editRowData.deviceList.filter(
          (item) => item.deviceType !== "602"
        );
        this.editRowData.deviceList.push({
          deviceId: value,
          deviceName,
          deviceType: "602",
        });
        console.log("this.editRowData.deviceList", this.editRowData.deviceList);
        // this.editRowData[name]={deviceId:value,deviceName,deviceType:"602"}
        // }else if(name === "paperBox"){
        //   this.editRowData.name=value
        // }else if(name === "cordlessCamera"){
        //   this.editRowData.name=value
      } else if (name === "carType") {
        this.editRowData[name] = value;
      }
    },
    handleChange(value, key, column) {
      this.editRowData[column] = value;
    },
    delete1(index, record) {
      this.changeInfoX.cars.splice(index, 1);
      this.changeInfoX.carsPersons.cars.splice(index, 1);
      this.tempCars.splice(index, 1);
      this.saveCarsPersons();
    },
    edit(key, record) {
      this.currentDevice = { ...record }.deviceList;
      this.editRowData = { ...record };
      this.editingKey = key;
      this.tempCars[key].editable = true;
      this.tempCars = [...this.tempCars];
    },
    save(key) {
      const { carNum, carType } = this.editRowData;
      if (this.hasPhone && !this.isPhone) {
        return;
      }
      if (carNum && carType) {
        let arr = this.tempCars.filter(
          (item, index) => item.carNum == carNum && index != key
        );
        if (arr.length) return this.$message.error("车牌号不能重复！");

        this.editingKey = -1;
        this.tempCars[key] = this.editRowData;
        delete this.tempCars[key].editable;
        this.tempCars = [...this.tempCars];
        this.changeInfoX.cars = [...this.tempCars];
        this.isAdding = false;
        this.saveCarsPersons();
      } else {
        this.$message.error({
          content: "请填写车牌号和车型！",
          key: "error",
        });
      }
    },
    cancelCar(key) {
      if (this.isAdding) {
        this.editingKey = -1;
        this.tempCars.splice(key, 1);
        this.tempCars = [...this.tempCars];
      } else {
        delete this.tempCars[key].editable;
        const { carNum, carType } = this.tempCars[key];
        // if(carNum carType)
        this.editingKey = -1;
        this.tempCars = [...this.tempCars];
      }

      this.isAdding = false;
    },

    inputBlur(value, key, column) {
      if (column === "carNum") {
        // let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        let reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/;
        if (!reg.test(value)) {
          const ref = column + key;
          this.$nextTick(() => {
            this.$refs[ref][0].focus();
          });
          return this.$message.error({
            content: "车牌号格式不正确!",
            key: "error",
          });
        }
      } else if (column === "phone") {
        let phoneReg = /^1\d{10}$/;
        if (value) {
          this.hasPhone = true;
        } else {
          this.hasPhone = false;
        }
        this.isPhone = phoneReg.test(value);
        if (!phoneReg.test(value) && this.hasPhone) {
          const ref = column + key;
          this.$nextTick(() => {
            this.$refs[ref][0].focus();
          });
          return this.$message.error("手机号格式不正确！");
        }
      }
    },

    //人员车辆信息保存
    async saveCarsPersons() {
      const taskId = this.istaskId;
      const cars = this.tempCars;
      const escortWorker = this.tempPersons;
      const dutyPersonList = escortWorker.filter((i) => i.id && i.type === "1");
      if (dutyPersonList.length === 0) {
        return this.$message.error("请添加押运负责人！");
      }
      if (this.hasPhone && !this.isPhone) {
        return;
      }
      try {
        const res = await this.$api.escortTask.saveCarsPersons({
          taskId,
          escortWorker,
          cars,
        });
        if (res.result) {
          this.$message.success({
            content: "保存成功！",
            key: "save",
          });
          this.getEscortDetailAsync(this.istaskId, "Task");
        } else {
          this.$message.error({
            content: res.message,
            key: "save",
          });
        }
      } catch (error) {
        this.$message.error(error);
      }
    },

    //获取车载设备
    async getAvailableCars(code, type) {
      try {
        const res = await this.$api.init.getAvailableCars({ orgCode: code });
        if (res.result) {
          if (type === 1) {
            this.startDevice = res.data;
          } else {
            this.endDevice = res.data;
          }
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },

    //获取强制记录
    async getForceActionRecord() {
      try {
        const res = await this.$api.escortTask.getForceActionRecord({
          taskId: this.istaskId,
        });
        if (res.result) {
          this.forceRecordList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },

    //获取强制操作二维码
    async getForceActionQRCode(taskId) {
      try {
        const res = await this.$api.escortTask.getForceActionQRCode({ taskId });
        if (res.result) {
          this.taskForceStatus = res.data.taskForceStatus;
          this.QRCodeUrl = res.data.url;
          return true;
        } else {
          this.$message.error(res.message);
          return false;
        }
      } catch (error) {
        this.$message.error(error);
      }
    },

    //获取二维码状态
    async getForceSignStatus(taskId) {
      try {
        const res = await this.$api.escortTask.getForceSignStatus({ taskId });
        if (res.result) {
          // console.log("this.taskForceStatus", this.taskForceStatus);
          if (this.taskForceStatus === "3") {
            //强制开始
            this.forceStatus = res.data.beginStatus;
            if (res.data.beginStatus !== 1) {
              clearInterval(this.timer);
              this.timer = null;
              if (res.data.beginStatus == 3) {
                this.countDownTime = 10;
                this.countDown = setInterval(() => {
                  this.countDownTime--;
                  if (this.countDownTime === 0) {
                    clearInterval(this.countDown);
                    this.countDown = null;
                    this.queryEscortAsync("3");
                    this.forceQRCodeModal = false;
                  }
                }, 1000);
              }
            }
          } else if (this.taskForceStatus === "5") {
            //强制结束
            this.forceStatus = res.data.endStatus;
            if (res.data.endStatus !== 1) {
              clearInterval(this.timer);
              this.timer = null;

              if (res.data.beginStatus == 3) {
                this.countDownTime = 10;
                this.countDown = setInterval(() => {
                  this.countDownTime--;
                  if (this.countDownTime === 0) {
                    clearInterval(this.countDown);
                    this.countDown = null;
                    this.queryEscortAsync("3");
                    this.forceQRCodeModal = false;
                  }
                }, 1000);
              }
            }
          }
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },

    // 获取摄像机
    async queryDeviceList() {
      try {
        const res = await this.$api.escortTask.queryDeviceList({
          taskId: this.istaskId,
        });
        if (res.result) {
          this.forceRecordList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
};
</script>

<style lang="less" >
.ant-tabs .ant-tabs-top-content.ant-tabs-content-animated {
  height: 100%;
  // padding:  0 0 20px 0;
  // width: 100%;
  // overflow-y: auto;
  // border: 1px solid #dae0e6;
}
.maxcontent.ant-select-dropdown {
  width: max-content !important;
}
.EscortTaskManage {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #ebf0f5;
  // div{
  //   box-sizing: content-box;
  // }
  .ant-btn-primary {
    background-color: #398fe6;
    border-color: #398fe6;
  }
  .ant-btn-primary[disabled] {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
  }
  .taskcontainer {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    .taskTitle {
      width: 100%;
      height: 52px;
      padding: 10px 20px;
      border-bottom: 1px solid #e6ecf2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tit {
        font-size: 18px;
        font-weight: 600;
      }
      .anticon {
        vertical-align: 0;
      }
      .force-start-text {
        cursor: pointer;
        font-size: 14px;
        margin-right: 10px;
        i {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 4px;
          background-color: #178fe6;
          margin-right: 5px;
        }
      }
      .force-stop-text {
        cursor: pointer;
        font-size: 14px;
        margin-right: 10px;
        i {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 4px;
          background-color: #3dbf7e;
          margin-right: 5px;
        }
      }
    }
    .taskInfo {
      width: 100%;
      padding: 20px 32px 0 20px;
      margin-bottom: 30px;
      box-sizing: border-box;
      & > div {
        h3 {
          font-size: 16px;
          padding-left: 10px;
          border-left: 5px solid #398fe6;
        }

        padding-bottom: 10px;
        border-bottom: 1px dashed #ddd;
        margin-bottom: 10px;
      }
      .ant-form-item {
        height: 45px;
        width: 300px;
        margin-bottom: 12px;
        // display: flex;
        // align-items: center;
        // justify-content: end;
        .ant-form-item-control {
          width: 200px;
        }
      }
      .ant-form-inline .ant-form-item > .ant-form-item-label {
        width: 100px;
      }
    }
    .tabs_container {
      width: 100%;
      height: 600px;
      padding: 0 20px 20px 20px;
      margin-top: 20px;
      flex-grow: 1;
      position: relative;
      // display: flex;

      .ant-tabs-content {
        height: 90%;
        // height: max-content;
        .ant-tabs-tabpane {
          height: 100%;
        }
      }
      .paperInfo {
        width: calc(100% - 40px);
        height: 100%;
        position: absolute;
        bottom: 20px;
        left: 20px;
        // overflow: hidden;
        .carsInfo {
          .ant-table-tbody > tr > td {
            padding: 6px 6px;
          }
          .btn {
            margin-left: 15px;
          }
        }
        .paperContent {
          width: 100%;
          height: 100%;
          // background-color: #ebf0f5;
          overflow-y: scroll;
          padding: 10px 10px 20px 10px;
          margin-top: -16px;
          border: 1px solid #dae0e6;
        }
        .line-plan {
          width: 100%;
          height: 100%;
          margin-top: -8px;
          border-left: 1px solid rgba(232, 232, 232);
          border-right: 1px solid rgba(232, 232, 232);
        }
      }
    }
  }
  .carsInfo {
    .personInfoRow {
      display: flex;
      justify-content: space-between;
      //   width: 300px;
      margin-bottom: 20px;
      .btn {
        margin-left: 15px;
      }
    }
    .text {
      display: inline-block;
      width: 100px;
      height: 32px;
      line-height: 32px;
      text-align: right;
    }

    .text2 {
      width: max-content;
      margin-left: 20px;
    }
    .driverRow {
      display: flex;
      .text1 {
        height: 32px;
        line-height: 32px;
        width: max-content;
        margin-left: 20px;
        text-align: right;
      }
    }
  }
  //   .ant-btn-primary {
  //   background-color: #398fe6;
  //   border-color: #398fe6;
  // }
}

.forceRecordModal {
  .ant-modal-body {
    padding-top: 15px;
  }
  .force-content {
    display: flex;
    padding: 15px 10px;
    justify-content: space-between;
    .blod {
      font-weight: bold;
    }
    p {
      margin: 5px 0;
    }
    img {
      width: 50px;
      max-height: 140px;
      border-radius: 3px;
      margin-left: 10px;
    }
  }
  .force-content-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .force-content-right {
    display: flex;
    align-items: flex-end;
    margin-bottom: 5px;
  }
  .force-content + .force-content {
    border-top: 1px solid #eee;
  }
}

.forceQRCodeModal {
  .ant-modal-body {
    text-align: center;
  }
  .box {
    width: 280px;
    height: 280px;
    margin: 0 auto;
    border: 1px solid #f2f2f2;
    border-radius: 3px;
    line-height: 280px;
  }
}
</style>

