<template>
  <div class="batch-import">
    <header>
      <h3 class="title">考生批量录入</h3>
      <a-button @click="goBack">
        <svg-icon icon-class="返回" :scale="0.8" style="margin-right: 5px" />
        返回
      </a-button>
    </header>
    <section>
      <!-- 上传 -->
      <div class="upload">
        <label for>数据修改申请材料：</label>
        <a-upload
          name="file"
          :action="baseUrl + '/uploadFile'"
          :headers="headers"
          :before-upload="beforeUpload"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :fileList="fileList"
          @change="handleChange"
        >
          <a-tooltip>
            <template slot="title">上传考生变更项批量文件，xls格式</template>
            <a-button>
              <a-icon type="upload" />选择文件
            </a-button>
          </a-tooltip>
        </a-upload>
        <div class="ex">
          <a-tooltip>
            <template slot="title">点击即可下载导入的数据模板</template>
            <a @click="downloadTemplate('1')"><a-icon type="download" style="margin-right:5px;"/>四川省成都市武侯区考生（模板）.xls</a>
          </a-tooltip>
        </div>
      </div>
      <div class="btn">
        <a-button type="primary" @click="handleImport('1')"> <a-icon type="form" /> 全量导入 </a-button>
        <a-button type="primary" @click="handleImport('2')" style="margin-left:20px;" > <a-icon type="form" /> 增量导入 </a-button>
      </div>
    </section>
    <!-- 导入说明 -->
    <section class="explain">
      <div class="title">导入说明</div>
      <ul class="list-wrap">
        <li class="list-item">1、请严格按照模板格式制作导入文件。</li>
        <li class="list-item">2、模板中，变更项列必须在下拉选项支持的范围（非代码），超出范围都会被系统处理为格式异常；原始值必须同系统保持一致（非代码）；变更值必须完全信息标准（非代码）。</li>
        <li class="list-item">3、考生报名号必须为系统中已存在的考生。</li>
        <li class="list-item">4、考生基础信息必须对应。</li>
        <li class="list-item">5、全量导入为覆盖式导入，即每次导入都会删除现有的数据，请谨慎操作。</li>
        <li class="list-item">6、导入日志只展示前十条错误，具体见反馈文件。</li>
      </ul>
    </section>
    <!-- 录入模板 -->
    <section>
      <div class="alter-head">
        <h4>考生变更项录入模板</h4>
      </div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        size="middle"
      ></a-table>
    </section>
    <!-- 弹框 -->
    <a-modal
      class="result-modal"
      v-model="visible"
      title="导出日志"
      @ok="handleOk"
      :footer="null"
      width="480px"
    >
      <div class="head">
        <a-icon type="exclamation-circle" :style="{fontSize:'26px',color:'#FF9933'}"/>
        <div class="tips">当前共导入考生数据{{totalNum}}条，其中异常数据<span style="color:#FF9933;font-size:24px;">{{errNum}}</span> 条 </div>
      </div>
      <div class="content">
        <ul>
          <li v-for="(item,index) of errDataList" :key="index">{{item}}</li>
        </ul>
      </div>
      <div class="footer">
        <a-tooltip>
          <template slot="title">点击即可下载导入返回的错误信息表</template>
          <a @click="downloadTemplate('2')"><a-icon type="download" style="margin-right:5px;"/>四川省成都市武侯区考生（错误返回）.xls</a>
        </a-tooltip>
      </div>
    </a-modal>
  </div>
</template>
 
<script>
/**
 * @description 考生批量录入
 * @date 2021-01-22 09:00:50
 */

