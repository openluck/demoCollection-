<template>
  <div class="timetable-manage">
    <!-- 搜索区域 -->
    <section class="select">
      <div class="common-title">课表管理</div>
      <!-- 学年选择框 -->
      <!-- <label for="selectSchoolYear">学年：</label> -->
      <div class="common-operate"
        style="margin-bottom: 0">
        <a-select id="selectSchoolYear"
          v-model="fetchData.schoolYearId"
          style="width: 168px"
          @select="handleSchoolYearSelect">
          <a-select-option v-for="item of schoolYearList"
            :value="item.schoolYearId"
            :key="item.schoolYearId">{{ item.schoolYearName }}</a-select-option>
        </a-select>
        <!-- 学期选择框 -->
        <!-- <label for="selectSemester" style="margin-left:15px;">学期：</label> -->
        <a-select id="selectSemester"
          v-model="fetchData.semesterId"
          style="width: 120px; margin-left: 16px"
          @select="handleSemesterSelect">
          <a-select-option v-for="item of semesterList"
            :value="item.semesterId"
            :key="item.semesterId">{{ item.semesterName }}</a-select-option>
        </a-select>
        <a-button type="search"
          class="ylc-select-button"
          @click="search">
          <svg-icon icon-class="com_search"
            class="ylc-select-icon" />
          查询
        </a-button>
      </div>
    </section>
    <section>
      <a-tabs v-model="key"
        @change="changeType">
        <a-tab-pane key="1"
          tab="非校本课">
          <div class="ylc-active-content"
            v-for="item of normalList"
            :key="item.secId">
            <div class="ylc-active-title">{{ item.secName }}</div>
            <div>
              <a-table class="msg-table"
                :columns="highSchoolColumns"
                :data-source="item.children"
                :loading="highSchoolTableLoading"
                :pagination="false"
                bordered
                :rowKey="(row) => row.gradeId">
                <template v-slot:updateTime="text">
                  <span>{{ text === null ? "--":text }}</span>
                </template>
                <template v-slot:importWay="text">
                  <span v-if="text === '1'">手动导入</span>
                  <span v-else-if="text === '2'">自动导入</span>
                  <span v-else>--</span>
                </template>
                <template v-slot:action="text, record">
                  <span @click="importDataSource(record)"
                    style="cursor: pointer; color: #494b4d">
                    <svg-icon icon-class="imp_data"
                      style="margin-right: 9px; color: #494b4d" />导入数据
                  </span>
                  <span @click="importRecord(record.gradeId)"
                    style="margin-left: 24px; cursor: pointer; color: #494b4d">
                    <svg-icon icon-class="com_detail"
                      style="margin-right: 9px; color: #494b4d" />导入完成情况
                  </span>
                </template>
              </a-table>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2"
          tab="校本课">
          <div class="ylc-base-content">
            <div style="margin-top: 8px">
              <a-button class="ylc-base-btn"
                @click="importBased()">
                <svg-icon icon-class="imp_data"
                  style="width: 14px; height: 14px; margin-right: 8px" />
                手动导入校本课
              </a-button>
            </div>
            <div style="margin-top: 24px">
              <a-table class="msg-table"
                :columns="baseInfoColumns"
                :data-source="baseData"
                :loading="baseTableLoading"
                :pagination="false"
                bordered
                :rowKey="(row, index) => index">
                <template v-slot:subjectName="text">
                  <div>{{text ? text : "--"}}</div>
                </template>
                <template v-slot:teacherName="text">
                  <div>{{text ? text : "--"}}</div>
                </template>
              </a-table>
              <GloPagination :total="total"
                @onChange="onPageChange"
                ref="gloPagination"
                @onSizeChange="sizeChange"
                @pressEnter="pressEnter" />
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </section>
    <GlobalModal :visible="visible"
      title="查看导入完成情况"
      :defaultBtn="false"
      :showFooter="''"
      @cancel="cancel">
      <div class="ylc-class-modal">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1"
            tab="行政班班级">
            <div class="ylc-class-table">
              <a-table class="msg-table"
                :columns="activeColumns"
                :data-source="activeList"
                :loading="classLoading"
                :pagination="false"
                :rowKey="(row) => row.classId">
                <template v-slot:importStatus="text">
                  <a-tag v-if="text === '未导入'"
                    class="ylc-unimport">未导入</a-tag>
                  <a-tag v-else
                    class="ylc-import">已导入</a-tag>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2"
            tab="走班班级">
            <div class="ylc-class-table">
              <a-table class="msg-table"
                :columns="walkColumns"
                :data-source="walkList"
                :loading="classLoading"
                :pagination="false"
                :rowKey="(row) => row.classId">
                <template v-slot:info="text, record">
                  <span>{{ record.className }}/{{record.subjectName}}/{{record.teacherName}}</span>
                </template>
                <template v-slot:importStatus="text">
                  <a-tag v-if="text !== '已导入'"
                    class="ylc-unimport">未导入</a-tag>
                  <a-tag v-else
                    class="ylc-import">已导入</a-tag>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </GlobalModal>
  </div>
