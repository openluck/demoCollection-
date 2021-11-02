<template>
  <div class="arranged-result-manage">
    <div class="arranged-result-manage-header">
      <div class="arranged-result-manage-header-top">
        <div>
          <span>机构：</span>
          <a-tree-select
            v-model="search.orgCode"
            style="width: 180px"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="orgTree"
            placeholder="请选择"
            tree-default-expand-all
            :replaceFields="replaceFieldsExam"
            @change="changeOrgCode"
          >
          </a-tree-select>
          <a-button type="primary" @click="queryList('1')">查询</a-button>
        </div>
        <div>
          <!-- <span>搜索：</span> -->
          <a-input
            allowClear
            v-model="search.keyword"
            style="width: 180px"
            placeholder="考生号/姓名/身份证号"
          ></a-input>
          <a-button type="primary" @click="queryList('2')">搜索</a-button>
        </div>
      </div>
      <div>
        <a-button type="primary" @click="exportButton">
          <svg-icon
            icon-class="daochu"
            :scale="0.85"
            style="margin-right: 5px"
          ></svg-icon>
          导出Excel</a-button
        >
      </div>
    </div>

    <div class="arr-result-manage-table">
      <a-table
        bordered
        :loading="tableLoading"
        :columns="columns"
        :data-source="data"
        :rowKey="(row) => row.id"
        :scroll="{ y: tableHeight }"
        :pagination="false"
        size="middle"
      >
        <span slot="gender" slot-scope="text">{{
          text === "1" ? "男" : text === "2" ? "女" : "-"
        }}</span>

        <div slot="handle" slot-scope="text, row" class="handle-button">
          <a-button @click="editButton(row)">编辑</a-button>
        </div>
      </a-table>
    </div>

    <template v-if="isMounted">
      <Page v-show="data.length" @getList="getList" ref="page" />
    </template>

    <a-modal
      v-model="editModalVisible"
      title=" 考生调整 "
      :maskClosable="false"
      wrapClassName="arranged-result-manage-modal"
      width="628px"
      :footer="null"
    >
      <div class="arranged-result-manage-modal-card">
        <div class="title">
          <p>考生基本信息</p>
        </div>
        <div class="content">
          <div class="content-left">
            <p>
              <span class="label-text">考生号：</span>{{ editData.examNum }}
            </p>
            <p>
              <span class="label-text">性别：</span
              >{{
                editData.gender === "1"
                  ? "男"
                  : editData.gender === "2"
                  ? "女"
                  : "-"
              }}
            </p>
            <p>
              <span class="label-text">医院名称：</span
              >{{ editData.hospitalName }}
            </p>
            <p>
              <span class="label-text">午别：</span
              >{{ editData.middayDistinction }}
            </p>
          </div>
          <div class="content-right">
            <p>
              <span class="label-text">考生姓名：</span>{{ editData.examName }}
            </p>
            <p>
              <span class="label-text">报名点名称：</span
              >{{ editData.assignsName }}
            </p>
            <p>
              <span class="label-text">体检日期：</span
              >{{ editData.physicalDate }}
            </p>
            <p><span class="label-text">组号：</span>{{ editData.groupNum }}</p>
          </div>
        </div>
      </div>
      <div class="arranged-result-manage-modal-card">
        <div class="title">
          <p>请选择需调整日期、午别和组号：</p>
        </div>
        <div class="content adjust-content">
          <div>
            <span>调整日期：</span>
            <a-select
              v-model="modifyData.physicalDate"
              style="width: 120px"
              placeholder="请选择"
              @change="changePhysicalDate"
            >
              <a-select-option
                v-for="item of dataGroupList"
                :key="item.date"
                :value="item.date"
              >
                {{ item.date }}
              </a-select-option>
            </a-select>
          </div>
          <div>
            <span>午别：</span>
            <a-select
              v-model="modifyData.middayDistinction"
              style="width: 120px"
              placeholder="请选择"
              @change="changeMiddayDistinction"
            >
              <a-select-option
                v-for="item of middayDistinctionList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <div>
            <span>分组序号：</span>
            <a-select
              v-model="modifyData.groupNum"
              style="width: 120px"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item of groupList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <div class="footer">
        <a-button type="primary" @click="comfirm">
          <svg-icon
            icon-class="queren"
            :scale="0.85"
            style="margin-right: 5px"
          ></svg-icon
          >确认</a-button
        >
        <a-button @click="cancle">
          <svg-icon
            icon-class="quxiao"
            :scale="0.7"
            style="margin-right: 5px"
          ></svg-icon
          >取消</a-button
        >
      </div>
    </a-modal>
  </div>
