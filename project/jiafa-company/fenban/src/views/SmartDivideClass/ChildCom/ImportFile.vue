<template>
  <div class="improt-file">
    <a-drawer title="文件导入" placement="right" :closable="false" :visible="visible" @close="onClose" width="620">
      <div class="title"></div>
      <span v-show="errorMb" class="error-mb" @click="uploadErrorTemplate">下载错误信息模板</span>
      <!-- accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" -->
      <a-upload-dragger name="file" :action="uploadAction" :headers="headers" :before-upload="beforeUpload"
        :fileList="fileList" @change="handleChange">
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
        <p class="ant-upload-hint">支持扩展名：xls、xlsx</p>
        <div style="height:10px"></div>
        <a class="down-a" @click="handleDownExcelTep" style="margin-top:15px;">点我下载模板 </a>
      </a-upload-dragger>
      <div :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }">
        <a-button style="marginRight: 8px" @click="onClose">取消</a-button>
        <a-button type="primary" @click="handleOk" :loading="loading">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>
 
<script>
/**
 * @description 导入分班
 * @date 2021-4-2 13:10:37
 */
import { baseUrl } from "@/Utils/global";
import { downloadFile } from "@/Utils/util";
export default {
  name: "ImportFile",
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      fileList: [],
      loading: false,
      headers: {
        // 文件上传headers
        // authorization: "authorization-text",
        token: "",
        // orgCode: '',
      },
      fileUrl: "",
      errorMb: false,
    };
  },
  computed: {
    uploadAction() {
      return `${baseUrl}/Common/uploadExcel`;
    },
  },
  created() {
    const token = sessionStorage.getItem("fenban_token");
    this.headers.token = token;
  },
  mounted() {},
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
      this.fileList = [];
      this.fileUrl = "";
      this.errorMb = false;
    },
    handleOk() {
      if (!this.fileUrl) {
        // document.getElementsByClassName('ant-upload')[0].style = 'border: 1px dashed red';
        return this.$message.warn("请上传文件！",5);
      }
      this.importDivideClass();
    },
    // 上传文件之前
    beforeUpload(file, fileList) {
      const isXLSX =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isXLSX) {
        this.$message.error("请上传xlsx文件！",5);
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
      }
      if (info.file.status === "done") {
        const res = info.file.response;
        if (res.code === "200") {
          //上传完成之后的路径
          this.fileUrl = res.data.excelurl;
          //上传的文件的size
          // this.fileSize = info.file.size;
          this.fileName = info.file.name;
          this.$message.success(`${info.file.name} 上传成功！`,5);
        } else {
          this.$message.error(res.message,5);
          info.file.status = "error";
        }
      } else if (info.file.status === "removed") {
        this.fileUrl = "";
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败！`,5);
      }
    },
    // 下载模板
    async handleDownExcelTep(e) {
      e.stopPropagation();
      try {
        const params = { key: "d02c23f3981b4ec1a66d52d11c5683b9" };
        const res = await this.$api.getDivideClassList.downExcelTep(params);
        downloadFile(res);
      } catch (error) {
        this.$message.error("下载失败！" + error,5);
        throw new Error(error);
      }
    },
    // 导入文件
    async importDivideClass() {
      try {
        this.loading = true;
        const planId = this.$store.state.adminClass.planId;
        const { fileUrl } = this;
        const params = { planId, fileUrl };
        const res = await this.$api.chooseExam.importDivideClass(params);

        if (res.code === "200") {
          this.loading = false;
          this.visible = false;
          this.$message.success("文件导入成功！",5);
          this.$emit("getBaseClassData");
          // 上传成功之后清空filelist
          this.fileList = [];
          this.fileUrl = "";
        } else if (res.code === "3001") {
          this.errorMb = true;
          this.errorExcelurl = res.message;
          this.$message.warning("请下载错误信息模板，进行查看错误信息",5);
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error("文件导入失败！" + res.message,5);
        }
      } catch (error) {
        this.loading = false;
        console.log(error);
        // throw new Error(error);
      }
    },
    /**
     * @desc 下载错误信息模板
     */
    async uploadErrorTemplate() {
      e.stopPropagation();
      let data = {
        excelurl: this.errorExcelurl,
      };
      const errorRes = await this.$api.chooseExam.downExcelError(data);
      downloadFile(errorRes, this.errorExcelurl);
    },
  },
};
</script>
 
<style scoped lang="less">
/deep/.ant-drawer-body {
  margin-top: 20px;
  .down-a {
    &:hover {
      text-decoration: underline;
    }
  }
  .error-mb {
    color: red;
    cursor: pointer;
    margin-bottom: 10px;
  }
}
</style>