<template>
  <div class="signDoctor">
    <div class="doctor">
      <a-button class="doctorBtn" type="primary" @click="addDoctor"
        ><svg-icon icon-class="shezhi" :scale="0.8" style="margin-right: 5px"></svg-icon>
        签名医生设置
      </a-button>
      <a-button type="primary" @click="getExport"
        ><svg-icon icon-class="daochu" :scale="0.8" style="margin-right: 5px"></svg-icon>
        导出Excel
      </a-button>
    </div>
    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.id"
        bordered
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: tableHeight }"
      >
        <span slot="operation" slot-scope="text, record" class="handle-button">
          <a-popconfirm
            title="请确认是否删除？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="showDeleteConfirm(record)"
          >
            <a-button> 删除 </a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <template v-if="isMounted">
      <Page v-show="dataList.length" @getList="getList" ref="page" />
    </template>
    <a-modal
      v-model="visibleDoctor"
      wrapClassName="signModal"
      title="签名医生设置"
      :footer="null"
      :destroyOnClose="true"
      width="700px"
      @cancel="closeVisible1"
    >
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="科室">
          <a-select
            v-model="form.subjectId"
            @change="deskChange"
            placeholder="请先选择科室"
          >
            <a-select-option
              v-for="(item, index) in getDepartmentsList"
              :key="index"
              :value="item.deskId"
            >
              {{ item.deskName }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="科室签字医生">
          <a-select
            v-model="form.conclusionId"
            @change="deskChanget"
            placeholder="请选择科室签字医生"
          >
            <a-select-option
              v-for="(item, index) in getDoctorList"
              :key="index"
              :value="item.id"
            >
              {{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="科室操作医生">
          <a-checkbox-group v-model="form.operationName">
            <a-checkbox
              v-for="(item, index) in getoperationList"
              :key="index"
              :value="item.id"
            >
              {{ item.name }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
      <div style="display: flex; align-items: center; justify-content: center">
        <a-button style="margin-right: 10px" type="primary" @click="closeVisible">
          确认
        </a-button>
        <a-button style="margin-left: 10px" @click="closeVisible1"> 取消 </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { downloadFile } from "@/utils/util.js";
const columns = [
  {
    title: "体检卡科室",
    dataIndex: "subjectName",
    key: "subjectName",
    align: "center",
    width: "15%",
  },
  {
    title: "签名医师",
    dataIndex: "conclusionName",
    key: "conclusionName",
    align: "center",
    width: "15%",
  },
  {
    title: "操作医师",
    dataIndex: "operationName",
    key: "operationName",
    width: "55%",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: "15%",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  name: "",
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      columns,
      dataList: [], // 查询列表数据
      visibleDoctor: false, //签名医生设置弹框
      getDepartmentsList: [], //科室数组
      getDoctorList: [], //签名医生数组
      getoperationList: [], //操作医生数组
      tableLoading: false,
      tableHeight: 0, //table高度
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        subjectName: undefined,
        conclusionName: undefined,
        subjectId: undefined,
        conclusionId: undefined,
        operationName: [],
      },
      search: {
        current: 1, //当前页
        pageSize: 20, //每页条数
      },
      stripTotal: null,
    };
  },

  mounted() {
    this.getList();
    this.$nextTick(() => {
      this.getTableHeight();
    });
  },
  created() {},
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list");
      this.tableHeight = tableHeight.clientHeight - 55 - 21 - 20;
    },

    addDoctor() {
      this.visibleDoctor = true;
      this.getDepartments();
    },
    closeVisible() {
      if (!this.form.subjectId) {
        this.$message.error("请选择科室~");
      } else if (!this.form.conclusionId) {
        this.$message.error("请选择科室签字医生~");
      } else if (!this.form.operationName.length) {
        this.$message.error("请选择科室操作医生~");
      } else {
        this.save(this.form);
        this.visibleDoctor = false;
        this.getDoctorList = []; //签名医生数组
        this.getoperationList = []; //操作医生数组
        this.form = {
          subjectName: undefined,
          conclusionName: undefined,
          subjectId: undefined,
          conclusionId: undefined,
          operationName: [],
        };
      }
    },
    closeVisible1() {
      this.visibleDoctor = false;
      this.form = {
        subjectName: undefined,
        conclusionName: undefined,
        subjectId: undefined,
        conclusionId: undefined,
        operationName: [],
      };
      this.getDoctorList = []; //签名医生数组
      this.getoperationList = []; //操作医生数组
    },
    showDeleteConfirm(item) {
      const temp = {
        id: item.id,
      };
      this.delateItem(temp);
    },
    deskChange(value, e) {
      this.form.conclusionId = "";
      this.form.operationName = [];
      this.form.subjectName = e.componentOptions.children[0].text;
      this.getDoctor(value);
    },
    deskChanget(value, e) {
      this.form.conclusionName = e.componentOptions.children[0].text;
    },
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.SignDoctorManage.getList({
          ...this.search,
        });
        if (res.code === 200) {
          this.dataList = res.data.list;
          this.stripTotal = res.data.pagination.total;
          this.isMounted = true;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },
    async delateItem(data) {
      try {
        const res = await this.$api.SignDoctorManage.deletedoctor(data);
        if (res.code === 200) {
          this.getList();
          this.$message.success("删除成功！");
        } else {
          this.$message.error("删除失败！");
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async getDepartments() {
      const data = {};
      try {
        const res = await this.$api.SignDoctorManage.getDepartments(data);
        if (res.code === 200 || res.code === '200') {
          this.getDepartmentsList = res.data.list;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async getDoctor(value) {
      const data = {
        subjectId: value,
      };
      try {
        const res = await this.$api.SignDoctorManage.getDoctor(data);
        if (res.code === 200) {
          this.getDoctorList = [];
          this.getoperationList = [];
          this.getDoctorList = res.data.conclusionName;
          this.getoperationList = res.data.operationName;
        } else {
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async save(data) {
      try {
        const res = await this.$api.SignDoctorManage.save(data);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async getExport() {
       this.$store.state.app.exportSpinLoading = true;
      const data = {};
      try {
        const res = await this.$api.SignDoctorManage.exportDoctor(data);
        if (res) {
          downloadFile(res);
        } else {
        }
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
.signDoctor {
  height: 100%;
  display: flex;
  flex-direction: column;
  .doctor {
    width: 100%;
    height: 34px;
    margin-bottom: 20px;
    .doctorBtn {
      margin-right: 20px;
    }
  }
  .list {
    flex-grow: 1;
    overflow-y: auto;
  }
}
//新增对话框
.signModal {
  .ant-modal-header {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