</template>
 
<script>
import { downloadFile } from "../../utils/util";
const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    width: 140,
    key: "examNum",
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    key: "examName",
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 50,
    key: "gender",
    scopedSlots: { customRender: "gender" },
  },
  {
    title: "身份证号",
    dataIndex: "IDNum",
    key: "IDNum",
    width: 140,
  },
  {
    title: "区县名称",
    dataIndex: "countyName",
    key: "countyName",
  },
  {
    title: "报名点名称",
    dataIndex: "assignsName",
    key: "assignsName",
  },
  {
    title: "体检医院名称",
    dataIndex: "hospitalName",
    // width: 120,
    key: "hospitalName",
  },
  {
    title: "体检日期",
    dataIndex: "physicalDate",
    key: "physicalDate",
  },
  {
    title: "午别",
    dataIndex: "middayDistinction",
    width: 60,
    key: "middayDistinction",
  },
  {
    title: "组号",
    width: 80,
    dataIndex: "groupNum",
    key: "groupNum",
  },
  {
    title: "组内序号",
    width: 80,
    dataIndex: "intraclassNum",
    key: "intraclassNum",
  },
  {
    title: "操作",
    width: 80,
    scopedSlots: { customRender: "handle" },
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      tableHeight: 0,
      logOrgCode: "",
      isMounted: false,
      columns,
      data: [],
      // orgTree: [],
      tableLoading: false,
      search: {
        orgCode: null,
        orgType: null,
        keyword: null,
        current: 1,
        pageSize: 20,
        type: "1",
      },
      stripTotal: 0, //查询列表总条数
      replaceFieldsExam: {
        children: "children",
        title: "orgName",
        key: "orgCode",
        value: "orgCode",
        type: "orgType",
      },
      editModalVisible: false, //弹框显隐
      dataGroupList: [], //弹框 - 选择器数据
      editData: {}, //编辑中的数据
      modifyData: {
        id: "",
        physicalDate: undefined,
        middayDistinction: undefined,
        groupNum: undefined,
      }, //修改后的数据
    };
  },
  computed: {
    orgTree() {
      const arr = sessionStorage.getItem("treeData");
      if (arr) {
        return JSON.parse(arr);
      }
      return [];
    },
    middayDistinctionList() {
      const { physicalDate } = this.modifyData;
      if (physicalDate) {
        const arr = this.dataGroupList.filter(
          (item) => item.date === physicalDate
        )[0].middayDistinctionList;
        return arr;
      }
      return [];
    },
    groupList() {
      const { middayDistinction } = this.modifyData;
      if (middayDistinction) {
        const arr = this.middayDistinctionList.filter(
          (item) => item.value === middayDistinction
        )[0].groupList;
        console.log(arr);
        return arr;
      }
      return [];
    },
  },
  async mounted() {
    this.logOrgCode = JSON.parse(sessionStorage.getItem("userInfo")).orgCode;
    this.search.orgCode = this.logOrgCode;
    this.search.orgType = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).orgTypeId;
    await this.getList();
    this.isMounted = true;
    this.$nextTick(() => {
      this.getTableHeight();
    });
  },
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(
        ".arr-result-manage-table"
      );
      this.tableHeight = tableHeight.clientHeight - 47;
    },
    changeOrgCode(a, b, c) {
      this.search.orgType = c.triggerNode.dataRef.orgType;
    },
    async queryList(type) {
      if (type === "1") {
        this.search.keyword = "";
      } else if (type === "2") {
        this.search.orgCode = this.logOrgCode;
      }
      this.search.type = type;
      this.$refs.page.pagination.current = 1;
      this.search.current = 1;
      await this.getList();
      this.$refs.page.returnPageTotal();
    },
    //编辑按钮点击事件
    editButton(row) {
      this.modifyData.id = row.id;
      this.modifyData.physicalDate = undefined;
      this.modifyData.middayDistinction = undefined;
      this.modifyData.groupNum = undefined;
      this.editData = { ...row };
      this.editModalVisible = true;
      this.getDateGroupList(row.examNum);
    },
    //导出按钮事件
    exportButton() {
      this.exportExcel();
    },

    //弹框事件
    //改变调整日期，清空后面的午别 和组号选择
    changePhysicalDate() {
      this.modifyData.middayDistinction = undefined;
      this.modifyData.groupNum = undefined;
    },
    //改变午别，清空后面的组号选择
    changeMiddayDistinction() {
      this.modifyData.groupNum = undefined;
    },
    //确认按钮点击事件
    comfirm() {
      const { id, physicalDate, middayDistinction, groupNum } = this.modifyData;
      if (id && physicalDate && middayDistinction && groupNum) {
        this.edit();
        this.editModalVisible = false;
      } else {
        this.$message.warning({
          content: "请选择需调整日期、午别和组号",
          key: "warn",
        });
      }
    },
    //取消按钮点击事件
    cancle() {
      this.editModalVisible = false;
    },

    //获取列表
    async getList() {
      try {
        this.tableLoading = true;
        const res = await this.$api.arrangeResultManage.getList({
          ...this.search,
        });
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

    // 编排结果管理- 获取体检日期 午别 分组 列表
    async getDateGroupList(examNum) {
      try {
        const res = await this.$api.arrangeResultManage.getDateGroupList({
          examNum,
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res.data);
          this.dataGroupList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
      }
    },

    // 编排结果管理- 编辑
    async edit() {
      try {
        const res = await this.$api.arrangeResultManage.edit(this.modifyData);
        if (res.code === "200" || res.code === 200) {
          this.$message.success("保存成功！");
          this.getList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
      }
    },

    // 编排结果管理-导出Excel
    async exportExcel() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        const res = await this.$api.arrangeResultManage.exportExcel(
          this.search
        );
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
 
<style lang = "less">
.arranged-result-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  .arranged-result-manage-header {
    & > div {
      margin-bottom: 15px;
    }
  }
  .arranged-result-manage-header-top {
    display: flex;
    justify-content: space-between;
    & > div {
      .ant-btn {
        margin-left: 15px;
      }
    }
  }

  .arr-result-manage-table {
    flex-grow: 1;
    overflow-y: auto;

    /* .ant-table td {
     white-space: nowrap;
    } */
  }
}

/* 弹窗样式 */
.arranged-result-manage-modal {
  .arranged-result-manage-modal-card {
    p {
      margin: 10px 0;
    }
    .title {
      /* padding-bottom: 10px; */
      font-weight: 700;
      border-bottom: 1px solid #ccc;
      & > p {
        border-left: 5px solid #000;
        padding-left: 10px;
      }
    }
    .content {
      display: flex;
      justify-content: space-between;
      & > div {
        width: 50%;
        /* text-align: center; */
      }
      .label-text {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }
    .adjust-content {
      margin-top: 15px;
      & > div {
        text-align: center;
      }
    }
  }
  .footer {
    margin-top: 50px;
    text-align: center;
    & > * {
      margin-right: 15px;
    }
  }
}
</style>