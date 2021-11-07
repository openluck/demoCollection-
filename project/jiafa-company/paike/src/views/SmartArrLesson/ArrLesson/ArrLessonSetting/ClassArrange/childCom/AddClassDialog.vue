<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-03 14:29:54
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-12 13:09:36
-->
<template>
  <div class="dialog">
    <a-modal
      :visible="addClassDialogvisible"
      title="添加教室"
      okText="确定"
      cancelText="取消"
      centered
      @cancel="closeTeacherListDialog"
      destroyOnClose
      width="800px"
      class="amodel"
    >
      <div class="model-con">
        <div class="left">
          <a-tree
            :tree-data="treeData"
            show-icon
            :defaultExpandAll="true"
            :replace-fields="replaceFields"
            @select="select"
            v-if="treeData.length > 0"
            :default-selected-keys="defaultClaaRoomId"
            :selectedKeys="selectedKeys"
          >
          </a-tree>
        </div>
        <!-- :row-selection="rowSelection" -->
        <!-- :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }" -->
        <a-table
          class="table"
          :columns="columns"
          :data-source="dataSourse"
          :row-selection="rowSelection"
          :rowKey="(record) => record.classroomId"
          :pagination="pagination"
          :row-class-name="rowClassName"
          :loading="loading"
        >
          <template slot="classroomTypeName" slot-scope="text">
            {{ text }}
          </template>
        </a-table>
      </div>
      <template slot="footer">
        <div>
          <a-button @click="closeTeacherListDialog"> 取消 </a-button>
          <a-button type="primary" :loading="bloading" @click="debounceHandleOk">
            确定
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { debounce } from "@/Utils/util.js";
// 表头
const columns = [
  {
    title: "场所类型",
    dataIndex: "classroomTypeName",
    key: "classroomTypeName",
    scopedSlots: { customRender: "classroomTypeName" },
    align: "center",
  },
  {
    title: "教室名称",
    dataIndex: "classroomName",
    key: "classroomName",
    align: "center",
  },
  {
    title: "教室容量",
    dataIndex: "peopleNum",
    key: "peopleNum",
    align: "center",
  },
];

