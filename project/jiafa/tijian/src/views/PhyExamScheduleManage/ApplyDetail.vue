<template>
  <div class="cro-area-stu">
    <a-button @click="goBack" style="margin-bottom: 15px; width: 82px">
      <svg-icon
        icon-class="fanhui"
        :scale="0.8"
        style="margin-right: 5px"
      ></svg-icon>
      返回</a-button
    >
    <div class="cro-area-stu-header">
      <div class="cro-area-stu-header-left">
        考籍所在地：
        <a-tree-select
          v-model="search.examMembershipLocation"
          style="width: 180px"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="examMemLocationTree"
          placeholder="请选择"
          :replaceFields="replaceFieldsExam"
        >
        </a-tree-select>
        体检所在地：
        <a-tree-select
          v-model="search.phyExamLocation"
          style="width: 180px"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="phyExamLocationTree"
          placeholder="请选择"
          :replaceFields="replaceFieldsPhy"
        >
        </a-tree-select>
        <a-button type="primary" @click="queryList('1')">查询</a-button>
      </div>
      <div class="cro-area-stu-header-right">
        <a-input
          allowClear
          v-model="search.keyword"
          style="width: 180px"
          placeholder="考生号/姓名/身份证号"
        ></a-input>
        <a-button type="primary" @click="queryList('2')">搜索</a-button>
      </div>
    </div>
    <div class="cro-area-stu-header">
      <!-- <a-button type="primary" @click="openModal">导入</a-button> -->
      <a-button type="primary" @click="exportExcel">
        <svg-icon
          icon-class="daochu"
          :scale="0.85"
          style="margin-right: 5px"
        ></svg-icon>
        导出Excel</a-button
      >
    </div>
    <div class="cro-area-stu-table">
      <a-table
        bordered
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        :rowKey="(row) => row.examineeId"
        :scroll="{ x: 100, y: tableHeight }"
        :pagination="false"
        size="middle"
      >
      </a-table>
    </div>
    <template v-if="isMounted">
      <Page v-show="data.length" @getList="getList" ref="page" />
    </template>
  </div>
</template>

<script>
import { downloadFile } from "../../utils/util";

