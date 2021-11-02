<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-06-03 13:55:58
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 09:58:41
-->

<!-- 添加 教师安排 -->
<template>
  <a-modal
    title="添加教师"
    class="addTeacherModal"
    :width="1000"
    :footer="null"
    :visible="isAddTeacherModal"
    @cancel="closeModal"
  >
    <div class="teacher-arrange">
      <div class="tcontainer">
        <div class="right">
          <div class="teacher-table">
            <div class="bnt-list">
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
                  <a-input-number
                    v-model="record.maxCourseHour"
                    id="maxCourseHour"
                    placeholder="0"
                    @blur="onCellChange(record)"
                    @pressEnter="onCellChange(record)"
                    @focus="saveFocus(record.maxCourseHour)"
                  />
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapMutations, mapState } from "vuex";
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
  props: ["groupId"],
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
      clearValue: 0,
      clearMaxCourseHourValue: 0
    };
  },
  components: {
    // TeachGroupDialog, // 教研组弹窗
    // TeacherListDialog, // 教师弹窗
    // EditableCell, // 编辑课时
    // TipsDialog,
    // DelTeachersDialog,
  },
  computed: {
    ...mapState("arrangeOperation", ["isAddTeacherModal"])
  },
  mounted() {
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
    // this.getTeachGroup();
    // this.getTeacherGroupList();
    this.getAllTeacherList();
  },
  methods: {
    ...mapMutations("arrangeOperation", ["setAddTeacherModal"]),
    /**
     * @desc 获取所有教师列表 -- 排课操作
     */
    async getAllTeacherList() {
      let data = {
        arrLessonId: this.arrLessonId,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        projectGroupId: this.groupId
      };
      let res = await this.$api.ArrangeOperation.getAllTeacherList(data);
      if (res.code === "200") {
        let list = res.data.list;
        list.map((item) => {
          item.maxCourseHour = 0;
          item.teahcerName = item.teacherName;
          item.id = item.teacherId;
        });
        this.dataSourse = list;
        this.pagination = { ...this.pagination, ...res.data.pagination };
      } else this.$message.error(res.message,5);
    },
    /**
     * @name: 分页
     */
    onPageChange(page) {
      this.pagination.current = page;
      // this.getTeacherGroupList();
      this.getAllTeacherList();
    },
    /**
     * @name: 改变每页数量时更新显示
     */
    onShowSizeChangeMethod(page, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.getAllTeacherList();
      // this.getTeacherGroupList();
      // this.getImportData(this.gradeValue);
    },
    /**
     * @desc 关闭弹窗
     */
    closeModal() {
      this.$parent.getTeacherList();
      this.setAddTeacherModal();
    },

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
     * @desc 课时数改变
     */
    saveFocus(maxCourseHour) {
      this.clearMaxCourseHourValue = maxCourseHour;
    },
    /**
     * @name: 确定改变课时数--鼠标失焦时调用
     */
    async onCellChange(record, value) {
      let { maxCourseHour } = record;
      let { id } = record;
      let pd = false;
      pd = this.isNum(maxCourseHour);
      if (pd) {
        let idList = [];
        idList.push(id);
        let data = {
          list: idList,
          teacherHour: maxCourseHour
        };
        try {
          let res = await this.$api.ArrLessonSetting.setTeacherHour(data);
          if (res.code === "200") {
            this.$message.success("设置课时成功",5);
            // this.getTeacherGroupList();
            this.idList = [];
          } else {
            this.$message.warning(res.message,5);
          }
        } catch (error) {
          this.$message.error("请求失败", error);
        }
      } else {
        this.$message.warning("课时只能设置0.5或者大于等于1的正整数",5);
        record.maxCourseHour = this.clearMaxCourseHourValue;
      }
    },

    isNum(num) {
      if (num > 0) {
        if (num === 0.5) {
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
     * @name: 编辑课时数
     */
    edit(record) {
      this.dataSourse[0].type = "1";
      this.editable = true;
    },


    /**
     * @name: 获取教研组 -- 无用
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
        this.$message.error("请求失败!", +error);
      }
    },

    /**
     * @name: 获取教师列表
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
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },

    /**
     * @name: 删除教研组
     */
    async delteacherGroup() {
      let projectGroupId = this.delGroupId;
      try {
        let data = {
          projectGroupId: projectGroupId
        };
        const res = await this.$api.ArrLessonSetting.delTeachGroup(data);
        if (res.code === "200") {
          this.$message.success("删除教研组成功",5);
          this.ClosetipsDialogModel(this.tipsDialogVisible);
          this.getTeachGroup();
        } else {
          this.$message.warning(res.message,5);
        }
      } catch (error) {
        this.$message.error("请求失败",5);
      }
    },
    /**
     * @name: 关闭教研组弹窗
     * @param {*} teachGroupVisible 显示弹窗
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
      let courseValueStr = e.target.value;
      let courseValueReg = Number(e.target.value);
      // 正整数
      var reg = /^[1-9]\d*$/;
      let courseReg = reg.test(courseValueReg);
      let courseNum = courseValueStr == 0.5;
      if (courseNum || courseReg) {
        let data = {
          list: this.idList,
          teacherHour: Number(e.target.value) // 后端不支持小数点
        };
        if (this.idList.length !== 0) {
          try {
            // this.loading = true;
            let res = await this.$api.ArrLessonSetting.setTeacherHour(data);
            if (res.code === "200") {
              this.$message.success("设置课时成功",5);
              this.idList = [];
              this.clearValue = 0;
              this.getTeacherGroupList();
            } else {
              this.$message.warning(res.message,5);
            }
          } catch (error) {
            this.$message.error("请求失败", error,5);
          }
        } else {
          this.$message.warning("请选择需要设置的老师",5);
        }
      } else {
        this.$message.warning("课时只能设置0.5或者大于等于1的正整数",5);
        this.clearValue = 0;
      }
    },

    /**
     * @name:  删除教师
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
          this.$message.success("取消成功",5);
          this.loading = false;
          this.idList = [];
          this.ClosetipsTeacherDialogModel(this.tipsTeacherDialogVisible);
          this.getTeacherGroupList();
        } else {
          this.$message.warning(res.message,5);
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
        this.$message.error("请选择删除项！",5);
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
      // console.log(value);
    }
  }
};
</script>

<style lang="less" scoped>
.addTeacherModal {
  /deep/ .ant-modal-body {
    // padding-top: 20;
    // height: 560px;
  }
  /deep/ .ant-modal-header {
    text-align: left;
  }
}
.teacher-arrange {
  width: 100%;
  height: calc(100% - 170px);
  .tcontainer {
    width: 100%;
    height: 100%;
    display: flex;
    .right {
      width: 100%;
      height: 100%;
      .teacher-table {
        .bnt-list {
          width: 100%;
          display: flex;
          justify-content: space-between;
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
  /deep/ .ant-tree-iconEle {
    width: 0px;
  }
}
</style>
