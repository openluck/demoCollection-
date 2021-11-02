<template>
  <div class="page">
    <div class="escortPlayback1">
      <div class="head">
        <div class="choos">
          <div class="choose">
            <p class="p-choose">机构{{ forever }}:</p>
            <a-tree-select v-model="orgCodeArr"
                           style="width: 80%"
                           :tree-data="options"
                           placeholder="请选择"
                           @change="changeOrgcode" />
          </div>

          <div class="result">
            <div class="selctor_item">
              <p class="p-result">任务类型:</p>
              <a-select style="width: 100px"
                        v-model="orgCodeType"
                        @change="changeType">
                <a-select-option value>全部</a-select-option>
                <a-select-option :value="1">领卷</a-select-option>
                <a-select-option :value="2">返卷</a-select-option>
              </a-select>
            </div>
            <div class="selctor_item">
              <p class="p-result">任务状态:</p>
              <a-select default-value
                        v-model="orgCodeStatus"
                        style="width: 100px"
                        @change="changeStatus">
                <a-select-option value>全部</a-select-option>
                <a-select-option v-for="item in taskStatus"
                                 :key="item.id">{{ item.name }}
                </a-select-option>
              </a-select>
            </div>

            <!-- 查询 -->
            <div class="query">
              <a-button @click="fillterTable"
                        type="primary">
                <icon-font type="iconsousuo"
                           class="icon-search" />
                查询
              </a-button>
            </div>
          </div>
        </div>

        <!-- 搜索 -->
        <div class="search">
          <p class="p-search">搜索：</p>
          <a-input @change="changeInfo"
                   v-model="taskInfo"
                   placeholder="任务名称/机构名称"
                   class="input" />
          <!-- 搜索 -->
          <div class="btn-search">
            <a-button @click="fillterTable1"
                      type="primary">
              <icon-font type="iconsousuo"
                         class="icon-search"
                         name="iconsousuo" />
              搜索
            </a-button>
          </div>
        </div>
      </div>

      <div class="addhask">
        <div class="choose">
          <a-checkbox v-model="onlyShowToday"
                      @change="onCheckboxChange('td', $event)">仅显示当天
          </a-checkbox>
          <a-checkbox v-model="onlyShowTest"
                      @change="onCheckboxChange('ts', $event)">仅显示测试
          </a-checkbox>
          <!-- <a-checkbox @change="onCheckboxChange('nts',$event)">不显示测试</a-checkbox> -->
        </div>
        <div class="addhask_btn">
          <a-button type="primary"
                    class="btn"
                    title="excel导出"
                    @click="educeExcel">
            导出
          </a-button>
          <a-button type="primary"
                    class="btn"
                    @click="btnOne">
            <icon-font style="font-size: 20px"
                       type="iconyijianchuangjian" />
            一键创建
          </a-button>
          <a-button type="primary"
                    class="btn"
                    @click="addplan">
            <icon-font style="font-size: 20px"
                       type="iconrenwuzhiding" />
            任务制定
          </a-button>
        </div>
      </div>
      <div id="table"
           class="table">
        <a-table :columns="columns"
                 :data-source="lists"
                 :pagination="pagination"
                 :rowClassName="setRowClassName"
                 :loading="tableLoading"
                 :scroll="{ y: 550 }"
                 :rowKey="(record) => record.taskId">
          <span slot="name"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="orgName"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="startOrgName"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="endOrgName"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="planStartTime"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="planEndTime"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="dutyPerson"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="isTest"
                slot-scope="text">{{ text ? "是" : "否" }}</span>

          <span slot="customTitle">任务名称</span>
          <span slot="taskType"
                slot-scope="text">{{
            text == 1 ? "领卷" : "返卷"
          }}</span>

          <span slot="result"
                slot-scope="result">
            <a-tag v-for="tag in result"
                   :key="tag"
                   :color="fillterHEXColor(tag)">{{ fillterTag(tag) }}</a-tag>
          </span>
          <span slot="action"
                slot-scope="text, record">
            <a-button size="small"
                      v-if="record.taskStatus < 2"
                      @click="changeTableItem(record)"
                      :disabled="!(record.createOrgCode == ownOrgCode)">编辑</a-button>
            <a-button size="small"
                      v-else-if="record.taskStatus > 2"
                      @click="changeTableItem(record)">详情</a-button>
            <a-popconfirm title="确认删除这条数据?"
                          ok-text="确认"
                          cancel-text="取消"
                          :disabled="!(record.createOrgCode == ownOrgCode)"
                          @confirm="deleteTableItem(record)">
              <a-button size="small"
                        v-if="record.taskStatus < 3"
                        :disabled="!(record.createOrgCode == ownOrgCode)">删除</a-button>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
      <!-- 导出excel不分页的dom -->
      <div id="table2"
           v-show="false">
        <a-table :columns="columns"
                 :data-source="tableList.list"
                 :pagination="false"
                 :loading="tableLoading"
                 :rowKey="(record) => record.taskId">
          <span slot="name"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="orgName"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="startOrgName"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="endOrgName"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="planStartTime"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="planEndTime"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="dutyPerson"
                slot-scope="text">{{ text || "--" }}</span>
          <span slot="isTest"
                slot-scope="text">{{ text ? "是" : "否" }}</span>

          <span slot="customTitle">任务名称</span>
          <span slot="taskType"
                slot-scope="text">{{
            text == 1 ? "领卷" : "返卷"
          }}</span>

          <span slot="result"
                slot-scope="result">
            <a-tag v-for="tag in result"
                   :key="tag"
                   :color="fillterHEXColor(tag)">{{ fillterTag(tag) }}</a-tag>
          </span>
          <span slot="action"
                slot-scope="text, record">
            <a-button size="small"
                      v-if="record.taskStatus < 2"
                      @click="changeTableItem(record)"
                      :disabled="!(record.createOrgCode == ownOrgCode)">编辑</a-button>
            <a-button size="small"
                      v-else-if="record.taskStatus > 2"
                      @click="changeTableItem(record)">详情</a-button>
            <a-popconfirm title="确认删除这条数据?"
                          ok-text="确认"
                          cancel-text="取消"
                          :disabled="!(record.createOrgCode == ownOrgCode)"
                          @confirm="deleteTableItem(record)">
              <a-button size="small"
                        v-if="record.taskStatus < 3"
                        :disabled="!(record.createOrgCode == ownOrgCode)">删除</a-button>
            </a-popconfirm>
          </span>
        </a-table>
      </div>

      <a-modal title="一键创建"
               :closable="false"
               :maskClosable="false"
               :visible="visible"
               width="650px"
               :destroyOnClose="false">
        <p class="pDataPicker">
          一键创建任务类型 ：
          <a-radio-group v-model="addPlanInfo.taskType"
                         @change="changeCreateType">
            <a-radio :value="1">领卷任务</a-radio>
            <a-radio :disabled="isToTest"
                     :value="2">返卷任务</a-radio>
          </a-radio-group>
          <a-checkbox @change="changeTotest"
                      v-model="addPlanInfo.isTest">创建为测试任务
          </a-checkbox>
        </p>
        <p class="pDataPicker">
          押运计划开始时间 ：
          <a-date-picker style="width: 280px"
                         show-time
                         type="date"
                         :disabled-date="disabledStartDate"
                         @change="changeStartTime"
                         placeholder="请选择开始时间" />
        </p>
        <p class="pDataPicker">
          押运计划结束时间 ：
          <a-date-picker style="width: 280px"
                         @change="changeEndTime"
                         :disabled-date="disabledEndDate"
                         show-time
                         type="date"
                         placeholder="请选择结束时间" />
        </p>
        <div class="org-wrap">
          <div class="start-org">
            <label for="">{{ startNameString.name }}</label>
            <a-tree-select v-model="addPlanInfo.startOrgCode"
                           style="width: 280px"
                           :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                           :tree-data="options"
                           :placeholder="startNameString.placeholder"
                           @change="startOrgInputChange" />
          </div>

          <div class="end-org">
            <label for="endOrgScoped">{{ targetNameString.name }}</label>
            <a-tree-select v-model="addPlanInfo.endOrgCode"
                           class="end-org-style"
                           style="width: 280px"
                           id="endOrgScoped"
                           :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                           :getPopupContainer="
                (triggerNode) => triggerNode.parentNode || document.body
              "
                           :tree-data="childrenOrgOptions"
                           title="asdada"
                           :placeholder="targetNameString.placeholder"
                           tree-checkable
                           search-placeholder="请选择教师范围"
                           :treeDefaultExpandAll="false"
                           @change="onChangeChangci2" />
            <a-checkbox :indeterminate="indeterminate2"
                        :checked="checkAll2"
                        class="change-all-ci"
                        @change="onChangeChangEndAll"
                        style="display: block; height: 30px">全选
            </a-checkbox>
            <span class="check-tree-org">{{ checkTreeOrg }}/{{ childrenOrgOptions.length }}</span>
          </div>
        </div>
        <!-- 押运场次选择 只有在考点任务才会显示 -->
        <div v-if="orgtypeid == '3'"
             class="changci">
          <label for="">押运场次：</label>
          <div class="cc-wrap">
            <a-checkbox :indeterminate="indeterminate"
                        :checked="checkAll"
                        @change="onChangeChangciAll"
                        style="display: block; height: 30px">全选
            </a-checkbox>
            <a-checkbox-group v-model="checkedList"
                              :options="plainOptions"
                              @change="onChangeChangci"
                              ref="modal" />
          </div>
        </div>
        <template slot="footer">
          <a-button key="back"
                    @click="handleCancel">取消</a-button>
          <a-button key="submit"
                    type="primary"
                    @click="handleOk">创建
          </a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { createNamespacedHelpers } from "vuex";
