<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-05-31 13:16:10
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-14 16:11:39
-->
<template>
  <div class="divide-arrless">
    <h3 class="title">智能排课</h3>
    <div class="btn-list">
      <a-button type="primary" @click="importDialog">
        <svg-icon class="drfb" icon-class="drfbfa"></svg-icon>
        导入分班方案
      </a-button>
      <a-button type="primary" class="all-del" @click="goWholeTable()">
        全校课表
      </a-button>
      <a-button class="all-del" @click="showTipsDialog()">
        <svg-icon class="tagqpk" icon-class="sc"></svg-icon>
        批量删除
      </a-button>
      <!-- <a-popconfirm title="是否确定删除这些项?" @confirm="() => btnchDel()">
        <a-button class="all-del"> <a-icon type="delete" />批量删除 </a-button>
      </a-popconfirm> -->
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="dataSourse"
        :row-selection="{
          selectedRowKeys: delDiviIdList,
          onChange: onSelectChange,
        }"
        :rowKey="(record) => record.arrLessonId"
        :pagination="pagination"
        :row-class-name="rowClassName"
        :loading="loading"
        :scroll="{ y: 'calc(100vh - 380px)' }"
      >
        <template slot="inputStatus" slot-scope="text">
          <span>
            {{ text === null ? "未发布" : text }}
          </span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a
            href="javascript:;"
            class="go-arrlession"
            @click="goArrLession(record)"
          >
            <!-- <a-icon type="vertical-align-bottom" /> -->
            <svg-icon class="tagqpk" icon-class="qpk"></svg-icon>
            去排课
          </a>
        </template>
      </a-table>
    </div>
    <!-- 导入弹窗 -->
    <ImportDialog
      :importCourseVisible="importCourseVisible"
      @CloseModel="CloseModel"
      ref="ImportDialog"
    ></ImportDialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import ImportDialog from "./childCom/ImportDialog";
// 表头
const columns = [
  {
    title: "分班方案",
    dataIndex: "arrLessionName",
    key: "arrLessionName",
    align: "left",
    width: 450,
  },
  {
    title: "关联年级",
    dataIndex: "grade",
    key: "grade",
    align: "center",
  },
  {
    title: "发布状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "inputStatus" },
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "arrLessonId",
    key: "arrLessonId",
    scopedSlots: { customRender: "operation" },
    align: "center",
    width: 190,
  },
];
export default {
  name: "divideArrLess",
  data() {
    return {
      columns,
      dataSourse: [],
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
      },
      loading: false,
      importCourseVisible: false,
      delDiviIdList: [], // 删除列表
    };
  },
  components: {
    ImportDialog,
  },
  computed: {
    ...mapState("stateList", [
      "divideArrangeLesPage",
      "divideArrangeLesChangePage",
    ]),
  },
  mounted() {
    // this.getPlanGroupList();
    this.pagination.pageSize = this.divideArrangeLesChangePage;
    this.onPageChange(this.divideArrangeLesPage);
  },
  methods: {
    ...mapMutations("stateList", [
      "setDivideArrangeLesPage",
      "setDivideArrangeLesChangePage",
      "setArrLessonListPage",
    ]),
    /**
     * @name: 切换页
     * @msg:
     * @param {*} page 切换到的页数
     * @param {*}
     * @return {*}
     */
    onPageChange(page) {
      this.setDivideArrangeLesPage(page);
      this.pagination.current = page;
      this.getPlanGroupList();
      this.delDiviIdList = [];
    },
    // 切换页数
    onShowSizeChangeMethod(i, pageSize) {
      this.setDivideArrangeLesChangePage(pageSize);
      this.setDivideArrangeLesPage(1);
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.getPlanGroupList();
    },
    /**
     * @name: 获取分班方案列表
     * @msg:
     * @param {*}
     * @param {*}
     * @return {*}
     */
    async getPlanGroupList() {
      this.loading = true;
      const data = {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      try {
        const res = await this.$api.DivideClassList.getPlanGroupList(data);
        if (res.code === "200") {
          this.dataSourse = res.data.list;
          this.pagination.total = res.data.pagination.total;
        }
        this.loading = false;
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
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
     * @name: 导入分班方案弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    importDialog() {
      this.importCourseVisible = true;
      this.$refs.ImportDialog.getGradesListByOrganizationId();
    },
    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    CloseModel() {
      this.importCourseVisible = false;
    },

    /**
     * @name: 提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showTipsDialog() {
      if (this.delDiviIdList.length === 0) {
        this.$message.error("请选择删除项！");
      } else {
        this.$confirm({
          title:
            "删除所选的分班方案，所选的分班方案下的所有排课方案将会被同步删除。",
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
     * @name: 去排课
     * @msg:
     * @param {*}
     * @return {*}
     */
    goArrLession(record) {
      this.setArrLessonListPage(1);
      let fbPlanId = record.arrLessonId;
      let fbPlanName = record.arrLessionName;
      // 存session
      sessionStorage.setItem("fbPlanId", fbPlanId);
      sessionStorage.setItem("fbPlanName", fbPlanName);
      this.$router.push({
        path: "/ArrLessonList",
      });
    },

    /**
     * @name: 批量删除
     * @msg:
     * @param {*}
     * @return {*}
     */
    async btnchDel() {
      let data = {
        arrLessionGroupId: this.delDiviIdList,
      };
      try {
        const res = await this.$api.DivideClassList.batchDel(data);
        if (res.code === "200") {
          this.$message.success("删除成功");
          this.delDiviIdList = [];
          this.pagination.current = 1;
          this.getPlanGroupList();
        } else {
          this.delDiviIdList = [];
          // this.pagination.current = 1;
          this.getPlanGroupList();
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
      // }
    },
    /**
     * @name: 去全校课表 新开一个页面
     * @msg:
     * @param {*}
     * @return {*}
     */
    goWholeTable() {
      const { href } = this.$router.resolve({
        path: "/WholeSchooleTable",
      });
      window.open(href, "_blank");
    },
    /**
     * @name: 
     * @msg: 
     * @param {*} selectedRowKeys
     * @return {*}
     */
    onSelectChange(selectedRowKeys) {
      this.delDiviIdList = selectedRowKeys;
    },
  /**
   * @name: 
   * @msg: 
   * @param {*}
   * @return {*}
   */    
  },
};
</script>

<style lang="less" scoped>
.divide-arrless {
  width: 100%;
  height: 100%;
  padding: 16px 16px 20px 16px;
  background-color: #ffffff;
  .title {
    font-weight: normal;
  }

  .all-del {
    margin-left: 10px;
  }
  .btn-list {
    margin: 20px 0;
  }
  /deep/ .gray {
    background-color: #fafafa;
  }
  .go-arrlession {
    color: rgba(0, 0, 0, 0.65);
  }
  .tagqpk {
    width: 1em;
    height: 1em;
    margin-right: 8px;
    // background-color: #929599;
    color: #929599;
  }
  .drfb {
    width: 1em;
    height: 1em;
    margin-right: 8px;
  }
}
</style>