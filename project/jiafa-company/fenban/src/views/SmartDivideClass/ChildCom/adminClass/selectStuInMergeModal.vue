<!--
 * @Descripttion: 合并班级-选择人员弹窗
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-25 09:02:01
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-23 14:53:25
-->

<template>
  <div class="personal-list">
    <a-modal
      v-model="visible"
      :title="editComInfo.combinationName"
      @ok="handleOk"
      :width="700"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <div class="top">
        <!-- <span class="item">班级人数：{{ editComInfo.classTotal }}人</span> -->
        <span class="item">组合人数：{{ editComInfo.combinationNum }}人</span>
      </div>
      <div class="search">
        <span> </span>
        <a-input-search
          placeholder="请输入学生姓名"
          v-model="search"
          enter-button="搜索"
          @search="() => onSearch(true)"
        />
      </div>
      <div class="content">
        <a-table
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
const columns = [
  { title: "班级", dataIndex: "stuClass", key: "stuClass" },
  { title: "姓名", dataIndex: "stuName", key: "stuName" },
  { title: "性别", dataIndex: "stuSex", key: "stuSex" },
  // { title: '语数外总分', dataIndex: 'mainGrade', key: 'mainGrade' },
  // { title: '选课结果', dataIndex: 'secondGrade', key: 'secondGrade' },
  {
    title: "语数外总分",
    dataIndex: "mainGrade",
    key: "mainGrade",
    align: "center",
    sorter: true,
    sortOrder: false
  },
  {
    title: "选课结果",
    dataIndex: "secondGrade",
    key: "secondGrade",
    align: "center",
    sorter: true
  }
];
export default {
  name: "",
  components: {},
  // props: ['editComInfo'],
  data() {
    return {
      columns,
      stuList: [],
      editComInfo: {},
      search: "",
      fetchData: {
        sortFilter: {
          mainGradeSort: "",
          secondGradeSort: ""
        }
      },
      title: "",
      pageSize: 10,
      pagination: {
        current: 1,
        defaultPageSize: 10,
        showSizeChanger: false, // 显示可改变每页数量
        showQuickJumper: false, //是否可以快速跳转至某页
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), //点击页码事件
        total: 35, //总条数
        size: "middle",
        pageSizeOptions: ["10", "20", "50", "100"], // 每页数量选项
        buildOptionText: (pageSizeOptions) => `${pageSizeOptions.value}条/页`,
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this) // 改变每页数量时更新显示
      }, // table的分页器
      isPersonList: false,
      enterNum: 0, //进入班级人数
      selectedRowKeys: [],
      inputDisabled: false
    };
  },
  computed: {
    // 从vuex中获取模态框的状态
    visible: {
      get: function () {
        return this.$store.state.adminClass.stuListInMergeStatus;
      },
      set: function () {}
    },
    // 从vuex获取行政班级的数据
    adminClassData() {
      return this.$store.state.adminClass.editComModalData;
    },
    personRes() {
      return this.$store.state.adminClass.stuListInMergeList;
    },
    loading() {
      return this.$store.state.adminClass.loading;
    },
    // 表格行选择事件
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
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
    // 人员list监听
    personRes() {
      // 监听人员列表接口返回的数据，获取表格数据和分页
      this.stuList = this.personRes.list;
      this.pagination.current = this.personRes.pagination.current;
      this.pagination.total = this.personRes.pagination.total;
      this.pageSize = this.personRes.pagination.pageSize;
    },
    // 输入number
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
  created() {
    this.editComInfo = this.$store.state.adminClass.stuListInMergeInfo;
    this.isPersonList = JSON.parse(sessionStorage.getItem("isPersonList"));
  },
  mounted() {
    this.onSearch();
    this.stuList = this.personRes.list;
    this.selectedRowKeys = this.editComInfo.stuList
      ? this.editComInfo.stuList
      : [];
    // this.test()
  },
  methods: {
    // 查询事件
    //type用于区分是否是点击搜索，这时候需要将current置为1
    onSearch(type) {
      if (type) this.pagination.current = 1;
      const {
        editComInfo: { combinationId }
      } = this;
      const stuList = this.editComInfo.stuList ? this.editComInfo.stuList : [];

      let selectedList = [];
      this.$store.state.adminClassCy.stuSelectInMergeList.map((item) => {
        if (item.combinationId === combinationId) {
          selectedList = item.list;
        }
      });
      let new_arr = [];
      new_arr = selectedList.filter((x) => stuList.indexOf(x) === -1);
      let search = this.search;
      search = search.replace(/(^\s*)|(\s*$)/g, "");
      let data = {
        classId: this.$store.state.adminClass.mergeClassInfo.classId, // 班级id
        combinationId, // 科目组合id
        selectedList: new_arr,
        keyword: search,
        current: this.pagination.current,
        pageSize: this.pageSize,
        ...this.fetchData
      };
      this.$store.dispatch("adminClass/getGroupGoClassStuList", data);
    },
    // 模态框-确定
    handleOk() {
      this.$parent.listPassToMerge(this.selectedRowKeys, this.editComInfo);
      this.$store.commit("adminClass/setStuListInMergeStatus", false);
    },
    // 模态框-取消事件
    handleCancel() {
      this.$store.commit("adminClass/setStuListInMergeStatus", false);
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
    },
    // table change event
    handleTableChange(pagination, filters, sorter) {
      // 按照语数外总分排序 0降序 descend 1 升序  ascend
      if (sorter.field === "mainGrade") {
        this.fetchData.sortFilter.mainGradeSort = "";
        this.fetchData.sortFilter.secondGradeSort = "";
        const { sortOrder } = this.columns[3];
        delete this.columns[4].sortOrder;
        if (sortOrder === "descend") {
          this.columns[3].sortOrder = "ascend";
          this.fetchData.sortFilter.mainGradeSort = "1";
          this.onSearch();
        } else if (sortOrder === "ascend") {
          this.columns[3].sortOrder = false;
          this.fetchData.sortFilter.mainGradeSort = "";
          this.onSearch();
        } else {
          this.columns[3].sortOrder = "descend";
          this.fetchData.sortFilter.mainGradeSort = "0";
          this.onSearch();
        }
        // 按照选科的分数排序 0降序 1 升序
      } else if (sorter.field === "secondGrade") {
        this.fetchData.sortFilter.mainGradeSort = "";
        this.fetchData.sortFilter.secondGradeSort = "";
        const { sortOrder } = this.columns[4];
        delete this.columns[3].sortOrder;
        if (sortOrder === "descend") {
          this.columns[4].sortOrder = "ascend";
          this.fetchData.sortFilter.secondGradeSort = "1";
          this.onSearch();
        } else if (sortOrder === "ascend") {
          this.columns[4].sortOrder = false;
          this.fetchData.sortFilter.secondGradeSort = "";
          this.onSearch();
        } else {
          this.columns[4].sortOrder = "descend";
          this.fetchData.sortFilter.secondGradeSort = "0";
          this.onSearch();
        }
      }
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