function filterArray(data, parentCode) {
  var tree = [];
  var temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].parentCode === parentCode) {
      var obj = data[i];
      temp = filterArray(data, data[i].orgcode);
      if (temp.length > 0) {
        obj.children = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}

const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    key: "examNum",
    width: 150,
    fixed: "left",
  },
  // {
  //   title: "调整日期",
  //   dataIndex: "adjustDate",
  //   key: "adjustDate",
  // fixed: "left"
  // },
  {
    title: "考生姓名",
    dataIndex: "examName",
    key: "examName",
    width: 100,
    fixed: "left",
  },
  {
    title: "性别",
    dataIndex: "examGender",
    width: 100,
    key: "examGender",
  },
  {
    title: "身份证号",
    dataIndex: "IDNum",
    width: 200,
    key: "IDNum",
  },
  {
    title: "考籍地市名称",
    dataIndex: "cityName",
    width: 200,
    key: "cityName",
  },
  {
    title: "考籍区县名称",
    dataIndex: "countyName",
    width: 200,
    key: "countyName",
  },
  {
    title: "考籍报名点名称",
    dataIndex: "assignsName",
    width: 200,
    key: "assignsName",
  },
  {
    title: "考籍班级代码",
    dataIndex: "classCode",
    width: 150,
    key: "classCode",
  },
  {
    title: "体检地市名称",
    dataIndex: "phyExamCityName",
    width: 200,
    key: "phyExamCityName",
  },
  {
    title: "体检区县名称",
    dataIndex: "phyExamCountyName",
    width: 200,
    key: "phyExamCountyName",
  },
  {
    title: "体检报名点名称",
    dataIndex: "phyExamAssignsName",
    width: 200,
    key: "phyExamAssignsName",
  },
  {
    title: "体检班级代码",
    dataIndex: "phyExamClassCode",
    key: "phyExamClassCode",
    width: 150,
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      tableHeight: 0, //table高度
      isMounted: false,
      tableLoading: false,
      stripTotal: null, //查询列表总条数
      examMemLocationTree: [],
      phyExamLocationTree: [],
      columns,
      data: [],
      importModalVisible: false, //导入弹框显隐
      fileList: [], //已经上传的文件列表
      search: {
        current: 1,
        pageSize: 20,
        examMembershipLocation: null,
        phyExamLocation: null,
        keyword: "",
        type: "1",
        applyId: "",
      },
      parentCode: JSON.parse(sessionStorage.getItem("userInfo")).orgCode,
      replaceFieldsExam: {
        children: "children",
        title: "examMemLocalName",
        key: "examMemLocalCode",
        value: "examMemLocalCode",
      },
      replaceFieldsPhy: {
        children: "children",
        title: "phyExamLocalName",
        key: "phyExamLocalCode",
        value: "phyExamLocalCode",
      },
    };
  },
  computed: {},
  async mounted() {
    this.search.applyId = this.$route.query.applyId;
    // this.search.phyExamLocation = this.$route.query.phyExamLocation;
    this.getExamMemLocationTree();
    this.getPhyExamLocationTree();
    await this.getList();
    this.isMounted = true;
    this.$nextTick(() => {
      this.getTableHeight();
    });
    this.bus.$emit(
      "changeSelectedKey",
      "/phyExamScheduleManage/croAreaDistributStu"
    );
  },
  methods: {
    filterArray,
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".cro-area-stu-table");
      this.tableHeight = tableHeight.clientHeight - 47;
    },
    goBack() {
      this.$router.push("/phyExamScheduleManage/croAreaDistributStu");
    },
    //根据所在地查询考生
    async queryList(type) {
      if (type === "1") {
        this.search.keyword = "";
      } else if (type === "2") {
        this.search.examMembershipLocation = null;
        this.search.phyExamLocation = null;
      }
      this.search.type = type;
      this.$refs.page.pagination.current = 1;
      this.search.current = 1;
      await this.getList();
      this.$refs.page.returnPageTotal();
    },

    //点击导入按钮
    openModal() {
      this.importModalVisible = true;
    },
    //导入对话框里面的事件
    beforeUpload(file, fileList) {
      this.fileList = fileList;
      return false;
    },
    //删除文件
    removeFile(file) {
      // console.log("removeFile", file);
      this.fileList = [];
    },
    //获取考生列表请求
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.applyDetail.getList({
          ...this.search,
        });
        // console.log("getList res", res);
        if (res.code === "200" || res.code === 200) {
          this.data = res.data.list;
          this.stripTotal = res.data.pagination.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    //考生跨地区分配-获取考籍所在地 树
    async getExamMemLocationTree() {
      try {
        const res = await this.$api.applyDetail.examMemLocationTree({
          applyId: this.search.applyId,
        });
        if (res.code === "200" || res.code === 200) {
          if (res.data.length) {
            const tempArr = res.data.map((item) => ({
              ...item,
              orgcode: item.examMemLocalCode,
            }));
            // console.log("tempArr1", tempArr);
            this.examMemLocationTree = this.filterArray(
              tempArr,
              tempArr[0].parentCode
            );
          }
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },

    //考生跨地区分配-获取体检所在地 树
    async getPhyExamLocationTree() {
      try {
        const res = await this.$api.applyDetail.phyExamLocationTree({
          applyId: this.search.applyId,
        });
        if (res.code === "200" || res.code === 200) {
          if (res.data.length) {
            const tempArr = res.data.map((item) => ({
              ...item,
              orgcode: item.phyExamLocalCode,
            }));
            // console.log("tempArr2", tempArr);
            this.phyExamLocationTree = this.filterArray(
              tempArr,
              tempArr[0].parentCode
            );
          }
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },

    // 考生跨地区分配-导出Excel
    async exportExcel() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        const res = await this.$api.applyDetail.exportExcel({
          ...this.search,
        });
        downloadFile(res);
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.$store.state.app.exportSpinLoading = false;
      }
    },
  },
};
</script>

<style lang="less">
.cro-area-stu {
  height: 100%;
  display: flex;
  flex-direction: column;
  .cro-area-stu-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .cro-area-stu-header-left,
    .cro-area-stu-header-right {
      & > * {
        margin-right: 15px;
      }
    }
  }

  .cro-area-stu-table {
    flex-grow: 1;
    overflow-y: auto;
  }

  // .ant-table td {
  //   white-space: nowrap;
  // }
}
</style>
