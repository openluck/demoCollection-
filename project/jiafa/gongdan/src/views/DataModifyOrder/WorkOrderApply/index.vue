<template>
  <div class="wk-apply">
    <header>
      <!-- <div class="notice">提示！在{{notice.startTime}} 到{{notice.endTime}} 之间可发起考生数据修改工单！</div> -->
      <a-alert v-if="noticeTime.startTime" :message="notice" banner closable />
      <a-skeleton v-else :paragraph="{ rows: 1 }" />
    </header>
    <main>
      <div class="head">
        <!-- 工单筛选区 -->
        <div class="head-l">
          <label for="audit-status">审批状态：</label>
          <a-select id="audit-status" v-model="fetchData.auditStatus" style="width: 200px">
            <a-select-option
              :value="item.code"
              v-for="(item, index) of auditStatusCodeTable"
              :key="index"
              >{{ item.value }}</a-select-option
            >
          </a-select>
          <div class="examinee-name" style="margin-left:20px">
            <label for="">考生姓名：</label>
            <a-input v-model="fetchData.exName" allowClear @change="inputChange" placeholder="请输入考生姓名" style="width: 200px"/>
            <a-tooltip>
              <template slot="title">根据审批状态或考生姓名查找数据</template>
              <a-button type="primary" class="search" @click="search">
                <svg-icon
                  icon-class="sousuo"
                  :scale="0.8"
                  style="margin-right: 5px"
                />
                查询
              </a-button>
          </a-tooltip>
          </div>
        </div>
        <!-- 添加工单按钮区 -->
        <div class="head-r">
          <a-tooltip>
            <template slot="title">{{createWkAtTime ? "添加一个新的工单" : `仅能在${timestampToTime(Number(noticeTime.startTime))}至${timestampToTime(Number(noticeTime.endTime))}之间可添加考生数据修改工单！` }}</template>
            <a-button :disabled="!createWkAtTime"  type="primary" :class="createWkAtTime ? 'blue' : '' " class="search" @click="createWk">
              <svg-icon
                icon-class="发起"
                :scale="0.8"
                style="margin-right: 5px"
              />
              添加
            </a-button>
          </a-tooltip>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="data"
          :loading="tableLoading"
          :pagination="pagination"
          size="middle"
          bordered
          :rowKey="(row) => row.id"
          :rowClassName="
            (record, index) => {
              return (index % 2 === 1 ? 'even-row' : '') + ' every-row'
            }
          "
        >
          <!-- 考生数 -->
          <span slot="amount" slot-scope="text">{{ text || '0' }}</span>
          <!-- 考生姓名 -->
          <span slot="name" slot-scope="text">
            <a-tooltip placement="topLeft">
              <template slot="title">{{ text }}</template>
              <span>{{ text || '--' }}</span>
            </a-tooltip>
          </span>
          <!-- 本机材料 -->
          <span slot="fileName" slot-scope="text, record">
            <span v-if="!text">--</span>
            <a-tooltip v-else placement="topLeft">
              <template slot="title">{{ text }}</template>
              <a @click="checkPDF(record)">{{ text }}</a>
            </a-tooltip>
          </span>
          <!-- 经办人 -->
          <span slot="personName" slot-scope="text, record">
            <span v-if="!text">--</span>
            <a-tooltip v-else placement="topLeft">
              <template slot="title">{{ text }}</template>
              <a @click="checkApplyPerson(record)">{{ text }}</a>
            </a-tooltip>
          </span>
          <!-- 提交时间 -->
          <span slot="submitTime" slot-scope="text">{{ text || '--' }}</span>
          <!-- 审核状态 -->
          <span slot="auditStatus" slot-scope="text">
            <a-tag :color="auditStatusToClassName(text)">
              {{ changeCodeTable(text) || '--' }}
            </a-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <!-- 已提交并处于审核中的工单只能查看；退回和未提交的工单可以编辑、删除和提交 -->
            <a-button
              v-if="!auditStatusToShowButtonType(record.auditStatus)"
              size="small"
              @click="wkEditAndDetail(record, 'look')"
              >查看</a-button
            >
            <a-tooltip v-if="auditStatusToShowButtonType(record.auditStatus)">
              <template slot="title">编辑该工单</template>
              <a-button size="small" @click="wkEditAndDetail(record, 'edit')"
                >编辑</a-button
              >
            </a-tooltip>
            <a-divider
              v-if="auditStatusToShowButtonType(record.auditStatus)"
              type="vertical"
            />
            <a-tooltip v-if="auditStatusToShowButtonType(record.auditStatus)">
              <template slot="title">提交该工单</template>
              <a-button size="small" @click="submit(record, 'wkList')"
                >提交</a-button
              >
            </a-tooltip>
            <a-divider
              v-if="auditStatusToShowButtonType(record.auditStatus)"
              type="vertical"
            />
            <a-button
              size="small"
              v-if="auditStatusToShowButtonType(record.auditStatus)"
              @click="del(record)"
              >删除</a-button
            >
          </span>
        </a-table>
      </div>
    </main>
    <!-- 新建工单弹框 -->
    <CreateWk @getWorkOrderList="getWorkOrderList" ref="CreateWk" />
    <!-- 提交工单弹框 -->
    <SubmitWk @getWorkOrderList="getWorkOrderList" ref="SubmitWk" />
    <!-- 查看申请人签名弹框 -->
    <SignCheck :pageUrl="signUrl" ref="SignCheck" />
    <!-- 查看PDF材料弹框 -->
    <PDFCheck :pageUrl="pdfUrl" ref="PDFCheck" />
  </div>
