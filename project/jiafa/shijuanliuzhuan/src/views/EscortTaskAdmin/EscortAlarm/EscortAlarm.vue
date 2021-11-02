<template>
  <div class="escortAlarm">
    {{ forever }}
    <div class="escortAlarm-container">
      <div class="filter">
        <div class="chooseOrg">
          <label for="orgId">机构选择：</label>
          <a-tree-select
            v-model="orgCodeTreeValue"
            ref="orgCodeTree"
            style="width: 180px"
            :defaultValue="UserOrgCode"
            dropdownClassName="org-tree-select"
            :tree-data="orgTree"
            placeholder="请选择机构"
            @change="changeOrg"
          ></a-tree-select>
        </div>
        <div class="chooseType">
          <label for="alarmTypeId">预警类型：</label>
          <a-select
            :defaultValue="filterInfo.alarmType"
            id="alarmTypeId"
            v-model="filter.alarmType"
            style="width: 180px"
            show-search
            :filter-option="filterOption"
            @change="changeAlarmType"
            dropdownClassName="alarmTypeDropdownClassName"
            :dropdownMatchSelectWidth="false"
          >
            <a-select-option value>全部</a-select-option>
            <a-select-option
              v-for="item in alarmType"
              :key="item.id"
              :title="item.name"
              :value="item.id"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </div>
        <div class="chooseTime">
          <label>预警时间：</label>
          <a-date-picker
            dropdownClassName="escortAlarmData"
            v-model="filter.startTime"
            :disabled-date="disabledStartDate"
            :showToday="false"
            format="YYYY-MM-DD"
            placeholder="开始日期"
          />&nbsp;&nbsp;至&nbsp;
          <a-date-picker
            dropdownClassName="escortAlarmData"
            v-model="filter.endTime"
            :disabled-date="disabledEndDate"
            :showToday="false"
            format="YYYY-MM-DD"
            placeholder="结束日期"
          />
          <a-button type="primary" @click="searchEvent(1)">
            <icon name="sousuo" scale="2"></icon>查询
          </a-button>
        </div>
        <div class="chooseSearch">
          <label for="alarmTypeId">搜索：</label>
          <a-input
            placeholder="机构名称"
            style="display: inline-block; width: 180px"
            v-model="filter.keyword"
          />
          <a-button type="primary" @click="searchEvent(0)">
            <icon name="sousuo" scale="2"></icon>搜索
          </a-button>
        </div>
      </div>
      <div class="table">
        <a-table
          :loading="isLoading"
          :columns="columns"
          :data-source="lists"
          :scroll="{ y: 570 }"
          size="middle"
          :pagination="pagination"
          :rowKey="(record) => record.uid"
          :rowClassName="
            (record, index) => {
              if (index % 2 !== 0) return 'eveneven';
            }
          "
        >
          <a-tooltip slot="alarmType" slot-scope="text">
            <template slot="title" v-if="text.length >= 11">{{
              returnAlarmType(text)
            }}</template>
            {{ returnAlarmType(text) }}
          </a-tooltip>
          <!-- <span slot="alarmType" slot-scope="text">{{returnAlarmType(text)}}</span> -->
          <a-tag
            slot="name"
            slot-scope="text"
            :color="
              text == 0
                ? 'orange'
                : text == 1
                ? 'green'
                : text == 2
                ? 'red'
                : '-'
            "
            >{{
              text == 0
                ? "未处置"
                : text == 1
                ? "正常"
                : text == 2
                ? "异常"
                : "-"
            }}</a-tag
          >
          <!-- <span
            slot="name"
            slot-scope="text"
          >{{ text=="0"?"未处置":text=="1"?"正常":text=="2"?"异常":"-" }}</span>-->
          <a-button
            slot="handle"
            slot-scope="text, record"
            @click="handleAlarm(record)"
            >处置</a-button
          >
        </a-table>
      </div>
    </div>
    <AlarmHandleModal
      v-if="modalVisible"
      ref="AlarmHandleModal"
      :modalData="modalData"
      @queryEscortAlarmAsync="queryEscortAlarmAsync"
    />
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
  message,
  Tag,
  Tooltip,
  TreeSelect,
} from "ant-design-vue";
Vue.use(Select).use(Input).use(Tag).use(Tooltip).use(TreeSelect);
Vue.prototype.$message = message;
message.config({
  duration: 1,
  maxCount: 1,
});

