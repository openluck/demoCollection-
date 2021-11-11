<template>
  <div>
    <a-modal
      :visible="addArrlessonVisible"
      title="添加排课方案"
      okText="确定"
      cancelText="取消"
      centered
      @ok="handleOk"
      @cancel="CloseDialogModel"
      :destroyOnClose="true"
      class="amodel"
      width="660px"
    >
      <div class="title">
        <span>最多可选取3个方案进行对比</span>
        <a-input-search
          placeholder="请输入排课方案编号"
          style="width: 200px"
          @search="onSearch"
          :maxLength="20"
          v-model="searchValue"
        />
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
          @change="handleTableChange"
        >
          <span slot="status" slot-scope="text">
            <span v-if="text === '未完成'" class="haswc">{{ text }}</span>
            <span v-else-if="text === '已完成'" class="wc">{{ text }}</span>
            <!-- <span v-else>{{ text }}</span> -->
            <span v-else class="fb">
              {{ /(.+)?(?:\(|（)(.+)(?=\)|）)/.exec(text)[1] }}
            </span>
          </span>
          <span slot="publishTerm" slot-scope="text">{{
            text === null ? "无" : text
          }}</span>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "排课方案编号",
    dataIndex: "number",
    key: "number",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
    align: "center",
  },
  {
    title: "学年学期",
    dataIndex: "publishTerm",
    key: "publishTerm",
    scopedSlots: { customRender: "publishTerm" },
    align: "center",
  },
  {
    title: "最后一次编辑时间",
    dataIndex: "lastTime",
    key: "lastTime",
    align: "center",
    // sorter: (a, b) => {
    //   console.log("a", a.number);
    //   console.log("b", b.number);
    //   a.lastTime - b.lastTime;
    // },
    sorter: true,
  },
];
export default {
  props: {
    addArrlessonVisible: {
      type: Boolean,
      default: false,
    },
    // 已经对比的个数
    compareList: {
      type: Number,
      default: 0,
    },
    arrLessonParentIdList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      data: [],
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
      loading: false,
      columns: columns,
      arrLessonIdList: [],
      arrLessonId: "",
      sorterOrder: "",
      searchValue: "",
    };
  },
  mounted() {
    // this.getArrLessonList();
    // this.arrLessonId = this.$router.query.arrLessonId;
  },
  methods: {
    async handleOk(e) {
      // 弹窗中的选项个数
      let selectLenth = this.arrLessonIdList.length;
      // 已经对比的个数
      let hasCompareLength = this.compareList;
      if (selectLenth > 3) {
        this.$message.warning("最多只能选择三项！");
      } else if (hasCompareLength === 3) {
        this.$message.warning(
          "已经对比了三项，最多只能对比三项，如果还想对比，请删除一项"
        );
      } else if (hasCompareLength + selectLenth > 3) {
        this.$message.warning("最多只能对比三项");
      } else if (selectLenth === 0) {
        this.$message.warning("请选择需要对比的方案");
      } else {
        this.$parent.getPlanReportorCompare(this.arrLessonIdList);
        this.CloseDialogModel();
        this.arrLessonIdList = [];
        this.sorterOrder = "";
      }
    },
    handleCancel(e) {
      this.visible = false;
    },
    async onSearch(value) {
      // this.searchValue = value;
      this.getArrLessonList(value);
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
     * @name: 获取排课方案列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getArrLessonList(searchValue, sorter) {
      this.loading = true;
      let data = {
        planId: sessionStorage.getItem("fbPlanId"),
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        hasContrastIdList: this.arrLessonParentIdList,
        type: 1,
      };
      if (searchValue) {
        data.searchValue = searchValue;
      }
      if (sorter === 1) {
        data.sorter = 1;
      } else if (sorter === 2) {
        data.sorter = 2;
      }
      try {
        const res = await this.$api.ArrlessonList.getArrLessonList(data);
        if (res.code === "200") {
          this.data = res.data.list;
          this.pagination.total = res.data.pagination.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        // this.$message.error("请求失败！", +error);
      }
      this.loading = false;
    },
    /**
     * @name: 切换页数
     * @msg:
     * @param {*} page 切换到的页数
     * @return {*}
     */
    onPageChange(page) {
      this.pagination.current = page;
      // this.getArrLessonList();
      this.arrLessonIdList = [];
      if (this.sorterOrder === "ascend") {
        console.log("升序");
        this.getArrLessonList("", 1);
      } else if (this.sorterOrder === "descend") {
        console.log("降序");
        this.getArrLessonList("", 2);
      } else {
        this.getArrLessonList();
      }
    },
    /**
     * @name: 切换页数
     * @msg:
     * @param {*} page 切换到的页数
     * @param {*} pageSize
     * @return {*}
     */
    onShowSizeChangeMethod(page, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.arrLessonIdList = [];
      this.getArrLessonList();
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
    },

    CloseDialogModel() {
      this.arrLessonIdList = [];
      this.$emit("CloseDialogModel", this.addArrlessonVisible);
      this.pagination.current = 1;
      this.sorterOrder = "";
    },
    handleTableChange(pagination, filters, sorter) {
      // 1为升序 ascend，2降序 descend
      this.sorterOrder = sorter.order;
      if (this.sorterOrder === "ascend") {
        console.log("升序");
        this.searchValue = "";
        // this.getArrLessonList(this.searchValue, 1);
        this.getArrLessonList('', 1);
      } else if (this.sorterOrder === "descend") {
        console.log("降序");
        // this.getArrLessonList(this.searchValue, 2);
        this.searchValue = "";
        this.getArrLessonList('', 2);
      } else {
        this.searchValue = "";
        this.getArrLessonList();
      }
    },
  },
};
</script>
<style scoped lang="less">
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
  width: 60px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: #d8f1e4;
  color: #72c89d;
  border-radius: 5px;
}
.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
/deep/ .gray {
  background-color: #fafafa;
}
</style>