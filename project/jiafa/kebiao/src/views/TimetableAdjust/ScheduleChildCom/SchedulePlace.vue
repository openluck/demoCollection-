<template>
  <div class="SchedulePlace">
    <div class="SchedulePlaceT">
      <div class="conditionOrg">
        <!-- 学年 -->
        <div style="position: relative">
          <a-select
            v-model="search.schoolYearId"
            style="width: 180px"
            @change="changeSchoolYearList"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option
              v-for="item in schoolYearList"
              :key="item.schoolYearId"
              :value="item.schoolYearId"
            >
              {{ item.schoolYearName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="conditionOrg">
        <!-- 学期 -->
        <div style="position: relative">
          <a-select
            v-model="search.semesterId"
            style="width: 180px"
            :getPopupContainer="(v) => v.parentNode"
          >
            <a-select-option
              v-for="item in semesterList"
              :key="item.semesterId"
              :value="item.semesterId"
            >
              {{ item.semesterName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="conditionOrg">
        <!-- 场所 -->
        <div style="position: relative">
          <a-tree-select
            v-model="search.placeId"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="placeList"
            show-search
            :filterTreeNode="filterOption"
            :replace-fields="replaceFields"
            placeholder="请选择场所"
            :load-data="onLoadData"
            :getPopupContainer="(v) => v.parentNode"
            style="width: 180px"
          />
        </div>
      </div>
      <div class="conditionOrg" @click="searchBtn">
        <a-button type="primary">搜索</a-button>
      </div>
    </div>
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.changeId"
        :pagination="false"
        :scroll="{ y: tableHeight }"
      >
        <template #createBy="text">
          {{ text ? text : "--" }}
        </template>
      </a-table>
      <glo-pagination
        :total="gloTotal"
        @onChange="onPageChange"
        ref="gloPagination"
        @onSizeChange="sizeChange"
        @pressEnter="pressEnter"
      ></glo-pagination>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: "被调整场所",
    dataIndex: "changeObject",
    key: "changeObject",
    width: "10%",
    ellipsis: true,
  },
  {
    title: "内容",
    dataIndex: "content",
    key: "content",
    width: "55%",
    ellipsis: true,
  },
  {
    title: "影响周次",
    dataIndex: "effectiveRange",
    key: "effectiveRange",
    width: "10%",
    ellipsis: true,
  },
  {
    title: "操作时间",
    dataIndex: "timestamp",
    key: "timestamp",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "操作人",
    dataIndex: "createBy",
    key: "createBy",
    width: "10%",
    ellipsis: true,
    scopedSlots: { customRender: "createBy" },
  },
];
import GloPagination from "@/components/common/GloPagination";
export default {
  name: "SchedulePlace",
  components: { GloPagination },
  data() {
    return {
      columns,
      tableHeight: 0,
      dataList: [],
      search: {
        schoolYearId: null, //学年
        semesterId: null, //学期
        placeId: null, //场所id
        current: 1,
        pageSize: 10,
        changeType: "4",
      },
      schoolYearList: [], // 学年列表
      semesterList: [], // 学期列表
      placeList: [], // 场所列表
      replaceFields: {
        key: "buildingId",
        title: "buildingName",
        value: "buildingId",
      },
      gloTotal: 0,
    };
  },
  computed: {},
  mounted() {
    // this.$nextTick(() => {
    //   this.getTableHeight();
    // });
    this.init();
  },
  methods: {
    // 初始化下拉框数据
    async init() {
      // 获取学年
      this.schoolYearList = JSON.parse(
        sessionStorage.getItem("schoolYearList")
      );
      this.schoolYearList.map((item, indexYear) => {
        if (item.isCurrentSchoolYear) {
          this.search.schoolYearId =
            this.schoolYearList[indexYear].schoolYearId;
          // 获取学期
          this.semesterList = this.schoolYearList[indexYear].semesterList;
          this.semesterList.map((item, indexSemester) => {
            if (item.isCurrentSchoolSemester) {
              this.search.semesterId =
                this.semesterList[indexSemester].semesterId;
            }
          });
        }
      });

      // 获取场所树
      await this.getPlaceTree();
      this.search.placeId = this.placeList[0].buildingId;
      await this.getList();
    },
    // 通过学年获取学期
    getSemesterList(value) {
      this.schoolYearList.map((item) => {
        if (item.schoolYearId === value) {
          this.semesterList = item.semesterList;
        }
      });
      this.search.semesterId = this.semesterList[0].semesterId;
    },
    // 学年change事件
    changeSchoolYearList(value) {
      this.search.semesterId = "";
      this.getSemesterList(value);
    },
    // 场所树，到楼层
    async getPlaceTree() {
      let res = await this.$api.common.getPlaceTree();
      if (res.code === "200" || (res.code === 200 && res.result)) {
        this.placeList = [...this.getArrayObj([res.data])];
        let all = {
          buildingId: "",
          buildingName: "全部场所",
          isLeaf: true,
        };
        this.placeList.unshift(all);
      }
    },
    getArrayObj(data, id, children) {
      // debugger;
      for (var i in data) {
        if (data && id && children) {
          if (data[i].buildingId === id) {
            data[i].children = children;
          } else {
            this.getArrayObj(data[i].children, id, children);
          }
        } else {
          if (!data[i].isLeaf) {
            data[i].disabled = true;
            this.getArrayObj(data[i].children);
          }
        }
      }
      return data;
    },
    // 如果楼层下有教室
    async onLoadData(treeNode) {
      let item = treeNode.dataRef;
      if (item.buildingType === "3" || item.buildingType === 3) {
        const children = await this.getClassroom(item.buildingId);
        //  debugger;
        let temPlaceList = this.getArrayObj(
          this.placeList,
          item.buildingId,
          children
        );
        this.placeList = [...temPlaceList];
      } else {
        return;
      }
    },
    // 根据楼层获取房间
    async getClassroom(value) {
      const data = { buildingId: value };
      const res = await this.$api.common.getClassroom(data);
      if (res.code === "200" || (res.code === 200 && res.result)) {
        return res.data.map((i) => ({
          ...i,
          buildingId: i.classroomId,
          isLeaf: true,
          value: i.classroomId,
          buildingName: i.classroomName,
        }));
      } else {
        return [];
      }
    },
    // 判断下拉框有无值 空字符串''为全部
    judgeHasValue() {
      if (this.search.schoolYearId === null) {
        this.$message.warning("请选择学年");
        return false;
      }
      if (this.search.semesterId === null) {
        this.$message.warning("请选择学期");
        return false;
      }
      if (this.search.placeId === null) {
        this.$message.warning("请选择场所");
        return false;
      }
      return true;
    },
    // 获取表格数据
    async getList() {
      let pd = this.judgeHasValue();
      if (pd) {
        this.tableLoading = true;
        try {
          const res = await this.$api.common.getRecordList({
            ...this.search,
          });
          if (res.code === "200") {
            this.dataList = res.data.list;
            this.gloTotal = res.data.pagination.total;
          } else {
            this.$message.warning(res.message);
          }
        } catch (error) {
          this.$message.error("请求失败！" + error);
        } finally {
          this.tableLoading = false;
        }
      }
    },

    // 查询
    searchBtn() {
      this.onPageChange(1);
      this.$refs.gloPagination.initCurrent();
      // this.getClassHourStatisticList();
    },
    // 表格页面改变事件
    onPageChange(current) {
      this.search.current = current;
      this.$refs.gloPagination.clearJumperValue();
      this.getList();
    },
    // 改变每页数量时更新显示
    sizeChange(current, size) {
      this.search.current = current;
      this.search.pageSize = size;
      this.getList();
    },
    // 快速切换页面
    pressEnter(outCurrent) {
      this.search.current = outCurrent;
      this.getList();
    },
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list");
      this.tableHeight = tableHeight.clientHeight - 55 - 50;
    },
    filterOption(input, treeNode) {
      return (
        treeNode.componentOptions.propsData.title
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>

<style scoped lang="less">
.SchedulePlace {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 16px 16px 24px;
  box-sizing: border-box;
  .SchedulePlaceT {
    width: 100%;
    height: 34px;
    display: flex;
    margin-bottom: 20px;
    .conditionOrg {
      height: 100%;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
    .conditionOrgr {
      display: flex;
      align-items: center;
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
  .list {
    flex-grow: 1;
    overflow-y: auto;
  }
  /deep/ .ant-table-row-cell-break-word {
    padding-left: 25px;
  }
  /deep/ .ant-table .ant-table-row-cell-break-word {
    background-color: inherit;
  }
  /deep/ .ant-table-thead {
    background-color: #fafbfc;
  }
}
</style>