export default {
  name: "AddClassDialog",
  data() {
    return {
      treeData: [],
      replaceFields: {
        children: "children",
        title: "placeName",
        key: "placeId",
        placeType: "placeType",
      },
      columns,
      dataSourse: [],
      pagination: {
        current: 1,
        pageSize: 6,
        showTotal: (total, range) => `共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 页数切换
      },
      loading: false,
      arrLessonId: "",
      classroomIdList: [],
      placeId: "",
      efaultClaaRoomId: [],
      selectedRowKeys: [],
      selectedKeys: [],
      bloading: false,
    };
  },
  computed: {
    rowSelection() {
      // 选择
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.classroomIdList = [...selectedRows];
        },
      };
    },
    ...mapState("dialog", ["addClassDialogvisible"]),
  },
  mounted() {
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
    this.getClassroomTree();
  },
  methods: {
    // 表格多选框
    // onSelectChange(selectedRowKeys) {
    //   console.log("selectedRowKeys changed: ", selectedRowKeys);
    //   // this.selectedRowKeys = selectedRowKeys;
    //   // this.classroomIdList = [...selectedRows];
    // },
    debounceHandleOk: debounce(
      function () {
        this.handleOk();
      },
      2000,
      true
    ),
    /**
     * @name: 确定
     * @msg:
     * @param {*}
     * @return {*}
     */
    async handleOk() {
      this.bloading = true;
      let data = {
        arrLessonId: this.arrLessonId,
        classroomIdList: this.classroomIdList,
      };
      if (this.classroomIdList.length !== 0) {
        try {
          const res = await this.$api.ArrLessonSetting.addClassroomList(data);
          if (res.code === "200") {
            this.$message.success("添加教室成功");
            this.$parent.getClassroomTree();
            this.$parent.getClassroomList();
            this.closeTeacherListDialog();
            this.bloading = false;
          } else {
            this.$message.warning(res.message);
          }
        } catch (error) {
          this.$message.error("请求失败", error);
        }
      } else {
        this.bloading = false;
        this.$message.warning("请选择需要添加的教室");
      }
    },

    /**
     * @name: 关闭弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    ...mapMutations("dialog", ["setAddClassDialog"]),
    closeTeacherListDialog() {
      console.log("关闭弹窗");
      this.pagination.current = 1;
      this.setAddClassDialog(false);
    },

    /**
     * @name: 分页
     * @msg:
     * @param {*} page
     * @return {*}
     */
    onPageChange(page) {
      this.pagination.current = page;
      this.getClassroomList();
      // this.selectedRowKeys = [];
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
     * @name: 获取教室（场所）结构树
     * @msg:
     * @param {*}
     * @return {*}
     */
    // async getClassroomTree() {
    //   try {
    //     const res = await this.$api.ArrLessonSetting.getClassroomTree();
    //     if (res.code === "200") {
    //       this.treeData = res.data;
    //       let selectedKeys = [];
    //       selectedKeys.push(res.data[0].placeId);
    //       this.defaultClaaRoomId = selectedKeys;
    //       this.select(selectedKeys);
    //     } else {
    //       this.$message.warning(res.message);
    //     }
    //   } catch (error) {
    //     this.$message.error("请求失败", +error);
    //   }
    // },
    async getClassroomTree() {
      let data = {
        arrLessonId: sessionStorage.getItem("arrLessonId"),
        type: 2,
      };
      try {
        const res = await this.$api.ArrLessonSetting.getPlanClassRoomTree(data);
        if (res.code === "200") {
          this.treeData = res.data;
          let selectedKeys = [];
          selectedKeys.push(res.data[0].placeId);
          this.defaultClaaRoomId = selectedKeys;
          this.pagination.current = 1;
          this.select(selectedKeys);
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败", +error);
      }
    },

    /**
     * @name: 教室安排-获取教室安排列表
     * @msg:
     * @param {*}
     * @return {*}
     */
    async getClassroomList() {
      this.loading = true;
      let data = {
        placeId: this.placeId,
        type: 2,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        arrLessonId: this.arrLessonId,
      };
      try {
        let res = await this.$api.ArrLessonSetting.getClassroomList(data);
        if (res.code === "200") {
          res.data.list.map((item) => {
            item.peopleNum = item.classroomMaxNum;
            item.placeType = item.classroomType;
          });
          res.data.list.map((item) => {
            delete item.classroomMaxNum;
          });
          res.data.list.map((item) => {
            delete item.classroomType;
          });
          this.dataSourse = res.data.list;
          this.pagination.total = res.data.pagination.total;
          this.loading = false;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败", +error);
      }
    },

    /**
     * @name:  左侧选择
     * @msg:
     * @param {*}
     * @return {*}
     */
    select(selectedKeys, e) {
      if (selectedKeys.length > 0) {
        this.placeId = selectedKeys[0];
        this.pagination.current = 1;
        this.getClassroomList();
        this.selectedKeys = [];
        this.selectedKeys = selectedKeys;
      }
    },
  },
};
</script>
                                                                                                                                       
<style lang="less" scoped>
.amodel {
  .model-con {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    .left {
      width: 29%;
      height: 400px;
      background-color: #f8f9fa;
      overflow-y: scroll;
    }
    .table {
      width: 70%;
    }
  }
}
/deep/ .ant-modal-header {
  text-align: left;
}
/deep/ .ant-modal-footer {
  text-align: center;
}

// /deep/ .ant-tree li span.ant-tree-switcher,
// .ant-tree li span.ant-tree-iconEle {
//   width: 0;
//   height: 0;
// }
.ant-pagination-total-text {
  position: absolute;
  left: 0;
}
/deep/ .ant-btn-primary {
  background-color: #1890ff;
}
/deep/ .ant-modal-body {
  height: 480px;
}
</style>