</template>
 
<script>
import GlobalModal from "@/components/common/GlobalModal.vue";
import GloPagination from "@/components/common/GloPagination.vue";
/**
 * @description 课表管理
 * @date 2021-1-15 14:09:51
 */
const highSchoolColumns = [
  {
    title: "年级",
    dataIndex: "gradeName",
    key: "gradeName",
    width: 150,
    scopedSlots: { customRender: "gradeName" }
  },
  {
    title: "数据更新时间",
    dataIndex: "updateTime",
    key: "updateTime",
    width: 225,
    scopedSlots: { customRender: "updateTime" }
  },
  {
    title: "导入方式",
    dataIndex: "importWay",
    key: "importWay",
    width: 175,
    scopedSlots: { customRender: "importWay" }
  },
  {
    title: "操作",
    key: "action",
    width: 180,
    scopedSlots: { customRender: "action" }
  }
];
const baseInfoColumns = [
  {
    title: "科目",
    dataIndex: "subjectName",
    key: "subjectName",
    width: 225,
    scopedSlots: { customRender: "subjectName" }
  },
  {
    title: "教师",
    dataIndex: "teacherName",
    key: "teacherName",
    width: 240,
    scopedSlots: { customRender: "teacherName" }
  },
  {
    title: "班级名称",
    dataIndex: "className",
    key: "className",
    width: 230,
    scopedSlots: { customRender: "className" }
  },
  {
    title: "导入时间",
    dataIndex: "importTime",
    key: "importTime",
    width: 230,
    scopedSlots: { customRender: "importTime" }
  }
];
const walkColumns = [
  {
    title: "班级/科目/教师",
    dataIndex: "className",
    key: "className",
    width: 220,
    scopedSlots: { customRender: "info" }
  },
  {
    title: "导入时间",
    dataIndex: "importTime",
    key: "importTime",
    width: 220,
    ellipsis: true,
    scopedSlots: { customRender: "importTime" }
  },
  {
    title: "状态",
    dataIndex: "importStatus",
    key: "importStatus",
    scopedSlots: { customRender: "importStatus" }
  }
];
const activeColumns = [
  {
    title: "班级名称",
    dataIndex: "className",
    key: "className",
    align: "left",
    width: 180,
    ellipsis: true,
    scopedSlots: { customRender: "className" }
  },
  {
    title: "导入时间",
    dataIndex: "importTime",
    key: "importTime",
    width: 220,
    ellipsis: true,
    scopedSlots: { customRender: "importTime" }
  },
  {
    title: "状态",
    dataIndex: "importStatus",
    key: "importStatus",
    scopedSlots: { customRender: "importStatus" }
  }
];
export default {
  name: "timetableManage",
  components: { GlobalModal, GloPagination },
  data() {
    return {
      schoolYearList: [], // 学年列表
      semesterList: [], // 学期列表
      fetchData: {
        schoolYearId: "",
        semesterId: "",
        current: 1,
        pageSize: 10
      }, // 查询参数
      baseData: [], // 校本课表格数据
      normalList: [], // 非校本课数据
      walkList: [], // 走班表格数据
      activeList: [], // 行政班表格数据
      total: 0, // 校本课数据总数
      visible: false, // 控制导入完成情况弹窗
      classLoading: false, //
      highSchoolTableLoading: false, // 非校本课表格loading
      baseTableLoading: false, // 校本课表格loading
      key: "1", // tab标签值
      highSchoolColumns, // 非校本课表头
      baseInfoColumns, // 校本课表头
      activeColumns, // 行政班表头
      walkColumns // 走班表头
    };
  },
  computed: {},
  created() {
    this.schoolYearList = JSON.parse(sessionStorage.getItem("schoolYearList"));
    this.schoolYearList.map(item => {
      if (item.isCurrentSchoolYear) {
        this.fetchData.schoolYearId = item.schoolYearId;
        this.semesterList = item.semesterList;
      }
    })
    this.semesterList.map(item => {
      if (item.isCurrentSchoolSemester) {
        this.fetchData.semesterId = item.semesterId;
        this.semesterStartTime = item.semesterStartTime;
        this.semesterEndTime = item.semesterEndTime;
      }
    })
    this.getNormalList();
  },
  methods: {
    // 点击导入非校本课数据
    importDataSource(record) {
      this.fetchData.gradeId = record.gradeId
      this.$router.push({
        path: "/TimetableManage/ImportCheck",
        query: {
          ...this.fetchData
        }
      });
    },
    // 点击导入校本课数据
    importBased() {
      this.$router.push({
        path: "/TimetableManage/ImportCheck",
        query: {
          ...this.fetchData,
          type: "校本课"
        }
      });
    },
    // 学年选择事件
    handleSchoolYearSelect(e) {
      this.fetchData.schoolYearId = e;
      this.schoolYearList.map((item) => {
        if (item.schoolYearId === e) {
          this.semesterList = item.semesterList;
        }
      });
      if (this.semesterList.length > 0) {
        this.fetchData.semesterId = this.semesterList[0].semesterId;
      } else {
        this.fetchData.semesterId = ""
        this.$message.warn("当前学年暂无学期")
      }
    },
    // 学期选择事件
    handleSemesterSelect(e) {
      this.fetchData.semesterId = e;
    },
    // 选择类型是否为非校本课
    changeType(key) {
      this.fetchData.current = 1;
      this.key = key
      if (key === "1") {
        this.getNormalList();
        this.$refs.gloPagination.initCurrent();
      } else {
        this.getSchoolBasedList();
      }
    },
    // 表格页面改变事件
    onPageChange(current, size) {
      this.fetchData.current = current;
      this.fetchData.pageSize = size;
      this.getSchoolBasedList();
    },
    // 改变每页数量时更新显示
    sizeChange(current, size) {
      this.fetchData.current = current;
      this.fetchData.pageSize = size;
      this.getSchoolBasedList();
    },
    pressEnter(outCurrent) {
      this.fetchData.current = outCurrent;
      this.getSchoolBasedList();
    },
    // 查询
    search() {
      if (this.key === "1") {
        this.getNormalList();
      } else {
        this.getSchoolBasedList()
      }
    },
    // 查看导入完成情况
    importRecord(id) {
      this.getNormalClassList(id);
      this.visible = true;
    },
    // 关闭弹窗
    cancel(e) {
      this.visible = false;
    },
    // 获取非校本课年级导入记录
    async getNormalList() {
      this.highSchoolTableLoading = true;
      const res = await this.$api.TimetableManage.getSchoolNormalList({
        ...this.fetchData
      });
      if (res.code === "200" || res.code === 200) {
        this.normalList = res.data;
        this.highSchoolTableLoading = false;
      } else {
        this.$message.warn(res.message);
        this.highSchoolTableLoading = false;
      }
    },
    // 获取非校本课班级导入记录
    async getNormalClassList(gradeId) {
      this.classLoading = true;
      const res = await this.$api.TimetableManage.getImportRecord({
        ...this.fetchData,
        gradeId
      });
      if (res.code === "200" || res.code === 200) {
        if (res.data) {
          this.activeList = res.data.adminstrative;
          this.walkList = res.data.walkClass;
          this.classLoading = false;
        }
      } else {
        this.$message.warn(res.message);
        this.classLoading = false;
      }
    },
    // 获取校本课导入记录
    async getSchoolBasedList() {
      this.baseTableLoading = true;
      const res = await this.$api.TimetableManage.getSchoolBasedList({
        ...this.fetchData
      });
      if (res.code === "200" || res.code === 200) {
        this.baseData = res.data.list;
        this.fetchData.current = res.data.pagination.current;
        this.fetchData.pageSize = res.data.pagination.pageSize;
        this.total = res.data.pagination.total;
        this.baseTableLoading = false;
      } else {
        this.$message.warn(res.message);
        this.baseTableLoading = false;
      }
    }
  }
};
</script>
 
