<template>
  <div class="ConclusionResetAudit">
    <div class="ConclusionResetAuditT">
      <div class="conditionOrg">
        <div >机构 ：</div>
        <div>
          <a-tree-select
              v-model="search.orgCode"
              style="width: 180px;"
              allowClear
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择"
              :tree-default-expand-all="false"
              :replaceFields="treeReplaceFields"
              :treeDefaultExpandedKeys="[search.orgCode]"
              @select="onSelect"
              @blur="orgBlur"
            >
            </a-tree-select>
        </div>
      </div>
      <div class="conditionOrg">
        <div >审核状态 ：</div>
        <div>
          <a-select v-model="search.checkSta" style="width: 120px">
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option value="0"> 待审核 </a-select-option>
            <a-select-option value="1"> 通过 </a-select-option>
            <a-select-option value="2"> 不通过 </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="searchBtn">
        <a-button type="primary" @click="searchList('1')"> 查 询 </a-button>
      </div>
      <div class="conditionOrgr">
        <div class="conditionOrg">
          <div>
            <a-input v-model="search.keyword" placeholder="考生号/姓名/身份证号" allow-clear style="width: 180px" />
          </div>
        </div>
        <div class="searchBtn">
          <a-button type="primary" @click="searchList('2')"> 搜 索 </a-button>
        </div>
      </div>
    </div>
    <div class="ConclusionResetAuditB">
      <div class="export"><a-button @click="getExport" type="primary"> <svg-icon icon-class="daochu" :scale="0.8" style="margin-right:5px;" />导出Excel </a-button></div>
    </div>

    <div class="list">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="(row) => row.id"
        bordered
        :pagination="false"
        :scroll="{ x: 2350, y: tableHeight }"
        :loading="tableLoading"
      >
        <span slot="checkSta" slot-scope="text">
          <p v-if="text === '0'">待审核</p>
          <p v-if="text === '1'">通过</p>
          <p v-if="text === '2'">不通过</p>
        </span>
        <span slot="action"  slot-scope="scope,text">
          <a-button @click="vision('1',text)" v-if="text.checkSta === '0'" >审核</a-button>
          <a-button  @click="vision('2',text)" v-else >详情</a-button>
        </span>
        
      </a-table>
    </div>
    <template v-if="isMounted">
      <Page v-show="dataList.length"  ref="page" />
    </template>
    <a-modal
      v-model="visibleLiver"
      wrapClassName="ChestLiver"
      :title="modalTitle"
      :footer="null"
      width="700px"
    >
      <div class="modalTitle">学生基本信息</div>
      <div class="studentInfo">
        <div class="infoItem" style="width: 100%">考生号：{{studentItem.examNum}}</div>
        <div class="infoItem" style="width: 50%">考生姓名：{{studentItem.examName}}</div>
        <div class="infoItem" style="width: 50%">性别：{{studentItem.sex}}</div>
        <div class="infoItem" style="width: 50%">区县名称：{{studentItem.countyName}}</div>
        <div class="infoItem" style="width: 50%">体检医院：{{studentItem.hospitalName}}</div>
        <div class="infoItem" style="width: 50%">报名点名称: {{studentItem.assignsName}}</div>
        <div class="infoItem" style="width: 50%">班级：{{studentItem.class}}</div>
      </div>
      <div class="modalTitle">结论重置信息</div>
      <div class="LiverForm">
        <div class="LiverFormItem">
          <div style="margin-right: 20px;width: 80px">重置原因 :</div>
          <a-textarea style="width: 500px"  :disabled="isdisadle" v-model="studentItem.applyReason" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </div>
        <div class="LiverFormItem">
          <div style="margin-right:20px;width: 80px">审核意见 :</div>
          <a-radio-group @change="radioChange" :disabled="isdisadle" v-model="studentItem.checkSta">
            <a-radio value="1">
              通过
            </a-radio>
            <a-radio value="2">
              不通过
            </a-radio>
          </a-radio-group>
        </div>
        <div class="LiverFormItem" v-show="studentItem.checkSta === '2' ? true: false">
          <div style="margin-right: 20px;width: 80px">不通过原因 :</div>
          <a-textarea style="width: 500px"  :disabled="isdisadle" v-model="studentItem.noPassReason" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </div>
      </div>
      <div style="display: flex; align-items: center; justify-content: center">
        <a-button v-show="isShowStudent.checkSta === '0'" style="margin-right: 10px" type="primary" @click="visionCommit">
          确认
        </a-button>
        <a-button v-show="isShowStudent.checkSta === '0'" style="margin-left: 10px" @click="closeVisible">
          取消
        </a-button>
        <a-button v-show="isShowStudent.checkSta != '0'" style="margin-left: 10px" @click="closeVisible">
          关闭
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    key: "examNum",
    width: 200,
    align: "center",
    fixed: "left",
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    key: "examName",
    width: 150,
    align: "center",
    fixed: "left",
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    width: 100,
    align: "center",
  },
  {
    title: "身份证号",
    dataIndex: "idnum",
    key: "idnum",
    width: 200,
    align: "center",
  },
  {
    title: "区县名称",
    dataIndex: "countyName",
    key: "countyName",
    width: 200,
    align: "center",
  },
  {
    title: "报名点名称",
    dataIndex: "assignsName",
    key: "assignsName",
    width: 300,
    align: "center",
  },
  {
    title: "体检医院名称",
    dataIndex: "hospitalName",
    key: "hospitalName",
    width: 300,
    align: "center",
  },
  {
    title: "申请原因",
    dataIndex: "applyReason",
    key: "applyReason",
    width: 150,
    align: "center",
  },
  {
    title: "申请人",
    dataIndex: "proposer",
    key: "proposer",
    width: 100,
    align: "center",
  },

  {
    title: "申请时间",
    dataIndex: "applyTime",
    key: "applyTime",
    width: 200,
    align: "center",
  },
  {
    title: "审核状态",
    dataIndex: "checkSta",
    key: "checkSta",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "checkSta" },
  },
  {
    title: "审核时间",
    dataIndex: "checkTime",
    key: "checkTime",
    width: 200,
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "examNum",
    key: "operation",
    fixed: "right",
    width: 150,
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  name: "",
  components: {},
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件 1
      columns,
      tableHeight: 0, //table高度
      tableLoading: false,
      value: '',
      visibleLiver: false,
      modalTitle: "结论重置审核",
      isdisadle: false,
      treeData: [],
      dataList: [],
      studentItem: {},
      isShowStudent: {},
      treeReplaceFields: {
        children: 'children', 
        title: 'orgName', 
        key: 'orgCode', 
        value: 'orgCode',
        type: 'orgType',
      },
      stripTotal: null, //查询列表总条数
      search: {
        checkSta: "", //审核状态(''全部，0待审核，1通过，2不通过)
        orgCode: "", //机构代码
        keyword: "", //输入框内容
        current: 1, //当前页
        pageSize: 20, //每页条数
        type: "1", //查询或搜索
        orgType: ""
      }
    };
  },
  computed: {},
  created() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.search.orgCode = userInfo.orgCode
    this.search.orgType = userInfo.orgTypeId
  },
  mounted() {
    this.treeData = JSON.parse(sessionStorage.getItem('treeData'))
    this.getList()
    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  methods: {
    moment,
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 55 - 21 - 20;
    },
    onSelect(selectedKeys, e) {
      //  console.log(e.$vnode.data.props.orgType);
      this.search.orgType = String(e.$vnode.data.props.orgType)
      // console.log(this.search.orgType);
    },
    orgBlur() {
      // console.log(this.search.orgCode);
      if (!this.search.orgCode) {
        this.search.orgType = ''
      }
    },
    radioChange() {
      if (this.studentItem.checkSta === '1') {
        this.studentItem.noPassReason = ''
      }
    },
    vision(type, item) {
      this.studentItem = {}
      this.isShowStudent = {}
      this.studentItem = JSON.parse(JSON.stringify(item)) 
      this.isShowStudent = JSON.parse(JSON.stringify(item)) 
      if (type === '1') {
        this.isdisadle = false
        this.modalTitle = '结论重置审核'
      } else {
         this.isdisadle = true
          this.modalTitle = '结论重置详情'
      }
      this.visibleLiver = true;
    },
    visionCommit() {
      const data = {
        applyReason: this.studentItem.applyReason,
        checkSta: this.studentItem.checkSta,
        checkTime: moment().format("YYYY-MM-DD hh:mm:ss"),
        noPassReason: this.studentItem.noPassReason,
        id: this.studentItem.id,
      }
      // console.log(data);
      this.save(data)
    },
    closeVisible() {
      this.visibleLiver = false;
    },
    // 获取列表
    async getList() {
       this.tableLoading = true;
      try {
        const res = await this.$api.conclusionResetAudit.getList({
          ...this.search,
        });
        if (res.code === "200" || res.code === 200) {
          // console.log(res);
          this.dataList = res.data.list
          this.stripTotal = res.data.pagination.total
          this.isMounted = true
        }
      } catch (error) {
        // console.log(error);
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },
    async save(data) {
      try {
        const res = await this.$api.conclusionResetAudit.save(data);
        if (res.code === 200) {
          this.$message.success('操作成功！')
          this.getList()
          this.visibleLiver = false
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        // console.log(error);
        this.$message.error("请求失败！" + error);
      } 
    },
    // 查询或搜索列表内容
    async searchList(type) {
      // console.log(type)
      this.search.type = type
      this.$refs.page.pagination.current = 1
      this.search.current = 1;

      if (type === "1") {
        this.search.keyword = ""
      } else if (type === "2") {
        this.search.orgCode = ''
        this.search.checkSta = ''
      }
      await this.getList()
      this.$refs.page.returnPageTotal()
    },
    async getExport() {
       this.$store.state.app.exportSpinLoading = true;
      const data = {
        orgCode: this.search.orgCode,
        checkSta: this.search.checkSta,
        keyword: this.search.keyword,
        orgType: this.search.orgType,
        type: this.search.type,
      }
      try {
        const res = await this.$api.conclusionResetAudit.exportExcel(data);
        if (res) {
        let BLOB = new Blob([res], {
          type: "application/vnd.ms-excel",
        });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(BLOB);
        link.download = "结论重置审核.xls";
        link.click();
        //释放内存
        window.URL.revokeObjectURL(link.href);
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
.ConclusionResetAudit {
  height: 100%;
  display: flex;
  flex-direction: column;
  .ConclusionResetAuditT {
    width: 100%;
    height: 34px;
    margin-bottom: 10px;
    display: flex;
    .conditionOrg {
      height: 100%;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
    .searchBtn {
      height: 100%;
      // width: 100px;
      display: flex;
      align-items: center;
    }
    .conditionOrgr {
      display: flex;
      height: 100%;
      width: 100px;
      display: flex;
      align-items: center;
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
  .ConclusionResetAuditB {
    height: 32px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .toDay {
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .item {
        // width: 20%;
        font-size: 14px;
        margin-left: 40px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .num {
          font-weight: 600;
          color: #797c80;
        }
      }
    }
  }
  .list{
    flex-grow: 1;
    overflow-y: auto;
  }
}
//新增对话框
.ChestLiver {
  // padding: 0 20px;
  .ant-modal-header {
    display: flex;
    justify-content: flex-start;
  }
  .modalTitle {
    font-size: 16px;
    margin-bottom: 5px;
    color: #565e66;
    font-weight: 600;
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #e6ecf2;
  }
  .studentInfo {
    margin: 15px 20px;
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    width: 100%;
    .infoItem {
      height: 40px;
      display: flex;
      align-items: center;
    }
  }
  .LiverForm {
    width: 100%;
    margin: 15px 20px;
    .LiverFormItem {
      width: 100%;
      margin: 15px 0;
      // height: 30px;
      display: flex;
      align-items: center;
    }
  }
  .modalDoctor {
    margin: 20px 0 30px 20px;
    width: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
