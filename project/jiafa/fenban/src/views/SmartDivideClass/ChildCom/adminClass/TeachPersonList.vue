<!--
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-27 17:03:52
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-24 14:17:51
-->

<template>
  <div class="personal-list">
    <a-modal
      v-model="visible"
      :title="adminClassData.teachClassName"
      @ok="handleOk"
      :width="700"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <div class="top">
        <span>总人数：{{ pagination.total }}人</span>
        <!-- <span>总人数：{{ adminClassData.teachClassNum }}人</span> -->
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
          :row-key="(record) => record.id"
          :pagination="pagination"
          :scroll="{ y: '350px' }"
        ></a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  { title: "所在教学班", dataIndex: "toTeachClass", key: "toTeachClass" },
  { title: "学生姓名", dataIndex: "stuName", key: "stuName" },
  { title: "性别", dataIndex: "sex", key: "sex" },
  { title: "来源班级", dataIndex: "orignClass2", key: "orignClass2" },
  { title: "所选组合", dataIndex: "selectCom", key: "selectCom" }
];
export default {
  name: "",
  components: {},
  data() {
    return {
      columns,
      stuList: [],
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
        total: 35, //总条数
        size: "middle",
        pageSizeOptions: ["10", "20", "50", "100"], // 每页数量选项
        buildOptionText: (pageSizeOptions) => `${pageSizeOptions.value}条/页`,
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this) // 改变每页数量时更新显示
      } // table的分页器
    };
  },
  computed: {
    // 从vuex中获取模态框的状态
    visible: {
      get: function () {
        return this.$store.state.adminClass.teachPersonModalStatus;
      },
      set: function () {}
    },
    // 从vuex获取行政班级的数据
    adminClassData() {
      return this.$store.state.adminClass.teachClassData;
    },
    personRes() {
      return this.$store.state.adminClass.teachPersonModalData;
    },
    loading() {
      return this.$store.state.adminClass.loading;
    }
  },
  watch: {
    personRes() {
      // 监听人员列表接口返回的数据，获取表格数据和分页
      this.stuList = this.personRes.list;
      this.pagination.current = this.personRes.pagination.current;
      this.pagination.total = this.personRes.pagination.total;
      this.pageSize = this.personRes.pagination.pageSize;
    }
  },
  mounted() {
    this.onSearch();
    this.stuList = this.personRes.list;
  },
  methods: {
    // 查询事件
    //type用于区分是否是点击搜索，这时候需要将current置为1
    onSearch(type) {
      if (type) this.pagination.current = 1;
      let search = this.search;
      search = search.replace(/(^\s*)|(\s*$)/g, "");

      let data = {
        classId: this.adminClassData.teachClassId,
        search,
        current: this.pagination.current,
        pageSize: this.pageSize,
        type: "2"
      };
      this.$store.dispatch("adminClass/getPersonList", data);
    },
    // 模态框-确定
    handleOk(e) {
      this.$store.commit("adminClass/setTeachPersonModalStatus", false);
    },
    // 模态框-取消事件
    handleCancel() {
      this.$store.commit("adminClass/setTeachPersonModalStatus", false);
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
/* /deep/.ant-pagination {
  background-color: #1ba4b3 !important; 
}  */
.top {
  height: 30px;
  line-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /deep/.ant-input-group-wrapper {
    width: 60%;
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
