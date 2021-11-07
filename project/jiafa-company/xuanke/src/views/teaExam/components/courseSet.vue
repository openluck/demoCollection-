<template>
  <div class="curricula_variable_set">
    <div class="set_top">
      <span style="font-size: 18px; margin-right: 10px">
        <svg-icon
          icon-class="icon _back"
          :scale="0.8"
          @click.native="goback"
          style="margin-right: 4px; cursor: pointer"
        />
        选课设置
      </span>
      <span style="color: #9ea2a6">{{ courseGroupInfo.name }}</span>
    </div>

    <div class="set_bottom">
      <div class="group_pattern" style="margin-bottom: 15px">
        <span>选课模式：</span>
        <a-radio-group v-model="groupMode">
          <a-radio
            v-for="item in modeList"
            :key="item.groupMode"
            :value="item.groupMode"
          >
            {{ item.name }}
          </a-radio>
        </a-radio-group>
      </div>

      <div class="subject" style="margin-bottom: 15px">
        <span>参选课目：</span>
        <span
          v-for="item in subjectList"
          :key="item.subjectId"
          style="margin-right: 15px"
          >{{ item.subjectName }}</span
        >
      </div>

      <div class="operation_btn" style="margin-bottom: 15px">
        <a-button style="margin-right: 15px" type="primary" @click="create" :disabled="currentState==='已完成'">
          <svg-icon
            icon-class="icon_creat"
            :scale="0.8"
            style="margin-right: 4px"
          />
          生成
        </a-button>
        <a-button style="margin-right: 15px" type="primary" @click="issue" :disabled="currentState==='已完成'">
          <svg-icon
            icon-class="icon_creat"
            :scale="0.8"
            style="margin-right: 4px"
          />
          发布
        </a-button>
        <!-- <a-button style="margin-right:15px;" type="primary" @click="allCancel">
          <svg-icon icon-class="icon_export" :scale="0.8" style="margin-right:4px;" />
          批量撤回
        </a-button> -->
        <a-popconfirm title="是否确定撤回这些项?" @confirm="() => allCancel()" :disabled="currentState==='已完成'">
          <a-button type="danger" style="margin-right: 15px" :disabled="currentState==='已完成'">
            <svg-icon
              icon-class="icon_chehui2"
              :scale="0.8"
              style="margin-right: 4px"
            />
            批量撤回
          </a-button>
        </a-popconfirm>
        <!-- <a-button type="primary" @click="allDel">
          <svg-icon icon-class="icon_export" :scale="0.8" style="margin-right:4px;" />
          批量删除
        </a-button> -->
        <a-popconfirm title="是否确定删除这些项?" @confirm="() => allDel()" :disabled="currentState==='已完成'">
          <a-button type="danger" :disabled="currentState==='已完成'">
            <svg-icon
              icon-class="icon_shanchu"
              :scale="0.9"
              style="margin-right: 4px"
            />
            批量删除
          </a-button>
        </a-popconfirm>
      </div>

      <div class="table_list">
        <a-table
          :row-selection="rowSelection"
          :columns="columns"
          size="middle"
          :loading="tableLoading"
          :rowKey="(row) => row.courseGroupItemId"
          :data-source="dataList"
          :pagination="pagination"
          bordered
        >
          <span slot="state" slot-scope="text">
            <span
              class="stateStyle"
              :class="text === 1 ? 'green' : text === 0 ? 'blue' : ''"
              >{{ text === 1 ? "已发布" : text === 0 ? "待发布" : "" }}</span
            >
          </span>

          <span slot="operation" slot-scope="text, record">
            <!-- <a-button @click="withdraw(record)" style="margin-right:10px;">撤回</a-button> -->
            <a-popconfirm
              v-if="dataList.length"
              title="是否确定撤回此项?"
              @confirm="() => withdraw(record)"
              :disabled="currentState==='已完成'"
            >
              <span style="cursor: pointer; margin-right: 20px" :disabled="currentState==='已完成'">
                <svg-icon
                  icon-class="icon_chehui"
                  :scale="0.8"
                  style="margin-right: 4px"
                />
                撤回
              </span>
            </a-popconfirm>
            <!-- <a-button @click="del(record)">删除</a-button> -->
            <a-popconfirm
              v-if="dataList.length"
              title="是否确定删除此项?"
              @confirm="() => del(record)"
              :disabled="currentState==='已完成'"
            >
              <span style="cursor: pointer" :disabled="currentState==='已完成'">
                <svg-icon
                  icon-class="icon_delete"
                  :scale="0.8"
                  style="margin-right: 4px"
                />
                删除
              </span>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: "课程组合名称",
    dataIndex: "courseGroupItemName",
    key: "courseGroupItemName",
    scopedSlots: { customRender: "courseGroupItemName" },
  },
  {
    title: "课程组合状态",
    dataIndex: "state",
    key: "state",
    scopedSlots: { customRender: "state" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    key: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  data() {
    return {
      courseGroupInfo: {},
      courseGroupId: "", // 活动id
      currentState: "", // 活动状态

      modeList: [], // 选课模式
      subjectList: [], //参选课目
      groupMode: "", //选课模式

      dataList: [], // 列表数据
      columns,
      tableLoading: false,
      courseGroupItemIds: [], // 列表选择项id（批量）

      //分页器
      pagination: {
        size: "middle",
        current: 1,
        showQuickJumper: true,
        showSizeChanger: false,
        total: 0,
        defaultPageSize: 10,
        // pageSizeOptions: ["10", "25", "50"],
        onChange: this.onPageChange.bind(this), //点击页码事件
        onShowSizeChange: this.onSizeChange.bind(this), // 改变每页条数
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`,
      },
      current: 1, // 当前页
      pageSize: 10, // 每页显示的条数
    };
  },
  mounted() {
    this.courseGroupInfo = JSON.parse(sessionStorage.getItem("courseSet"));
    this.courseGroupId = JSON.parse(
      sessionStorage.getItem("courseSet")
    ).courseGroupId;
    this.currentState = JSON.parse(
      sessionStorage.getItem("courseSet")
    ).currentState;
    // 获取选课模式
    this.getCourseGroupsScheme();
    // 获取参选课目
    this.getCourse();
    // 获取组合列表
    this.getGroupItemPagingList();
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.courseGroupItemIds,
        onChange: (selectedRowKeys, selectedRows) => {
          this.courseGroupItemIds = selectedRows.map(
            (item) => item.courseGroupItemId
          );
        },
      };
    },
  },
  methods: {
    // 回退
    goback() {
      this.$router.push({
        path: "/TeacherExam",
        query: {
          pageIndex: this.$store.state.teacherExam.pageInfo.pageIndex,
          pageSize: this.$store.state.teacherExam.pageInfo.pageSize,
        },
      });
    },
    // 获取选课模式
    async getCourseGroupsScheme() {
      try {
        const res = await this.$api.courseSet.getCourseGroupsScheme({});
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          this.modeList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取参选课目
    async getCourse() {
      try {
        const res = await this.$api.courseSet.getCourse({
          courseGroupId: this.courseGroupId,
        });
        console.log(res);
        if (res.code === "200" || res.code === 200) {
          this.subjectList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 点击生成 - 生成选课组合
    async create() {
      if (!this.groupMode) {
        this.$message.warn("请选择选课模式！");
        return;
      }
      try {
        const res = await this.$api.courseSet.addCourseGroupItem({
          courseGroupId: this.courseGroupId,
          groupMode: this.groupMode,
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.getGroupItemPagingList();
        } else {
          this.groupMode = "";
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 生成课程组合列表
    async getGroupItemPagingList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.courseSet.getGroupItemPagingList({
          courseGroupId: this.courseGroupId,
          current: this.current,
          pageSize: this.pageSize,
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.dataList = res.data.list;
          this.pagination.total = res.data.pagination.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.tableLoading = false;
      }
    },
    // 翻页改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.current = page;
      this.getGroupItemPagingList();
    },
    // 改变每页数量
    onSizeChange(current, size) {
      console.log(current, size);
      this.current = 1;
      this.pageSize = size;
      this.pagination.current = 1;
      this.getGroupItemPagingList();
    },
    // 发布
    async issue() {
      if (this.courseGroupItemIds.length <= 0) {
        this.$message.warn("请选择课程组合！");
        return;
      }
      try {
        const res = await this.$api.courseSet.updateGroupItemState({
          courseGroupItemIds: this.courseGroupItemIds,
          state: 1,
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.$message.success("发布成功！");
          this.courseGroupItemIds = [];
          this.getGroupItemPagingList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 批量撤回
    async allCancel() {
      if (this.courseGroupItemIds.length <= 0) {
        this.$message.warn("请选择课程组合！");
        return;
      }
      try {
        const res = await this.$api.courseSet.updateGroupItemState({
          courseGroupItemIds: this.courseGroupItemIds,
          state: 0,
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.$message.success("撤回成功！");
          this.courseGroupItemIds = [];
          this.getGroupItemPagingList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 批量删除
    async allDel() {
      if (this.courseGroupItemIds.length <= 0) {
        this.$message.warn("请选择课程组合！");
        return;
      }
      try {
        const res = await this.$api.courseSet.delGroupItem({
          courseGroupItemIdList: this.courseGroupItemIds,
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.$message.success("删除成功！");
          if (this.courseGroupItemIds.length >= this.dataList.length) {
            console.log("ininin");
            this.pagination.current = 1
            this.current = 1
          }
          this.getGroupItemPagingList();
          this.courseGroupItemIds = [];
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 撤回
    async withdraw(record) {
      try {
        const res = await this.$api.courseSet.updateGroupItemState({
          courseGroupItemIds: [record.courseGroupItemId],
          state: 0,
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.$message.success("撤回成功！");
          this.getGroupItemPagingList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 删除
    async del(record) {
      try {
        const res = await this.$api.courseSet.delGroupItem({
          courseGroupItemIdList: [record.courseGroupItemId],
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.$message.success("删除成功！");
          this.getGroupItemPagingList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="less">
.curricula_variable_set {
  .set_top {
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
  }
  .set_bottom {
    padding: 15px 20px;
    .table_list {
      .stateStyle {
        padding: 6px 8px;
        border-radius: 4px;
      }
      .green {
        background-color: #d8f1e4;
        color: #45be81;
      }
      .blue {
        background-color: #cee3f8;
        color: #2e8ae6;
      }
    }
  }
}
</style>
