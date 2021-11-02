<template>
  <div class="page">
    <div class="escortTask">
      <div class="head">
        <div class="choos">
          <div class="choose">
            <p class="p-choose">机构{{ forever }}：</p>
            <!-- <button @click="xxxx"></button> -->
            <a-tree-select
              dropdownClassName="org-tree-select"
              v-if="options.length"
              style="width: 200px"
              :tree-data="options"
              placeholder="请选择"
              v-model="filterInfo.orgCode"
              @change="changeOrgcode"
            />
          </div>

          <div class="result">
            <div class="selctor_item">
              <p class="p-result" style="width: 80px">押运负责人:</p>
              <a-input
                @change="changeUserName"
                v-model="filterInfo.escortUserName"
                placeholder="押运负责人"
                class="input"
                style="width: 120px"
              />
            </div>
            <div class="selctor_item">
              <p class="p-result" style="width: 35px">场次:</p>
              <a-select
                placeholder="场次"
                style="width: 140px"
                v-model="filterInfo.session"
                @change="changeSession"
                allowClear
              >
                <a-select-option
                  v-for="item in sessionList"
                  :key="item.sessionCode"
                  :value="item.sessionCode"
                  >{{ item.sessionName }}
                </a-select-option>
              </a-select>
            </div>
            <div class="selctor_item">
              <p class="p-result">任务类型:</p>
              <a-select
                style="width: 80px"
                v-model="filterInfo.taskTypeId"
                @change="changeType"
              >
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option :value="1">领卷</a-select-option>
                <a-select-option :value="2">返卷</a-select-option>
              </a-select>
            </div>
            <div class="selctor_item">
              <p class="p-result">强制状态:</p>
              <a-select
                v-model="filterInfo.forceStatus"
                style="width: 80px"
                allowClear
                @change="changeForceStatus"
              >
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </div>

            <!-- 查询 -->
            <div class="query">
              <a-button @click="fillterTable" type="primary">
                <icon-font type="iconsousuo" class="icon-search" />
                查询
              </a-button>
            </div>
          </div>
        </div>

        <!-- 搜索 -->
        <div class="search">
          <p class="p-search">搜索：</p>
          <a-input
            @change="changeInfo"
            v-model="filterInfo.taskInfo"
            placeholder="任务名称/机构名称"
            class="input"
          />
          <!-- 搜索 -->
          <div class="btn-search">
            <a-button @click="fillterTable1" type="primary">
              <icon-font
                type="iconsousuo"
                class="icon-search"
                name="iconsousuo"
              />
              搜索
            </a-button>
          </div>
        </div>
        <TaskStatusList
          v-if="showTaskList"
          :filterData="filterInfo"
          :countList="countList"
          :canClick="true"
          @changeStatus="queryEscort"
        />
        <div class="onlyOption">
          <a-checkbox v-model="filterInfo.onlyToday" @change="changeOnlyToday">
            仅显示当天任务
          </a-checkbox>
          <a-checkbox
            v-model="filterInfo.onlyOvertime"
            @change="changeOnlyOvertime"
          >
            仅显示超时任务
          </a-checkbox>
          <div class="empty"></div>
          <a-button
            class="btn"
            title="excel导出"
            type="green"
            @click="educeExcel()"
          >
            导出
          </a-button>
          <a-button type="green" @click="toTaskMonitor()"> 任务监控</a-button>
        </div>
      </div>

      <div class="table task-table">
        <a-table
          :columns="isNarrow ? columnsNarrow : columnsNarrow"
          :scroll="isNarrow ? { x: 1300, y: 530 } : { x: 1300, y: 530 }"
          :data-source="lists"
          :pagination="pagination"
          :rowClassName="setRowClassName"
          :loading="tableLoading"
          :rowKey="(record) => record.taskId"
        >
          <span slot="customTitle">任务名称</span>
          <span slot="name" slot-scope="text">{{ text }}</span>
          <span slot="taskType" slot-scope="text">{{
            text == 1 ? "领卷" : "返卷"
          }}</span>

          <!-- 场次 -->
          <div slots="session" slot-scope="text">
            <span class="session-span" :title="getSessionName(text)">{{
              getSessionName(text)
            }}</span>
          </div>

          <span slot="canForce" slot-scope="text">{{ text ? text : "-" }}</span>

          <!-- 开始机构 -->
          <div slot="startOrgName" slot-scope="text, record">
            <span>{{ text ? text : "-" }}</span>
            <!-- <a-tag color="gray" v-if="record">执</a-tag> -->
            <i class="execute" v-if="record.executeOrg === 0">执</i>
          </div>

          <!-- 结束结构 -->
          <div slot="endOrgName" slot-scope="text, record">
            <span>{{ text ? text : "-" }}</span>
            <!-- <a-tag color="gray" v-if="record">执</a-tag> -->
            <i class="execute" v-if="record.executeOrg === 1">执</i>
          </div>

          <!-- 押运负责人 -->
          <div slot="escortUserName" slot-scope="text, record">
            <span>{{ text ? text : "-" }}</span>
            <i v-if="text" :class="record.isOnline ? 'online' : 'offline'"></i>
          </div>

          <!-- 是否开启测试 -->
          <div slot="isTest" slot-scope="text">
            <span>{{ text ? "是" : "否" }}</span>
          </div>

          <!-- 强制状态 -->
          <div slot="forceStatus" slot-scope="text, record">
            <span @click="openForceRecordmodal(record)">{{
              text > 0 ? "是" : text == 0 ? "否" : "-"
            }}</span>
          </div>

          <span slot="result" slot-scope="result">
            <a-tag
              v-for="tag in result"
              :key="tag"
              :color="fillterHEXColor(tag)"
              >{{ fillterTag(tag) }}</a-tag
            >
          </span>
          <span slot="action" slot-scope="text, record">
            <a-button
              size="small"
              v-if="
                record.startOrgCode == ownOrgCode ||
                record.endOrgCode == ownOrgCode ||
                orgTypeId == '1'
              "
              @click="changeTableItem(record)"
              >管理</a-button
            >
            <!-- <a-button
              size="small"
              @click="changeTableItem(record)"
              >管理11 {{orgTypeId}}+{{record.canForce}}+{{record.taskStatus }}</a-button
            > -->
            <a-button
              size="small"
              v-if="record.taskStatus > 2"
              @click="getDetail(record)"
              >详情</a-button
            >
            <!-- <a-button
              v-if="record.taskStatus === '2'"
              size="small"
              @click="forceHandle(record, '3')"
            >
              开始11
            </a-button> -->

            <!-- 时间限制版本 -->
            <!-- <a-button
              v-if="
                orgTypeId === '2' &&
                record.canForce &&
                record.taskStatus === '2' &&
                moment(record.planStartTime) < moment(new Date())
              "
              size="small"
              @click="forceHandle(record, '3')"
            >
              开始
            </a-button>
            <a-button
              v-if="
                orgTypeId === '2' &&
                record.canForce &&
                record.taskStatus === '3' &&
                moment(record.planEndTime) < moment(new Date())
              "
              size="small"
              @click="forceHandle(record, '5')"
            >
              结束
            </a-button> -->

            <!-- 时间不加限制版本 -->
            <a-button
              v-if="
                orgTypeId === '2' &&
                record.canForce &&
                record.taskStatus === '2'
              "
              size="small"
              @click="forceHandle(record, '3')"
            >
              开始
            </a-button>
            <a-button
              v-if="
                orgTypeId === '2' &&
                record.canForce &&
                record.taskStatus === '3'
              "
              size="small"
              @click="forceHandle(record, '5')"
            >
              结束
            </a-button>
            <!-- <a-button
              v-if="record.taskStatus === '3'"
              size="small"
              @click="forceHandle(record, '5')"
            >
              结束11
            </a-button> -->
          </span>
        </a-table>
      </div>

      <!-- 导出excel不分页的dom -->
      <div id="table2" v-show="false">
        <a-table
          :columns="isNarrow ? columnsNarrow : columnsNarrow"
          :data-source="tableList.list"
          :pagination="false"
          :rowKey="(record) => record.taskId"
        >
          <span slot="name" slot-scope="text">{{ text }}</span>
          <span slot="customTitle">任务名称</span>
          <span slot="taskType" slot-scope="text">{{
            text == 1 ? "领卷" : "返卷"
          }}</span>

          <!-- 场次 -->
          <div slot="session" slot-scope="text">
            <span class="session-span" :title="getSessionName(text)">{{
              getSessionName(text)
            }}</span>
          </div>

          <span slot="canForce" slot-scope="text">{{ text }}</span>

          <!-- 开始机构 -->
          <div slot="startOrgName" slot-scope="text, record">
            <span>{{ text ? text : "-" }}</span>
            <!-- <a-tag color="gray" v-if="record">执</a-tag> -->
            <i class="execute" v-if="record.executeOrg === 0">执</i>
          </div>

          <!-- 结束结构 -->
          <div slot="endOrgName" slot-scope="text, record">
            <span>{{ text ? text : "-" }}</span>
            <!-- <a-tag color="gray" v-if="record">执</a-tag> -->
            <i class="execute" v-if="record.executeOrg === 1">执</i>
          </div>

          <!-- 押运负责人 -->
          <div slot="escortUserName" slot-scope="text, record">
            <span>{{ text ? text : "-" }}</span>
            <i v-if="text" :class="record.isOnline ? 'online' : 'offline'"></i>
          </div>

          <!-- 是否开启测试 -->
          <div slot="isTest" slot-scope="text">
            <span>{{ text ? "是" : "否" }}</span>
          </div>

          <!-- 强制状态 -->
          <div slot="forceStatus" slot-scope="text, record">
            <span @click="openForceRecordmodal(record)">{{
              text > 0 ? "是" : text == 0 ? "否" : "-"
            }}</span>
          </div>

          <span slot="result" slot-scope="result">
            <a-tag
              v-for="tag in result"
              :key="tag"
              :color="fillterHEXColor(tag)"
              >{{ fillterTag(tag) }}</a-tag
            >
          </span>
          <span slot="action" slot-scope="text, record">
            <a-button
              size="small"
              v-if="
                record.startOrgCode == ownOrgCode ||
                record.endOrgCode == ownOrgCode ||
                orgTypeId == '1'
              "
              @click="changeTableItem(record)"
              >管理</a-button
            >
            <a-button
              size="small"
              v-if="record.taskStatus > 2"
              @click="getDetail(record)"
              >详情</a-button
            >
            <!-- 时间不加限制版本 -->
            <a-button
              v-if="
                orgTypeId === '2' &&
                record.canForce &&
                record.taskStatus === '2'
              "
              size="small"
              @click="forceHandle(record, '3')"
            >
              开始
            </a-button>
            <a-button
              v-if="
                orgTypeId === '2' &&
                record.canForce &&
                record.taskStatus === '3'
              "
              size="small"
              @click="forceHandle(record, '5')"
            >
              结束
            </a-button>
          </span>
        </a-table>
      </div>
    </div>

    <a-modal
      title="提示"
      :visible="overtimeTaskListModal"
      wrapClassName="overtimeTaskListModal"
      :footer="false"
      @cancel="overtimeTaskListModal = false"
    >
      <a-spin tip="加载中..." :spinning="overtimeModalLoading">
        <div class="title">
          <a-icon
            type="exclamation-circle"
            style="font-size: 30px; color: #fd645e; margin-right: 10px"
          />
          存在以下超时未操作任务，请核对检查任务状态!
        </div>
        <div class="content">
          <div class="contentLeft">
            <p>超时未开始任务 {{ unstart.length }}</p>
            <ul>
              <li v-for="i in unstart" :key="i.taskId">{{ i.taskName }}</li>
            </ul>
          </div>
          <div class="contentLeft contentRight">
            <p>超时未结束任务 {{ unfinish.length }}</p>
            <ul>
              <li v-for="i in unfinish" :key="i.taskId">{{ i.taskName }}</li>
            </ul>
          </div>
        </div>
      </a-spin>
    </a-modal>

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
          />
          无此签名Id或签名过期
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
          />
          被扫描！
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
          />
          签名提交成功！ {{ countDownTime }}秒后关闭
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
          />
          签名提交失败！
        </p>
        <p v-else-if="forceStatus == 1">
          <a-icon
            type="loading"
            style="font-size: 16px; margin-right: 10px; vertical-align: inherit"
          />
          签名中
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
import moment from "moment";
import QRCode from "qrcode"; //引入生成二维码插件
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { createNamespacedHelpers } from "vuex";

