<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-02 14:04:50
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-14 16:12:56
-->
<template>
  <div class="teacher-arrange">
    <div class="tcontainer">
      <div class="left">
        <a-tree
          show-icon
          :defaultExpandAll="true"
          :replace-fields="replaceFields"
          v-if="treeData.length > 0"
          :default-selected-keys="defaultProjectId"
          :selectedKeys="selectedKeys"
          @select="selectTeachGroup"
          class="tree-seleGroup"
        >
          <a-tree-node
            v-for="item in treeData"
            :key="item.projectGroupId"
            :disabled="true"
          >
            <template slot="title">
              <span>
                {{ item.projectGroupName }}
              </span>
              <a-icon
                type="plus-circle"
                class="plus"
                @click="teacherGroupDialog"
              />
            </template>
            <a-tree-node
              v-for="childItem in item.peojectGroupList"
              :key="childItem.projectGroupId"
            >
              <template slot="title">
                <div>
                  <!-- @click="selectTeachGroup(childItem) -->
                  <div>
                    <span>{{ childItem.projectGroupName }}</span>
                    <span>-({{ childItem.teacherNum }})人</span>
                  </div>
                  <div @click="showTipsDialog(childItem, $event)">
                    <a-icon type="minus-circle" class="minus" />
                  </div>
                </div>
                <!-- @click="delteacherGroup(childItem)" -->
              </template>
            </a-tree-node>
          </a-tree-node>
        </a-tree>
      </div>
      <div class="right">
        <div class="teacher-table">
          <div class="bnt-list">
            <div class="bleft">
              <a-button type="primary" @click="teacherListDialog">
                <a-icon type="plus" />新增老师
              </a-button>
              <a-button
                type="primary"
                style="margin-left: 20px"
                @click="importDataBase"
              >
                <!-- <a-icon type="plus" /> -->
                <svg-icon class="drfb" icon-class="drfbfa" />
                导入教师任教</a-button
              >
              <a-button class="del-btn" @click="showTipsTeacherDialog">
                <a-icon type="delete" />批量删除
              </a-button>
            </div>
            <div class="bright">
              <a-button
                class="del-btn"
                @click="showSeetingDialog"
                :disabled="btnSearch.disableBtn"
              >
                批量设置教师课时
              </a-button>
              <!-- <span>批量设置教师课时：</span>
              <a-input-number
                :maxLength="3"
                placeholder="0"
                class="input"
                @blur="pressEnter"
                v-model="clearValue"
                :min="0"
                :max="999"
              /> -->
              <!-- @pressEnter="pressEnter" -->
            </div>
          </div>
          <div class="table">
            <a-table
              :columns="columns"
              :data-source="dataSourse"
              :row-selection="{
                selectedRowKeys: idList,
                onChange: onSelectChange,
              }"
              :rowKey="(record) => record.id"
              :pagination="pagination"
              :loading="loading"
              :row-class-name="rowClassName"
              :scroll="{ y: 'calc(100vh - 450px)' }"
            >
              <template slot="maxCourseHour" slot-scope="text, record">
                <a-input-number
                  v-model="record.maxCourseHour"
                  id="maxCourseHour"
                  placeholder="0"
                  @blur="onCellChange(record)"
                  @pressEnter="onCellChange(record)"
                  @focus="saveFocus(record.maxCourseHour)"
                />
                <!-- :min="0" -->
                <!-- @pressEnter="onCellChange(record)" -->
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加教研组弹窗 -->
    <TeachGroupDialog
      :teachGroupVisible="teachGroupVisible"
      @closeTeachGroupDialog="closeTeachGroupDialog"
      ref="TeachGroupDialog"
    />
    <!-- 添加教师弹窗 -->
    <TeacherListDialog
      :projectGroupId="projectGroupId"
      ref="TeacherListDialog"
    />
    <!-- 批量设置提示弹窗 -->
    <BatchSettingDialog
      :BatchSettingDialogVisible="settingDialog.BatchSettingDialogVisible"
      @CloseBatchSettingDialog="CloseBatchSettingDialog"
      :projectGroupName="settingDialog.projectGroupName"
      :TipsData="TipsData"
      ref="TipsDialog"
    ></BatchSettingDialog>
    <!-- 导入基础数据 -->
    <ImportBaseData ref="ImportBaseData" />
  </div>
