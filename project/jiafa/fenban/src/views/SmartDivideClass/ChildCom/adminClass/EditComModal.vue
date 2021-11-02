<!--
 * @Descripttion: 组合编辑弹窗
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-27 09:04:59
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-22 14:42:45
-->

<template>
  <div class="personal-list">
    <a-modal
      v-model="editModalStatus"
      :title="editComInfo.adminClassName"
      @ok="handleOk"
      :width="740"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <div class="top">
        <span class="item">组合人数：{{ editComInfo.combinationNum }}人</span>
      </div>
      <div class="search">
        <span>
          修改组合人数：
          <a-input-number
            id="inputNumber"
            v-model="enterNum"
            :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
            :parser="(value) => value"
            :min="0"
            :max="pagination.total"
            :disabled="inputDisabled"
            @change="changeEnterNum"
          />
        </span>
        <a-input-search
          v-if="isStuList"
          placeholder="请输入学生姓名"
          v-model="search"
          enter-button="搜索"
          @search="onSearch"
        />
      </div>
      <div class="content">
        <a-table
          v-if="isStuList"
          :loading="loading"
          :columns="columns"
          :data-source="stuList"
          :row-key="(record) => record.stuId"
          :pagination="pagination"
          :row-selection="rowSelection"
          :scroll="{ y: '350px' }"
          @change="handleTableChange"
        ></a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
