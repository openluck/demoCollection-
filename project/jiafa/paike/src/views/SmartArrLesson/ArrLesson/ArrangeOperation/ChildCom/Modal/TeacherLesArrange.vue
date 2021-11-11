<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-02 14:04:50
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 10:00:47
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
        >
          <a-tree-node v-for="item in treeData" :key="item.projectGroupId">
            <template slot="title">
              <span @click="selectTeachGroup(item)">{{
                item.projectGroupName
              }}</span>
              <a-icon type="plus" class="plus" @click="teacherGroupDialog" />
            </template>
            <a-tree-node
              v-for="childItem in item.peojectGroupList"
              :key="childItem.projectGroupId"
            >
              <template slot="title">
                <span @click="selectTeachGroup(childItem)">{{
                  childItem.projectGroupName
                }}</span>
                <a-icon
                  class="minus"
                  type="minus"
                  @click="showTipsDialog(childItem)"
                />
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
                <a-icon type="plus" />
                新增老师
              </a-button>
              <!-- @click="delTeacherList" -->
              <!-- <a-popconfirm
                title="是否确定删除这些老师嘛?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="() => delTeacherList()"
              >
                <a-button class="del-btn">
                  <a-icon type="plus" />
                  批量取消
                </a-button>
              </a-popconfirm> -->

              <!-- @click="delTeacherList" -->
              <a-button class="del-btn" @click="showTipsTeacherDialog">
                <a-icon type="plus" />
                批量取消
              </a-button>
            </div>
            <div class="bright">
              <span>批量设置教师课时：</span>
              <a-input-number
                placeholder="0"
                class="input"
                @blur="pressEnter"
                @pressEnter="pressEnter"
                @change="onFocus"
                v-model="clearValue"
              />
              <!-- <editable-cell
                text="20"
                 class="input"
                @change="batchChangeHour($event)"
              /> -->
            </div>
          </div>
          <div class="table">
            <a-table
              :columns="columns"
              :data-source="dataSourse"
              :row-selection="{
                selectedRowKeys: idList,
                onChange: onSelectChange
              }"
              :rowKey="(record) => record.id"
              :pagination="pagination"
              :loading="loading"
              :row-class-name="rowClassName"
              :scroll="{ y: 'calc(100vh - 500px)' }"
            >
              <template slot="maxCourseHour" slot-scope="text, record">
                <EditableCell
                  ref="EditableCell"
                  :text="text"
                  @change="onCellChange(record, $event)"
                />
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
    <!-- 删除教研组提示弹窗 -->
    <TipsDialog
      :tipsDialogVisible="tipsDialogVisible"
      @ClosetipsDialogModel="ClosetipsDialogModel"
      ref="TipsDialog"
    ></TipsDialog>
    <!-- 删除老师弹窗 -->
    <DelTeachersDialog
      :tipsTeacherDialogVisible="tipsTeacherDialogVisible"
      @ClosetipsTeacherDialogModel="ClosetipsTeacherDialogModel"
      ref="DelTeachersDialog"
    ></DelTeachersDialog>
  </div>
</template>

<script>
import TeachGroupDialog from "./childCom/TeachGroupDialog";
import TeacherListDialog from "./childCom/TeacherListDialog";
import EditableCell from "./childCom/EditableCell.vue";
import TipsDialog from "./childCom/TipsDialog.vue";
import DelTeachersDialog from "./childCom/DelTeachersDialog.vue";
import { mapMutations } from "vuex";

