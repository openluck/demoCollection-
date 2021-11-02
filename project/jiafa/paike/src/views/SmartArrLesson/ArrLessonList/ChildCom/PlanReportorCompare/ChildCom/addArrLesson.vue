<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-03 14:29:54
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-08 16:45:57
-->

<template>
  <!-- width="592px"
      height="552px" -->
  <div class="dialog">
    <a-modal
      :visible="addArrlessonVisible"
      title="添加排课方案"
      okText="确定"
      cancelText="取消"
      centered
      @ok="handleOk"
      @cancel="closeTeacherListDialog"
      :destroyOnClose="true"
      class="amodel"
      width="660px"
    >
      <div class="setting">
        <div class="left">
          <span>批量设置教师课时：</span>
          <a-input-number
            placeholder="0"
            class="input-hour"
            @blur="pressEnter"
            @pressEnter="pressEnter"
            v-model="clearValue"
            width="100px"
            :min="0"
            :maxLength="maxLengthNum"
            :max="999"
          />
        </div>
        <a-input-search
          placeholder="请输入教师姓名"
          style="width: 200px"
          @search="onSearch"
          :maxLength="maxLength"
        />
      </div>
      <div>
        <a-table
          :columns="columns"
          :data-source="dataSourse"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :rowKey="(record) => record.teacherId"
          :pagination="pagination"
          :row-class-name="rowClassName"
          :loading="loading"
        >
          <a slot="maxCourseHour">
            <a href="javascript:;">去排课</a>
          </a>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
// 表头
const columns = [
  {
    title: "姓名",
    dataIndex: "teacherName",
    key: "teacherName",
    align: "center",
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    align: "center",
  },
];
export default {
  name: "TeacherListDialog",
  props: {
    projectGroupId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      columns,
      dataSourse: [],
      pagination: {
        current: 1,
        pageSize: 6,
        showTotal: (total, range) => `共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 页数切换
        // onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
        selectedRows: [],
        selectedRowsTem: [],
        teacherId: [],
      },
      arrLessonId: "",
      loading: false,
      searchValue: "", // 查询参数
      clearValue: 0,
      selectedRowKeys: [],
      courseHour: 0,
      maxLength: 10,
      maxLengthNum: 10,
    };
  },
  computed: {
    ...mapState("dialog", ["addArrlessonVisible"]),
  },
  mounted() {
    // this.getTeacherDialogList();
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
  },
  methods: {
    ...mapMutations("dialog", ["setaddArrlessonVisible"]),
    /**
     * @name: 确定
     * @msg:
     * @param {*}
     * @return {*}
     */
    async handleOk() {
      if (this.selectedRowKeys.length !== 0) {
        let newSelectedRowsTem = JSON.parse(
          JSON.stringify(this.selectedRowsTem)
        );
        newSelectedRowsTem.map((item) => {
          if (item.sex === "男") {
            item.sex = 1;
          } else if (item.sex === "女") {
            item.sex = 2;
          } else {
            item.sex = 0;
          }
        });

        let sectionSelectNumber = sessionStorage.getItem("stuCourseTime");
        let data = {
          sectionSelectNumber: parseInt(sectionSelectNumber),
          projectGroupId: this.projectGroupId,
          arrLessonId: this.arrLessonId,
          teacherList: newSelectedRowsTem,
          courseHour: this.courseHour,
        };
        try {
          const res = await this.$api.ArrLessonSetting.addTeacher(data);
          if (res.code === "200") {
            this.$message.success("添加老师成功");
            this.pagination.current = 1;
            this.setaddArrlessonVisible();
            this.$parent.getTeachGroup();
            this.$parent.getTeacherGroupList();
            this.selectedRowKeys = [];
            this.clearValue = 0;
          } else {
            this.$message.warning(res.message);
          }
        } catch (error) {
          this.$message.error("请求失败！", error);
        }
      } else {
        this.$message.warning("请选择老师");
      }
    },

    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    closeTeacherListDialog() {
      this.setaddArrlessonVisible();
      this.searchValue = "";
      this.selectedRowKeys = [];
      this.clearValue = 0;
      this.pagination.current = 1;
    },

    /**
     * @name: 查询
     * @msg:
     * @param {*}
     * @return {*}
     */
    onSearch(value, e) {
      // console.log(value);
      // console.log(e);
      // let vaule = value;
      this.searchValue = value;
      this.pagination.current = 1;
      this.getTeacherDialogList(this.searchValue);
    },

    /**
     * @name: 分页
     * @msg:
     * @param {*} page
     * @return {*}
     */
    onPageChange(page) {
      this.pagination.current = page;
      this.searchValue
        ? this.getTeacherDialogList(this.searchValue)
        : this.getTeacherDialogList();
      this.selectedRowKeys = [];
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
     * @name: 获取老师列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getTeacherDialogList(value) {
      // console.log("this.projectGroupId:", this.projectGroupId);
      this.loading = true;
      let data = {
        projectGroupId: this.projectGroupId,
        arrLessonId: this.arrLessonId,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        teacherName: value,
      };
      // if (value) {
      //   data.teacherName = value;
      // }
      try {
        const res = await this.$api.ArrLessonSetting.getTeacherDialogList(data);
        if (res.code === "200") {
          this.dataSourse = res.data.list;
          if (res.data.pagination === null) {
            this.pagination.total = 0;
          } else {
            this.pagination.total = res.data.pagination.total;
          }
        } else {
          this.$message.warning("查无此人");
        }
      } catch (error) {
        this.$message.error("请求失败", error);
      }
      this.loading = false;
    },

    /**
     * @name: 批量修改课时
     * @msg:
     * @param {*} e
     * @return {*}
     */
    async pressEnter(e) {
      if (e.target.value === "") {
        this.$message.warning("课时不能设置为空");
        this.clearValue = 0;
      } else {
        let pd = false;
        pd = this.isNum(e.target.value);
        if (pd) {
          // if (this.selectedRowKeys.length !== 0) {
          this.courseHour = parseInt(e.target.value);
          // } else {
          //   this.$message.warning("请选择需要设置的老师");
          // }
        } else {
          this.$message.warning(
            "课时只能设置0,或者能被0.5整除的课时数,或者正整数"
          );
          this.clearValue = 0;
        }
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
    // 表格多选框
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRowsTem = [...selectedRows];
    },
  },
};
</script>

<style lang="less" scoped>
.amodel {
  .setting {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    .input-hour {
      width: 100px;
    }
  }
}
/deep/ .ant-modal-header {
  text-align: left;
}
/deep/ .ant-modal-footer {
  text-align: center;
}

/deep/ .ant-tree li span.ant-tree-switcher,
.ant-tree li span.ant-tree-iconEle {
  width: 0;
  height: 0;
}
.ant-pagination-total-text {
  position: absolute;
  left: 0;
}
/deep/ .ant-btn-primary {
  background-color: #1890ff;
}
/deep/ .gray {
  background-color: #fafafa;
}
</style>