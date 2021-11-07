<template>
  <div class="examinee-alter-and-check">
    <header>
      <h3 class="title">
        {{type === "add" ? "考生数据录入" : type === "look" ? "考生数据查看" : type === "edit" ? "考生数据编辑" : ""}}
      </h3>
      <a-button @click="goBack">
        <svg-icon
          icon-class="返回"
          :scale="0.8"
          style="margin-right: 5px"
        />  
        返回
      </a-button>
    </header>
    <section>
      <!-- 表格头部 -->
      <div v-if="type === 'add'" class="isEdit-head">
        <!-- 考生数据修改 -->
        <div class="search">
          <label for="search-examinee-info">请输入考生身份证号码或考生报名号：</label>
          <a-input
            id="search-examinee-info"
            v-model.trim="idNumber"
            @keyup.enter="search"
            @change="inputChange"
            style="width:300px"
            allowClear
            placeholder="请输入完整的身份证号码或考生报名号"
          />
          <a-tooltip>
            <template slot="title">输入完整的身份证号码或考生报名号搜索该机构下所有考生</template>
            <a-button class="search-btn" @click="search" type="primary" :loading="btnLoading">
              搜索
              <svg-icon
                icon-class="sousuo"
                :scale="0.8"
                style="margin-left: 5px"
              />
            </a-button>
          </a-tooltip>
          
        </div>
        <div v-if="isShowExmineeInfo" class="bottom">
          <div class="exminee-info">
            <div>
              姓名：<span class="information">{{examineeInfo.name || ''}}</span>
            </div>
            <div>
              性别：<span class="information">{{examineeInfo.sex || ''}}</span>
            </div>
            <div>
              身份证号码：<span class="information">{{examineeInfo.idNumber || ''}}</span>
            </div>
            <div>
              报名号：<span class="information">{{examineeInfo.bmh || ''}}</span>
            </div>
          </div>
          <div class="alter">
            <!-- 考生删除 -->
            <div class="ex-del" v-if="type === 'add'">
              <a-tooltip>
                <template slot="title">
                  <span>该操作会删除该生所有的变更项！同时变更项列表中出现一条变更项字段为“删除考生”，原始值和变更值都为空的数据。</span>
                </template>
                <a-button :disabled="alterBtnDisabled"  @click="delExaminee" class="search-btn" style="margin-right:15px;">
                  <svg-icon
                    icon-class="删除"
                    :scale="0.8"
                    style="margin-right: 5px"
                  />  
                  考生删除
                </a-button>
              </a-tooltip>
            </div>
            <a-button class="search-btn" @click="alterExamineeRegInfo('edit')">
              <!-- <svg-icon
                icon-class="sousuo"
                :scale="0.8"
                style="margin-right: 5px"
              /> -->
              <a-icon type="edit" />
              数据变更
            </a-button>
          </div>
        </div>
      </div>
      <!-- 考生数据查看与编辑 -->
      <div class="islook-exminee-info" v-if="type === 'look' || type === 'edit'" >
        <div class="exminee-info">
          <div>
            姓名：<span class="information">{{examineeInfo.name || ''}}</span>
          </div>
          <div>
            性别：<span class="information">{{examineeInfo.sex || ''}}</span>
          </div>
          <div>
            身份证号码：<span class="information">{{examineeInfo.idNumber || ''}}</span>
          </div>
          <div>
            报名号：<span class="information">{{examineeInfo.bmh || ''}}</span>
          </div>
        </div>

        <div class="btns" style="display: flex;">
          <!-- 考生删除 -->
          <div class="ex-del" v-if="type === 'edit'">
            <a-tooltip>
              <template slot="title">
                <span>该操作会删除该生所有的变更项！同时变更项列表中出现一条变更项字段为“删除考生”，原始值和变更值都为空的数据。</span>
              </template>
              <a-button :disabled="alterBtnDisabled"  @click="delExaminee" class="search-btn" style="margin-right:15px;">
                <svg-icon
                  icon-class="删除"
                  :scale="0.8"
                  style="margin-right: 5px"
                />  
                考生删除
              </a-button>
            </a-tooltip>
          </div>
          <!-- 变更按钮 -->
          <div class="alter" style="text-align: right;">
            <!-- 数据变更 -->
            <a-tooltip>
              <template slot="title">
                <span v-if="alterBtnDisabled">检测到你已录入考生删除申请，无法再次发起其他考生信息变更！</span>
              </template>
              <a-button v-if="type === 'edit'" @click="alterExamineeRegInfo('edit')" :disabled="alterBtnDisabled" class="search-btn">
                <a-icon type="edit" />
                数据变更
              </a-button>
            </a-tooltip>
            
            <a-button v-if="type === 'look'" @click="alterExamineeRegInfo('look')" class="search-btn">
              <a-icon type="copy" />
              变更详情
            </a-button>
          </div>
        </div>
      </div>
      
      <!-- 表格 -->
      <div class="table">
        <div v-if="type!=='look' && alterData.length" style="height:30px;">
          <a-tooltip>
            <template slot="title">
              该生变更项中身份证号、性别、出生日期不能单独删除！须通过批量删除按钮一并删除。
            </template>
            <a-button @click="handleDelMulti" style="float:right;margin-bottom:10px;">
              <svg-icon
                icon-class="删除"
                :scale="0.8"
                style="margin-right: 5px"
              />  
              批量删除
            </a-button>
          </a-tooltip>
        </div>
        <a-table
          :columns="alterColumns"
          :data-source="alterData"
          :pagination="pagination"
          :loading="alterTableLoading"
          :rowKey="row=>row.alterId"
          size="middle"
          bordered
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: onSelectionSelect, getCheckboxProps: getCheckboxProps }"
          :rowClassName="
            (record, index) => {
              return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
            }
          "
        >
          <!-- 最后修改时间 -->
          <span slot="lastTime" slot-scope="text">{{text || "--"}}</span>
      
          <!-- 原始值 -->
          <span slot="oldValue" slot-scope="text">
            <a-tooltip placement="topLeft">
              <template slot="title">{{text}}</template>
              <span>{{text || "--"}}</span>
            </a-tooltip>
          </span>
          <!-- 变更值 -->
          <span slot="newValue" slot-scope="text">
            <a-tooltip placement="topLeft">
              <template slot="title">{{text}}</template>
              <span>{{text || "--"}}</span>
            </a-tooltip>
          </span>
          <!-- 操作人 -->
          <span slot="actionPerson" slot-scope="text">{{text || "--"}}</span>

          <span v-if="type !== 'look'" slot="action" slot-scope="text,record">
            <a-button v-if="!showDel(record)" @click="del(record)" size="small">删除</a-button>
          </span>
        </a-table>
      </div>
    </section>

    <!-- 信息修改变更日志 -->
    <!-- ********新需求去掉信息修改变更日志********  -->
    <!-- ********2021-3-5 13:43:19******** -->
    <section v-if="false">
      <div class="alter-head">
        <h4>信息修改变更日志</h4>
      </div>
      <a-table
        class="alter-log-table"
        :columns="alterLogColumns"
        :data-source="alterLogData"
        :rowKey="row=>row.logId"
        :loading="logTableLoading"
        :pagination="false"
        :scroll="{ y: 460 }"
        bordered
        size="middle"
        :rowClassName="
          (record, index) => {
            return (index % 2 === 1 ? 'even-row' : '') + ' every-row';
          }
        "
      >
        <!-- 时间 -->
        <span slot="time" slot-scope="text">{{timestampToTime(text)}}</span>
        <!-- 操作 -->
        <span slot="operateType" slot-scope="text">{{text || "--"}}</span>
        <!-- 变更项 -->
        <span slot="updateKey" slot-scope="text">
          <a-tooltip placement="topLeft">
            <template slot="title">{{text}}</template>
            <span>{{text || "--"}}</span>
          </a-tooltip>
        </span>
        <!-- 原始值 -->
        <span slot="oldValue" slot-scope="text">
          <a-tooltip placement="topLeft">
            <template slot="title">{{text}}</template>
            <span>{{text || "--"}}</span>
          </a-tooltip>
        </span>
        <!-- 变更值 -->
        <span slot="newValue" slot-scope="text">
          <a-tooltip placement="topLeft">
            <template slot="title">{{text}}</template>
            <span>{{text || "--"}}</span>
          </a-tooltip>
        </span>
        <!-- 操作机构 -->
        <span slot="actionAgency" slot-scope="text">{{text || "--"}}</span>
        <!-- 操作人 -->
        <span slot="actionPerson" slot-scope="text">{{text || "--"}}</span>
      </a-table>
    </section>
  </div>