</template>

<script>
import TeachGroupDialog from "./childCom/TeachGroupDialog";
import TeacherListDialog from "./childCom/TeacherListDialog";
import BatchSettingDialog from "./childCom/BatchSettingDialog.vue";
import ImportBaseData from "./childCom/ImportBaseDatas.vue";
import { mapMutations, mapState } from "vuex";

// 表头
const columns = [
  {
    title: "任教老师",
    dataIndex: "teahcerName",
    key: "teahcerName",
    align: "center",
    width: 450,
  },
  {
    title: "最大正课时数",
    dataIndex: "maxCourseHour",
    key: "maxCourseHour",
    scopedSlots: { customRender: "maxCourseHour" },
    align: "center",
    width: 190,
  },
];

export default {
  name: "",
  data() {
    return {
      treeData: [],
      temp: [],
      replaceFields: {
        children: "peojectGroupList",
        title: "projectGroupName",
        key: "projectGroupId",
        // slots: "slots",
      },
      dataSourse: [], // 表数据
      columns, // 表头
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
      teachGroupVisible: false, // 教研组弹窗显示
      text: "", // 编辑值
      editable: false,
      loading: false, // 弹窗loading
      arrLessonId: "", // 排课方案id 动态
      projectGroupId: "", // 教研组id 动态
      showIcon: true,
      idList: [],
      projectGroupId: "",
      defaultProjectId: [],
      tipsTeacherDialogVisible: false,
      delGroupId: "",
      clearValue: 0,
      clearMaxCourseHourValue: 0,
      projectOneIdArr: [],
      selectedKeys: [],
      teacherGroupIdZD: [],
      TipsData: {},
      settingDialog: {
        BatchSettingDialogVisible: false, // 批量设置课时数
        projectGroupName: "", // 教研组名
      },
      btnSearch: {
        disableBtn: false,
        teacherNum: null,
      },
    };
  },
  components: {
    TeachGroupDialog, // 教研组弹窗
    TeacherListDialog, // 教师弹窗
    BatchSettingDialog, // 批量设置课时数
    ImportBaseData, // 导入基础数据
  },
  computed: {
    // ...mapState("stateList", ["teacherGroupId"]),
  },
  async mounted() {
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
    await this.getTeachGroup();
    if (this.$route.query.teacherGroupId) {
      this.teacherGroupIdZD.push(this.$route.query.teacherGroupId);
      await this.selectTeachGroup(this.teacherGroupIdZD);
    } else {
      await this.selectTeachGroup(this.projectOneIdArr);
    }
  },
  methods: {
    // 表格多选框
    onSelectChange(selectedRowKeys) {
      this.idList = selectedRowKeys;
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
     * @name: 分页
     * @msg:
     * @param {*} page
     * @return {*}
     */
    onPageChange(page) {
      this.pagination.current = page;
      this.getTeacherGroupList();
      // this.selectedRowKeys = [];
      this.idList = [];
    },

    /**
     * @name: 改变每页数量时更新显示
     * @msg:
     * @param {*} page
     * @return {*}
     */
    onShowSizeChangeMethod(page, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.getTeacherGroupList();
      // this.getImportData(this.gradeValue);
    },

    /**
     * @name: 添加教研组弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    teacherGroupDialog() {
      this.$refs.TeachGroupDialog.getTeachGroupDialogList();
      this.teachGroupVisible = true;
    },

    /**
     * @name: 关闭教研组弹窗
     * @msg:
     * @param {*} teachGroupVisible 显示弹窗
     * @return {*}
     */
    closeTeachGroupDialog(teachGroupVisible) {
      this.teachGroupVisible = false;
    },

    /**
     * @name: 添加老师弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    ...mapMutations("dialog", ["setTeacherListVisible"]),
    teacherListDialog() {
      if (this.projectGroupId !== "") {
        this.setTeacherListVisible(true);
        this.$refs.TeacherListDialog.getTeacherDialogList();
      } else {
        this.$message.warning("请选择教研组");
      }
    },

    /**
     * @name:
     * @msg:
     * @param {*} record
     * @param {*} num
     * @return {*}
     */
    saveFocus(maxCourseHour) {
      this.clearMaxCourseHourValue = maxCourseHour;
    },

    /**
     * @name: 获取教研组
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getTeachGroup() {
      // 不能直接操作treeData， 需要给一个中间值。最后赋值给treedata
      try {
        let data = {
          arrLessonId: this.arrLessonId,
        };
        const res = await this.$api.ArrLessonSetting.getTeachGroupList(data);
        if (res.code === "200") {
          this.temp[0] = res.data;
          this.temp[0].projectGroupId = this.temp[0].gradeId;
          this.temp[0].projectGroupName = this.temp[0].gradeName;
          this.temp[0].slots = { icon: "add" };
          this.temp[0].peojectGroupList.map((item) => {
            item.peojectGroupList = [];
            item.slots = { icon: "minus" };
          });
          this.treeData = [...this.temp];
          this.projectOneIdArr.push(
            this.temp[0].peojectGroupList[0].projectGroupId
          );
          this.defaultProjectId.push(
            this.temp[0].peojectGroupList[0].projectGroupId
          );
        }
      } catch (error) {
        console.log("请求失败！", error);
      }
    },

    /**
     * @name: 获取教师列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getTeacherGroupList() {
      this.loading = true;
      try {
        let data = {
          arrLessonId: this.arrLessonId,
          current: this.pagination.current,
          pageSize: this.pagination.pageSize,
          projectGroupId: this.projectGroupId,
        };
        const res = await this.$api.ArrLessonSetting.getTeacherGroupList(data);
        if (res.code === "200") {
          this.dataSourse = res.data.list;
          this.pagination.current = res.data.pagination.current;
          this.pagination.total = res.data.pagination.total;
          this.idList = [];
          if (this.dataSourse.length == 0) {
            this.btnSearch.disableBtn = true;
          } else {
            this.btnSearch.disableBtn = false;
          }
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
      this.loading = false;
    },

    /**
     * @name: 删除教研组
     * @msg:
     * @param {*}
     * @return {*}
     */
    async delteacherGroup() {
      let projectGroupId = this.delGroupId;
      try {
        let data = {
          projectGroupId: projectGroupId,
        };
        const res = await this.$api.ArrLessonSetting.delTeachGroup(data);

        if (res.code === "200") {
          this.$message.success("删除教研组成功");
          this.getTeachGroup();
          this.getTeacherGroupList();
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log("请求失败！", error);
      }
    },
    /**
     * @name: 提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showTipsDialog(childItem, e) {
      e.stopPropagation();
      this.delGroupId = childItem.projectGroupId;
      this.$confirm({
        title: "确定删除该教研组？",
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk: () => {
          this.delteacherGroup();
        },
      });
    },
    /**
     * @name: 选择教研组获取对应的表格
     * @msg:
     * @param {*}
     * @return {*}
     */
    selectTeachGroup(childItem) {
      if (childItem.length > 0) {
        // this.projectGroupId = childItem.projectGroupId;
        this.projectGroupId = childItem[0];
        this.pagination.current = 1;
        this.getTeacherGroupList();
        this.selectedKeys = [];
        this.selectedKeys = childItem;
      }
      this.treeData[0].peojectGroupList.map((item) => {
        if (item.projectGroupId === this.projectGroupId) {
          this.settingDialog.projectGroupName = item.projectGroupName;
          this.btnSearch.teacherNum = item.teacherNum;
        }
      });
    },

    /**
     * @name: 批量修改课时
     * @msg:
     * @param {*} e
     * @return {*}
     */
    pressEnter(e) {
      if (e.target.value === "") {
        this.$message.warning("课时不能设置为空");
        this.clearValue = 0;
      } else {
        let pd = false;
        let eValue = Number(e.target.value);
        let sectionSelectNumber = sessionStorage.getItem("stuCourseTime");
        pd = this.isNum(eValue);
        if (pd) {
          let data = {
            list: this.idList,
            teacherHour: eValue,
            sectionSelectNumber: parseInt(sectionSelectNumber),
          };
          if (this.idList.length !== 0) {
            this.$confirm({
              title: "批量设置教师课时后所选老师课时数将被覆盖",
              okText: "确定",
              okType: "primary",
              cancelText: "取消",
              onOk: () => {
                this.seetingTeacherHour(data);
              },
            });
          } else {
            this.$message.warning("请选择需要设置的老师");
            this.clearValue = 0;
          }
        } else {
          this.$message.warning("课时只能设置0,正整数");
          this.clearValue = 0;
        }
      }
    },

    /**
     * @name: 调用批量设置课时
     * @msg:
     * @param {*} data
     * @return {*}
     */
    async seetingTeacherHour(data) {
      try {
        let res = await this.$api.ArrLessonSetting.setTeacherHour(data);
        if (res.code === "200") {
          this.$message.success("设置课时成功");
          this.idList = [];
          this.getTeacherGroupList();
        } else {
          this.$message.warning(res.message);
        }
        this.clearValue = 0;
      } catch (error) {
        console.log("请求失败！", error);
      }
    },

    /**
     * @name: 确定改变课时数
     * @msg:
     * @param {*}
     * @return {*}
     */
    async onCellChange(record, value) {
      let sectionSelectNumber = sessionStorage.getItem("stuCourseTime");
      let { maxCourseHour } = record;
      console.log(typeof maxCourseHour);
      let { id } = record;
      if (maxCourseHour === null) {
        this.$message.warning("课时不能设置为空");
        this.getTeacherGroupList();
      } else if (maxCourseHour < 0) {
        this.$message.warning("课时只能设置0,正整数");
        this.getTeacherGroupList();
      } else {
        let pd = false;
        pd = this.isNum(maxCourseHour);
        if (pd) {
          let idList = [];
          idList.push(id);
          let data = {
            list: idList,
            teacherHour: maxCourseHour,
            sectionSelectNumber: parseInt(sectionSelectNumber),
          };
          try {
            let res = await this.$api.ArrLessonSetting.setTeacherHour(data);
            if (res.code === "200") {
              this.$message.success("设置课时成功");
              this.getTeacherGroupList();
              this.idList = [];
            } else {
              this.$message.warning(res.message);
              record.maxCourseHour = this.clearMaxCourseHourValue;
            }
          } catch (error) {
            console.log("请求失败！", error);
          }
        } else {
          this.$message.warning("课时只能设置0,正整数");
          // record.maxCourseHour = this.clearMaxCourseHourValue;
          this.getTeacherGroupList();
        }
      }
    },

    // 只能为0，正整数
    isNum(num) {
      if (num >= 0) {
        if (num === 0) {
          return true;
        } else {
          //判断正整数
          var reg = /^[1-9]\d*$/;
          let courseReg1 = reg.test(num);
          if (courseReg1) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },
    /**
     * @name:  删除教师
     * @msg:
     * @param {*}
     * @return {*}
     */
    async delTeacherList() {
      // this.arrLessonId = sessionStorage.getItem("arrLessonId");
      let data = {
        idList: this.idList,
        arrLessonId: this.arrLessonId,
      };
      // if (this.idList.length !== 0) {
      try {
        this.loading = true;
        let res = await this.$api.ArrLessonSetting.delTeacherList(data);
        if (res.code === "200") {
          this.$message.success("取消成功");
          this.loading = false;
          this.idList = [];
          this.ClosetipsTeacherDialogModel(this.tipsTeacherDialogVisible);
          this.pagination.current = 1;
          this.getTeachGroup();
          this.getTeacherGroupList();
        } else {
          this.$message.warning(res.message);
          this.loading = false;
        }
      } catch (error) {
        console.log("请求失败！", error);
      }
      this.loading = false;
    },
    /**
     * @name: 提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showTipsTeacherDialog() {
      if (this.idList.length === 0) {
        this.$message.error("请选择删除项！");
      } else {
        // this.tipsTeacherDialogVisible = true;
        this.$confirm({
          title: "确定删除选中老师？",
          okText: "确定",
          okType: "primary",
          cancelText: "取消",
          onOk: () => {
            this.delTeacherList();
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
    ClosetipsTeacherDialogModel(tipsTeacherDialogVisible) {
      this.tipsTeacherDialogVisible = !tipsTeacherDialogVisible;
    },
    /**
     * @name: 显示批量设置教师课时弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showSeetingDialog() {
      this.settingDialog.BatchSettingDialogVisible = true;
    },
    /**
     * @name: 关闭批量设置教师课时弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    CloseBatchSettingDialog() {
      this.settingDialog.BatchSettingDialogVisible = false;
    },
    /**
     * @name: 批量设置教师课时
     * @msg:
     * @param {*}
     * @return {*}
     */
    async setTeacherHourNewAll(value) {
      let hourTime = value;
      let data = {
        teacherGroupId: this.projectGroupId,
        sectionSelectNumber: parseInt(sessionStorage.getItem("stuCourseTime")),
        teacherHour: Number(hourTime),
      };
      const res = await this.$api.ArrLessonSetting.setTeacherHourNewAll(data);
      try {
        if (res.code === "200") {
          this.$message.success(res.message);
          this.getTeacherGroupList();
          this.CloseBatchSettingDialog();
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        this.$message.warning(error);
      }
    },
    /**
     * @name: 导入基础数据
     * @msg:
     * @param {*}
     * @return {*}
     */
    importDataBase() {
      this.$refs.ImportBaseData.showModel();
    },
  },
};
</script>

<style lang="less" scoped>
.teacher-arrange {
  width: 100%;
  height: calc(100% - 170px);
  .tcontainer {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
      width: 226px;
      height: 100%;
      background-color: #f7f8fa;
      padding: 15px 20px 0;
      box-sizing: border-box;
      /deep/ .ant-tree-node-content-wrapper {
        position: relative;
      }
      overflow-y: scroll;
      .plus {
        position: absolute;
        right: -22%;
        top: 50%;
        transform: translateY(-50%);
        color: #565757;
      }
      .minus {
        position: absolute;
        right: -22%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .right {
      width: calc(100% - 253px);
      height: 100%;
      margin-left: 20px;
      .teacher-table {
        .bnt-list {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .bleft {
            .del-btn {
              margin-left: 16px;
            }
          }
          .bright {
            display: flex;
            align-items: center;
            .input {
              width: 96px;

              &::placeholder {
                color: #000;
              }
            }
          }
        }
        .table {
          margin-top: 20px;
          .table-edit {
            width: 96px;
            height: 32px;
          }
        }
      }
    }
  }
  /deep/ .gray {
    background-color: #fafafa;
  }
  // /deep/ .ant-tree li span.ant-tree-switcher,
  // .ant-tree li span.ant-tree-iconEle {
  //   width: 0;
  //   height: 0;
  // }
  /deep/ .ant-tree-iconEle {
    width: 0px;
  }
  .tree-seleGroup {
    font-weight: bold;
  }
  .drfb {
    width: 1em;
    height: 1em;
    margin-right: 8px;
    vertical-align: -0.1em;
  }
}
</style>