// 表头
const columns = [
  {
    title: "任教老师",
    dataIndex: "teahcerName",
    key: "teahcerName",
    align: "center",
    width: 450
  },
  {
    title: "最大课时数",
    dataIndex: "maxCourseHour",
    key: "maxCourseHour",
    scopedSlots: { customRender: "maxCourseHour" },
    align: "center",
    width: 190
  }
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
        key: "projectGroupId"
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
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this) // 改变每页数量时更新显示
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
      tipsDialogVisible: false,
      tipsTeacherDialogVisible: false,
      delGroupId: "",
      clearValue: 0
    };
  },
  components: {
    TeachGroupDialog, // 教研组弹窗
    TeacherListDialog, // 教师弹窗
    EditableCell, // 编辑课时
    TipsDialog,
    DelTeachersDialog
  },
  computed: {
    // rowSelection() {
    //   return {
    //     onChange: (selectedRowKeys, selectedRows) => {
    //       // console.log(
    //       //   `selectedRowKeys: ${selectedRowKeys}`,
    //       //   "selectedRows: ",
    //       //   selectedRows
    //       // );
    //       // selectedRowKeys.map((item) => {
    //       //   this.idList.push(item);
    //       // });
    //       this.idList = selectedRowKeys;
    //     },
    //   };
    // },
  },
  mounted() {
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
    this.getTeachGroup();
    this.getTeacherGroupList();
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
      this.teachGroupVisible = !teachGroupVisible;
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
        this.$message.warning("请选择教研组",5);
      }
      // this.$refs.TeacherListDialog.getTeacherDialogList();
    },

    /**
     * @name: 确定改变课时数
     * @msg:
     * @param {*}
     * @return {*}
     */
    async onCellChange(record, value) {
      let { id } = record;
      let idList = [];
      idList.push(id);
      let data = {
        list: idList,
        teacherHour: Number(value)
      };
      try {
        let res = await this.$api.ArrLessonSetting.setTeacherHour(data);
        if (res.code === "200") {
          this.$message.success("设置课时成功",5);
          this.getTeacherGroupList();
          this.idList = [];
        } else {
          this.$message.warning(res.message,5);
        }
      } catch (error) {
        this.$message.error("请求失败", error,5);
      }
    },

    /**
     * @name: 编辑课时数
     * @msg:
     * @param {*}
     * @return {*}
     */
    edit(record) {
      this.dataSourse[0].type = "1";
      this.editable = true;
    },

    /**
     * @name: 批量改变课时数
     * @msg:
     * @param {*}
     * @return {*}
     */
    batchChangeHour(e) {
      console.log(e);
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
          arrLessonId: this.arrLessonId
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

          let projectOneIdObk = this.temp[0].peojectGroupList[0];
          this.defaultProjectId.push(
            this.temp[0].peojectGroupList[0].projectGroupId
          );
          //  this.defaultProjectId = this.temp[0].peojectGroupList[0];
          this.selectTeachGroup(projectOneIdObk);
        }
      } catch (error) {
        this.$message.error("请求失败!", +error,5);
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
          projectGroupId: this.projectGroupId
        };
        const res = await this.$api.ArrLessonSetting.getTeacherGroupList(data);
        if (res.code === "200") {
          this.dataSourse = res.data.list;
          this.pagination.current = res.data.pagination.current;
          this.pagination.total = res.data.pagination.total;
        } else {
          this.$message.error(res.message,5);
        }
      } catch (error) {
        console.log(error);
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
          projectGroupId: projectGroupId
        };
        const res = await this.$api.ArrLessonSetting.delTeachGroup(data);
        if (res.code === "200") {
          this.$message.success("删除教研组成功");
          this.ClosetipsDialogModel(this.tipsDialogVisible);
          this.getTeachGroup();
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败");
      }
    },
    /**
     * @name: 关闭教研组弹窗
     * @msg:
     * @param {*} teachGroupVisible 显示弹窗
     * @return {*}
     */
    closeTeachGroupDialog(teachGroupVisible) {
      this.teachGroupVisible = !teachGroupVisible;
    },
    /**
     * @name: 提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showTipsDialog(childItem) {
      this.delGroupId = childItem.projectGroupId;
      this.tipsDialogVisible = true;
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
    selectTeachGroup(childItem) {
      this.projectGroupId = childItem.projectGroupId;
      this.getTeacherGroupList();
    },
    /**
     * @name: 批量修改课时
     * @msg:
     * @param {*} e
     * @return {*}
     */
    async pressEnter(e) {
      // 正则表达式只能为number类型。 如果0.5使用parseInt, 值就会为0
      // let courseValueStr = e.target.value;
      // let courseValueReg = Number(e.target.value);
      // // 正整数
      // var reg = /^[1-9]\d*$/;
      // let courseReg = reg.test(courseValueReg);
      // let courseNum = courseValueStr == 0.5;
      let pd = false;
      pd = this.isNum(e.target.value);
      if (pd) {
        let data = {
          list: this.idList,
          teacherHour: Number(e.target.value) // 后端不支持小数点
        };
        if (this.idList.length !== 0) {
          try {
            // this.loading = true;
            let res = await this.$api.ArrLessonSetting.setTeacherHour(data);
            if (res.code === "200") {
              this.$message.success("设置课时成功");
              this.idList = [];
              this.clearValue = 0;
              this.getTeacherGroupList();
            } else {
              this.$message.warning(res.message);
            }
          } catch (error) {
            this.$message.error("请求失败", error);
          }
        } else {
          this.$message.warning("请选择需要设置的老师");
        }
      } else {
        this.$message.warning(
          "课时只能设置0,或者能被0.5整除的课时数,或者正整数"
        );
        this.clearValue = 0;
      }
    },
    isNum(num) {
      if (num >= 0) {
        if (num % 0.5 === 0) {
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
      let data = {
        idList: this.idList
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
          this.getTeacherGroupList();
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败", error);
      }
      // } else {
      //   this.$message.warning("请选择需要取消的老师");
      // }
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
        this.tipsTeacherDialogVisible = true;
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
    onFocus(value) {
      console.log(value);
    }
  }
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
      width: 208px;
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
        right: -14%;
        top: 50%;
        transform: translateY(-50%);
      }
      .minus {
        position: absolute;
        right: -22%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .right {
      width: calc(100% - 300px);
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
}
</style>