import { downloadFile } from '@/Utils/util'
const columns = [
  {
    title: "BMH",
    key: "BMH",
    dataIndex: "BMH",
    align: "center",
  },
  {
    title: "SFZH",
    key: "SFZH",
    dataIndex: "SFZH",
    align: "center",
  },
  {
    title: "KSXM",
    key: "KSXM",
    dataIndex: "KSXM",
    align: "center",
  },
  {
    title: "BGX",
    key: "BGX",
    dataIndex: "BGX",
    align: "center",
  },
  {
    title: "YSZ",
    key: "YSZ",
    dataIndex: "YSZ",
    align: "center",
  },
  {
    title: "BGZ",
    key: "BGZ",
    dataIndex: "BGZ",
    align: "center",
  },
];
const data = [
  {
    key:"214d4fas4d4sdas1sc",
    BMH:"报名号（必填）",
    SFZH:"身份证号（必填）",
    KSXM:"考生姓名（必填）",
    BGX:"变更项（必填）",
    YSZ:"原始值（非必填）",
    BGZ:"变更值（非必填）",
  }
];
import { baseUrl } from "@/Utils/global";
export default {
  name: "batchImport",
  components: {},
  data() {
    return {
      columns,
      data,
      visible: false,
      baseUrl,
      headers: { // 文件上传headers
        // authorization: "authorization-text",
        token: sessionStorage.getItem("sjgdxgxt_token"),
        exId: sessionStorage.getItem("exId")
      },
      fileList: [],  // 申请材料对象，回显使用
      fileUrl:"",
      fileName: "",
      totalNum:"100",
      errNum:"70000",
      wkId: '',
      errDataList: [],
    };
  },
  computed: {},
  mounted() {
    this.wkId = sessionStorage.getItem('id');
    console.log(sessionStorage.getItem('id'));
  },
  methods: {
    // 返回
    goBack(){
      this.$router.go(-1);
    },
    handleOk() {
      this.visible = false;
    },
    // 下载模板
    // type=1，返回的错误信息表
    // type=2 ，下载导入返回的错误信息表
    async downloadTemplate(type){
      const { wkId } = this;
      const data = { wkId, type };
      try {
        const res = await this.$api.WorkOrderApply.downloadTemplate(data);
        downloadFile(res)
      } catch (error) {
        console.log(error)
        this.$message.error(error)
      }
      
    },
    // 导入
    async handleImport(type){
      if(!this.fileUrl){
        return this.$message.warn("请先上传文件！")
      }
      const { wkId, fileUrl } = this;
      const data = { wkId, type, fileUrl };
      try {
        this.visible = true;
        this.errDataList  = [
          '第56条数据异常，报名号不存在；',
          '第73条数据异常，变更项数据不在可选范围；',
          '第64条数据异常，身份证号格式错误；',
          '第91条数据异常，报名号和身份证号无法对应；',
          '第92条数据异常，考生姓名不能为空；',
          '第93条数据异常，原始值字符长度过长；',
          '第9101条数据异常，变更项数据重复',
          '第91条数据异常，变更项数据重复第91条数据异常，变更项数据重复',
          '第56条数据异常，报名号不存在；',
          '第73条数据异常，变更项数据不在可选范围；',
          '第64条数据异常，身份证号格式错误；',
          '第91条数据异常，报名号和身份证号无法对应；',
          '第92条数据异常，考生姓名不能为空；',
          '第93条数据异常，原始值字符长度过长；',
          '第9101条数据异常，变更项数据重复',
          '第91条数据异常，变更项数据重复第91条数据异常，变更项数据重复',
          '第56条数据异常，报名号不存在；',
          '第73条数据异常，变更项数据不在可选范围；',
          '第64条数据异常，身份证号格式错误；',
          '第91条数据异常，报名号和身份证号无法对应；',
          '第92条数据异常，考生姓名不能为空；',
          '第93条数据异常，原始值字符长度过长；',
          '第9101条数据异常，变更项数据重复',
          '第91条数据异常，变更项数据重复第91条数据异常，变更项数据重复',
        ]
        const res = await this.$api.WorkOrderApply.batchEntry(data);
        console.log(res);
        if(res.code === '200'){

        }
      } catch (error) {
        console.log(error);
        this.$message.error(error)
      }
      
    },
    // 上传文件之前
    beforeUpload(file, fileList) {
      console.log(file);
      const isXLSX = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || "application/vnd.ms-excel";
      if (!isXLSX) {
        this.$message.error("请上传xlsx文件！");
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
          // this.fileWithWorkOrder("1");
        }
        this.$message.success(`${info.file.name} 上传成功！`);
      } else if (info.file.status === "removed") {
        this.fileUrl = '';
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败！`);
      }
    },
  },
};
</script>
 
<style scoped lang="less">
/deep/.ant-upload-list-item-name{
  max-width: 550px;
  padding-right: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upload>span{
  display: flex;
}
/deep/.ant-upload-list-item-card-actions {
  margin-left: 20px;
}
.batch-import {
  padding: 20px;
  header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #e6ecf2;
  }
  .upload{
    height: 90px;
    display: flex;
    align-items: center;
    .ex{
      margin-left: 60px;
    }
  }
  .btn{
    height: 55px;
    margin-left: 126px;
  }
  .explain{
    background-color: #fafafa;
    display: flex;
    align-items: center;
    min-height: 180px;
    .title{
      background-color: #e9e9e9;
      width: 70px;
      min-height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      font-size: 16px;
      font-weight: 600;
    }
    .list-wrap{
      margin-bottom: 0;
      padding-left: 20px;
      flex: 1;
      .list-item{
        min-height: 28px;
        line-height: 28px;
        list-style: none;  
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
}
.result-modal{
  .head{
    display: flex;
    align-items: center;
    margin-left: 20px;
    .tips{
      margin-left: 10px;
    }
  }
  .content{
    min-height: 100px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    background-color: #F7F8FA;
    margin: 20px;
    ul{
      margin-bottom: 0;
      padding-left: 20px;
      max-height: 280px;
      overflow-y: scroll;
      li{
        min-height: 24px;
        line-height: 24px;
        list-style: none;
        &:hover{
          background-color: rgb(230, 230, 230);
        }
      }
    }
  }
  .footer{
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-left: 20px;
  }
}
</style>