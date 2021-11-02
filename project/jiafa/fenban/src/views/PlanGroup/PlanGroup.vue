<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk 
 * @Date: 2021-04-25 14:44:32
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-18 14:45:44
-->

<template>
  <div class="plan-group-list">
    <div class="head">
      <div class="bread">
        <span>智能分班</span>
      </div>
      <div class="import-delete-btn">
        <a-button class="import-btn themeBtn" @click="showModel">
          <svg-icon class="op_daoru" icon-class="op_daoru"></svg-icon>
          导入选课活动
        </a-button>
        <!-- <a-popconfirm title="是否确定删除这些项?" @confirm="() => allDel()"> -->
        <a-button class="delete-btn" @click="showTipsDialog">
          <!-- <a-icon type="delete" /> -->
          <svg-icon
            class="op_daoru"
            icon-class="xuanke_del"
            style="color: #929599"
          ></svg-icon>
          批量删除
        </a-button>
        <!-- </a-popconfirm> -->
      </div>
    </div>
    <div class="table-list" ref="drawerContainer">
      <a-table
        class="app"
        size="middle"
        :scroll="{ y: 'calc(100vh - 290px)' }"
        :bordered="true"
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :row-selection="rowSelection"
        :pagination="pagination"
        :rowKey="(row) => row.planGroupId"
      >
        <!-- 选课活动 -->
        <template slot="chooseClass" slot-scope="text">
          <div class="chooseClass">
            <span>{{ text }}</span>
          </div>
        </template>
        <!-- 人员名单 -->
        <template slot="isPeople" slot-scope="text">{{
          text === "True" ? "有" : "无"
        }}</template>
        <!-- 发布结果 -->
        <template slot="inputStatus" slot-scope="text">
          <span>
            <!-- {{ text === null ? "未发布" : text }} -->
            {{ text }}
          </span>
        </template>
        <!-- 分班 -->
        <template slot="divideClass" slot-scope="text, record">
          <div class="divide-class">
            <a href="javascript:;" class="see-btn" @click="toSeeResult(record)">
              <!-- <a-icon class="icon-btn" type="file-done" /> -->
              <svg-icon
                class="ckjg"
                icon-class="fblist_ckjg"
                style="color: #929599"
              ></svg-icon>
              查看结果
            </a>
            <a class="div-btn" @click="goDivideClassList(record)">
              <svg-icon
                class="ckjg"
                icon-class="menu_2"
                style="color: #929599"
              ></svg-icon>
              分班
            </a>
          </div>
        </template>
      </a-table>
    </div>
    <!-- 弹窗 -->
    <ImportCourse
      :importCourseVisible="importCourseVisible"
      @CloseModel="CloseModel"
      ref="importCourse"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// 表头的数据
// 导入分班抽屉
import ImportCourse from "./ImportCourse/ImportCourse";