import FileSaver from "file-saver";
import XLSX from "xlsx";

const { mapActions, mapState, mapMutations } = createNamespacedHelpers(
  "escortPlan"
);
import { getStore } from "@/utils/util.js";

const UserOrgCode = JSON.parse(getStore("userInfo")).orgcode;
import {
  Select,
  Cascader,
  Button,
  Icon,
  Table,
  Tag,
  Divider,
  Input,
  Pagination,
  Modal,
  Radio,
  DatePicker,
  message,
  Popconfirm,
  TreeSelect,
  Checkbox,
  Dropdown,
} from "ant-design-vue";
import TaskUpVue from "../TaskMonitor/ChildCon/TaskUp.vue";

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1814330_pl18gus56wg.js",
});
Vue.use(Select)
  .use(TreeSelect)
  .use(Cascader)
  .use(Table)
  .use(Tag)
  .use(Divider)
  .use(Input)
  .use(Pagination)
  .use(Modal)
  .use(DatePicker)
  .use(Icon)
  .use(message)
  .use(Popconfirm)
  .use(Checkbox)
  .use(Dropdown)

  // .use(IconFont)
  .use(Radio);
Vue.prototype.$message = message;
const columns = [
  {
    dataIndex: "taskName",
    key: "taskName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
  },
  {
    title: "创建机构",
    dataIndex: "orgName",
    key: "orgName",
    align: "center",
    scopedSlots: { customRender: "orgName" },
  },
  {
    title: "起始机构",
    dataIndex: "startOrgName",
    key: "startOrgName",
    align: "center",
    scopedSlots: { customRender: "startOrgName" },
  },
  {
    align: "center",
    title: "目标机构",
    dataIndex: "endOrgName",
    key: "endOrgName",
    scopedSlots: { customRender: "endOrgName" },
  },
  {
    align: "center",
    title: "计划开始时间",
    dataIndex: "planStartTime",
    key: "planStartTime",
    scopedSlots: { customRender: "planStartTime" },
  },
  {
    align: "center",
    title: "计划结束时间",
    dataIndex: "planEndTime",
    key: "planEndTime",
    scopedSlots: { customRender: "planEndTime" },
  },
  {
    title: "押运负责人",
    dataIndex: "dutyPerson",
    key: "dutyPerson",
    align: "center",
    scopedSlots: { customRender: "dutyPerson" },
  },
  {
    align: "center",
    title: "任务类型",
    dataIndex: "taskType",
    key: "taskType",
    scopedSlots: { customRender: "taskType" },
  },
  {
    title: "是否开启测试",
    dataIndex: "isTest",
    key: "isTest",
    scopedSlots: { customRender: "isTest" },
    align: "center",
  },
  {
    title: "任务状态",
    dataIndex: "taskStatus",
    key: "taskStatus",
    scopedSlots: { customRender: "result" },
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "left",
  },
];