const { mapActions, mapState, mapMutations } = createNamespacedHelpers(
  "escortTask"
);
import { baseUrl } from "../../../utils/global";

console.log("baseUrl", baseUrl);
import TaskStatusList from "../../../components/common/TaskStatusList";
import { getStore, setStore, Base64 } from "@/utils/util.js";
// import { setStore } from "../../../utils/util";

const columns = [
  {
    // align: "center",
    dataIndex: "taskName",
    key: "taskName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    // width: "10%",
  },
  {
    align: "center",
    title: "场次",
    dataIndex: "session",
    key: "session",
    // width: 80,
  },
  {
    align: "center",
    title: "起始机构",
    dataIndex: "startOrgName",
    key: "startOrgName",
    scopedSlots: { customRender: "startOrgName" },
  },
  {
    title: "目标机构",
    dataIndex: "endOrgName",
    key: "endOrgName",
    scopedSlots: { customRender: "endOrgName" },
    align: "center",
  },
  {
    title: "任务开始时间",
    dataIndex: "taskStartTime",
    key: "taskStartTime",
    // width: "10%",
    align: "center",
  },
  {
    title: "任务结束时间",
    dataIndex: "taskEndTime",
    key: "taskEndTime",
    // width: "10%",
    align: "center",
  },
  {
    title: "押运负责人",
    dataIndex: "escortUserName",
    key: "escortUserName",
    scopedSlots: { customRender: "escortUserName" },
    // width: "10%",
    align: "center",
  },
  {
    title: "任务类型",
    dataIndex: "taskType",
    key: "taskType",
    scopedSlots: { customRender: "taskType" },
    width: 100,
    align: "center",
  },
  {
    title: "是否开启测试",
    dataIndex: "isTest",
    key: "isTest",
    scopedSlots: { customRender: "isTest" },
    width: 130,
    align: "center",
  },

  {
    title: "任务状态",
    dataIndex: "taskStatus",
    key: "taskStatus",
    scopedSlots: { customRender: "result" },
    width: 100,
    align: "center",
  },
  {
    title: "强制状态",
    dataIndex: "forceStatus",
    key: "forceStatus",
    scopedSlots: { customRender: "forceStatus" },
    width: 100,
    align: "center",
  },

  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    // width: "10%",
    align: "center",
  },
];
const columnsNarrow = [
  {
    // align: "center",
    dataIndex: "taskName",
    key: "taskName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    fixed: "left",
    width: 300,
  },
  {
    align: "center",
    title: "场次",
    dataIndex: "session",
    key: "session",
    scopedSlots: { customRender: "session"},
    width: 200,
  },
  //   {
  //   title: "强制",
  //   dataIndex: "canForce",
  //   key: "canForce",
  //   scopedSlots: { customRender: "canForce" },
  // },
  {
    align: "center",
    title: "起始机构",
    dataIndex: "startOrgName",
    key: "startOrgName",
    scopedSlots: { customRender: "startOrgName" },
    align: "center",
    width: 200,
  },
  {
    align: "center",
    title: "目标机构",
    dataIndex: "endOrgName",
    key: "endOrgName",
    scopedSlots: { customRender: "endOrgName" },
    width: 300,
    align: "center",
  },
  {
    align: "center",
    title: "任务开始时间",
    dataIndex: "taskStartTime",
    key: "taskStartTime",
    width: 200,
    // width: "10%",
  },
  {
    align: "center",
    title: "任务结束时间",
    dataIndex: "taskEndTime",
    key: "taskEndTime",
    // width: "10%",
    width: 200,
  },
  {
    align: "center",
    title: "押运负责人",
    dataIndex: "escortUserName",
    key: "escortUserName",
    scopedSlots: { customRender: "escortUserName" },
    // width: "10%",
    width: 150,
    align: "center",
  },
  {
    align: "center",
    title: "任务类型",
    dataIndex: "taskType",
    key: "taskType",
    scopedSlots: { customRender: "taskType" },
    // width: "10%",
    width: 100,
  },
  {
    align: "center",
    title: "是否开启测试",
    dataIndex: "isTest",
    key: "isTest",
    scopedSlots: { customRender: "isTest" },
    width: 180,
    // width: "10%",
  },

  {
    align: "center",
    title: "任务状态",
    dataIndex: "taskStatus",
    key: "taskStatus",
    scopedSlots: { customRender: "result" },
    // width: "10%",
    width: 100,
  },
  {
    align: "center",
    title: "强制状态",
    dataIndex: "forceStatus",
    key: "forceStatus",
    scopedSlots: { customRender: "forceStatus" },
    width: 100,
    // width: "10%",
  },

  {
    align: "center",
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    // width: "10%",
    fixed: "right",
    width: 150,
  },
];