const columns = [
  { title: "班级", dataIndex: "className", key: "className" },
  { title: "姓名", dataIndex: "stuName", key: "stuName" },
  { title: "性别", dataIndex: "sex", key: "sex" },
  {
    title: "语数外总分",
    dataIndex: "total",
    key: "total",
    sorter: true,
    sortOrder: false
  },
  { title: "选课总分", dataIndex: "selResult", key: "selResult", sorter: true }
];
export default {
  name: "",
  components: {},
  props: ["editComInfo"],
  data() {
    return {
      columns,
      stuList: [],
      title: "",
      fetchData: {
        sortFilter: {
          mainGradeSort: "",
          secondGradeSort: ""
        }
      },
      search: "",
      pageSize: 10,
      pagination: {
        current: 1,
        defaultPageSize: 10,
        showSizeChanger: false, // 显示可改变每页数量
        showQuickJumper: false, //是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), //点击页码事件
        total: 0, //总条数
        size: "middle",
        pageSizeOptions: ["10", "20", "50", "100"], // 每页数量选项
        buildOptionText: (pageSizeOptions) => `${pageSizeOptions.value}条/页`,
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this) // 改变每页数量时更新显示
      }, // table的分页器
      enterNum: 0, //进入班级人数
      selectedRowKeys: [],
      inputDisabled: false
    };
  },
  computed: {
    ...mapState("adminClass", [
      "isStuList",
      "adminClassData",
      "editComModalData",
      "loading"
    ]),
    editModalStatus: {
      get: function () {
        return this.$store.state.adminClass.editModalStatus;
      },
      set: function () {}
    },
    // 表格行选择事件
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
          this.inputDisabled = true;
          if (!selectedRowKeys.length) {
            this.inputDisabled = false;
          }
          this.selectedRowKeys = selectedRowKeys;
        },
        // 多选框禁用
        getCheckboxProps: (record) => {
          return {
            props: {
              // 全部默认禁止选中
              disabled: record.disabled
            }
          };
        }
      };
    }
  },
  watch: {
    editComModalData() {
      // 监听人员列表接口返回的数据，获取表格数据和分页
      this.stuList = this.editComModalData.list;
      this.selectedRowKeys = this.editComModalData.selectedRowKeys;
      this.pagination.current = this.editComModalData.pagination.current;
      this.pagination.total = this.editComModalData.pagination.total;
      this.pageSize = this.editComModalData.pagination.pageSize;
    },
    enterNum(val) {
      /**
       * 需求：当输入了人数时候，表格多选框禁用，
       * 当选择了表格多选框时候，输入人数input禁用
       */
      if (val > 0) {
        this.stuList = this.stuList.map((item) => ({
          ...item,
          disabled: true
        }));
      } else if (val <= 0) {
        this.stuList = this.stuList.map((item) => ({
          ...item,
          disabled: false
        }));
      }
    }
  },
  created() {},
  mounted() {
    this.onSearch();
    this.stuList = this.editComModalData.list;
  },
  methods: {
    ...mapActions("adminClass", ["getSaveData"]),
    // 表格事件
    handleTableChange(pagination, filters, sorter) {
      // 按照语数外总分排序 0降序 1 升序
      if (sorter.field === "total") {
        this.fetchData.sortFilter.mainGradeSort = "";
        this.fetchData.sortFilter.secondGradeSort = "";
        const { sortOrder } = this.columns[3];
        delete this.columns[4].sortOrder;
        if (sortOrder === "descend") {
          this.columns[3].sortOrder = "ascend";
          this.fetchData.sortFilter.mainGradeSort = "1";
          this.onSearch();
        } else {
          this.columns[3].sortOrder = "descend";
          this.fetchData.sortFilter.mainGradeSort = "0";
          this.onSearch();
        }
        // 按照选科的分数排序 0降序 1 升序
      } else if (sorter.field === "selResult") {
        this.fetchData.sortFilter.mainGradeSort = "";
        this.fetchData.sortFilter.secondGradeSort = "";
        const { sortOrder } = this.columns[4];
        delete this.columns[3].sortOrder;
        if (sortOrder === "descend") {
          this.columns[4].sortOrder = "ascend";
          this.fetchData.sortFilter.secondGradeSort = "1";
          this.onSearch();
        } else {
          this.columns[4].sortOrder = "descend";
          this.fetchData.sortFilter.secondGradeSort = "0";
          this.onSearch();
        }
      }
    },
    changeEnterNum() {},
    // 查询事件
    onSearch() {
      // console.log(this.isStuList);
      let search = this.search;
      search = search.replace(/(^\s*)|(\s*$)/g, "");
      let data = {
        groupId: this.editComInfo.groupId,
        combinationId: this.editComInfo.combinationId,
        adminClassId: this.editComInfo.adminClassId,
        search,
        current: this.pagination.current,
        pageSize: this.pageSize,
        ...this.fetchData
      };
      this.$store.dispatch("adminClass/getStuListInCombinationInClass", data);
    },
    // 模态框-确定
    handleOk(e) {
      if (this.selectedRowKeys.length) {
        this.updateCombination();
      } else {
        this.$message.error("请选择人员！",5);
      }
    },
    async updateCombination() {
      const data = {
        adminClassId: this.editComInfo.adminClassId,
        combinationId: this.editComInfo.combinationId,
        isStuList: this.isStuList,
        personNum: this.enterNum,
        personList: this.enterNum ? [] : this.selectedRowKeys
      };
      let res = await this.$api.adminClass.updateCombination(data);
      if (res.code === "200") {
        this.getSaveData();
        this.$parent.getBaseClassData();
        this.$message.success(res.message,5);
        this.$store.commit("adminClass/setEditModalStatus", false);
      } else {
        this.$message.error(res.message,5);
      }
    },
    // 模态框-取消事件
    handleCancel() {
      this.$store.commit("adminClass/setEditModalStatus", false);
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.onSearch();
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.pageSize = pageSize;
      this.pagination.current = 1;
      this.onSearch();
    }
  }
};
</script>

<style scoped lang="less">
/deep/.ant-btn-primary {
  background-color: #1ba4b3 !important;
  border-color: #1ba4b3 !important;
}
/deep/.ant-pagination-item-active {
  border-color: #1ba4b3;
  a {
    color: #1ba4b3;
  }
}
/deep/.ant-pagination-item {
  &:hover {
    color: #1ba4b3 !important;
    border-color: #1ba4b3;
  }
}
/deep/.ant-modal-body {
  padding: 12px 24px;
}
/* /deep/.ant-pagination {
  background-color: #1ba4b3 !important; 
}  */
.top {
  height: 30px;
  line-height: 30px;
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  .item {
    width: 150px;
  }
}
.search {
  height: 30px;
  line-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /deep/.ant-input-group-wrapper {
    width: 40%;
  }
  /deep/.ant-btn-primary {
    background-color: #1ba4b3;
    border-color: #1ba4b3;
    &:hover {
      color: #fff;
      background: #1ba4b3;
      border-color: #1ba4b3;
    }
    &:focus {
      color: #fff;
      background: #1ba4b3;
      border-color: #1ba4b3;
    }
  }
}
.content {
  margin-top: 16px;
}
</style>