const columns = [
  {
    width: 150,
    align: "center",
    ellipsis: true,
    title: "预警类型",
    dataIndex: "alarmType",
    key: "alarmType",
    scopedSlots: { customRender: "alarmType" },
  },
  {
    title: "起始机构",
    dataIndex: "startOrgName",
    key: "startOrgName",
    align: "center",
  },
  {
    title: "目标机构",
    dataIndex: "endOrgName",
    key: "endOrgName ",
    align: "center",
  },
  {
    width: 100,
    title: "押运人",
    dataIndex: "escortPerson",
    key: "escortPerson",
    align: "center",
  },
  {
    title: "车辆",
    dataIndex: "escortCars",
    key: "escortCars",
    align: "center",
  },
  {
    width: 180,
    title: "报警时间",
    dataIndex: "alarmTime",
    key: "alarmTime",
    align: "center",
  },
  {
    width: 100,
    title: "处置状态",
    dataIndex: "actionStatus",
    key: "actionStatus",
    align: "center",
    scopedSlots: { customRender: "name" },
  },
  {
    width: 100,
    align: "center",
    title: "处置人",
    dataIndex: "actionPerson",
    key: "actionPerson",
  },
  {
    width: 100,
    align: "center",
    title: "操作",
    key: "address",
    scopedSlots: { customRender: "handle" },
  },
];

const UserOrgCode = JSON.parse(getStore("userInfo")).orgcode || "";
import axios from "axios";

