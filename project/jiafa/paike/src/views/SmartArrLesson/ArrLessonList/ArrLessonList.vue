<!--
 * @descripttion: 排课方案列表页面
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-5-27 11:26:12
-->
<template>
  <div class="arrLesson-list-wrap">
    <!-- loading -->
    <div class="example">
      <a-spin
        :spinning="showLoading"
        size="large"
        class="show-loading"
        wrapperClassName="global-export-spin-loading"
        tip="Loading..."
      >
        <div>
          <div class="head">
            <div class="plan-name">
              <a-icon class="icon" type="left-circle" @click="goback" />
              {{ arrLessionName }}
            </div>
            <a-button type="primary" @click="goArrLesson">
              <svg-icon class="fbpkfa" icon-class="qpk"></svg-icon>
              去排课</a-button
            >
          </div>
          <div class="content">
            <div class="operation-zone">
              <a-space size="middle">
                <a-button type="primary" @click="showInputDialog">
                  <svg-icon class="fbpkfa" icon-class="fb"></svg-icon
                  >发布排课方案
                </a-button>
                <a-button type="primary" @click="showOutDialog">
                  <svg-icon class="fbpkfa" icon-class="dc"></svg-icon>导出
                </a-button>
                <a-button type="primary" @click="comparisonPlan">
                  <svg-icon class="fbpkfa" icon-class="fadb"></svg-icon
                  >方案对比</a-button
                >
                <a-button type="default" @click="showTipsDialog">
                  <svg-icon class="tagqpk" icon-class="sc"></svg-icon>批量删除
                </a-button>
              </a-space>
            </div>
            <div class="table">
              <!-- :row-selection="rowSelection" -->
              <a-table
                :columns="columns"
                :data-source="data"
                :rowKey="(row) => row.arrLessonId"
                :pagination="pagination"
                :loading="loading"
                :row-class-name="rowClassName"
                :scroll="{ y: 'calc(100vh - 380px)' }"
                :row-selection="{
                  selectedRowKeys: arrLessonIdList,
                  onChange: onSelectChange,
                }"
              >
                <!-- 编号 -->
                <span slot="number" slot-scope="text, record">
                  {{ text }}
                  <a-icon
                    type="edit"
                    class="edit-btn"
                    @click="editNumber(record)"
                  />
                </span>
                <!-- 状态 -->
                <span slot="status" slot-scope="text">
                  <span v-if="text === '未完成'" class="haswc">{{ text }}</span>
                  <span v-else-if="text === '已完成'" class="wc">{{
                    text
                  }}</span>
                  <span v-else class="fb">
                    {{ text }}
                  </span>
                </span>
                <span slot="publishTerm" slot-scope="text">{{
                  text === null ? "未发布" : `(已发布)${text}`
                }}</span>
                <!-- 是否启用 -->
                <span slot="isEnable" slot-scope="text, record">
                  <a-switch
                    :checked="text"
                    @change="updatePlanEnable(record)"
                  />
                </span>
                <span slot="action" slot-scope="text, record">
                  <div class="btn-con">
                    <!-- 自习排课 -->
                    <div v-if="showStudyClass">
                      <a-button
                        type="link"
                        v-if="record.status !== '未完成'"
                        @click="goStudyClass(record)"
                      >
                        <!-- <a-button
                        type="link"
                        v-if="true"
                        @click="goStudyClass(record)"
                      > -->
                        <a-icon type="plus-circle" />自习排课
                      </a-button>
                      <a-button type="link" v-else class="notCom">
                        <a-icon type="plus-circle" />自习排课
                      </a-button>
                    </div>
                    <!-- 方案对比 -->
                    <div>
                      <a-button
                        v-if="record.status === '未完成'"
                        class="notCom"
                        type="link"
                      >
                        <svg-icon class="notagqpk" icon-class="fadb"></svg-icon>
                        方案对比
                      </a-button>
                      <a-button
                        v-else
                        type="link"
                        @click="comparisonPlan(record)"
                      >
                        <svg-icon class="tagqpk" icon-class="fadb"></svg-icon>
                        方案对比
                      </a-button>
                    </div>
                    <!-- 排课结果-->
                    <div>
                      <a-button
                        v-if="
                          record.status === '未完成' ||
                          record.status === '已完成'
                        "
                        type="link"
                        @click="continueArrLesson(record)"
                      >
                        <svg-icon class="tagqpk" icon-class="qpk"></svg-icon>
                        继续排课
                      </a-button>
                      <a-button v-else type="link" @click="toKB(record)">
                        <svg-icon class="tagqpk" icon-class="jxpk"></svg-icon
                        >排课结果
                      </a-button>
                    </div>
                  </div>
                </span>
              </a-table>
            </div>
          </div>
        </div>
      </a-spin>
    </div>

    <!-- 创建排课弹窗 -->
    <!-- :recordList="data" -->
    <CreateArrLessDialog
      :arrLessonGroupId="arrLessonId"
      ref="CreateArrLessDialog"
    ></CreateArrLessDialog>
    <!-- 发布课表弹窗 -->
    <!-- <InputDialog ref="InputDialog"> </InputDialog> -->
    <TipsDialog
      :tipsDialogVisible="tipsDialogVisible"
      @ClosetipsDialogModel="ClosetipsDialogModel"
      :TipsRecord="TipsRecord"
      ref="TipsDialog"
    ></TipsDialog>
    <!-- 发布弹窗 -->
    <InputDialog
      :InputDailogvisible="InputDailogvisible"
      @CloseInputDialogModel="CloseInputDialogModel"
      :arrLessonIdParent="arrLessonIdParent"
      ref="InputDialog"
    ></InputDialog>
    <!-- 导出弹窗 -->
    <OutputDialog
      :outputVisible="outputVisible"
      @CloseOutDialogModel="CloseOutDialogModel"
      :outputArrLessonId="outputArrLessonId"
    ></OutputDialog>
    <Lineup v-if="showLineup" :planId="arrLessonId" />
    <!-- 编辑排课方案名称 -->
    <GlobalModal
      :visible="GlobalModalVisible"
      :title="GlobalModalTitle"
      @cancel="GlobalModalVisible = false"
      :defaultBtn="false"
    >
      <a-form-model
        class="lky-modal-form"
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item label="方案名" prop="numberName" ref="numberName">
          <InputSuffix
            v-model.trim="form.numberName"
            placeholder="请输入方案名称"
          />
        </a-form-model-item>
      </a-form-model>
      <div style="text-align: center" slot="selfBtn">
        <a-button type="default" @click="GlobalModalVisible = false"
          >取消</a-button
        >
        <a-button
          type="primary"
          @click="saveNumberName"
          :loading="buttonLoading"
          >确定</a-button
        >
      </div>
    </GlobalModal>
  </div>