<style scoped lang="less">
.ylc-class-modal {
  max-height: 536px;
  overflow-y: auto;
  .ylc-class-table {
    padding: 0 32px;
    padding-bottom: 30px;
    .ylc-unimport {
      width: 64px;
      height: 24px;
      line-height: 22px;
      border-radius: 4px;
      background: #ffecec;
      color: #fe7272;
      text-align: center;
      border: none;
    }
    .ylc-import {
      width: 64px;
      height: 24px;
      line-height: 22px;
      border-radius: 4px;
      background: #e2f9ed;
      color: #56bf8b;
      text-align: center;
      border: none;
    }
  }
  /deep/ .ant-tabs-nav-wrap {
    padding: 0 32px;
  }
  /deep/ .ant-table-row-cell-break-word {
    padding-left: 16px;
  }
  /deep/ .ant-table-thead {
    background: #f5f6f7;
    color: #797c80;
    height: 48px;
  }
  /deep/ .ant-table-thead > tr > th {
    height: 48px;
    padding: 10px 0;
    padding-left: 16px;
    background-color: #f5f6f7 !important;
  }
  /deep/ .ant-table-row {
    background: #fff !important;
  }
  /deep/ .ant-table .ant-table-tbody > tr > td {
    height: 48px;
  }
  /deep/ .ant-table .ant-table-row-cell-break-word {
    background-color: #fff;
  }
}
.timetable-manage {
  .iconfont {
    font-family: "iconfont";
    font-size: 16px;
    font-style: normal;
  }
  .select {
    padding-left: 24px;
    .ylc-manage-title {
      height: 56px;
      line-height: 56px;
      font-size: 18px;
    }
    .ylc-select-button {
      margin-left: 16px;
      background-color: #1bb280;
      color: #fff;
      font-size: 14px;
      .ylc-select-icon {
        width: 14px;
        height: 14px;
        margin-right: 6px;
      }
    }
  }
  .ylc-active-content {
    padding: 0 24px;
    margin-top: 10px;
    .ylc-active-title {
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      font-weight: bolder;
    }
  }
  .ylc-base-content {
    padding: 0 24px;
    .ylc-base-btn {
      color: #fff;
      background-color: #2abf8e;
    }
  }
  /deep/ .ant-table-row-cell-break-word {
    padding-left: 25px;
  }
  /deep/ .ant-table-thead > tr > th {
    border: none;
    color: #616366;
  }
  /deep/ .ant-table-tbody > tr > td {
    color: #303233;
    border-right: none;
    background-color: #fff;
  }
  /deep/ .ant-table-bordered table {
    border: none;
  }
  /deep/ .ant-table-placeholder {
    border: none;
    border-bottom: 1px solid #e8e8e8;
  }
  /deep/ .ant-tabs-nav-scroll {
    padding: 0 10px;
  }
  /deep/ .ant-tabs-nav {
    font-size: 16px;
  }
  /deep/ .ant-tabs-nav .ant-tabs-tab-active {
    padding-top: 16px;
    padding-bottom: 16px;
    color: #2abf8e;
  }
  /deep/ .ant-tabs-ink-bar {
    height: 3px;
    background-color: #2abf8e;
  }
  /deep/ .ant-tabs-bar {
    margin: 0;
  }
  /deep/.ant-tabs-nav .ant-tabs-tab {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    margin: 0 16px 0 20px;
    padding: 14px 2px;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    font-size: 16px;
  }
}
</style>