import moment from "moment";
import { timestampToTime, getStore } from "@/utils/util.js";
import AlarmHandleModal from "./ChildCon/AlarmHandleModal";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapMutations } = createNamespacedHelpers(
  "escortAlarm"
);
export default {
  name: "EscortAlarm",
  components: {
    AButton: Button,
    AIcon: Icon,
    ACascader: Cascader,
    ADatePicker: DatePicker,
    AInput: Input,
    ATable: Table,
    AlarmHandleModal,
  },
  data() {
    return {
      columns,
      pagination: {
        size: "middle",
        current: 1,
        showQuickJumper: true,
        total: 0,
        defaultPageSize: 10,
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共 ${total} 条`,
        onChange: (pageIndex, pageSize) => {
          this.pagination.current = pageIndex;
          this.filterInfo.pageIndex = pageIndex;
          this.queryEscortAlarmAsync(true);
        },
      },
      modalVisible: false,
      //本页面的筛选数据
      // filter:{...this.filterInfo},
      filter: {
        orgCode: UserOrgCode,
        // orgCode: "",
        alarmType: "",
        startTime: null,
        endTime: null,
        keyword: "",
      },
      orgCodeTreeValue: UserOrgCode,
      //传递给弹窗的数据
      modalData: {},
      // 机构树
      UserOrgCode,
      // orgTree: [],
      //预警类型下拉列表数据
      // alarmType: '',
      alarmType: [],
    };
  },
  beforeCreate() {},
  created() {
    this.resetFilterInfo();
    this.queryEscortAlarmAsync(false);
  },
  mounted() {
    // this.orgTree = this.$store.state.app.orgs;
    this.alarmType = JSON.parse(getStore("systemConf")).alarmType || [];
    // this.filterInfo.orgCode = JSON.parse(getStore("userInfo")).orgcode || "";
    // setTimeout(() => this.changeDomText(), 100);
  },
  computed: {
    ...mapState(["lists", "total", "filterInfo", "isLoading", "render"]),
    forever() {
      this.pagination.total = this.total / 1;
      // this.pagination.current = this.filterInfo.pageIndex;
      return "";
    },
    orgTree() {
      return this.$store.state.app.orgs;
    },
    //返回预警类型
    returnAlarmType() {
      const arr = this.alarmType;
      return (id) => {
        if (!arr || arr.length == 0) {
          return "-";
        } else {
          for (let item of arr) {
            if (id == item.id) return item.name;
          }
        }
      };
    },
  },
  methods: {
    ...mapActions(["queryEscortAlarmAsync"]),
    ...mapMutations(["resetFilterInfo"]),
    //禁选日期
    disabledStartDate(startValue) {
      const endValue = this.filter.endTime;
      if (!startValue || !endValue) {
        return startValue >= moment();
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    //禁选日期
    disabledEndDate(endValue) {
      const startValue = this.filter.startTime;
      if (!endValue || !startValue) {
        return endValue >= moment();
      }
      return (
        startValue.valueOf() >= endValue.valueOf() ||
        endValue.valueOf() >= moment()
      );
    },
    //改变org
    changeOrg(value, label, extra) {
      // console.log(value, label, extra)
      this.filter.orgCode = value;
    },
    // changeOrg(orgCode) {
    //   this.filter.orgCode = orgCode[orgCode.length - 1];
    // },
    //点击搜索按钮事件
    searchEvent(type) {
      //点击查询
      let { startTime, endTime, keyword, orgCode, alarmType } = this.filter;
      if (type) {
        if (!orgCode) return this.$message.error("请选择机构！");
        this.filter.keyword = "";
        this.pagination.current = 1;
        this.filterInfo.pageIndex = 1;
        // this.filterInfo.orgCode = '86.32';
        this.filterInfo.orgCode = orgCode || UserOrgCode;
        this.filterInfo.alarmType = alarmType;
        this.filterInfo.keyword = "";
        if (startTime && endTime) {
          startTime = moment(startTime).valueOf();
          endTime = moment(endTime).valueOf();
          this.filterInfo.startTime = timestampToTime(startTime, 1);
          this.filterInfo.endTime = timestampToTime(endTime, 1);
          this.queryEscortAlarmAsync(true);
        } else {
          this.filterInfo.startTime = "";
          this.filterInfo.endTime = "";
          this.queryEscortAlarmAsync(true);
          // this.$message.error("请选择开始时间和结束时间！");
        }
      } else {
        // if (!keyword) return this.$message.error("请输入查询内容！");
        this.orgCodeTreeValue = UserOrgCode;

        this.filter.alarmType = "";
        this.filter.startTime = null;
        this.filter.endTime = null;
        this.pagination.current = 1;
        this.filterInfo.pageIndex = 1;
        startTime = moment(startTime).valueOf();
        endTime = moment(endTime).valueOf();
        // this.filterInfo.orgCode = '86.32';
        this.filterInfo.orgCode = UserOrgCode;
        this.filterInfo.alarmType = "";
        this.filterInfo.startTime = "";
        this.filterInfo.endTime = "";
        this.filterInfo.keyword = keyword;
        this.queryEscortAlarmAsync(true);
      }
    },

    //点击处置按钮事件
    handleAlarm(data) {
      this.modalData = data;
      this.modalVisible = true;
      // this.modalVisible = false;
      // this.modalVisible = true;
      setTimeout(() => (this.$refs.AlarmHandleModal.visible = true), 0);
      // this.$refs.AlarmHandleModal.initMap();
    },
    //select搜索筛选
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },
    changeAlarmType(a, option) {
      // console.log(835, a, option.componentOptions.children[0].text);
    },

    //分页控件的最后展示总页数
    changeDomText() {
      const quickJumper = document.querySelector(
        ".ant-pagination-options-quick-jumper"
      );
      // console.log(123, quickJumper);
      const childNodesText = quickJumper.childNodes;
      // console.log(234, this.total, this.pagination.defaultPageSize);

      const totalPage = Math.ceil(this.total / this.pagination.defaultPageSize);
      if (childNodesText[childNodesText.length - 1].nodeValue === "页") {
        childNodesText[childNodesText.length - 1].nodeValue =
          "/" + totalPage + "页";
      }
    },

    //message提示
    messageInfo() {
      this.$message.success("操作成功");
    },
  },
};
</script>

<style lang="less" >
.escortAlarm {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #ebf0f5;
  font-size: 14px;
  .escortAlarm-container {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px;
    .filter {
      width: 100%;
      padding-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      & > * {
        margin-right: 10px;
        padding: 5px 0;
      }
      label {
        display: inline-block;
        width: 70px;
        text-align: right;
      }
      button {
        margin-left: 15px;
      }
      .chooseOrg {
        width: 260px;
      }
      .chooseType {
        width: 255px;
      }
      .chooseTime {
        width: 500px;
      }
      .chooseSearch {
        width: 100%;
      }

      .svg-icon {
        margin-right: 5px;
        vertical-align: -3px;
      }
      //修改日期控件宽度
      .ant-calendar-picker {
        min-width: 150px !important;
      }
      .ant-calendar-picker-input.ant-input {
        width: 150px;
      }
    }
    .table {
      .eveneven {
        background-color: #fafafa;
      }
    }
  }

  .ant-btn {
    padding: 0 10px;
  }
  .ant-btn-primary {
    background-color: #398fe6;
    border-color: #398fe6;
  }

  // 修改antdv表格默认样式
  .ant-pagination-item-active a {
    background-color: #398fe6;
    color: #fff;
  }
  .ant-pagination-item-active a:hover {
    color: #fff;
  }
  .ant-table-pagination {
    float: left;
  }
  .ant-table-tbody {
    .ant-btn {
      height: 28px;
    }
    & > tr {
      & > td {
        padding: 18px 5px !important;
      }
    }
  }
}
.escortAlarmData {
  .ant-calendar {
    width: 250px;
  }
}
.alarmTypeDropdownClassName {
  width: 240px;
}
</style>