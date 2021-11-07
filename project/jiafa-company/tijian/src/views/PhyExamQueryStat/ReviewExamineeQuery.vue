<template>
<!-- 复查考生查询  -->
  <div id="reviewExamineeQuery">
    <div class="top" style="margin-bottom: 20px">

      <div class="topSearch">
        <div class="query">
          <div>
            <span class="name">机构：</span>
            <a-tree-select
              v-model="search.orgCode"
              style="width: 180px;margin-right:20px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择"
              :tree-default-expand-all="false"
              :treeDefaultExpandedKeys="[search.orgCode]"
              :replaceFields="replaceFields"
              @select="onSelect"
            >
            </a-tree-select>
          </div>

          <div>
            <span class="name">体检医院：</span>
            <a-select
              style="width: 120px;margin-right:20px" 
              placeholder="请选择"
              allowClear
              v-model="search.tjzdm"
            >
              <a-select-option value>
                全部
              </a-select-option>
              <a-select-option :title = item.hospitalName :value = item.hospitalCode v-for="item in medicalHospitalList" :key = item.hospitalCode>
                {{ item.hospitalName }}
              </a-select-option>
            </a-select>
          </div>

          <div>
            <span class="name">考生状态：</span>
            <a-select
              style="width: 120px;margin-right:15px" 
              placeholder="请选择"
              allowClear
              v-model="search.examState"
            >
              <a-select-option value>
                全部
              </a-select-option>
              <a-select-option value="1">
                待审核
              </a-select-option>
              <a-select-option value="2">
                待复查
              </a-select-option>
              <a-select-option value="3">
                复查完成
              </a-select-option>
              <a-select-option value="4">
                审核不通过
              </a-select-option>
            </a-select>
          </div>
          <a-button type="primary" @click="searchList('1')">查询</a-button>
        </div>
        <div class="search">
          <a-input placeholder="考生号/姓名/身份证号" allowClear v-model="search.keyword" style="width: 180px;margin-right:15px" />
          <a-button type="primary" @click="searchList('2')">搜索</a-button>
        </div>
      </div>

      <div class="topExport" style="margin-top: 15px">
        <a-button type="primary" @click="allExport">
          <svg-icon icon-class="daochu" :scale="0.8" style="margin-right:5px;" />
          导出Excel
        </a-button>
      </div>
    </div>

    <!-- 复查考生查询列表 -->
    <div class="list">
      <a-table
        :columns="columns" 
        :data-source="dataList"
        :rowKey="row => row.id"
        bordered
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ x: 100, y: tableHeight }"
        size="middle"
      >
        <!-- 复查申请材料 -->
        <span slot="materials" slot-scope="text">
          <a @click="handlePreview(text)">复查申请材料</a>
        </span>
        <!-- 复查说明 -->
        <span slot="reviewExplain" slot-scope="text">
          <a-tooltip placement="topLeft">
            <template slot="title">
              {{ text }}
            </template>
            <span type="primary">{{ text }}</span>
          </a-tooltip>
        </span>
        <!-- 考生状态 -->
        <span slot="examState" slot-scope="text" :class="text==='1'?'colOrange':text==='2'?'colGray':text==='3'?'colGreen':text==='4'?'colRed':''">
          {{ text==='1'?'待审核':text==='2'?'待复查':text==='3'?'复查完成':text==='4'?'审核不通过':'-' }}
        </span>
        <!-- 详情 -->
        <span slot="operation" slot-scope="text,record">
          <a-button @click="details(record)">
            详情
          </a-button>
        </span>
      </a-table>
    </div>

    <!-- 考生详情model -->
    <a-modal
      v-model="visible" 
      title="考生复查详情" 
      @ok="detailsModalHandleOk"
      width="660px"
      :maskClosable="false"
      wrapClassName="detailsModal"
    >
    <template slot="footer">
      <a-button type="primary" @click="detailsModalHandleOk" style="margin-right:10px;">
        <svg-icon icon-class="queren" :scale="0.8" style="margin-right:5px;" />
        确认
      </a-button>
      <a-button @click="detailsModalHandleCancel">
        <svg-icon icon-class="quxiao" :scale="0.7" style="margin-right:5px;" />
        取消
      </a-button>
    </template>

      <span class="title">学生基本信息</span>
      <div class="infoDetails">
        <div class="line">
          <div class="left">
            <div class="name">考生号：</div>
            <div>{{examDetails.examNum}}</div>
          </div>
        </div>
        <div class="line">
          <div class="left">
            <div class="name">考生姓名：</div>
            <div>{{examDetails.examName}}</div>
          </div>
          <div class="right">
            <div class="name">性别：</div>
            <div>{{examDetails.sex}}</div>
          </div>
        </div>
        <div class="line">
          <div class="left">
            <div class="name">区县名称：</div>
            <div>{{examDetails.countyName}}</div>
          </div>
          <!-- <div class="right">
            <div class="name">体检医院：</div>
            <div>{{examDetails.hospitalName}}</div>
          </div> -->
          <div class="right">
            <div class="name">班级：</div>
            <div>{{examDetails.classNum}}</div>
          </div>
        </div>
        <div class="line1">
          <div class="name">体检医院：</div>
          <div>{{examDetails.hospitalName}}</div>
        </div>
        <div class="line1">
          <div class="name">报名点名称：</div>
          <div>{{examDetails.assignsName}}</div>
        </div>
      </div>
      <span class="title">复查详情</span>
      <div class="reviewDetails">
        <div class="line">
          <div class="left">复查科室：</div>
          <div class="right">{{examDetails.reviewDesk}}</div>
        </div>
        <div class="line">
          <div class="left">复查说明：</div>
          <div class="right">{{examDetails.reviewExplain}}</div>
        </div>
        <div class="line">
          <div class="left">复查材料：</div>
          <div class="right">
            <img :src="examDetails.materials" alt="复查材料" style="width:150px; cursor: pointer;" @click="showImg(examDetails.materials)">
          </div>
        </div>
        <div class="line">
          <div class="left">审核意见：</div>
          <div class="right">{{examDetails.auditOpinion}}</div>
        </div>
        <!-- <div class="line">
          <div class="left">不通过原因：</div>
          <div class="right">{{examDetails.cause}}</div>
        </div> -->
      </div>
    </a-modal>

    <!-- 申请材料预览 -->
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      wrapClassName="previewImgModal"
    >
      <img alt="pic" style="width: 100%" :src="previewImage" />
    </a-modal>

    <template v-if="isMounted">
      <Page v-show="dataList.length" @getList="getList" ref="page" />
    </template>

  </div>
