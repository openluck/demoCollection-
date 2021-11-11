<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-02 14:04:50
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-14 15:46:09
-->
<template>
  <div class="class-arrange">
    <div class="tcontainer">
      <div class="left">
        <div class="batch-setting">
          <a-button class="btn" @click="addClassDialog">
            <a-icon type="plus" />
            添加教室
          </a-button>
        </div>
        <a-tree
          :tree-data="treeData"
          show-icon
          :defaultExpandAll="true"
          :replace-fields="replaceFields"
          @select="select"
          v-if="treeData.length > 0"
          :default-selected-keys="defaultClaaRoomId"
          :selectedKeys="selectedKeys"
          class="tree-seleGroup"
        >
        </a-tree>
      </div>
      <div class="right">
        <div class="teacher-table">
          <div class="bnt-list">
            <div class="bleft">
              <!-- <a-popconfirm
                title="确定取消这些教室嘛?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="() => delClassroomList()"
              >
                <a-button type="primary">
                  <a-icon type="plus" />
                  批量取消
                </a-button>
              </a-popconfirm> -->
              <a-button
                @click="showTipsDialog"
                style="margin-bottom: 20px"
              >
                <a-icon type="delete" />
                批量删除
              </a-button>
            </div>
            <!-- <div class="bright">
              <span>批量设置教师课时</span>
              <a-input placeholder="20" />
            </div> -->
          </div>
          <div>
            <a-table
              :columns="columns"
              :data-source="dataSourse"
              :row-selection="rowSelection"
              :rowKey="(record) => record.classroomId"
              :pagination="pagination"
              :row-class-name="rowClassName"
              :loading="loading"
              :scroll="{ y: 'calc(100vh - 455px)' }"
            >
              <a slot="maxCourseHour">
                <div>
                  <a-input placeholder="20" type="number" />
                </div>
              </a>
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <AddClassDialog ref="AddClassDialog"></AddClassDialog>
    <!-- <TipsDialog
      :tipsDialogVisible="tipsDialogVisible"
      @ClosetipsDialogModel="ClosetipsDialogModel"
      ref="TipsDialog"
    ></TipsDialog> -->
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import AddClassDialog from "./childCom/AddClassDialog";
// import TipsDialog from "./childCom/TipsDialog.vue";

const columns = [
  {
    title: "场所类型",
    dataIndex: "classroomTypeName",
    key: "classroomTypeName",
  },
  {
    title: "教室名称",
    dataIndex: "classroomName",
    key: "classroomName",
  },
  {
    title: "教室容量",
    dataIndex: "classroomMaxNum",
    key: "classroomMaxNum",
  },
];

export default {
  name: "",
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
      arrLessonId: "",
      selectedRows: [],
      placeId: "",
      defaultClaaRoomId: [],
      tipsDialogVisible: false,
      selectedKeys: [],
    };
  },
  components: {
    AddClassDialog,
    // TipsDialog,
  },
  computed: {
    rowSelection() {
      // const { selectedRowKeys } = this;
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRowKeys;
        },
        // selectedRowKeys,
      };
    },
  },
  mounted() {
    this.arrLessonId = sessionStorage.getItem("arrLessonId");
    this.getClassroomTree();
  },
  methods: {
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
     * @name: 分页
     * @msg:
     * @param {*} page
     * @return {*}
     */
    onPageChange(page) {
      this.pagination.current = page;
      this.getClassroomList();
    },

    /**
     * @name: 添加教室弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    ...mapMutations("dialog", ["setAddClassDialog"]),
    addClassDialog() {
      this.setAddClassDialog(true);
      this.$refs.AddClassDialog.getClassroomTree();
      // this.$refs.AddClassDialog.getClassroomList();
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
        type: 1,
      };
      try {
        const res = await this.$api.ArrLessonSetting.getPlanClassRoomTree(data);
        if (res.code === "200") {
          this.treeData = res.data;
          let selectedKeys = [];
          selectedKeys.push(res.data[0].placeId);
          this.defaultClaaRoomId = selectedKeys;
          this.select(selectedKeys);
        } else {
          this.$message.warning(res.message);
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
        type: 1,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        arrLessonId: this.arrLessonId,
      };
      try {
        let res = await this.$api.ArrLessonSetting.getClassroomList(data);
        if (res.code === "200") {
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
     * @name: 批量取消
     * @msg:
     * @param {*}
     * @return {*}
     */
    async delClassroomList() {
      // if (this.selectedRows.length === 0) {
      //   this.$message.warning("请选中需要取消的教室");
      //   return;
      // }
      try {
        let data = {
          arrLessonId: this.arrLessonId,
          classroomIdList: this.selectedRows,
        };
        const res = await this.$api.ArrLessonSetting.delClassroomList(data);
        if (res.code === "200") {
          this.$message.success("删除成功");
          this.ClosetipsDialogModel(this.tipsDialogVisible);
          this.selectedRows = [];
          this.pagination.current = 1;
          this.getClassroomTree();
          this.getClassroomList();
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        this.$api.message.error("请求失败", error);
      }
    },
    onShowSizeChangeMethod(page, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.getClassroomList();
    },
    /**
     * @name: 提示弹窗
     * @msg:
     * @param {*}
     * @return {*}
     */
    showTipsDialog() {
      if (this.selectedRows.length === 0) {
        this.$message.error("请选择删除项！");
      } else {
        // this.tipsDialogVisible = true;
        // console.log("this.tipsDialogVisible", this.tipsDialogVisible);
        this.$confirm({
          title: "确定删除所选教室？",
          okText: "确定",
          okType: "primary",
          cancelText: "取消",
          onOk: () => {
            this.delClassroomList();
          },
        });
      }
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
    /**
     * 一维/多维数组中根据id获取对象
     * @param {*} data  一维/多维数组
     **/
    getArrayObj(data) {
      for (let i in data) {
        let item = data[i];
        if (item.count === 0) {
          delete item.count;
        } else if (item?.children?.length) {
          this.getArrayObj(item.children);
        }
      }
      return data;
    },
  },
};
</script>

<style lang="less" scoped>
.class-arrange {
  width: 100%;
  height: calc(100% - 170px);
  .tcontainer {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
      width: 208px;
      height: 100%;
      background-color: #f7f8fa;
      overflow-y: scroll;
      .batch-setting {
        display: flex;
        justify-content: center;
        .btn {
          width: 176px;
          margin-top: 20px;
        }
      }
    }
    .right {
      width: calc(100% - 236px);
      height: 100%;
      margin-left: 20px;
      .teacher-table {
        .bnt-list {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .bright {
            display: flex;
          }
        }
      }
    }
  }
  /deep/ .gray {
    background-color: #fafafa;
  }
  .tree-seleGroup {
    font-weight: bold;
  }
}
</style>