const data = [];

export default {
  components: { TaskStatusList },
  data() {
    return {
      baseUrl,
      overtimeTaskListModal: false, //超时任务modal显隐
      overtimeModalLoading: true, //超时任务modal 加载状态
      forceQRCodeModal: false, //强制操作modal显隐
      forceRecordModal: false, //强制操作modal显隐
      forceRecordList: [],
      isNarrow: false, //是否宽度<1400
      unstart: [], //超时未开始任务
      unfinish: [], //超时未结束任务
      orgTypeId: null,
      // filterInfo: {
      //   orgCode: "",
      //   escortUserName: "",
      //   session: "",
      //   taskTypeId: "",
      //   forceStatus: undefined,
      //   taskInfo: "",
      //   taskStatusId: "",
      //   onlyToday: false,
      //   onlyOvertime: false,
      //   pageIndex: "",
      //   pageSize: "",
      // },
      orgCodeInfo: "",
      isCreateOrg: true,
      visible: false,
      // tableLoading: false,
      ownOrgCode: JSON.parse(getStore("userInfo")).orgcode,
      orgName: JSON.parse(getStore("userInfo")).orgname,
      // taskStatus: this.$store.state.app.systemConf.escortStatus,
      data,
      // columns,
      columnsNarrow,
      // options: this.$store.state.app.orgs,
      fieldNames: {
        label: "orgName",
        value: "orgCode",
        children: "children",
      },
      pagination: {
        pageNo: 1,
        pageSize: 10, // 默认每页显示数量
        showQuickJumper: true, //是否可以快速跳转至某页
        showTotal: (total) => `当前显示10条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), //点击页码事件
        total: 0, //总条数
        current: 0,
      },
      taskInfo: "",

      taskForceStatus: null, //当前点击任务可强制操作的状态
      QRCodeUrl: null, //当前点击任务可强制操作二维码路径
      forceStatus: null,
      timer: null, //轮询定时器
      countDown: null,
      countDownTime: 0,
      tableList: [],
    };
  },

  computed: {
    ...mapState([
      "lists",
      "total",
      "tableLoading",
      "countList",
      "showTaskList",
      "filterInfo",
    ]),
    forever() {
      this.pagination.total = this.total / 1;
      return "";
    },
    taskStatus() {
      return this.$store.state.app.systemConf.escortStatus;
    },
    options() {
      return this.$store.state.app.orgs;
    },
    //根据状态返回相关状态数量
    returnStatusCount(id) {
      return (id) => {
        const arr = this.countList.filter((item) => item.value === id);
        if (arr.length) {
          return arr[0].count;
        } else {
          return 0;
        }
      };
    },
    sessionSubjects() {
      return this.$store.state.app.sessionSubjects;
    },
    getSessionName(id) {
      const arr = this.sessionSubjects;
      return (id) => {
        if (id) {
          // console.log("iddddddddddd", id);
          const idArr = id.split(",");
          return arr
            .filter((item) => idArr.includes(item.sessionCode))
            .map((item) => item.sessionName)
            .join(",");
        } else {
          return "-";
        }
      };
    },

    imgBaseUrl() {
      let str = baseUrl.replace("/EXPCM/", "");
      // console.log("str", str);
      return str;
    },
  },
  watch: {
    //监听弹框显隐
    forceQRCodeModal(newValue, oldValue) {
      // console.log("newValue,oldValue", newValue, oldValue);
      if (!newValue && oldValue) {
        clearInterval(this.timer);
        this.timer = null;
        clearInterval(this.countDown);
        this.countDown = null;
      }
    },
  },
  created() {
    this.queryEscort();
    this.sessionList = this.$store.state.app.sessionSubjects;
    this.orgTypeId = JSON.parse(getStore("userInfo")).orgtypeid;
    const width = document.body.clientWidth;
    if (width <= 1400) {
      this.isNarrow = true;
    }
    this.filterInfo.orgCode = JSON.parse(getStore("userInfo")).orgcode;
    this.empty();
    this.queryEscortAsync();
    this.getOvertimeTask();
  },
  mounted() {
    // console.log(encodeURI("四川省成都市教育考试院-一二三"));
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    if (
      to.name === "TaskMonitor" &&
      (to.query.taskStatus === "3" ||
        to.query.taskStatus === "5" ||
        to.query.taskStatus === "4")
    ) {
      // 不缓存
      from.meta.keepAlive = true;
    } else {
      // 缓存
      from.meta.keepAlive = false;
    }
    next();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
    clearInterval(this.countDown);
    this.countDown = null;
  },
  methods: {
    moment,
    ...mapActions(["queryEscortAsync", "setEscortAsync", "deleteEscortAsync"]),
    ...mapMutations([
      "queryEscortOrgCode",
      "queryEscortUserName",
      "queryEscortSession",
      "queryEscortTaskTypeId",
      "queryEscortForceStatus",
      "queryEscortTaskInfo",
      "queryEscortOnlyToday",
      "queryEscortTaskStatusId",
      "queryEscortOnlyOvertime",
      "empty",
      "queryEscortPageindex",
    ]),
    fillterColor(tag) {
      if (tag == 1 || tag == 0) {
        return "yellow";
      } else if (tag == 2) {
        return "gray";
      } else if (tag == 3) {
        return "blue";
      } else if (tag == 4) {
        return "cyan";
      } else if (tag == 5) {
        return "green";
      } else {
        return "";
      }
    },
    fillterHEXColor(tag) {
      if (tag == 1 || tag == 0) {
        return "#d49539";
      } else if (tag == 2) {
        return "#b1b1b1";
      } else if (tag == 3) {
        return "#178fe6";
      } else if (tag == 4) {
        return "#15d9d3";
      } else if (tag == 5) {
        return "#2bb974";
      } else {
        return "";
      }
    },
    /**
     * 获取任务列表
     */
    queryEscort() {
      const filterTask = {
        orgCode: this.filterInfo.orgCode
          ? this.filterInfo.orgCode
          : JSON.parse(getStore("userInfo")).orgcode,
        escortUserName: this.filterInfo.escortUserName,
        session: this.filterInfo.session,
        taskTypeId: this.filterInfo.taskTypeId,
        forceStatus: this.filterInfo.forceStatus,
        taskInfo: this.filterInfo.taskInfo,
        taskStatusId: this.filterInfo.taskStatusId,
        onlyToday: this.filterInfo.onlyToday,
        onlyOvertime: this.filterInfo.onlyOvertime,
        PageIndex: 1,
        PageSize: 10000,
      };
      this.$api.escortPlan.queryEscortManagementList(filterTask).then((res) => {
        if (res.data) {
          this.tableList = res.data;
        }
      });
    },
    fillterTag(tag) {
      if (this.taskStatus.length > 0) {
        // console.log("长度大于零");
        for (let index = 0; index < this.taskStatus.length; index++) {
          if (tag == this.taskStatus[index].id) {
            return this.taskStatus[index].name;
          }
        }
      }
    },
    changeOrgcode(value, name) {
      this.filterInfo.orgCode = value;
      this.orgName = name[0];
      let code = "";
      if (value) {
        code = value;
      } else {
        code = "";
      }
      this.queryEscortOrgCode(code);
    },
    changeUserName() {
      this.queryEscortUserName(this.filterInfo.escortUserName);
    },
    changeSession(value) {
      this.queryEscortSession(value);
    },
    changeType(value) {
      this.queryEscortTaskTypeId(value);
    },
    changeForceStatus(value) {
      this.queryEscortForceStatus(value);
    },
    changeInfo() {
      this.queryEscortTaskInfo(this.filterInfo.taskInfo);
    },
    changeTaskStatusId(value) {
      this.filterInfo.taskStatusId = value;
      this.queryEscortTaskStatusId(value);
      this.queryEscortAsync();
    },
    changeOnlyToday() {
      this.queryEscortOnlyToday(this.filterInfo.onlyToday);
      this.queryEscortAsync();
      this.queryEscort();
    },
    changeOnlyOvertime() {
      this.queryEscortOnlyOvertime(this.filterInfo.onlyOvertime);
      this.queryEscortAsync();
      this.queryEscort();
    },
    fillterTable() {
      this.pagination.current = 1;
      this.taskInfo = "";
      this.queryEscortAsync("3");
      this.queryEscort();
    },
    fillterTable1() {
      this.pagination.current = 1;
      // if (this.taskInfo == "") {
      // this.$message.error("请先输入查询条件！");
      // } else {
      this.queryEscortAsync("2");
      this.queryEscort();
      // }
    },
    onPageChange(page) {
      this.pagination.current = page;
      this.queryEscortPageindex(page);
      this.queryEscortAsync("1");
    },
    setRowClassName(record, index) {
      let className = "light-row";
      if (index % 2 === 0) className = "dark-row1";
      return className;
    },
    changeTableItem(v) {
      // setStore("currentTaskStatus", v.taskStatus);
      this.$router.push({
        path: "/EscortTask/EscortTaskManage",
        query: {
          taskId: v.taskId,
          // taskStatus: v.taskStatus,
        },
      });
    },

    //点击强制开始或结束
    async forceHandle(record, type) {
      // this.taskForceStatus = type;

      const result = await this.getForceActionQRCode(record.taskId);
      // console.log("result", result);
      if (result) {
        this.forceQRCodeModal = true;
        await this.getQRCode(record.taskId, this.taskForceStatus);
        this.getForceSignStatus(record.taskId);
        this.timer = setInterval(() => {
          this.getForceSignStatus(record.taskId);
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
      // console.log("name", name)
      // const signServerPage = this.QRCodeUrl;
      const signServerPage = JSON.parse(getStore("systemConf")).signServerPage;
      const obj = { u: name, t: taskId, f: type };
      this.QRCodeMsg = `${signServerPage}?p=${JSON.stringify(
        obj
      )}&cb=${baseUrl}saveForceSign`;
      // console.log("this.QRCodeMsg", this.QRCodeMsg);
      this.$nextTick(() => {
        const ele = document.getElementById("QRCode");
        // 将获取到的数据（val）画到msg（canvas）上
        QRCode.toCanvas(ele, this.QRCodeMsg, options, (error) => {
          console.log(error);
        });
      });
    },

    toTaskMonitor() {
      this.$router.push("taskMonitorNew");
    },

    getDetail(v) {
      this.$router.push({
        path: "/taskMonitor",
        query: {
          taskId: v.taskId,
          taskStatus: v.taskStatus,
          endOrgCode: v.endOrgCode,
        },
      });
    },

    async openForceRecordmodal(record) {
      // taskId
      if (record.forceStatus > 0) {
        const result = this.getForceActionRecord(record.taskId);
        if (result) {
          this.forceRecordModal = true;
        }
      }
      // console.log(record);
    },

    //获取超时任务弹窗数据
    async getOvertimeTask() {
      this.overtimeModalLoading = true;
      const orgCode = JSON.parse(getStore("userInfo")).orgcode;
      try {
        const res = await this.$api.escortTask.getOvertimeTask({ orgCode });
        if (res.result) {
          this.unfinish = res.data.unfinish;
          this.unstart = res.data.unstart;
          if (this.unfinish.length || this.unstart.length) {
            this.overtimeTaskListModal = true;
          }
        }
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.overtimeModalLoading = false;
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
          // console.log("this.taskForceStatus",this.taskForceStatus);
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
          console.log("ininin else ");
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },

    //获取强制记录
    async getForceActionRecord(taskId) {
      try {
        const res = await this.$api.escortTask.getForceActionRecord({
          taskId,
        });
        if (res.result) {
          this.forceRecordList = res.data;
          return true;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 导出
    educeExcel() {
      let domCopy = document.getElementById("table2").cloneNode(true);
      let domCopy2 = domCopy.getElementsByTagName("tr");
      for (let i = 0; i < domCopy2.length; i++) {
        if (i == 0) {
          domCopy2[i].cells[domCopy2[i].cells.length - 1].remove();
        } else {
          domCopy2[i].children[domCopy2[i].cells.length - 1].remove();
        }
      }
      let et = XLSX.utils.table_to_book(domCopy); //此处传入table的DOM节点
      let etout = XLSX.write(et, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([etout], {
            type: "application/octet-stream",
          }),
          this.orgName + "押运任务管理.xlsx"
        ); //trade-publish.xlsx 为导出的文件名
      } catch (e) {
        console.log(e, etout);
      }
      return etout;
    },
    printContent() {
      let wpt = document.getElementById("table2");
      let newContent = wpt.innerHTML;
      let oldContent = document.body.innerHTML;

      document.body.innerHTML = newContent;
      window.print(); //打印方法
      window.localtion.reload();
      document.body.innerHTML = oldContent;
    },
  },
};
</script>

<style lang="less">
.org-tree-select.ant-select-dropdown {
  max-height: 500px !important;
}

.overtimeTaskListModal {
  .title {
    padding: 0px 10px;
    margin-bottom: 20px;
  }

  .content {
    display: flex;
    justify-content: space-between;

    .contentLeft {
      height: 200px;
      overflow-y: auto;
      width: 45%;
      border: 1px solid #f2f2f2;
      border-radius: 3px;
      padding: 20px 0;

      p {
        border-left: 5px solid #000;
        padding-left: 20px;
        margin-bottom: 8px;
        font-weight: 700;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 8px;
        padding-left: 20px;
      }
    }
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

.page {
  // .red {
  //   background-color: red;
  // }
  .dark-row1 {
    background: #fafafa;
  }

  width: 100%;
  //   height: 100%;
  height: 100%;
  padding: 10px;
  background: #ebf0f5;

  .escortTask {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: white;
    display: flex;
    flex-direction: column;

    .head {
      width: 100%;
      // height: 58px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;

      .choos {
        display: flex;

        .choose {
          height: 50px;
          display: flex;
          align-items: center;
          margin-right: 10px;

          .ant-select-selection--single {
            width: 200px;
          }

          .p-choose {
            // width: 100px;
            font-size: 14px;
            margin: 0 0 0 10px;
          }
        }

        .result {
          // width: 460px;
          height: 50px;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: space-around;

          .selctor_item {
            display: flex;
            align-items: center;
            margin: 0 20px 0 0;

            .p-result {
              width: 60px;
              font-size: 14px;
              margin: 0 5px 0 0;
            }
          }

          .query {
            //   margin-left: px;
            .icon-search {
              font-size: 16px;
            }
          }
        }
      }

      .search {
        width: 380px;
        height: 50px;
        display: flex;
        align-items: center;

        .input {
          width: 200px;
        }

        .p-search {
          font-size: 14px;
          margin: 0 10px 0 10px;
        }

        .btn-search {
          margin-left: 20px;

          .icon-search {
            font-size: 16px;
          }
        }
      }

      // .ant-btn {
      //   padding: 0 10px;
      // }
      .ant-btn-primary {
        background-color: #398fe6;
        border-color: #398fe6;
      }

      .onlyOption {
        // height: 40px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .empty {
          flex-grow: 1;
        }

        .btn {
          margin-right: 20px;
        }
      }
    }

    .addhask {
      width: 100%;
      height: 40px;
      // margin-top: 10px;
      margin-bottom: 10px;

      .addhask_btn {
        width: 262px;
        height: 100%;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        float: right;

        .btn {
          width: 110px;
          height: 34px;
          line-height: 34px;
          background-color: #3dbf7e;
          color: white;
          border: 0;
        }
      }
    }

    .ant-table-pagination.ant-pagination {
      float: left;
      margin-bottom: 5px;
    }

    // .filter-current {
    // padding: 0 10px;
    .status-filter {
      font-size: 0;
      // margin-bottom: 0px;
      margin-left: 10px;

      span {
        font-size: 14px;
      }
    }

    span.status {
      margin-right: 10px;
      cursor: pointer;
      text-align: center;
      display: inline-block;
      width: 100px;
      height: 30px;
      border: 1px solid #ced3d9;
      border-radius: 3px;
      line-height: 28px;
      font-size: 14px;

      i {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }

      .gray {
        background-color: #b1b1b1;
      }

      .yellow {
        background-color: #d49539;
      }

      .blue {
        background-color: #178fe6;
      }

      .cyan {
        background-color: #15d9d3;
      }

      .green {
        background-color: #2bb974;
      }
    }

    span.active {
      border-color: #3380cc;
      background-color: #ebf5ff;
    }

    .ant-btn-green {
      color: #fff;
      background-color: #3dbf7e;
      border-color: #3dbf7e;
    }

    // }

    .table {
      flex-grow: 1;

      .session-span {
        display: inline-block;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .execute {
        display: inline-block;
        width: 22px;
        height: 16px;
        line-height: 16px;
        border-radius: 8px;
        background-color: #9bb3cb;
        color: #fff;
      }

      .online {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: #2bb974;
      }

      .offline {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: #b1b1b1;
      }
    }
  }

  .ant-pagination-item-active a {
    background-color: #398fe6;
    color: #fff;
  }
}

.task-table {
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 16px 16px;
  }
}

.pDataPicker {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

@media screen and (max-width: 1850px) {
  .escortTask {
    .onlyOption {
      width: 100%;
    }

    // .status-filter {
    // margin-bottom: 15px;
    // }
    .p-choose {
      width: 44px;
    }
  }
}

@media screen and (min-width: 1850px) {
  .escortTask {
    .onlyOption {
      // width: 800px;
      flex-grow: 1;
    }

    .status-filter {
      margin-bottom: 15px;
    }

    // .p-choose {
    // width: 60px;
    // }
  }
}
</style>