</template>
 
<script>
import { downloadFile } from "@/utils/util.js";
// 查询列表结构
const columns = [
  {
    title: "考生号",
    dataIndex: "examNum",
    width: 200,
    key: "examNum",
    fixed: 'left'
  },
  {
    title: "考生姓名",
    dataIndex: "examName",
    width: 150,
    align: "center",
    key: "examName",
    fixed: 'left'
  },
  {
    title: "性别",
    dataIndex: "sex",
    width: 100,
    align: "center",
    key: "sex"
  },
  {
    title: "身份证号",
    dataIndex: "idnum",
    width: 200,
    key: "idnum"
  },
  {
    title: "区县名称",
    dataIndex: "countyName",
    width: 250,
    key: "countyName"
  },
  {
    title: "报名点名称",
    dataIndex: "assignsName",
    width: 250,
    key: "assignsName"
  },
  {
    title: "体检医院名称",
    dataIndex: "hospitalName",
    width: 300,
    key: "hospitalName"
  },
  {
    title: "复查科室",
    dataIndex: "reviewDesk",
    width: 150,
    align: "center",
    key: "reviewDesk"
  },
  {
    title: "复查说明",
    dataIndex: "reviewExplain",
    width: 250,
    key: "reviewExplain",
    scopedSlots: { customRender: "reviewExplain" },
    ellipsis: true
  },
  {
    title: "复查申请材料",
    dataIndex: "materials",
    width: 150,
    align: "center",
    key: "materials",
    scopedSlots: { customRender: "materials" }
  },
  {
    title: "申请人",
    dataIndex: "proposer",
    width: 150,
    align: "center",
    key: "proposer"
  },
  {
    title: "申请时间",
    dataIndex: "applyTime",
    width: 200,
    align: "center",
    key: "applyTime"
  },
  {
    title: "考生状态",
    dataIndex: "examState",
    width: 150,
    align: "center",
    key: "examState",
    scopedSlots: { customRender: "examState" },
  },
  /* {
    title: "复查医生",
    dataIndex: "reviewDoctor",
    width: 150,
    align: "center",
    key: "reviewDoctor"
  }, */
  {
    title: "复查完成时间",
    dataIndex: "reviewTime",
    width: 200,
    align: "center",
    key: "reviewTime"
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 100,
    align: "center",
    fixed: 'right',
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  data() {
    return {
      isMounted: false, //第一次不渲染Page组件
      tableHeight: 0, //table高度

      treeData: [], // 机构树数据
      replaceFields: {
        children: 'children', 
        title: 'orgName', 
        key: 'orgCode', 
        value: 'orgCode',
      }, //替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段

      medicalHospitalList: [], // 体检医院

      columns, // 查询列表结构
      dataList: [], // 查询列表数据
      tableLoading: false,
      stripTotal: null, //查询列表总条数

      search: {
        orgCode: null, //机构id
        tjzdm: '', //体检医院代码
        examState: '', //考生状态
        keyword: "", //输入框内容
        current: 1, //当前页
        pageSize: 20, //每页条数
        type: "1" // 查询或搜索
      },

      examDetails: {}, //考生详情
      visible: false, //详情model

      previewVisible: false, // 申请材料预览
      previewImage: "" // 申请材料地址
    }
  },
  mounted() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.search.orgCode = userInfo.orgCode
    this.treeData = JSON.parse(sessionStorage.getItem('treeData'))
    this.getList()
    this.getMedicalHospital()

    this.$nextTick(() => {
      this.getTableHeight();
    })
  },
  methods: {
    // 获取表格高度
    getTableHeight() {
      let tableHeight = window.document.querySelector(".list")
      this.tableHeight = tableHeight.clientHeight - 47 - 21 - 20;
    },

    // 机构树选择
    onSelect(selectedKeys, e) {
      console.log('onSelect', selectedKeys, e);
      this.search.orgCode = selectedKeys
      this.getMedicalHospital()
    },

    // 获取医院数据
    async getMedicalHospital() {
      try {
        const res = await this.$api.init.getMedicalHospital({
          orgCode: this.search.orgCode
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res.data.hospitalList);
          this.medicalHospitalList = res.data.hospitalList
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },

    // 申请材料madel
    handlePreview(text) {
      console.log(text)
      this.previewImage = text
      this.previewVisible = true
    },
    handleCancel() {
      this.previewVisible = false;
    },

    //查看考生详情
    details(record) {
      console.log(record)
      this.examDetails = record
      this.visible = true;
    },
    // 材料查看
    showImg(text) {
      this.previewImage = text
      this.previewVisible = true
    },
    //详情modal框确定
    detailsModalHandleOk(e) {
      console.log(e);
      this.visible = false;
    },
    //详情modal框取消
    detailsModalHandleCancel(e) {
      console.log(e);
      this.visible = false;
    },

    // 获取列表
    async getList() {
      this.tableLoading = true;
      try {
        const res = await this.$api.PhyExamQueryStat.reviewExamineeList({
          ...this.search
        });
        if (res.code === "200" || res.code === 200) {
          console.log(res);
          this.dataList = res.data.list
          this.stripTotal = res.data.pagination.total
          this.isMounted = true
        }
      } catch (error) {
        console.log(error);
        this.$message.error("请求失败！" + error);
      } finally {
        this.tableLoading = false;
      }
    },

    // 查询或搜索列表内容
    async searchList(type) {
      console.log(type)
      this.search.type = type
      this.$refs.page.pagination.current = 1
      this.search.current = 1;

      if (type === "1") {
        this.search.keyword = ""
      } else if (type === "2") {
        this.search.orgCode = JSON.parse(sessionStorage.getItem('userInfo')).orgCode
        this.search.tjzdm = ''
        this.search.examState = ''

        this.getMedicalHospital()
      }

      await this.getList()
      this.$refs.page.returnPageTotal()
    },

    // 导出
    async allExport() {
      this.$store.state.app.exportSpinLoading = true;
      try {
        const res = await this.$api.PhyExamQueryStat.allExport({
          ...this.search,
          excelType: '3'
        });
        downloadFile(res)
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.app.exportSpinLoading = false;
      }
    }
  }
}
</script>
 
<style lang = "less">
 #reviewExamineeQuery{
    height: 100%;
    display: flex;
    flex-direction: column;

   .top{
     .topSearch{
       display: flex;
       justify-content:space-between;
       .query{
         display: flex;
         width: 70%;
         flex-wrap: wrap;
       }
       .search{
          display: flex;
          flex-grow: 1;
          justify-content: flex-end;
       }
     }
   }

   .list{
     flex-grow: 1;
     overflow-y: auto;

     .colOrange{
       color: #FF9B3A;
     }
     .colGray{
       color: #ABABAB;
     }
     .colGreen{
       color: #4CCA75;
     }
     .colRed{
       color: #FF6262;
     }
   }
 }

 /* 学生详情modal */
 .detailsModal{
   .ant-modal-body {
     .title{
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        font-weight: 600;
        padding-left: 10px;
        border-left: 3px solid #595959;
     }
     .infoDetails{
       border-top:1px solid #e8e8e8;
       margin: 10px 0;
       .line{
         display: flex;
         justify-content:space-between;
         margin-top: 10px;
         .left{
           width: 50%;
           display: flex;
           .name{
             width: 30%;
             text-align: right;
           }
         }
         .right{
           width: 50%;
           display: flex;
           .name{
             width: 25%;
             text-align: right;
           }
         }
       }
       .line1{
         display: flex;
         margin-top: 10px;
         .name{
            width: 15%;
            text-align: right;
          }
       }
     }
     .reviewDetails{
       border-top:1px solid #e8e8e8;
       margin-top: 10px;
       .line{
         display: flex;
         margin-top: 10px;
         .left{
           width: 14%;
           text-align: right;
         }
         .right{
           width: 86%;
         }
       }
     }
   }
   .ant-modal-footer{
     border: 0;
     text-align: center;
   }
 }
/* 申请材料预览modal框 */
.previewImgModal {
  z-index: 99999;
  .ant-modal-body {
    padding: 40px;
  }
}
</style>