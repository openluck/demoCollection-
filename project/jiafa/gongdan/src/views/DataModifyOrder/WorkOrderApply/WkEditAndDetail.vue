<template>
    <!-- 该工单内考生列表 -->
  <div class="wk-edit-and-detail">
    <!-- 页面类型 -->
    <header>
      <h3 class="title">{{ type === "look" ? "工单查看" : type === "edit" ? "工单编辑" : "" }}</h3>
      <a-button @click="goBack">
        <svg-icon
          icon-class="返回"
          :scale="0.8"
          style="margin-right: 5px"
        />
        返回
      </a-button>
    </header>
    <!-- 考生列表 -->
    <section>
      <div class="head">
        <div class="search">
          <label for="search-input">搜索：</label>
          <a-input
            id="search-input"
            v-model.trim="fetchData.keyword"
            @keyup.enter="search"
            @change="inputChange"
            allowClear
            style="width:260px"
            placeholder="输入姓名、报名号、身份证号码"
          />
          <a-tooltip>
            <template slot="title">根据姓名、身份证号码搜索当前工单的考生</template>
            <a-button class="search-btn" type="primary" @click="search">
              <svg-icon
                icon-class="sousuo"
                :scale="0.8"
                style="margin-right: 5px"
              />
              搜索
            </a-button>
          </a-tooltip>
        </div>
        <div class="bottom">
          <!-- 上传 -->
          <div class="upload">
            <label for>数据修改申请材料：</label>
            <a-upload
              :disabled="type==='look'"
              name="file"
              :action="baseUrl+ '/uploadFile'"
              :headers="headers"
              :before-upload="beforeUpload"
              accept=".PDF"
              :fileList="fileList"
              @preview="preview"
              @change="handleChange"
            >
              <a-tooltip>
                <template slot="title">上传数据修改申请材料，限PDF格式</template>
                <a-button :disabled="type==='look'">
                  <a-icon type="upload" />选择文件
                </a-button>
              </a-tooltip>
            </a-upload>
          </div>
          <div class="submit" v-if="type!=='look'">
            <a-tooltip>
              <template slot="title">确认录入考生信息以及考生材料无误且完整可提交该工单</template>
              <a-button class="submit-btn" @click="submit" type="primary">
                <svg-icon
                  icon-class="提交"
                  :scale="0.8"
                  style="margin-right: 5px"
                />
                提交
              </a-button>
            </a-tooltip>
            <a-button class="add-btn" @click="handleBatchImport" type="primary">
                <svg-icon
                  icon-class="录入"
                  :scale="0.8"
                  style="margin-right: 5px"
                />
                批量录入
              </a-button>
            <a-tooltip>
              <template slot="title">录入新的考生修改信息</template>
              <a-button class="add-btn" @click="addAndEditAndLook(null, 'add')" type="primary">
                <svg-icon
                  icon-class="录入"
                  :scale="0.8"
                  style="margin-right: 5px"
                />
                录入
              </a-button>
            </a-tooltip>
            
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table">
        <a-table
          :columns="examineeColumns"
          :data-source="examineeData"
          :pagination="pagination"
          :loading="examineeTableLoading"
          :rowKey="row=>row.examineeId"
          size="middle"
          bordered
        >
          <!-- 变更项 -->
          <span slot="alterItem" slot-scope="text">
            <a-tooltip placement="topLeft">
              <template slot="title">{{text || "--"}}</template>
              <span>{{text || "--"}}</span>
            </a-tooltip>
          </span>
          <!-- 原始值 -->
          <span slot="oldValue" slot-scope="text">
            <a-tooltip placement="topLeft">
              <template slot="title">{{text || "--"}}</template>
              <span>{{text || "--"}}</span>
            </a-tooltip>
          </span>
          <!-- 变更值 -->
          <span slot="newValue" slot-scope="text">
            <a-tooltip placement="topLeft">
              <template slot="title">{{text || "--"}}</template>
              <span>{{text || "--"}}</span>
            </a-tooltip>
          </span>
          <!-- 最后修改时间 -->
          <!-- <span slot="lastTime" slot-scope="text">{{text || "--"}}</span> -->
          <!-- 上级是查看按钮进入 -->
        </a-table>
      </div>
    </section>
    <!-- 该工单审核流程 -->
    <!-- ********新需求去掉该工单审核流程********  -->
    <!-- ********2021-3-5 13:43:19******** -->
    <section v-if="false">
      <div class="alter-head">
        <h4>工单审核流程</h4>
      </div>
      <!-- 表格 -->
      <a-table
        class="audit-list"
        :columns="auditColumns"
        :data-source="auditData"
        :pagination="false"
        :loading="auditTableLoading"
        :rowKey="row=>row.time"
        size="middle"
        bordered
        :scroll="{ y: 460 }"
        :rowClassName="
          (record, index) => {
            return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
          }
        "
      >
        <!-- 时间 -->
        <span slot="time" slot-scope="text">{{text}}</span>
        <!-- 状态 -->
        <span slot="status" slot-scope="text">{{changeCodeTable(auditStatusCodeTable,text)}}</span>
        <!-- 备注 -->
        <span v-if="record.returnRemarks" slot="remark" slot-scope="text,record" class="remarks">
          <a-tooltip placement="topLeft">
            <template slot="title"> 
              【{{changeCodeTable(returnCodeTable,record.returnCode)}}】：{{record.returnRemarks}}
              <span v-if="record.returnList.length">
                ，退回意见明细：
                <span v-for="(item,index) of record.returnList" :key="index"><a @click="examineeDetail(item.bmh)">{{item.name}}</a>{{item.remarkChild}}、</span>
              </span>
            </template>
              <span class="esplis">
                【{{changeCodeTable(returnCodeTable,record.returnCode)}}】：{{record.returnRemarks}}
                <span v-if="record.returnList.length">
                  ，退回意见明细：
                  <span v-for="(item,index) of record.returnList" :key="index"><a @click="examineeDetail(item.bmh)">{{item.name}}</a>{{item.remarkChild}}、</span>
                </span>
              </span>
          </a-tooltip>
          <span><a @click="remarksDetail(record)">详情</a></span>
        </span>
        <span v-else>--</span>
        <!-- 操作机构 -->
        <span slot="actionAgency" slot-scope="text">{{text}}</span>
      </a-table>
    </section>
    <!-- 签字提交 -->
    <SubmitWk ref="SubmitWk"  @getExamineeList="getExamineeList" @getAuditLog="getAuditLog"/>
    <!-- 工单审核流程详情 -->
    <AuditLogDetail ref="AuditLogDetail" />
    <!-- 申请材料查看 -->
    <PDFCheck :pageUrl="fileUrl" ref="PDFCheck"/>
  </div>
