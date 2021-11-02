<!--
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-27 17:03:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-23 15:23:09
-->

<template>
  <div class="study-personal-list">
    <a-modal
      v-model="studyPersonListStatus"
      :title="studyTeachClassData.teachClassName"
      @ok="handleOk"
      :width="700"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <div class="top">
        <!-- <div class="select">
          <label for="">学考班：</label>
          <a-select style="width:200px;">
            <a-select-option value="jack">aaa</a-select-option>
          </a-select>
        </div> -->
        <a-input-search
          placeholder="请输入学生姓名"
          v-model="fetchData.keyword"
          enter-button="搜索"
          @search="getData"
          style="width: 280px"
        />
      </div>
      <div class="content">
        <a-table
          :loading="isMergeLoading"
          :columns="columns"
          :data-source="stuList"
          :row-key="(record) => record.stuId"
          :pagination="pagination"
          :scroll="{ y: '350px' }"
        ></a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
/**
 * @description 学考分班下 查看 学考教学班学生列表
 * @date 2021-4-27 11:08:09
 */
import { mapState, mapMutations } from "vuex";
const columns = [
  {
    title: "来源行政班级",
    dataIndex: "adminClassName",
    key: "adminClassName"
  },
  {
    title: "来源学考班",
    dataIndex: "studyClassName",
    key: "studyClassName"
  },
  { title: "学生姓名", dataIndex: "stuName", key: "stuName" },
  { title: "性别", dataIndex: "stuSex", key: "stuSex" }
];
export default {
  name: "StudyPersonList",
  components: {},
  data() {
    return {
      columns,
      stuList: [],
      fetchData: {
        keyword: "",
        current: 1,
        pageSize: 10
      },
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
        pageSizeOptions: ["10", "20", "30", "50"], // 每页数量选项
        buildOptionText: (pageSizeOptions) => `${pageSizeOptions.value}条/页`,
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this) // 改变每页数量时更新显示
      } // table的分页器
    };
  },
  computed: {
    ...mapState("adminClass", [
      "studyTeachClassData",
      "isMergepersonRes",
      "isMergeLoading"
    ]),
    studyPersonListStatus: {
      get: function () {
        return this.$store.state.adminClass.studyPersonListStatus;
      },
      set: function () {}
    }
  },
  watch: {
    studyPersonListStatus(val) {
      if (val) {
        this.getData();
      }
    },
    isMergepersonRes(val) {
      const { list, pagination } = this.isMergepersonRes;
      this.stuList = list;
      this.pagination.total = pagination.total;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations("adminClass", ["setStudyPersonListStatus"]),
    // 查询事件
    getData() {
      const params = {
        adminClassId: this.studyTeachClassData.adminClassId,
        tcId: this.studyTeachClassData.teachClassId,
        keyword: this.fetchData.keyword,
        current: this.fetchData.current,
        pageSize: this.fetchData.pageSize
      };
      this.$store.dispatch("adminClass/getisMergePersonList", params);
    },
    // 模态框-确定
    handleOk(e) {
      this.setStudyPersonListStatus(false);
    },
    // 模态框-取消事件
    handleCancel() {
      this.setStudyPersonListStatus(false);
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.pageSize = pageSize;
      this.pagination.current = 1;
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
  justify-content: flex-end;
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
