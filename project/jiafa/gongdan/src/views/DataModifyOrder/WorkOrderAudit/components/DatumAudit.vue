<template>
  <div class="datum-audit">
    <div class="work-order-audit-upload">
      <span class="upload-control">
        <span>审核材料：</span>
        <a-upload
          name="file"
          :action="baseUrl+ '/uploadFile'"
          :headers="headers"
          :before-upload="beforeUpload"
          accept=".PDF"
          :fileList="fileList"
          @change="handleChange"
          @preview="filePreview"
        >
          <a-button>选择文件</a-button>
        </a-upload>
      </span>
      <span class="upload-sign-confirm">
        <a-button
          type="primary"
          icon="check"
          v-if="qrbtnVisible"
          @click="openTipModal"
        >{{switchComfName}}</a-button>
      </span>
    </div>
    <!-- 签字确认提示弹框 -->
    <drag-modal :visible="tipVisible" @cancel="tipHandleCancel" :footer="null">
      <div class="tip-modal-title" slot="title">提示</div>
      <span
        class="tip-modal-content-list"
        v-for="(item,index) in reOpList"
        :key="index"
      >考生[{{item.examineeName}}：{{item.examineeIdNumber}}]</span>
      <p class="tip-modal-content-confirm">{{confirmText}}</p>
      <div class="tip-modal-footer">
        <a-button type="primary" @click="tipHandleOk">确定</a-button>
        <a-button style="margin-left:10px" @click="tipHandleCancel">取消</a-button>
      </div>
    </drag-modal>
    <drag-modal
      class="QR-submit-wk-modal"
      :title="qrCodeTitle"
      :visible="qsCodeVisible"
      @cancel="concelQsCode"
      :width="400"
    >
      <div class="QR-code">
        <canvas id="QRCode"></canvas>
      </div>
      <div class="info">
        <p>请扫描上方二维码进行签名确认，确认后系统将自动提交给上级，提交后将无法修改，如需修改需上级退回</p>
      </div>
    </drag-modal>
  </div>
</template>
 
<script>
import { baseUrl } from "../../../../Utils/global";
import QRCode from "qrcode"; //引入生成二维码插件
import DragModal from "@/components/common/draggableModal";