</template>

<script>
/**
 * @description 工单申请 -获取工单列表
 * @date 2020-12-9 11:16:46
 */
import { timestampToTime } from '@/Utils/util'
import CreateWk from './Child/CreateWk'
import SubmitWk from './Child/SubmitWk'
// import ApplyPerson from './Child/ApplyPerson'
// import PDFCheck from './Child/PDFCheck'

import PDFCheck from '@/components/common/readPDF'
import SignCheck from '@/components/common/readSign'
const columns = [
  {
    title: '工单号',
    dataIndex: 'wkId',
    key: 'wkId',
    width: '10%',
    align: 'left',
  },
  {
    title: '考生数',
    dataIndex: 'amount',
    key: 'amount',
    width: '5%',
    scopedSlots: { customRender: 'amount' },
    align: 'center',
  },
  {
    title: '考生姓名',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' },
    width: '20%',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '汇报材料',
    key: 'fileName',
    dataIndex: 'fileName',
    scopedSlots: { customRender: 'fileName' },
    width: '15%',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '经办人',
    key: 'personName',
    dataIndex: 'personName',
    scopedSlots: { customRender: 'personName' },
    width: '10%', 
    align: 'left',
    ellipsis: true,
  },
  {
    title: '提交时间',
    key: 'submitTime',
    dataIndex: 'submitTime',
    scopedSlots: { customRender: 'submitTime' },
    width: '15%',
    align: 'center',
  },
  {
    title: '审核状态',
    key: 'auditStatus',
    dataIndex: 'auditStatus',
    scopedSlots: { customRender: 'auditStatus' },
    width: '10%',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '15%',
    align: 'center',
  },
]
export default {
  name: 'WorkOrderApply',
  components: { CreateWk, SubmitWk, SignCheck, PDFCheck },
  data() {
    return {
      columns,
      data: [],
      fetchData: {
        auditStatus: '',
        current: 1,
        pageSize: 20,
        exName: ''  // 考生姓名
      },
      noticeTime: {
        startTime: '',
        endTime: '',
      },
      auditStatusCodeTable: [], // 审核状态
      signUrl: '', // 签名图片地址
      pdfUrl: '', // PDF预览地址
      tableLoading: false,
      timer:null,
      pagination: {
        current: 1,
        size:"middle",
        defaultPageSize: 20,
        showQuickJumper: true, //是否可以快速跳转至某页
        total: 0, //总条数
        showSizeChanger: false, // 显示可改变每页数量
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), //点击页码事件
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this), // 改变每页数量时更新显示
      }, // table的分页器
    }
  },
  computed: {
    // 通知信息
    notice() {
      return `提示！  在${timestampToTime(Number(this.noticeTime.startTime))}  到  ${timestampToTime(Number(this.noticeTime.endTime))}之间可添加考生数据修改工单！`;
    },
    // 是否可以新建工单
    createWkAtTime(){
      return (this.noticeTime.endTime > new Date() && this.noticeTime.startTime < new Date()) ? true : false
    }
  },
  mounted() {
    /**
     * @description 轮训请求接口，获取工单设置时间
     * @time 30s
     */
    this.timer = window.setInterval(() => {
      window.setTimeout(this.getWorkOrderTime(), 0)
    }, 30000);

    this.getCodeTable();
    this.getWorkOrderList();
    this.getWorkOrderTime();
  },
  beforeDestroy(){
    clearInterval(this.timer);
  },
  methods: {
    timestampToTime,
    // 已提交并处于审核中的工单只能查看；退回和未提交的工单可以编辑、删除和提交
    auditStatusToShowButtonType(status) {
      switch (status) {
        case '00': // 未提交
          return true
          break
        case '01': // 上级退回，未提交
          return true
          break
        case '11': // 本级为区县 上级退回，未提交
          return true
          break
        case '21': // 本级为地市 上级退回，未提交
          return true
          break
        default:
          return false
          break
      }
    },
    // 根据审核状态判断显示颜色
    auditStatusToClassName(status){
      switch (status) {
        case "40": //审核通过
          return 'green'
          break;
        case "10": //区县审核中
          return 'blue'
          break;
        case "11": //上级已退回，区县审核中
          return 'blue'
          break;
        case "20": //地市审核中
          return 'blue'
          break;
        case "21": //上级已退回，地市审核中
          return 'blue'
          break;
        case "30": //省级审核中
          return 'blue'
          break;
        case "00": //未提交
          return 'gray'
          break;
        case "01": //上级退回，未提交
          return 'gray'
          break;
        default:
          return ""
          break;
      }
    },
    // 根据code转换码表
    changeCodeTable(code) {
      let value;
      for (let i = 0; i < this.auditStatusCodeTable.length; i++) {
        if (code === this.auditStatusCodeTable[i].code) {
          value = this.auditStatusCodeTable[i].value;
        }
      }
      return value;
    },
    // 搜索时，点击清除图标自动调用接口
    inputChange(e){
      if(e.type === "click"){
        this.getWorkOrderList();
      }
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.current = page;
      this.getWorkOrderList();
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.current = 1;
      // this.getWorkOrderList();
    },
    // 搜索
    search() {
      // 调用一次接口
      this.getWorkOrderList();
    },
    // 发起
    createWk() {
      this.$refs.CreateWk.showModal();
      // 调用接口
    },
    // 查看审核人签名
    checkApplyPerson(record) {
      const { imgUrl } = record;
      this.signUrl = imgUrl;
      this.$refs.SignCheck.showModal();
    },
    // 查看PDF详情
    checkPDF(record) {
      const { fileUrl } = record;
      this.pdfUrl = fileUrl;
      this.$refs.PDFCheck.showModal();
    },
    // 查看 / 编辑该工单
    wkEditAndDetail(record, type) {
      const { wkId, id } = record
      sessionStorage.setItem('wkId', wkId);
      sessionStorage.setItem('id', id);
      sessionStorage.setItem('wkPageType', type);
      this.$router.push({
        path: '/WorkOrderApply/WkEditAndDetail',
        query: {
          // type,
        },
      })
    },
    // 提交该工单
    submit(record, type) {
      if(!record.fileName && !record.fileUrl){
        this.$message.warn("检测到此工单未上传申请材料，请上传之后提交！");
        return
      }
      this.$refs.SubmitWk.showModal(record, type);
    },
    // 删除该工单
    del(record) {
      const { id } = record;
      this.$confirm({
        title: '请确认是否删除该工单。',
        content: record.name ? `该工单包含学生：${record.name || ""}` : '',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // 调用接口
          this.delWorkOrder(id);
        },
      })
    },
    // 获取工单申请列表
    async getWorkOrderList() {
      this.tableLoading = true;
      try {
        const fetchData = this.fetchData;
        const res = await this.$api.WorkOrderApply.getWorkOrderList(fetchData);
        if (res.code === '200') {
          this.data = res.data.list;
          this.pagination.total = res.data.pagination.total;
          this.tableLoading = false;
        } else {
          this.$$message.error('请求失败！' + res.message);
          this.tableLoading = false;
        }
      } catch (error) {
        // console.error(error);
        this.tableLoading = false;
      }
    },
    // 删除该工单
    async delWorkOrder(id) {
      try {
        const res = await this.$api.WorkOrderApply.delWorkOrder({ id });
        if (res.code === '200') {
          this.$message.success('删除成功！')
          this.getWorkOrderList();
        } else {
          this.$message.error('删除失败！' + res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取码表
    async getCodeTable() {
      try {
        const res = await this.$api.WorkOrderApply.getCodeTable({
          type: 'shgdzt',
          auditType:'1'
        })
        if (res.code === '200') {
          this.auditStatusCodeTable = res.data.list;
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取工单设置时间
     getWorkOrderTime() {
        this.$api.WorkOrderSetting.getWorkOrderTime({}).then(res=>{
          if (res.code === '200') {
          this.noticeTime = res.data;
        } else {
          this.$message.error('获取时间失败' + res.message);
        }
        })
    },
  },
}
</script>

<style scoped lang="less">
.wk-apply {
  width: 100%;
  background: #fff;
  padding: 20px;
  header {
    .notice {
      height: 100%;
      background: #fff3cd;
      display: flex;
      align-items: center;
    }
  }
  main {
    .head {
      margin: 20px 0;
      display: flex;
      justify-content: space-between;
      .head-l {
        display: flex;
        align-items: center;
      }
      .head-r {
        padding-right: 10px;
        .blue {
          border: 1px solid #00cc00;
          background: #00cc00;
          color: #fff;
        }
      }
      .search {
        margin-left: 30px;
      }
    }
    .table {
      // 表格隔行变色
      /deep/ .even-row {
        background-color: #f7f8fa;
      }
      // a标签下划线
      /deep/ .ant-table-row a {
        text-decoration: underline;
        color: #595959;
      }
      /* /deep/ thead > tr > th {
        border-left: 1px solid #e6e8eb;
        border-top: 1px solid #e6e8eb;
        border-bottom: 1px solid #e6e8eb;
        &:last-child {
          border-right: 1px solid #e6e8eb;
        }
      } */
      /deep/ .ant-table-pagination {
        text-align: left;
        .ant-pagination-total-text {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