const columns = [
  {
    title: "选课活动",
    dataIndex: "selCourseName",
    key: "selCourseName",
    scopedSlots: { customRender: "chooseClass" },
    align: "left",
    width: 450,
  },
  {
    title: "相关年级",
    dataIndex: "grade",
    key: "grade",
    align: "left",
    width: 200,
  },
  {
    title: "人员名单",
    dataIndex: "isStuList",
    key: "isPeopleList",
    scopedSlots: { customRender: "isPeople" }, // 插槽的方式
    align: "left",
    width: 100,
  },
  {
    title: "发布状态",
    dataIndex: "inputStatus",
    key: "inputStatus",
    scopedSlots: { customRender: "inputStatus" },
    align: "left",
  },
  {
    title: "操作",
    dataIndex: "selCourseId",
    key: "selCourseId",
    scopedSlots: { customRender: "divideClass" },
    align: "left",
    width: 190,
  },
];
export default {
  name: "PlanGroup",
  data() {
    return {
      dataSource: [], // 表格数据
      columns, // 表头数据
      pagination: {
        // 表格分页
        current: 1,
        defaultPageSize: 10,
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 改变每页条数
      },
      loading: false,
      importCourseVisible: false, // 显示弹窗
      getCourseGroupList: [], // 系统导入表格数据
      deleteGroupList: [], // 删除表格选择项
      current: 1, // 当前请求页数，从1开始
      pageSize: 10, // 每页数据条数
    };
  },
  components: {
    ImportCourse,
  },
  mounted() {
    // this.getPlanGroupList();
    // this.$nextTick(() => {
    this.onPageChange(this.planGroupPage);
    // });
  },
  computed: {
    // 表格全选选择
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.deleteGroupList = selectedRows.map((item) => item.planGroupId);
        },
      };
    },
    // 获取store，app中的页数状态
    ...mapState("adminClass", ["planGroupPage"]),
  },
  methods: {
    /**
     * @name: 获取智能分班列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getPlanGroupList() {
      this.loading = true;
      const data = {
        current: this.current,
        pageSize: this.pageSize,
      };
      const res = await this.$api.getDivideClassList.getPlanGroupList(data);
      if (res.code === "200") {
        this.dataSource = res.data.list;
        this.pagination.total = res.data.pagination.total;
      }
      this.loading = false;
    },

    /**
     * @name: 切换页数
     * @msg:
     * @param {*} page 切换到的页数
     * @param {*} pageSize
     * @return {*}
     */
    ...mapMutations("adminClass", ["setPlanGroupPage", "setdivideClassPage"]),
    onPageChange(page, pageSize) {
      // debugger;
      this.setPlanGroupPage(page);
      this.current = page;
      this.pagination.current = page;
      this.getPlanGroupList();
    },

    /**
     * @name: 开启弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showModel() {
      this.importCourseVisible = !this.importCourseVisible;
      this.$refs.importCourse.handleChangeGrade();
      this.$refs.importCourse.clearFileList();
    },

    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*} importCourseVisible
     * @return {*}
     */
    CloseModel(importCourseVisible) {
      this.importCourseVisible = !importCourseVisible;
    },

    /**
     * @name: 提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showTipsDialog() {
      if (this.deleteGroupList.length === 0) {
        this.$message.error("请选择删除项！", 5);
      } else {
        // this.tipsDialogVisible = true;
        this.$confirm({
          title:
            "删除所选的分班方案，所选的分班方案下的所有分班方案将会被同步删除。",
          okText: "确定",
          okType: "primary",
          cancelText: "取消",
          onOk: () => {
            this.allDel();
          },
        });
      }
    },

    /**
     * @desc 全部清空
     */
    async allDel() {
      // if (this.deleteGroupList.length === 0) {
      //   this.$message.error("请选择删除项！");
      // } else {
      let data = {
        planGroupId: this.deleteGroupList,
      };
      const res = await this.$api.getDivideClassList.delSelCourse(data);
      if (res.code === "200") {
        this.$message.success(res.message, 5);
        this.deleteGroupList = [];
        this.getPlanGroupList();
      } else {
        this.$message.error(res.message, 5);
      }
      // }
    },

    /**
     * @desc 去分班页面
     */
    goDivideClassList(record) {
      this.setdivideClassPage(1);
      let { planGroupId, selCourseName } = record;
      // 存入sessionStorage， 方便后面分班完成之后跳转页面，取参数。
      window.sessionStorage.setItem(
        "goDivideClassList",
        JSON.stringify({ planGroupId, selCourseName })
      );
      let haveStuList = record.isStuList;
      let isStuList = !!(haveStuList === "True" || haveStuList === "true");
      this.$store.commit("adminClass/setIsStuListStatus", isStuList);
      this.$router.push({
        path: "/DivideClassList",
        query: {
          id: planGroupId,
          name: selCourseName,
        },
      });
    },

    /**
     * @desc 查看结果
     */
    toSeeResult(record) {
      let { selCourseId } = record;
      let { isStuList } = record;
      this.$router.push({
        path: "/seeResult",
        query: {
          selCourseId: selCourseId,
          isStuList: isStuList,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.plan-group-list {
  padding: 10px 30px;
  box-sizing: border-box;
  background-color: #fff;
  height: 100%;
  width: 100%;
  overflow: auto;
  .head {
    width: 100%;
    height: 50px;
    position: relative;
    .bread {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 17px;
    }
    .import-delete-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      .delete-btn {
        background-color: #fff;
        color: rgba(0, 0, 0, 0.65);
        margin-left: 20px;
      }
    }
  }
  .table-list {
    .divide-class {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #000 !important;
      .see-btn,
      .div-btn {
        color: rgba(0, 0, 0, 0.65) !important;
      }
      .icon-btn {
        margin-right: 4px;
      }
    }
    /deep/
      .ant-table-middle
      > .ant-table-content
      > .ant-table-scroll
      > .ant-table-body
      > table
      > .ant-table-tbody
      > tr
      > td {
      padding: 21px 8px;
    }
  }
  .ckjg {
    width: 1em;
    height: 1em;
  }
  .op_daoru {
    width: 1em;
    height: 1em;
    margin-bottom: 1px;
    margin-right: 4px;
  }
}
</style>