export default {
  name: "",
  components: { DragModal },
  props: {
    selectedWkIds: Array
  },
  data() {
    return {
      baseUrl,
      headers: {
        token: sessionStorage.getItem("sjgdxgxt_token"),
        exId: sessionStorage.getItem("exId")
      },
      fileList: [],
      fileUrl: "",
      fileName: "",
      qrbtnVisible: false,
      //提示弹框数据
      tipVisible: false,
      reOpList: [], //退回意见考生
      //确认及弹出二维码相关数据
      qsCodeVisible: false,
      qrCodeTitle: "提交签名"
    };
  },
  computed: {
    confirmText() {
      const orgLevel = JSON.parse(sessionStorage.getItem("userInfo")); //判断省级还是区县
      if (orgLevel === "1") {
        return "已录入退回意见，是否确认审核通过并进行数据修改";
      } else {
        return "已录入退回意见，是否确认审核通过";
      }
    },
    switchComfName() {
      const curOrgLevel = JSON.parse(sessionStorage.getItem("userInfo"))
        .orgTypeId;
      if (curOrgLevel === "1") {
        return "确认修改";
      } else {
        return "确认";
      }
    }
  },
  mounted() {},
  methods: {
    /**
     * 文件上传校验
     */
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
    /**
     * 文件上传
     */
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
          this.fileName = info.file.name;
        }
        this.qrbtnVisible = true;
        this.$message.success(`${info.file.name} 上传成功！`);
      } else if (info.file.status === "removed") {
        this.qrbtnVisible = false;
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败！`);
      }
    },
    /**
     * 上传文件预览
     */
    filePreview(file) {
      this.showPDF(file.response.data.url);
    },
    /**
     * 提示弹窗
     */
    openTipModal() {
      this.getReOpExamiee();
    },
    /**
     * 获取退回意见考生
     */
    async getReOpExamiee() {
      const result = await this.$api.workOrderAudit.getReOpExamiee({
        wkId: this.selectedWkIds
      });
      if (result.code === "200") {
        const reOpList = result.data.list;
        if (reOpList.length > 0) {
          this.reOpList = result.data.list;
          this.tipVisible = true;
        } else {
          this.qsCodeVisible = true;
          this.signConfirm();
        }
      }
    },
    tipHandleOk() {
      this.tipVisible = false;
      this.qsCodeVisible = true;
      this.signConfirm();
    },
    tipHandleCancel() {
      this.tipVisible = false;
    },
    /**
     * 关闭二维码弹窗
     */
    concelQsCode() {
      clearInterval(this.pollingInterval);
      this.selectedRowKeys = [];
      this.qsCodeVisible = false;
      this.getAuditOrderList();
    },
    /**
     * 生成二维码
     */
    getQRCode() {
      const options = {
        errorCorrectionLevel: "H", //容错级别
        type: "image/png", //生成的二维码类型
        quality: 0.3, //二维码质量
        margin: 1, //二维码留白边距
        width: 250, //宽
        height: 250, //高
        // text: "http://www.apple.com.cn",//二维码内容
        color: {
          dark: "#333333", //前景色
          light: "#fff" //背景色
        }
      };
      this.QRCodeMsg = this.qrcodeUrl; //生成的二维码为URL地址js
      const ele = document.getElementById("QRCode");
      // 将获取到的数据（val）画到msg（canvas）上
      QRCode.toCanvas(ele, this.QRCodeMsg, options, error => {
        console.log(error);
      });
    },
    /**
     * 签字确认提交-二维码获取
     */
    async signConfirm() {
      const signConfirmFilter = {
        wkId: this.selectedWkIds,
        fileUrl: this.fileUrl,
        fileName: this.fileName
      };

      const result = await this.$api.workOrderAudit.signConfirm(
        signConfirmFilter
      );
      if (result.code === "200") {
        this.qrcodeUrl = result.data.qrcodeUrl;
        this.tokenP = result.data.p;
        this.getQRCode();
        this.delayReQRCode();
      }
    },

    /**
     * 二维码关闭倒计时
     */
    delayReQRCode() {
      this.countdown = 60;
      //轮询获取二维码扫描状态
      this.pollingInterval = setInterval(() => {
        this.getQrcodeStatus();
      }, 2000);
      // setTimeout(() => {
      //   this.qsCodeVisible = false;
      //   clearInterval(polling);
      //   clearInterval(countdown);
      // }, 6000);
    },
    /**
     * 获取二维码提交状态
     */
    async getQrcodeStatus() {
      this.hasConfirm = false;
      const filter = {
        orgTypeId: JSON.parse(sessionStorage.getItem("userInfo")).orgTypeId,
        wkId: this.selectedWkIds,
        dealType: "2",
        p: this.tokenP
      };
      const result = await this.$api.common.getQrcodeStatus(filter);
      if (result.code === "200") {
        this.hasConfirm = true;
        clearInterval(this.pollingInterval);
        setTimeout(() => {
          this.qsCodeVisible = false;
          this.qrbtnVisible = false;
          this.fileList.length = 0;
          this.$parent.getExamineeList();
          this.$router.push({ path: "/DataModifyOrder/WorkOrderAudit" });
        }, 1000);
      }
    }
  }
};
</script>
 
<style scoped lang = "less">
.datum-audit {
  display: inline-block;
  margin-left: 10px;
  width: 50%;
  height: 60px;
  .work-order-audit-upload {
    display: inline-block;
    width: 100%;
    height: 60px;
    line-height: 60px;
    .upload-control {
      display: inline-block;
    }
  }
}
.tip-modal-title {
  width: 100%;
  text-align: left;
  font-size: 14px;
}
.tip-modal-content-list {
  display: inline-block;
  width: 100%;
  height: 16px;
  line-height: 16px;
  text-align: center;
}
.tip-modal-content-confirm {
  text-align: center;
  margin: 20px 0;
}
.tip-modal-footer {
  text-align: center;
  margin: 0 auto;
}
/* 二维码弹框 */
.QR-submit-wk-modal {
  .QR-code {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info {
    text-align: center;
    margin-top: 10px;
  }
}
/deep/ .ant-upload-list {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  zoom: 1;
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
}
/deep/.ant-upload-list-item-name {
  /* width: 300px; */
  /* overflow: hidden; */
  /* margin-right: 0px; */
  padding-right: 40px;
}
/deep/.ant-upload-list-item {
  position: relative;
  height: 100%;
  font-size: 14px;
}
/deep/.ant-upload-list-item-name {
  display: inline-block;
  max-width: 400px;
  padding-left: 22px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>