</template>
 
<script>
/**
 * @description 考生数据查看与编辑
 * @date 2020年12月17日13:58:45
 */

import {timestampToTime} from '@/Utils/util'
// 变更项列表
const alterColumns = [
  {
    title: "变更项",
    dataIndex: "updatekey",
    key: "updatekey",
    align: "left"
  },
  {
    title: "原始值",
    dataIndex: "oldValue",
    key: "oldValue",
    align: "left",
    ellipsis: true,
    scopedSlots: { customRender: "oldValue" }
  },
  {
    title: "变更值",
    dataIndex: "newValue",
    key: "newValue",
    align: "left",
    ellipsis: true,
    scopedSlots: { customRender: "newValue" }
  },
  {
    title: "操作机构",
    dataIndex: "actionAgency",
    key: "actionAgency",
    scopedSlots: { customRender: "actionAgency" },
    align: "center"
  },
  {
    title: "操作人",
    dataIndex: "actionPerson",
    key: "actionPerson",
    align: "center",
    scopedSlots: { customRender: "actionPerson" },
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center"
  }
];
// 信息修改变更日志
const alterLogColumns = [
  {
    title: "操作时间",
    dataIndex: "updateTime",
    key: "updateTime",
    align: "left"
  },
  {
    title: "操作",
    dataIndex: "operateType",
    key: "operateType",
    align: "center",
    scopedSlots: { customRender: "operateType" }
  },
  {
    title: "变更项",
    dataIndex: "updateKey",
    key: "updateKey",
    align: "left",
    ellipsis: true,
    scopedSlots: { customRender: "updateKey" }
  },
  {
    title: "原始值",
    dataIndex: "oldValue",
    key: "oldValue",
    align: "left",
    ellipsis: true,
    scopedSlots: { customRender: "oldValue" }
  },
  {
    title: "变更值",
    dataIndex: "newValue",
    key: "newValue",
    align: "left",
    ellipsis: true,
    scopedSlots: { customRender: "newValue" }
  },
  {
    title: "操作机构",
    dataIndex: "actionAgency",
    key: "actionAgency",
    align: "center",
    scopedSlots: { customRender: "actionAgency" }
  },
  {
    title: "操作人",
    dataIndex: "actionPerson",
    key: "actionPerson",
    align: "center",
    scopedSlots: { customRender: "actionPerson" }
  }
];
export default {
  name: "ExamineeAlterAndCheck",
  components: {},
  data() {
    return {
      alterColumns,
      alterData:[],
      alterLogColumns,
      alterLogData:[],
      alterTableLoading: false,
      logTableLoading: false,
      idNumber:"",
      wkId:"",
      bmh:"",
      returnStatusCodeTable:[], // 工单退回意见类型码表
      selectedRowKeys: [],
      isShowExmineeInfo:false,
      fetchData: {
        current: 1,
        pageSize: 20,
      },
      examineeInfo:{
        idNumber:"",
        name:"",
        sex:"",
        bmh:"",
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
      }, // table的分页器
      type: "",
      alterBtnDisabled: false,
      btnLoading: false
    };
  },
  computed: {
    
  },
  created() {
    /**
     * @description 数组扩展方法,删除指定某个元素（根据值删除，不是位置）
     * @param {Array.remove()}
     * @returns {Array}
     */
    Array.prototype.remove = function(val) {
      const index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    // this.wkId = this.$route.query.wkId;
    // this.type = this.$route.query.type;
    this.type = sessionStorage.getItem("examineePageType");

    this.wkId = sessionStorage.getItem("id");
    if(this.type !== "add"){
      this.bmh = sessionStorage.getItem("bmh");
    }
  },
  mounted() {
    console.log(this.type);
    this.getCodeTable();
    if(this.type !== "add"){
      this.getExamineeInfo();
      // this.getInfoAlterLog();
    } 

    /**
     *@description 在考生数据查看时，考生变更项不能操作（删除），根据列的最后一项动态pop 和 push
     */
    if (this.alterColumns.length < 6) {
       this.alterColumns.push({
        title: "操作",
        dataIndex: "action",
        key: "action",
        scopedSlots: { customRender: "action" },
        align: "center"
      });
    }
    if (this.type === "look") {
      if(this.alterColumns.length >= 6) {
        // 删除columns最后一项， 操作项
        this.alterColumns.pop();
      }
    }
    
  },
  updated(){
    this.changeAlterBtnDisabled();
  },
  methods: {
    timestampToTime,
    // 表格页面改变事件
    onPageChange(page) {
      this.pagination.current = page;
      this.fetchData.current = page;
      this.getExamineeInfo();
    },
    // 改变每页数量时更新显示
    onShowSizeChangeMethod(i, pageSize) {
      this.fetchData.pageSize = pageSize;
      this.pagination.current = 1;
      this.fetchData.current = 1;
      this.getExamineeInfo();
    },
    // 根据code转换码表
    changeCodeTable(code) {
      let value;
      for (let i = 0; i < this.returnStatusCodeTable.length; i++) {
        if (code === this.returnStatusCodeTable[i].code) {
          value = this.returnStatusCodeTable[i].value;
        }
      }
      return value;
    },
    // 返回
    goBack() {
      // this.$router.go(-1);
      this.$router.push({
        path: "/WorkOrderApply/WkEditAndDetail"
      })
    },
    // 搜索时，点击清除图标清除上次查询结果
    inputChange(e){
      if(e.type === "click"){
        this.isShowExmineeInfo = false;
      }
    },
    // 搜索
    search() {
      if (!this.idNumber) {
        this.$message.warn("请输入身份证号码！");
        return;
      }
      this.getExamineeInfoWithID();
    },
    // 数据变更
    alterExamineeRegInfo(type) {
      sessionStorage.setItem("regInfoPageType", type);
      console.log('regInfoPageType',sessionStorage.getItem('regInfoPageType'));
      this.$router.push({
        path: "/WorkOrderApply/ExamineeRegInfo",
        query: {
          // bmh,
          // wkId,
          // type
        }
      });
    },
    // 改变数据变更按钮的disable状态
    changeAlterBtnDisabled(){
      const { alterData } = this;
      if(!alterData.length){
        this.alterBtnDisabled = false;
      }
      alterData.map(item =>{
        if(item.updatekey === "删除考生"){
          this.alterBtnDisabled = true;
        } 
      })
    },
    // 是否显示删除按钮
    showDel(record){
      return record.updatekey === '性别代码' ? true : record.updatekey === '出生日期' ? true :record.updatekey === '身份证号码' ? true :  false;
    },
    // 删除该生当前变更项 单个删除
    del(record){
      const { alterId } = record;
      const { wkId, bmh } = this;
      this.$confirm({
        title: `请确认是否删除该条数据？`,
        okText: '确认',
        cancelText: '取消',
        onOk:()=>{
          // 调用接口
          this.delAlterItem({ alterId: [alterId], bmh, wkId })
        }
      });
    },
    // 删除多选
    handleDelMulti(){
      const { wkId, bmh, selectedRowKeys} = this;
      const alterId = selectedRowKeys;
      console.log(selectedRowKeys);
      if(!selectedRowKeys.length) return this.$message.warn("请勾选要删除的项！");
      this.$confirm({
        title: `请确认是否删除选中的 ${selectedRowKeys.length} 条数据？`,
        okText: '确认',
        cancelText: '取消',
        onOk: ()=> {
          // 调用接口
          this.delAlterItem({ alterId, bmh, wkId })
        }
      });
    },
    // 考生删除
    delExaminee(){
      const { wkId, bmh, examineeInfo: { idNumber } } = this;
      this.$confirm({
        title: '请确认是否删除此考生？',
        content: '该操作会删除之前录入的其他变更项，请确认是否继续删除！',
        okText: '确认',
        cancelText: '取消',
        onOk: ()=> {
          // 调用接口
          this.delExamineeAll({ bmh, wkId })
        }
      });
    },

    // 多选事件 
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    // 多选框禁用
    getCheckboxProps() {
      if(this.type === 'look'){
        return({
          props:{
            disabled: true
          }
        })
      } else {
        return({
          props:{
            disabled: false
          }
        })
      }
    },

    /**
     * @description 多选框选择事件
     * 身份证号、性别、出生日期不能单独删除
     * 必须通过批量删除按钮一起删除
     */
    onSelectionSelect(record, selected, selectedRows, nativeEvent){
      const result =  record.updatekey === '性别代码' ? true : record.updatekey === '出生日期' ? true :record.updatekey === '身份证号码' ? true :  false;
      // 性别 ，出生日期 ，身份证号码
      if(result){
        const data = this.alterData;
        data.map(item => {
          if(item.updatekey === '性别代码'){
            if(!selected){
              this.selectedRowKeys.remove(item.alterId);
              return;
            }
            if(!this.selectedRowKeys.includes(item.alterId)){
              this.selectedRowKeys.push(item.alterId);
            }
          } else if(item.updatekey === '出生日期'){
            if(!selected){
              this.selectedRowKeys.remove(item.alterId);
              return;
            }
            if(!this.selectedRowKeys.includes(item.alterId)){
              this.selectedRowKeys.push(item.alterId);
            }
          } else if(item.updatekey === '身份证号码'){
            if(!selected){
              this.selectedRowKeys.remove(item.alterId);
              return;
            }
            if(!this.selectedRowKeys.includes(item.alterId)){
              this.selectedRowKeys.push(item.alterId);
            }
          }
        })
      }
    },
    // 录入/编辑--考生删除
    async delExamineeAll(data){
      try {
        const res = await this.$api.WorkOrderApply.delExamineeAll(data);
        if (res.code === "200") {
          this.$message.success("删除成功！")
          this.getExamineeInfo();
          // this.getInfoAlterLog();
        } else {
          this.$message.error("删除失败！" + res.message);
        }
      } catch (error) {
        
      }
    },
    // 录入/编辑-删除该生当前变更项
    async delAlterItem(data){
      try {
        const res = await this.$api.WorkOrderApply.delAlterItem(data);
        if (res.code === "200") {
          this.$message.success("删除成功！")
          this.getExamineeInfo();
          // this.getInfoAlterLog();
          // 清空多选数据
          this.selectedRowKeys = [];
        } else {
          this.$message.error("删除失败！" + res.message);
        }
      } catch (error) {
        
      }
    },
    // 录入-根据考生身份证号码获取考生信息
    async getExamineeInfoWithID() {
      // const { wkId } = this;
      this.btnLoading = true;
      const wkId = sessionStorage.getItem("id");
      const idNumber = this.idNumber;
      try {
        const res = await this.$api.WorkOrderApply.getExamineeInfoWithID({
          idNumber,
          wkId
        });
        if (res.code === "200") {
          if(res.data.examineeInfo === null){
            this.$message.warn("身份证号码输入有误或暂无此考生");
            this.isShowExmineeInfo = false;
            return
          }
          this.$message.success("查询成功！");
          this.isShowExmineeInfo = true;
          this.examineeInfo = res.data.examineeInfo;

          const bmh = this.examineeInfo.bmh;
          this.bmh = bmh;
          sessionStorage.setItem("bmh",bmh);
        } else {
          this.$message.error("查询失败！" + res.message);
        }
      } catch (error) {

      } finally {
        this.btnLoading = false;
      }
      
    },
    // 获取该工单下某个考生信息
    async getExamineeInfo() {
      // const { bmh } = this.examineeInfo;
      const  bmh  = sessionStorage.getItem("bmh");
      const { wkId, fetchData } = this;

      this.alterTableLoading = true;
      try {
        const res = await this.$api.WorkOrderApply.getExamineeInfo({...fetchData, bmh, wkId});
        if (res.code === "200") {
          this.alterData = res.data.alterItem;
          this.examineeInfo = res.data.examineeInfo;
          this.alterTableLoading = false;
        } else {
          this.$message.error("请求失败！" + res.message);
          this.examineeTableLoading = false;
        }
      } catch (error) {
      } finally{
        this.alterTableLoading = false;
      }
    },
    // 获取该工单下考生信息变更日志
    async getInfoAlterLog() {
      // const { bmh } = this.examineeInfo;
      const  bmh  = sessionStorage.getItem("bmh");
      const { wkId } = this;
      this.logTableLoading = true;
      try {
        const res = await this.$api.WorkOrderApply.getInfoAlterLog({bmh, wkId});
        if (res.code === "200") {
          this.alterLogData = res.data.alterLog;
          this.logTableLoading = false;
        } else {
          this.$message.error("请求失败！" + res.message);
          this.logTableLoading = false;
        }
      } catch (error) {}
    },
    // 获取工单退回意见类型码表
    async getCodeTable(){
      try {
        const res = await this.$api.WorkOrderApply.getCodeTable({type:"gdtulx"});
        if (res.code === "200") {
          this.returnStatusCodeTable = res.data.list;
        }
      } catch (error) {
        
      }
    }
  }
};
</script>
 
<style scoped lang="less">
.examinee-alter-and-check {
  padding: 20px;
  background-color: #fff;
  // 表格隔行变色
  /deep/ .even-row {
    background-color: #f7f8fa;
  }
  // a标签下划线
  /deep/ a {
    text-decoration: underline;
  }
  header {
    height: 40px;
    display: flex;
    
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #e6ecf2;
  }
  .isEdit-head {
    .search {
      display: flex;
      align-items: center;
      margin: 30px 0;
      .search-btn {
        margin-left: 30px;
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      .alter{
        display: flex;
      }
      .exminee-info {
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        & > div {
          margin-right: 40px;
        }
        & > .information {
          color: #8a9199;
        }
      }
    }
  }
  .islook-exminee-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    .exminee-info{
      display: flex;
      align-items: center;
      &>div{
        margin-right: 40px;
      }
      &>.information{
        color: #8a9199;
      }
    }
  }
  .ex-del{
    display: flex;
    justify-content: flex-end;
  }
  .table{
    /deep/ .ant-table-pagination {
      text-align: left;
      .ant-pagination-total-text {
        margin-right: 15px;
      }
    }
  }
  .alter-head{
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
}
</style>