</template>
 
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import CreateArrLessDialog from "./ChildCom/CreateArrLessDialog/CreateArrLessDialog";
import InputDialog from "./ChildCom/InputDialog/InputDialog";
import TipsDialog from "./ChildCom/TipsDialog/TipsDialog.vue";
import OutputDialog from "./ChildCom/OutDialog/OutDialog.vue";
import Lineup from "./ChildCom/Lineup/Lineup.vue";
import GlobalModal from "../../../components/GlobalModal.vue";
import InputSuffix from "../../../components/InputSuffix.vue";

const columns = [
  {
    title: "排课方案编号",
    dataIndex: "number",
    key: "number",
    align: "center",
    scopedSlots: { customRender: "number" },
    width: "10%",
  },
  {
    title: "排课状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
    align: "center",
  },
  {
    title: "最后一次编辑时间",
    dataIndex: "lastTime",
    key: "lastTime",
    align: "center",
  },
  {
    title: "是否启用",
    dataIndex: "isEnable",
    key: "isEnable",
    scopedSlots: { customRender: "isEnable" },
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  name: "ArrLessonList",
  components: {
    CreateArrLessDialog,
    InputDialog,
    TipsDialog,
    OutputDialog,
    Lineup,
    GlobalModal,
    InputSuffix,
  },
  props: {},
  data() {
    let validateRepetition = (rule, value, callback) => {
      if (
        this.data.some(
          (i) =>
            i.number === value &&
            (this.tempName ? value !== this.tempName : true)
        )
      ) {
        return callback(new Error("方案名称重复"));
      } else {
        callback();
      }
    };
    return {
      showLineup: false,
      data: [],
      columns,
      selectedRowKeys: [],
      loading: false,
      visible: false,
      publishLoading: false,
      selectValue: undefined,
      modalVisible: false,
      result: "1",
      pagination: {
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
        showTotal: (total) => `共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 页数切换
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
      arrLessonId: "", // 排课方案组id
      arrLessionName: "", // 排课方案组名
      arrLessonIdList: [],
      tipsDialogVisible: false,
      InputDailogvisible: false,
      outputVisible: false,
      arrLessonIdParent: "",
      selectedRows: [],
      outputArrLessonId: "", // 导出的排课方案id
      showLoading: false,
      TipsRecord: {},
      GlobalModalVisible: false, // 编辑弹窗显示
      GlobalModalTitle: "编辑",
      buttonLoading: false,
      tempName: null, //临时名称，用于查重
      form: {
        numberName: "",
        planId: "",
      },
      rules: {
        numberName: [
          {
            required: true,
            message: "请输入方案名",
            trigger: ["blur", "change"],
          },
          { validator: validateRepetition, trigger: ["blur", "change"] },
        ],
      },
      showStudyClass: null, // 是否展示自习排课
    };
  },
  computed: {
    ...mapState("stateList", ["arrLessonListPage", "arrLessonListChangePage"]),
  },
  mounted() {
    // 获取session
    this.arrLessonId = sessionStorage.getItem("fbPlanId");
    this.arrLessionName = sessionStorage.getItem("fbPlanName");
    // this.getArrLessonList();
    this.pagination.pageSize = this.arrLessonListChangePage;
    this.onPageChange(this.arrLessonListPage);
  },
  created() {
    // 是否启用一列显示
    if (!window.G.showAutoPkNumber) {
      delete this.columns[3];
    }
    this.showStudyClass = window.G.showStudyClass;
  },
  methods: {
    ...mapMutations("stateList", [
      "setArrLessonListPage",
      "setArrLessonListChangePage",
    ]),
    /**
     * @name: 切换页数
     * @msg:
     * @param {*} page 切换到的页数
     * @param {*} pageSize
     * @return {*}
     */
    onPageChange(page) {
      this.setArrLessonListPage(page);
      this.pagination.current = page;
      this.getArrLessonList();
      this.arrLessonIdList = [];
    },
    // 切换页面数据条数
    onShowSizeChangeMethod(page, pageSize) {
      this.setArrLessonListChangePage(pageSize);
      this.setArrLessonListPage(1);
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.arrLessonIdList = [];
      this.getArrLessonList();
    },

    /**
     * @name: 表格隔行变色
     * @msg:
     * @param {*} record
     * @param {*} index
     * @return {*}
     */
    rowClassName(record, index) {
      let className = "";
      if (index % 2 === 1) className = "gray";
      return className;
    },
    /**
     * @name: 去课表
     * @msg:
     * @param {*}
     * @param {*}
     * @return {*}
     */
    toKB(record) {
      let arrLessonIdParent = record.arrLessonId;
      let { number } = record;
      // this.$router.push({
      //   path: "/PreviewTimetable",
      // });
      const { href } = this.$router.resolve({
        path: "/PreviewTimetable",
      });
      sessionStorage.setItem("arrLessonId", arrLessonIdParent);
      window.open(href, "_blank");
      this.$store.commit("stateList/setArrLessonNumber", number);
    },
    /**
     * @name: 批量删除
     * @msg:
     * @param {*}
     * @param {*}
     * @return {*}
     */
    async btnchDel() {
      let data = {
        arrLessonId: this.arrLessonIdList,
      };
      try {
        const res = await this.$api.ArrlessonList.delArrLesson(data);
        if (res.code === "200") {
          this.$message.success(res.message);
          this.pagination.current = 1;
          this.arrLessonIdList = [];
          // this.ClosetipsDialogModel(this.tipsDialogVisible);
          this.getArrLessonList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
      // }
    },
    /**
     * @name: 查看方案报告
     * @msg:
     * @param {*}
     * @param {*}
     * @return {*}
     */
    viewPlanDetails({ arrLessonId }) {
      this.$router.push({
        path: "/PlanReportorCompare",
        query: {
          arrLessonId,
        },
      });
    },
    /**
     * @name: 获取排课方案列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    ...mapMutations("stateList", ["setShowTipe", "setArrLessonCompareIdList"]),
    async getArrLessonList() {
      this.loading = true;
      let data = {
        planId: this.arrLessonId,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      try {
        const res = await this.$api.ArrlessonList.getArrLessonList(data);
        if (res.code === "200") {
          this.data = res.data.list;
          this.data.length !== 0
            ? (this.showTipe = true)
            : (this.showTipe = false);
          this.setShowTipe(this.showTipe);
          this.pagination.total = res.data.pagination.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！", +error);
      }
      this.loading = false;
    },
    /**
     * @desc 队列操作刷新所有数据
     */
    refreshAllData() {
      this.getArrLessonList();
    },
    /**
     * @name: 去排课弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    async goArrLesson() {
      if (this.data.length !== 0) {
        this.$refs.CreateArrLessDialog.showDialog();
        this.$refs.CreateArrLessDialog.getArrLessonList();
      } else {
        // this.$message.warning("暂无排课方案");
        let data = {
          arrLessonId: "",
          arrLessonGroupId: this.arrLessonId,
        };
        try {
          this.showLoading = true;
          let res = await this.$api.ArrlessonList.createArrLessonId(data);
          if (res.code === "200") {
            this.showLoading = false;
            let number = res.data.code;
            this.$store.commit("stateList/setArrLessonNumber", number);
            this.createArrLessonId = res.data.arrLessonId;
            // this.$router.push({
            //   path: "/CourseSecArrange",
            // });
            sessionStorage.setItem("arrLessonId", this.createArrLessonId);
            this.getSectionArr();
          } else {
            this.$message.error(res.message);
          }
        } catch (error) {
          this.$message.error("请求失败", error);
        }
      }
      // this.$store.commit("dialog/setArrLessonId", this.arrLessonId);
    },
    /**
     * @name: 继续排课
     * @msg:
     * @param {*} record
     * @return {*}
     */
    async continueArrLesson(record) {
      let { arrLessonId } = record;
      let { number } = record;
      this.arrLessonId = arrLessonId;
      const res = await this.$api.ArrlessonList.getQueueup({
        planId: arrLessonId,
      });
      if (res.code == 200) {
        if (res.data.status === 0 || res.data.status === 1) {
          this.showLineup = true;
          return;
        }
      } else {
        this.$message.error(res.message);
      }
      // this.$store.commit("dialog/setArrLessonId", this.arrLessonId);
      this.$store.commit("stateList/setArrLessonNumber", number);
      sessionStorage.setItem("arrLessonId", this.arrLessonId);
      this.getSectionArr();
    },
    /**
     * @desc: 获取到节次数目后跳转到排课设置页面
     * @param {*}
     * @author: went
     */

    /**
     * @name: 去节次安排
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getSectionArr() {
      let data = {
        arrLessonId: sessionStorage.getItem("arrLessonId"),
      };
      const res = await this.$api.SectionArrList.getClassSectionList(data);
      if (res.code === "200") {
        this.dataSourse = res.data;
        // 根据返回的节次数量，设置节次数量数组
        let num = this.dataSourse.length * 7;
        let list = [...Array.from(new Array(num), (item, i) => i)];
        this.$store.commit("stateList/setSectionArr", list);
        this.$router.push({
          path: "/CourseSecArrange",
          // query: {
          //   number,
          // },
        });
      } else {
        this.$message.warning(res.message);
      }
    },
    /**
     * @name: 提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showTipsDialog() {
      if (this.arrLessonIdList.length === 0) {
        this.$message.error("请选择删除项！");
      } else {
        // this.tipsDialogVisible = true;
        this.$confirm({
          title: "确定删除所选排课方案？",
          okText: "确定",
          okType: "primary",
          cancelText: "取消",
          onOk: () => {
            this.btnchDel();
          },
        });
      }
    },
    /**
     * @name: 关闭提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    ClosetipsDialogModel(tipsDialogVisible) {
      this.tipsDialogVisible = !tipsDialogVisible;
    },
    /**
     * @name: 表格选择框
     * @msg:
     * @param {*}
     * @return {*}
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.arrLessonIdList = selectedRowKeys;
      this.arrLessonIdParent = selectedRowKeys[0];
      this.selectedRows = selectedRows;
      this.TipsRecord = selectedRows[0];
    },

    /**
     * @name: 返回
     * @msg:
     * @param {*}
     * @return {*}
     */
    goback() {
      this.$router.push("/DivideArrangeLes");
    },

    /**
     * @name: 发布
     * @msg:
     * @param {*}
     * @return {*}
     */
    showInputDialog() {
      if (this.arrLessonIdList.length === 0) {
        this.$message.warning("请选择需要发布的排课方案");
      } else if (this.arrLessonIdList.length > 1) {
        this.$message.warning("只能发布一条排课方案");
      } else if (
        this.arrLessonIdList.length === 1 &&
        this.selectedRows[0].status === "未完成"
      ) {
        this.tipsDialogVisible = true;
      } else {
        if (this.selectedRows[0].status !== "未完成") {
          this.InputDailogvisible = true;
          this.$refs.InputDialog.getYearTermTree();
        } else {
          this.$message.warning("该方案未完成");
        }
      }
    },
    /**
     * @name: 关闭导入弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    CloseInputDialogModel(InputDailogvisible) {
      this.InputDailogvisible = !InputDailogvisible;
    },
    /**
     * @name: 导出弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showOutDialog() {
      if (this.arrLessonIdList.length === 0) {
        this.$message.warning("请选择需要导出的排课方案");
      } else if (this.arrLessonIdList.length > 1) {
        this.$message.warning("只能导出一条排课方案");
      } else {
        // if (this.selectedRows[0].status !== "未完成") {
        this.outputArrLessonId = this.selectedRows[0].arrLessonId;
        this.outputVisible = true;
        // } else {
        //   this.$message.warning("该方案未完成");
        // }
      }
    },
    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    CloseOutDialogModel(outputVisible) {
      this.outputVisible = !outputVisible;
    },

    /**
     * @name: 清空表格选中
     * @msg:
     * @param {*}
     * @return {*}
     */
    clearSelect() {
      this.arrLessonIdList = [];
    },

    /**
     * @name: 去方案对比方案页面
     * @msg:
     * @param {*}
     * @return {*}
     */
    comparisonPlan(record) {
      let { arrLessonId } = record;
      // this.$router.push({
      //   path: "/PlanReportorCompare",
      //   query: {
      //     arrLessonId: this.arrLessonId,
      //   },
      // });
      if (arrLessonId) {
        let arrLessonIdList = [];
        arrLessonIdList.push(arrLessonId);
        this.$router.push({
          path: "/PlanReportorCompare",
          query: {
            arrLessonIdList: arrLessonIdList,
          },
        });
      } else {
        let selectList = this.selectedRows.length;
        let inputState = this.selectedRows.some(
          (item) => item.status === "未完成"
        );
        if (selectList === 0) {
          this.$message.warning("请选择排课方案");
        } else if (selectList > 3) {
          this.$message.warning("选择的方案最多只能选3个");
        } else if (inputState) {
          this.$message.warning("有未完成的方案，请重新选择方案，进行对比");
        } else {
          this.$router.push({
            path: "/PlanReportorCompare",
            query: {
              arrLessonIdList: this.arrLessonIdList,
            },
          });
        }
      }
    },
    /**
     * @name: 启用
     * @msg:
     * @param {*}
     * @return {*}
     */
    async updatePlanEnable(record) {
      let param = {
        arrLessonId: record.arrLessonId,
        isEnable: !record.isEnable,
      };
      try {
        const res = await this.$api.ArrlessonList.UpdatePlanEnable(param);
        if (res.code === "200") {
          this.getArrLessonList();
          if (record.isEnable) {
            this.$message.success("启用关闭");
          } else {
            this.$message.success("启用开启");
          }
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！", +error);
      }
    },
    /**
     * @name: 去自习排课页面
     * @msg:
     * @param {*} record
     * @return {*}
     */
    goStudyClass(record) {
      const { arrLessonId } = record;
      this.$router.push({
        path: "/StudyClass",
        query: {
          planId: arrLessonId,
        },
      });
    },
    /**
     * @name: 方案编辑
     * @msg:
     * @param {*} record
     * @return {*}
     */
    editNumber(record) {
      this.GlobalModalVisible = true;
      this.form.numberName = record.number;
      this.form.planId = record.arrLessonId;
      this.tempName = record.number;
    },
    /**
     * @name: 确定保存修改之后的方案名
     * @msg:
     * @param {*}
     * @return {*}
     */
    saveNumberName() {
      this.$refs.form.validate(async (res) => {
        if (res) {
          let result;
          let data = {
            planId: this.form.planId,
            code: this.form.numberName,
          };
          result = await this.updatePlanCode(data);
          if (result) {
            this.getArrLessonList();
            this.GlobalModalVisible = false;
          }
        }
      });
    },
    /**
     * @name: 更新排课方案名
     * @msg:
     * @param {*} data
     * @return {*}
     */
    async updatePlanCode(data) {
      this.buttonLoading = true;
      try {
        const res = await this.$api.ArrlessonList.updatePlanCode(data);
        if (res.code === "200") {
          this.$message.success("编辑成功");
          return true;
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.buttonLoading = false;
      }
    },
  },
};
</script>
 
<style scoped lang="less">
.detection-modal {
  .operation {
    &:hover {
      text-decoration: underline;
    }
  }
}
.arrLesson-list-wrap {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: white;
  .breadcrumbs {
    height: 32px;
    display: flex;
    align-items: center;
  }
  .head {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .plan-name {
      font-size: 22px;
      font-weight: 600;
    }
  }
  .content {
    .operation-zone {
    }
    .table {
      margin-top: 20px;
      .base-input {
        width: 60px;
        height: 30px;
        display: inline-block;
        line-height: 30px;
        border-radius: 7%;
      }
      .edit-btn {
        cursor: pointer;
        // margin-left: 10px;
      }
      .can-input {
        background-color: #e2f9ed;
        color: #7acda3;
      }
      .noconflict {
        color: #8bc4ff;
        background-color: #ecf5ff;
      }
      .conflict {
        color: #feadad;
        background-color: #ffecec;
      }
    }
  }
  /deep/ .ant-btn-link {
    color: rgba(0, 0, 0, 0.65);
  }
  /deep/ .gray {
    background-color: #fafafa;
  }
  .icon {
    margin-right: 10px;
  }
  .haswc {
    display: inline-block;
    width: 60px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: #ffecec;
    color: #fe9797;
    border-radius: 5px;
  }
  .wc {
    display: inline-block;
    width: 60px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: #ecf5ff;
    color: #89c2ff;
    border-radius: 5px;
  }
  .fb {
    display: inline-block;
    // width: 60px;
    // height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: #d8f1e4;
    color: #72c89d;
    border-radius: 5px;
    padding: 0 10px;
  }
  .tagqpk {
    width: 1em;
    height: 1em;
    margin-right: 8px;
    color: #929599;
  }
  .notagqpk {
    width: 1em;
    height: 1em;
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.25);
  }
  .btn-con {
    display: flex;
    justify-content: center;
  }
  .fbpkfa {
    width: 1em;
    height: 1em;
    margin-right: 8px;
  }
  .notCom {
    color: rgba(0, 0, 0, 0.25);
  }
}
.lky-modal-form {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>