const data = [];

export default {
  components: {
    // AIcon: Icon,
    IconFont,
  },
  data () {
    return {
      SHOW_PARENT,
      childrenOrgOptions: [],
      oneBtn: true,
      orgtypeid: "",
      orgCodeType: "",
      orgCodeStatus: "",
      checkTreeOrg: 0,
      orgCodeArr: "",
      orgCodeInfo: "",
      isCreateOrg: true,
      visible: false,
      isToTest: false, //测试任务判断返卷
      // tableLoading: false,
      addPlanInfo: {
        //一键创建
        taskStartTime: null,
        taskEndTime: null,
        taskType: "",
        orgCode: JSON.parse(getStore("userInfo")).orgcode,
        isTest: false, // 是否创建为测试任务
        escortCount: [], // 押运场次（考点任务才有）
        startOrgCode: [],
        endOrgCode: [],
      },
      startNameString: {
        name: "起始机构 ：",
        placeholder: "请选择起始机构",
      },
      isFristClick: true,
      targetNameString: {
        name: "目的机构范围 ：",
        placeholder: "请选择目的机构",
      },
      ownOrgCode: JSON.parse(getStore("userInfo")).orgcode,
      data,
      columns,
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
      // 查询任务列表
      escortCount: [], // 场次
      checkedList: [],
      checkedList2: [],
      indeterminate: false,
      indeterminate2: false,
      checkAll: false,
      checkAll2: false,
      plainOptions: [],
      orgName: "",
      isExaminPoint: false,
      onlyShowToday: false,
      onlyShowTest: false,
      tableList: [],
    };
  },
  created () {
    this.orgCodeArr = UserOrgCode;
    console.log("creat");
    this.orgtypeid = JSON.parse(getStore("userInfo")).orgtypeid;
    this.orgName = JSON.parse(getStore("userInfo")).orgname;
    const { keepAlive, search } = this.$route.query;
    const pSearch=search?JSON.parse(search):{}
    const {
      orgCode,
      onlyShowToday,
      taskType,
      onlyShowTest,
      pageIndex,
      pageSize,
      orgCodeType,
      taskStatus,
      keyword,
    } = pSearch;
    if (keepAlive) {
      //从返回页面来的数据

      this.orgCodeArr = orgCode;
      this.onlyShowToday = onlyShowToday;
      this.onlyShowTest = onlyShowTest;
      this.orgCodeType = taskType; //任务类型
      this.orgCodeStatus = taskStatus; //任务状态
      this.taskInfo = keyword; //模糊查询内容
      this.quertFilterInfo(JSON.parse(search));

      this.pagination = {
        ...this.pagination,
        current: pageIndex,
        pageSize: pageSize, // 默认每页显示数量
      };
      this.queryEscortAsync();
      this.queryEscort();
    } else {
      this.queryEscortTaskShowTest(onlyShowTest)
      this.queryEscortTaskShowToday(onlyShowToday)
      this.empty();
      this.queryEscortAsync();
      this.queryEscort();
    }

    // if(this.orgtypeid>2){
    //   this.oneBtn=false
    // }
    // console.log(JSON.parse(getStore("userInfo")).orgtypeid);

    // 获取当前用户是否考点
    // isExamPoint = sessionStorage.getItem('userInfo').orgtypeid
  },
  mounted () {
    //获取考试场次及科目
    this.$api.init.getSessionAndSubject().then((res) => {
      if (res.result) {
        this.escortCount = res.data;
        // 将返回的数据格式处理成CheckBoxGroup需要的格式
        let arr = [];
        this.escortCount.map((item) => {
          let obj = {};
          const subName = item.subjects.map((item) => item.subjectName);
          obj["label"] = item.sessionName + " " + " " + subName.join("、");
          obj["value"] = item.sessionCode;
          arr.push(obj);
        });
        this.plainOptions = arr;
      }
    });
  },
  computed: {
    ...mapState(["lists", "total", "tableLoading", "filterInfo"]),
    forever () {
      this.pagination.total = this.total / 1;
      return "";
    },
    taskStatus () {
      return this.$store.state.app.systemConf.escortStatus;
    },
    options () {
      return this.$store.state.app.orgs;
    },
  },
  methods: {
    moment,
    ...mapActions([
      "queryEscortAsync",
      "setEscortAsync",
      "deleteEscortAsync",
      "setBatchEscort",
    ]),
    ...mapMutations([
      "queryEscortOrgCode",
      "quertFilterInfo",
      "queryEscortTaskShowTest",
      "queryEscortTaskTypeId",
      "queryEscortTaskStatusId",
      "queryEscortTaskInfo",
      "queryEscortPageindex",
      "queryEscortTaskShowToday",
      "addPlian",
      "empty",
    ]),

    // 一键创建任务选择目的机构
    startOrgInputChange (value, label, extra) {
      //   this.childrenOrgOptions = [];
      //   this.addPlanInfo.endOrgCode = [];
      //   const data = extra.triggerNode.dataRef.children || [];
      //   this.childrenOrgOptions = data.map((item) => {
      //     const obj = { ...item };
      //     delete obj.children;
      //     return obj;
      //   });
    },
    /**
     * 获取任务列表
     */
    queryEscort () {
      this.orgCodeArr = this.orgCodeArr
        ? this.orgCodeArr
        : JSON.parse(getStore("userInfo")).orgcode;
      this.$api.escortPlan
        .queryEscortPlanList({
          orgCode: this.taskInfo ? "" : this.orgCodeArr,
          taskStatus: this.taskInfo ? "" : this.orgCodeStatus,
          taskType: this.taskInfo ? "" : this.orgCodeType,
          keyword: this.taskInfo,
          pageIndex: 1,
          pageSize: 10000,
          onlyShowTest: this.onlyShowTest,
          onlyShowToday: this.onlyShowToday,
        })
        .then((res) => {
          if (res.data) {
            this.tableList = res.data;
          }
        });
    },

    replaceAll (item, sourceStr, newStr) {
      let reg = new RegExp(sourceStr, "g"); //g,表示全部替换。
      return item.replace(reg, newStr);
    },
    // 单选
    onChangeChangci (checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.plainOptions.length;
      this.checkAll = checkedList.length === this.plainOptions.length;
      this.addPlanInfo.escortCount = this.checkedList;
    },
    onChangeChangci2 (value, checkedList) {
      this.checkTreeOrg = checkedList.length;
      this.indeterminate2 =
        !!checkedList.length &&
        checkedList.length < this.childrenOrgOptions.length;
      this.checkAll2 = checkedList.length === this.childrenOrgOptions.length;
      this.addPlanInfo.escortCount = this.checkedList2;
    },
    // 全选场次
    onChangeChangciAll (e) {
      const { plainOptions } = this;
      const value = plainOptions.map((item) => item.value);
      Object.assign(this, {
        checkedList: e.target.checked ? value : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
      this.addPlanInfo.escortCount = this.checkedList;
    },
    // 全选结构树
    onChangeChangEndAll (e) {
      const { childrenOrgOptions } = this;
      if (this.checkTreeOrg < childrenOrgOptions.length) {
        this.checkTreeOrg = childrenOrgOptions.length;
      } else {
        this.checkTreeOrg = 0;
      }
      const value = childrenOrgOptions.map((item) => item.value);
      Object.assign(this, {
        checkedList2: e.target.checked ? value : [],
        indeterminate2: false,
        checkAll2: e.target.checked,
      });
      this.addPlanInfo.endOrgCode = this.checkedList2;
    },
    // 筛选
    onCheckboxChange (type, e) {
      switch (type) {
        case "td":
          console.log(`仅显示当天checked = ${e.target.checked}`);
          this.queryEscortTaskShowToday(e.target.checked);
          this.queryEscortAsync("3");
          this.taskInfo = "";
          this.queryEscort();
          break;
        case "ts":
          console.log(`仅显示测试checked = ${e.target.checked}`);
          this.queryEscortTaskShowTest(e.target.checked);
          this.queryEscortAsync("3");
          this.taskInfo = "";
          this.queryEscort();
          break;
        default:
          break;
      }
    },

    // 创建测试任务
    changeTotest (e) {
      let isChoose = e.target.checked;
      this.startNameString = {
        name: "起始机构 ：",
        placeholder: "请选择起始机构",
      };
      this.targetNameString = {
        name: "目的机构范围 ：",
        placeholder: "请选择目的机构",
      };
      if (isChoose) {
        this.isToTest = true;
        this.addPlanInfo.taskType = 1;
      } else {
        this.isToTest = false;
        this.addPlanInfo.taskType = "";
      }
    },

    //禁选日期
    disabledStartDate (startValue) {
      const endValue = moment(this.addPlanInfo.taskEndTime);
      return (
        endValue < startValue || startValue <= moment().subtract(1, "days")
      );
    },
    //禁选日期
    disabledEndDate (endValue) {
      const startValue = moment(
        this.addPlanInfo.taskStartTime,
        "YYYY-MM-DD HH:mm:ss"
      );

      return startValue > endValue || endValue <= moment().subtract(1, "days");
    },
    fillterColor (tag) {
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
    fillterHEXColor (tag) {
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
    fillterTag (tag) {
      if (this.taskStatus.length > 0) {
        for (let index = 0; index < this.taskStatus.length; index++) {
          if (tag == this.taskStatus[index].id) {
            return this.taskStatus[index].name;
          }
        }
      }
    },
    addplan () {
      this.$router.push({
        path: "/EscortPlan/AddPlan",
        query: {
          taskId: "",
        },
      });
    },
    // 一键创建任务
    btnOne () {
      this.addPlanInfo.taskType = "";
      this.addPlanInfo.taskStartTime = null;
      this.addPlanInfo.taskEndTime = null;
      this.addPlanInfo.escortCount = [];
      this.checkedList = [];
      this.addPlanInfo.isTest = false;
      this.indeterminate = false;
      this.checkAll = false;
      this.addPlanInfo.endOrgCode = [];
      this.isToTest = false;
      this.addPlanInfo.taskType = "";
      this.checkTreeOrg = 0;
      // 机构固定
      this.childrenOrgOptions = this.options[
        this.options.length - 1
      ].children.map((item) => {
        const obj = { ...item };
        delete obj.children;
        return obj;
      });
      const orgTypeId = window.sessionStorage.getItem("userInfo").orgtypeid;
      if (orgTypeId === "4") {
        // 创建考点任务
        this.isExaminPoint = true;
      } else {
        // 创建非考点任务
        this.isExaminPoint = true;
      }
      this.visible = true;
      // 设置场次文字样式
      this.$nextTick(() => {
        const ele = document.getElementsByClassName("ant-checkbox-group-item");
        Array.from(ele).map((item) => {
          item.childNodes[1].innerHTML = `<span class="label-width" title=" ${item.childNodes[1].textContent.slice(
            6
          )}"><span style="font-weight: 600; font-size: 14px;margin-right:10px;">${item.childNodes[1].textContent.substring(
            0,
            6
          )}</span>  ${item.childNodes[1].textContent.slice(6)}</span>`;
        });
      });
    },
    changeOrgcode (value, name) {
      console.log("...orgCodeArr", value);
      this.orgCodeArr = value;
      this.orgName = name[0];
      let code = "";
      if (value) {
        code = value;
      } else {
        code = "";
      }
      this.queryEscortOrgCode(code);
    },
    changeCreateType (e) {
      let value = e.target.value;
      if (value == 1) {
        this.startNameString = {
          name: "起始机构 ：",
          placeholder: "请选择起始机构",
        };
        this.targetNameString = {
          name: "目的机构范围 ：",
          placeholder: "请选择目的机构",
        };
        return;
      }
      this.startNameString = {
        name: "目的机构 ：",
        placeholder: "请选择目的机构",
      };
      this.targetNameString = {
        name: "起始机构范围 ：",
        placeholder: "请选择起始机构",
      };
    },
    changeType (value) {
      this.orgCodeType = value;
      this.queryEscortTaskTypeId(value);
    },
    changeStatus (value) {
      this.orgCodeStatus = value;
      this.queryEscortTaskStatusId(value);
    },
    changeInfo (value) {
      this.queryEscortTaskInfo(this.taskInfo);
    },
    fillterTable () {
      this.pagination.current = 1;
      (this.taskInfo = ""), this.queryEscortAsync("3");
      this.queryEscort();
    },
    fillterTable1 () {
      this.pagination.current = 1;
      this.orgCodeArr = [];
      this.orgCodeType = "";
      this.orgCodeStatus = "";
      // if (this.taskInfo == "") {
      // this.$message.error("请先输入查询条件！");
      // } else {
      this.queryEscortAsync("2");
      this.queryEscort();
      // }
    },
    onPageChange (page) {
      this.pagination.current = page;
      this.queryEscortPageindex(page);
      this.queryEscortAsync("1");
    },
    changeStartTime (value) {
      this.addPlanInfo.taskStartTime = moment(value).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      // console.log(this.addPlanInfo.taskStartTime);
    },
    changeEndTime (value) {
      this.addPlanInfo.taskEndTime = moment(value).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    handleOk (e) {
      if (this.addPlanInfo.taskType === "") {
        this.$message.error("请选择任务类型！");
      } else if (this.addPlanInfo.taskStartTime == null) {
        this.$message.error("请选择开始时间！");
      } else if (this.addPlanInfo.taskEndTime == null) {
        this.$message.error("请选择结束时间！");
      } else if (
        this.addPlanInfo.taskEndTime < this.addPlanInfo.taskStartTime
      ) {
        this.$message.error("开始时间不能大于结束时间！");
      } else {
        // console.log(e);
        this.visible = false;
        // this.addPlanInfo.createType = this.orgtypeid;
        // 2021年2月25日12:42:46
        // this.setBatchEscort(this.addPlanInfo);
        // 将startOrgCode字符串更改为数组
        this.addPlanInfo.startOrgCode = this.addPlanInfo.startOrgCode.split();
        // console.log(this.addPlanInfo.startOrgCode);
        // 将场次更改数组更改为字符串
        this.addPlanInfo.escortCount = this.addPlanInfo.escortCount.toString();
        this.createBatchPlan(this.addPlanInfo);
        setTimeout(() => {
          this.queryEscortAsync();
        }, 100);
      }
    },
    handleCancel (e) {
      this.addPlanInfo.taskStartTime = null;
      this.addPlanInfo.taskEndTime = null;
      this.visible = false;
      this.addPlanInfo.taskType = "";
      this.addPlanInfo.escortCount = [];
      this.checkedList = [];
      this.addPlanInfo.isTest = false;
      this.indeterminate = false;
      this.checkAll = false;
    },
    onChange (value) { },
    setRowClassName (record, index) {
      let className = "light-row";
      if (index % 2 === 0) className = "dark-row1";
      return className;
    },
    changeDomText (name) {
      const childNodesText = name.childNodes;
      // console.log(childNodesText);
      if (childNodesText[childNodesText.length - 1].nodeValue === "页") {
        // console.log(22);
        childNodesText[childNodesText.length - 1].nodeValue = "100/页";
      }
    },
    changeTableItem (v) {
      this.$router.push({
        path: "/EscortPlan/AddPlan",
        query: {
          taskId: v.taskId,
          taskStatus: v.taskStatus,
          keepAlive: 1, //将列表查询参数传递过去
          search: JSON.stringify(this.filterInfo),
        },
      });
    },
    deleteTableItem (v) {
      this.deleteEscortAsync(v.taskId);
      setTimeout(() => {
        this.queryEscortAsync();
      }, 100);

      // console.log(v)
    },

    // 一键创建押运计划_v4.10_0203
    createBatchPlan (data) {
      this.$api.escortPlan
        .createBatchPlan(data)
        .then((res) => {
          if (res.result) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 导出
    educeExcel () {
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
          this.orgName + "押运计划管理.xlsx"
        ); //trade-publish.xlsx 为导出的文件名
      } catch (e) {
        console.log(e, etout);
      }
      return etout;
    },
    printContent () {
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
.ant-modal-body {
  padding: 40px;
}

.page {
  .red {
    background-color: red;
  }
  .dark-row1 {
    background: #fafafa;
  }
  width: 100%;
  height: 100%;
  padding: 10px;
  background: #ebf0f5;
  .escortPlayback1 {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: white;
    .head {
      width: 100%;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .choos {
        display: flex;
        .choose {
          width: 265px;
          height: 75px;
          display: flex;
          align-items: center;
          margin-right: 10px;
          .ant-select-selection--single {
            width: 200px;
          }
          .p-choose {
            font-size: 14px;
            margin: 0 10px 0 10px;
          }
        }
        .result {
          // width: 460px;
          margin-left: 0px;
          height: 75px;
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
        height: 75px;
        display: flex;
        align-items: center;

        .input {
          width: 200px;
        }
        .p-search {
          font-size: 14px;
          margin: 0 10px 0 20px;
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
    }
    .addhask {
      width: 100%;
      height: 60px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .addhask_btn {
        width: 262px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        float: right;
        .btn {
          width: 110px;
          height: 34px;
          line-height: 34px;
          background-color: #3dbf7e;
          margin-left: 20px;
          color: white;
          border: 0;
        }
      }
    }
    .ant-table-pagination.ant-pagination {
      float: left;
    }
  }
  .ant-pagination-item-active a {
    background-color: #398fe6;
    color: #fff;
  }
}

.pDataPicker {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.start-org {
  label {
    text-align: right;
    padding-right: 0;
    width: 132px;
  }
  height: 32px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.end-org {
  label {
    text-align: right;
    padding-right: 0;
    width: 132px;
  }
  display: flex;
  align-items: center;
  height: 32px;
  margin-bottom: 20px;
}

.changci {
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
  width: 100%;
  min-height: 32px;
  display: flex;
  margin-bottom: 10px;
  padding-left: 40px;
  .label-width {
    height: 100%;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /*用...代替超出部分*/
    max-width: 420px;
  }
  .ant-checkbox-group > .ant-checkbox-group-item {
    display: block;
    min-height: 40px;
    line-height: 40px;
    white-space: nowrap; /*一行显示*/
  }
  .ant-checkbox-wrapper {
    border-bottom: 1px dashed #e8e8e8;
    width: 450px;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /*用...代替超出部分*/
    max-width: 420px;
  }
  .cc-wrap {
    flex: 1;
  }
}

.end-org-style .ant-select-selection__rendered {
  height: 30px;
  overflow: hidden;
  overflow-y: scroll;
}

.end-org {
  .change-all-ci {
    width: 80px;
    display: flex !important;
    align-items: flex-end;
    justify-content: center;
  }
}

.check-tree-org {
  display: inline-block;
  margin-top: 10px;
  margin-left: -10px;
}
</style>
