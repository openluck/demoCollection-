<template>
  <div class="submit-wk">
    <a-modal
      class="submit-wk-modal"
      v-model="visible"
      title="签字提交"
      :destroyOnClose="true"
      :confirm-loading="confirmLoading"
      :width="400"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <div class="info">
        您已录入
        <span class="examinee-length">{{examineeLength}}</span>个考生，确认录入的违纪考生材料无误且完整吗？
        <span class="wran">一旦提交不可再录入、删除、编辑考生信息，</span>确定无误请扫描上方二维码或复制链接到网页进行签字提交。
      </div>
    </a-modal>
    <!-- 根据需求提交不需要扫描二维码 -->
    <!-- 2021-3-9 09:43:17 -->

    <!-- <GlobalModal
      class="submit-wk-modal"
      :visible="visible"
      @cancel="closeModal"
      :width="400"
      :destroyOnClose="true"
      title="签字提交"
      :afterClose="afterClose"
    >
      <div class="QR-code">
        <canvas id="QRCode"></canvas>
      </div>
      <div class="info">
        确认录入的考生信息和考生材料无误且完整吗？<span class="wran">一旦提交不可再录入、删除、编辑考生信息，</span>确定无误请扫描上方二维码或复制链接到网页进行签字提交。
      </div>
      <div v-if="hasConfirm" class="hasConfirm">
        <a-icon style="color:green;margin-right:10px" type="check-circle" />您已确认签字，即将关闭当前窗口
      </div>
    </GlobalModal> -->
  </div>
</template>
 
<script>
/**
 * @description 提交工单
 * @date 2020-12-9 17:58:35
 */
import QRCode from "qrcode"; //引入生成二维码插件
import GlobalModal from "@/components/common/draggableModal";
export default {
  name: "SubmitWk",
  components: { GlobalModal },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      examineeLength: 0,
      QRcodeUrl: "",
      p:"",
      loading: true,
      wkId: "",
      hasConfirm: false,
      pollingInterval: null,
      id: "", // 工单id
      timer:null
    };
  },
  computed: {},
  mounted() {},
  beforeDestroy(){
    clearInterval(this.timer);
  },
  methods: {
    async showModal(record, type) {
      this.hasConfirm = false;
      // 在工单申请列表中提交
      if (type === "wkList") {
        const { wkId, id, name } = record;
        // 获取到该工单一共有多少考生
        if (name) {
          const examinee = name.split(",");
          // const ex1 = name.split(",")
          this.examineeLength = examinee.length;
        }

        this.wkId = wkId;
        this.id = id;
      } else if (type === "wkEdit") {
        console.log('record',record);
        // 在工单编辑页面提交
        const { wkId, id, examineeLength } = record;
        // 获取到该工单一共有没有考生
        this.examineeLength = examineeLength;
        this.wkId = wkId;
        this.id = id;
      }
      // 提交时需要验证，如果检测到考生数为0或者没有录入考生材料，无法提交
      if (!this.examineeLength) {
        this.$message.warn("检测到工单所辖考生数为0或未录入考生材料，无法提交！");
        return;
      }
      this.visible = true;
    },
    
    // 确认提交
    handleOk(){
      this.submitWorkOrder();
    },
    // 取消
    handleCancel(){
      this.visible = false;
    },
    // 提交工单
    async submitWorkOrder() {
      const id = this.id;
      this.confirmLoading = true;
      try {
        const res = await this.$api.WorkOrderApply.submitWorkOrder({ id });
        if (res.code === "200") {
          this.confirmLoading = false;
          this.visible = false;
          // 重新请求数据
          this.$emit("getWorkOrderList");
          this.$emit("getExamineeList");
          // 提交成功之后关闭二维码弹框时将页面type改为 look
          this.$parent.type = 'look';
          sessionStorage.setItem('wkPageType', 'look');
        } else {
          this.$message.error("提交失败！" + res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 关闭模态框
   /*  closeModal(){
      this.visible = false;
      // 重新请求数据
      this.$emit("getWorkOrderList");
      // 重新请求数据
      this.$emit("getExamineeList");
      this.$emit("getAuditLog");
      // this.$$parent.changeType('look');
    }, */
    // 二维码弹框关闭之后
    /* afterClose() {
      clearInterval(this.timer);
    }, */
    // 二维码关闭倒计
    /* delayReQRCode() {
      //轮询获取二维码扫描状态
      this.timer = window.setInterval(() => {
        this.getQrcodeStatus()
      }, 2000);
    }, */
    // 获取二维码提交状态
    /* async getQrcodeStatus() {
      this.hasConfirm = false;
      const filter = {
        orgTypeId: JSON.parse(sessionStorage.getItem("userInfo")).orgTypeId,
        wkId: [this.id],
        dealType: "1", // 处理方式  1：申请  2：审核
        p:this.p
      };
      const result = await this.$api.common.getQrcodeStatus(filter);
      if (result.code === "200") {
        this.hasConfirm = true;
        clearInterval(this.timer);
        setTimeout(() => {
          this.visible = false;
          // 重新请求数据
          this.$emit("getWorkOrderList");
          this.$emit("getExamineeList");
          this.$emit("getAuditLog");
          // 提交成功之后关闭二维码弹框时将页面type改为 look
          this.$parent.type = 'look';
          sessionStorage.setItem('wkPageType', 'look');
        }, 3000);
      }
    }, */
    // 提交工单
    /* async submitWorkOrder() {
      const id = this.id;
      try {
        const res = await this.$api.WorkOrderApply.submitWorkOrder({ id });
        if (res.code === "200") {
          this.QRcodeUrl = res.data.url;
          this.p = res.data.p;
          // 如果提交工单成功并且返回了 URL，此时生成二维码
          this.getQRCode();
          // 轮训获取二维码状态
          this.delayReQRCode();
          this.loading = false;
        } else {
          this.$message.error("获取二维码失败！" + res.message);
        }
      } catch (error) {
        console.log(error);
      }
    }, */
    // 生成二维码
    /* getQRCode() {
      const options = {
        errorCorrectionLevel: "H", //容错级别
        type: "image/png", //生成的二维码类型
        quality: 0.3, //二维码质量
        margin: 1, //二维码留白边距
        width: 250, //宽
        height: 250, //高
        color: {
          dark: "#333333", //前景色
          light: "#fff", //背景色
        },
      };
      this.QRCodeMsg = this.QRcodeUrl; //生成的二维码为URL地址js
      this.$nextTick(()=>{
        const ele = document.getElementById("QRCode");
        // 将获取到的数据（val）画到msg（canvas）上
        QRCode.toCanvas(ele, this.QRCodeMsg, options, (error) => {
          console.log(error);
        });
      })
    }, */
  },
};
</script>
 
<style scoped lang="less">
.submit-wk-modal {
  
  .QR-code {
    width: 352px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info {
    margin: 20px 0;
    text-align: left;
    font-size: 12px;
    .examinee-length {
      font-size: 26px;
      font-weight: 600;
    }
    .wran {
      color: rgb(0, 0, 0);
    }
  }
  .hasConfirm{
    font-size: 16px;
    margin-top: 20px;
    text-align: center;
  }
  /* /deep/.ant-modal-footer {
    border: 0;
    text-align: center;
    padding-bottom: 40px;
    .ant-btn:first-child {
      margin-right: 20px;
    }
  } */
}
</style>