</template>
 
<script>
/**
 * @description 工单编辑与查看
 * @date 2020-12-9 16:00:50
 */
import { baseUrl } from "@/Utils/global";
import { mergeCellKey3 } from '@/Utils/util'
import SubmitWk from "./Child/SubmitWk";
import AuditLogDetail from "./Child/AuditLogDetail";
import PDFCheck from '@/components/common/readPDF'

const auditColumns = [
  {
    title: "时间",
    key: "time",
    dataIndex: "time",
    scopedSlots: { customRender: "time" },
    align: "left",
    width: "15%"
  },
  {
    title: "状态",
    key: "status",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
    align: "left",
    width: "15%"
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
    align: "left",
    width: "50%"
  },
  {
    title: "操作机构",
    key: "actionAgency",
    dataIndex: "actionAgency",
    scopedSlots: { customRender: "actionAgency" },
    align: "left",
    width: "20%"
  }
];

export default {
  name: "WkEditAndDetail",
  components: { SubmitWk, AuditLogDetail, PDFCheck },
  data() {
    // 表格合并col需要写入data以确保this指向
    const examineeColumns = [
      {
        title: "报名号",
        dataIndex: "bmh",
        key: "bmh",
        align: "left",
        customRender: (text, record, index) => {
          const obj = {
            children:
              text ? <span>{text}</span> : "--",
              attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey3(
            record.bmh,
            this.examineeData,
            'bmh',
            'bmh',
            index
          )
          return obj
        },
      },
      {
        title: "证件号",
        dataIndex: "idNumber",
        key: "idNumber",
        align: "left",
        customRender: (text, record, index) => {
          const obj = {
            children:
              text ? <span>{text}</span> : "--",
              attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey3(
            record.bmh,
            this.examineeData,
            'idNumber',
            'bmh',
            index
          )
          return obj
        },
      },
      {
        title: "考生姓名",
        dataIndex: "examineeName",
        key: "examineeName",
        align: "left",
        customRender: (text, record, index) => {
          const obj = {
            children:
              text ? <span>{text}</span> : "--",
              attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey3(
            record.bmh,
            this.examineeData,
            'examineeName',
            'bmh',
            index
          )
          return obj
        },
      },
      {
        title: "变更项",
        dataIndex: "alterItem",
        key: "alterItem",
        scopedSlots: { customRender: "alterItem" },
        align: "left",
        ellipsis: true
      },
      {
        title: "原始值",
        dataIndex: "oldValue",
        key: "oldValue",
        scopedSlots: { customRender: "oldValue" },
        align: "left",
        ellipsis: true
      },
      {
        title: "变更值",
        dataIndex: "newValue",
        key: "newValue",
        scopedSlots: { customRender: "newValue" },
        align: "left",
        ellipsis: true
      },
      {
        title: "最后修改时间",
        key: "lastTime",
        dataIndex: "lastTime",
        align: "center",
        customRender: (text, record, index) => {
          const obj = {
            children:
              text !== null ? <span>{text}</span> : "",
              attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey3(
            record.bmh,
            this.examineeData,
            'lastTime',
            'bmh',
            index
          )
          return obj
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        customRender: (text, record, index) => {
          const obj = {
            children:
              this.type === 'edit' ? <span><a-button size="small" onclick={()=>this.addAndEditAndLook(record, 'edit')}>编辑</a-button><a-divider type="vertical"/><a-button size="small" onclick={()=>this.del(record)}>删除</a-button></span>
              : this.type === 'look' ? <a-button size="small" onclick={()=>this.addAndEditAndLook(record, 'look')}>查看</a-button> : '',
              attrs: {},
          }
          obj.attrs.rowSpan = mergeCellKey3(
            record.bmh,
            this.examineeData,
            'action',
            'bmh',
            index
          )
          return obj
        },
      }
    ];
    return {
      baseUrl,
      examTotal: '', // 此工单下考生数量
      examineeData: [],
      examineeColumns,
      auditColumns,
      auditData: [],
      examineeTableLoading: false,
      auditTableLoading: false,
      currentOrgFile: null, // 申请材料对象
      type: "", // 页面类型
      fileUrl: "", // 申请材料地址
      fileName: "", // 申请材料地址
      headers: { // 文件上传headers
        // authorization: "authorization-text",
        token: sessionStorage.getItem("sjgdxgxt_token"),
        exId: sessionStorage.getItem("exId")
      },
      fileList: [],  // 申请材料对象，回显使用
      wkId: "", // 工单id
      auditStatusCodeTable: [], // 审核状态
      returnCodeTable: [], // 退回意见类型
      fetchData: {
        keyword: "",
        wkId: "",
        current: 1,
        pageSize: 20
      },
      pagination: {
        current: 1,
        defaultPageSize: 20,
        showQuickJumper: true, //是否可以快速跳转至某页
        total: 0, //总条数
        showSizeChanger: false, // 显示可改变每页数量
        // pageSizeOptions: ["10", "20", "50"], // 每页数量选项
        // buildOptionText: pageSizeOptions => `${pageSizeOptions.value}条/页`,
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条`, // 显示总数
        onChange: this.onPageChange.bind(this), //点击页码事件
        onShowSizeChange: this.onShowSizeChangeMethod.bind(this) // 改变每页数量时更新显示
      } // table的分页器
    };
  },
  computed: {},
  mounted() {
    /**
     * 此处不使用路由传参，而是利用sessionstorage做数据持续化存储。
     * @todo  vuex
     */
    this.fetchData.wkId = sessionStorage.getItem("id");
    // this.type = this.$route.query.type;
    this.type = sessionStorage.getItem("wkPageType");
    console.log('wkPageType',sessionStorage.getItem("wkPageType"));
    this.getExamineeList();
    // this.getAuditLog();
    this.getCodeTable();
    this.getCodeTable1();
  },
  methods: {
    // 根据code转换码表 状态与退回类型
    changeCodeTable(type,code) {
      let value;
      for (let i = 0; i < type.length; i++) {
        if (code === type[i].code) {
          value = type[i].value;
        }
      }
      return value;
    },
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.current = page;
      this.getExamineeList();
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.current = 1;
      this.getExamineeList();
    },
    // 搜索时，点击清除图标自动调用接口
    inputChange(e){
      if(e.type === "click"){
        this.getExamineeList();
      }
    },
    // 签字提交
    submit() {
      if (this.fileUrl && this.fileName) {
        const id = sessionStorage.getItem("id");
        // 获取到该工单一共有多少考生 （表格合并需求变更后此方法获取不了数量。）
        const examineeLength = this.examTotal;
        // type 为wkEdit 从工单编辑页面提交
        this.$refs.SubmitWk.showModal({ id, examineeLength }, "wkEdit");
      } else {
        this.$message.warn("请上传数据修改申请材料后提交！");
        return;
      }
    },
    // 上传文件点击预览
    preview(){
       this.$refs.PDFCheck.showModal();
    },
    // 批量录入
    handleBatchImport(){
      this.$router.push({
        path: "/WorkOrderApply/BatchImport",
      })
    },
    // 录入与编辑与查看
    addAndEditAndLook(record, type) {
      sessionStorage.setItem("examineePageType",type)
      if (type === "add") {
        this.$router.push({
          path: "/WorkOrderApply/ExamineeAlterAndCheck",
          query: {
            // type
          }
        });
      } else {
        const { bmh } = record;
        sessionStorage.setItem("bmh", bmh);
        this.$router.push({
          path: "/WorkOrderApply/ExamineeAlterAndCheck",
          query: {
            // type
          }
        });
      }
    },

    // 返回
    goBack() {
      // this.$router.go(-1);
      this.$router.push({
        path:"/WorkOrderApply"
      });
    },
    // 搜索
    search() {
      this.getExamineeList();
      this.pagination.current = 1;
    },
    // 工单审核流程备注 点击详情
    remarksDetail(record){
      const recordData = {...record};
      recordData.returnCode = this.changeCodeTable(this.returnCodeTable,recordData.returnCode);
      this.$refs.AuditLogDetail.showModal(recordData);
    },
    // 工单审核流程备注 点击学生名称跳转页面
    examineeDetail(bmh) {
      sessionStorage.setItem("examineePageType",'look');
      sessionStorage.setItem("bmh", bmh);
      this.$router.push({
          path: "/WorkOrderApply/ExamineeAlterAndCheck",
          query: {
            // type
          }
        });
    },
    // 上传文件之前
    beforeUpload(file, fileList) {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        this.$message.error("请上传PDF文件");
        fileList.pop();
        return new Promise((resolve, reject) => {
          return reject(new Error("出错了"));
        });
      }
      this.fileList = [file];
    },
    // 上传文件事件
    handleChange(info) {
      this.fileList = info.fileList;
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        const res = info.file.response;
        if (res.code === "200") {
          //上传完成之后的路径
          this.fileUrl = res.data.url;
          //上传的文件的size
          // this.fileSize = info.file.size;
          this.fileName = info.file.name;
          // 上传  type 为 1
          this.fileWithWorkOrder("1");
        }
        this.$message.success(`${info.file.name} 上传成功！`);
      } else if (info.file.status === "removed") {
        /**
         * @todo 删除文件之后，需要请求接口
         */
          // 删除  type 为 2
          this.fileWithWorkOrder("2");
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败！`);
      }
    },
    /**
     * @todo 上传完成之后调用此接口
     */
    // 将上传申请材料URL绑定到该工单
    async fileWithWorkOrder(type) {
      // const wkId = this.fetchData.wkId;
      const fileUrl = this.fileUrl;
      const fileName = this.fileName;
      const id = sessionStorage.getItem("id");

      try {
        const res = await this.$api.WorkOrderApply.fileWithWorkOrder({
          wkId: id,
          fileUrl,
          fileName,
          type
        });
        if (res.code === "200") {
          const msg = type === "1" ? "文件与工单绑定成功！" : type === "2" ? '删除成功！' : '';
          this.getExamineeList();
          this.$message.success( msg );
        } else {
          this.$message.error("操作失败！" + res.message);
        }
      } catch (error) {}
    },

    // 删除考生
    del(record) {
      const { wkId } = this.fetchData;
      const { bmh, examineeName } = record;
      this.$confirm({
        title: `请确认是否删除该考生？`,
        content: `该生：报名号：[${bmh}]，姓名：${examineeName}`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          // 调用接口
          this.delExaminee({ bmh, wkId });
        }
      });
    },
    // 删除该工单下某个考生
    async delExaminee(data) {
      try {
        const res = await this.$api.WorkOrderApply.delExaminee(data);
        if (res.code === "200") {
          this.$message.success("删除成功！");
          this.getExamineeList();
        } else {
          this.$message.error("删除失败！" + res.message);
        }
      } catch (error) {}
    },
    // 获取该工单下考生列表
    async getExamineeList() {
      this.examineeTableLoading = true;
      const fetchData = this.fetchData;
      try {
        const res = await this.$api.WorkOrderApply.getExamineeList(fetchData);
        if (res.code === "200") {
          this.examineeData = res.data.list;
          this.pagination.total = res.data.pagination.total;
          const currentOrgFile = res.data.currentOrgFile;
          // 此工单下考生数量
          // this.examTotal =  res.data.examTotal;
          this.examTotal =  '10';

          this.currentOrgFile = currentOrgFile;
          this.fileUrl = currentOrgFile.fileUrl;
          this.fileName = currentOrgFile.fileName;
          
          this.examineeTableLoading = false;
          // 上传文件回显
          if(currentOrgFile.fileName && currentOrgFile.fileUrl){
            this.fileList = [
              {
                name: currentOrgFile.fileName,
                uid: currentOrgFile.fileUrl,
                status: "done"
              }
            ];
          }
        } else {
          this.$message.error("请求失败！" + res.message);
          this.examineeTableLoading = false;
        }
      } catch (error) {
        this.examineeTableLoading = false;
        console.error(error);
      }
    },

    // 获取该工单下审核流程列表
    async getAuditLog() {
      // const wkId = this.fetchData.wkId;
      const id = sessionStorage.getItem("id");
      try {
        const res = await this.$api.WorkOrderApply.getAuditLog({ wkId: id });
        if (res.code === "200") {
          this.auditData = res.data.list;
          this.auditTableLoading = false;
        } else {
          this.$message.error("请求失败！" + res.message);
          this.auditTableLoading = false;
        }
      } catch (error) {
        this.auditTableLoading = false;
      }
    },
    // 获取码表 ,// 工单流转状态
    async getCodeTable() {
      try {
        const res = await this.$api.WorkOrderApply.getCodeTable({
          type: "shgdzt",
          auditType:'1'
        });
        if (res.code === "200") {
          this.auditStatusCodeTable = res.data.list;
        }
      } catch (error) {}
    },
    // 退回意见类型
    async getCodeTable1(){
      try {
        const res = await this.$api.WorkOrderApply.getCodeTable({
          type:"gdtulx"
        })
        if(res.code === "200"){
          this.returnCodeTable = res.data.list;
          console.log(this.returnCodeTable);
        }
      } catch (error) {}
    }
  }
};
</script>
 
<style lang="less">
.wk-edit-and-detail {
  background: #fff;
  padding: 20px;
  // 表格隔行变色
  /deep/ .even-row {
    background-color: #f7f8fa;
  }
  header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #e6ecf2;
  }
  .head {
    height: 120px;
    .search {
      display: flex;
      align-items: center;
      margin: 30px 0;
      .search-btn {
        margin-left: 30px;
      }
    }
    // **********上传文件样式
    .upload {
      .ant-upload-list-text{
        margin-left: 10px;
      }
      display: flex;
      align-items: center;
      & > span {
        .ant-upload-list-item-name{
          max-width: 550px;
          padding-right: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        display: flex;
        /deep/.ant-upload-list-item-card-actions {
          right: 0px;
        }
      }
      .ant-upload-list-item-name{
        cursor: pointer;
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .submit {
        .add-btn {
          margin-left: 15px;
        }
      }
    }
  }
  .table {
    /deep/ .ant-table-tbody
      > tr :hover
      > td {
      background: #fff;
    }
    // /deep/ .ant-table-tbody
    //   > tr:hover:nth-child(2n)
    //   > td {
    //   background: #F7F8FA;
    // }
    // 为表格加上阴影
    /deep/ .ant-pagination{
      box-shadow: 0 -6px 6px -4px rgba(0, 0, 0, 0.15);
      position: relative;
      z-index: 9;
    }
    /deep/ .ant-table-pagination {
      text-align: left;
      .ant-pagination-total-text {
        margin-right: 15px;
      }
    }
  }
  .alter-head{
    font-size: 16px;
    margin: 30px 0px;
    height: 40px;
    line-height: 40px;
    font-weight: 600;
    border-bottom: 1px solid #e6ecf2;
    h4{
      position: relative;
      padding-left: 10px;
      &::before{
        content: "";
        position: absolute;
        left: 0;
        top: 11px;
        width: 4px;
        height: 18px;
        background: #000;
      }
    }
  }
  .audit-list {
    /deep/ .remarks{
      display: flex;
      align-items: center;
      &>span>a{
        text-decoration: underline;
      }
    }
    /deep/ .esplis{
      display: inline-block;
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &>span>span>a{
        text-decoration: underline;
      }
    }
  }
}
</style>