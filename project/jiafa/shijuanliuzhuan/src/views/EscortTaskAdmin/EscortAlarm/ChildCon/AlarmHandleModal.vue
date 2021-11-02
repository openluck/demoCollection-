<template>
  <div class="alarmHandleModal">
    <a-modal
      :visible="visible"
      title="报警处置"
      width="500px"
      class="alarmHandleModal"
      :footer="null"
      @cancel="cancel"
      :destroyOnClose="false"
    >
      <div class="modalContent">
        <div class="modalTimeHeader">
          <div class="modalTime">
            <p>报警时间：{{modalData.alarmTime}}</p>
            <div id="alarmLocation"></div>
          </div>
          <!-- <div class="modalPic">
            <p>报警抓拍</p>
            <div class="modalPicBox">
              <img v-for="(item,index) in 10" :key="index" src="" alt="" >
            </div>
          </div>-->
        </div>
        <div class="modalHandle">
          <span>处置：</span>
          <a-radio-group v-if="visible" :defaultValue="modalData.actionStatus" ref="actionStatus">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="2">异常</a-radio>
          </a-radio-group>
        </div>
        <div style="display:flex">
          <span style="width:42px">备注：</span>
          <a-textarea
            v-if="visible"
            ref="remark"
            :maxLength="100"
            style="width:390px"
            placeholder="请输入备注"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            :defaultValue="modalData.remark"
          />
        </div>
        <div class="footer">
          <a-button type="primary" @click="saveInfo">
            <icon name="ok" scale="2.2"></icon>确定
          </a-button>
          <a-button @click="cancel">
            <icon name="close" scale="2"></icon>取消
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { getStore } from "@/utils/util.js";
import { Button, Input, Modal, Radio, message } from "ant-design-vue";
Vue.prototype.$message = message;
message.config({
  duration: 2,
  maxCount: 1
});
Vue.use(Button)
  .use(Input)
  .use(Modal)
  .use(Radio);
export default {
  name: "AlarmHandleModal",
  props: ["modalData"],
  data() {
    return {
      map: {},
      marker: {},
      visible: false,
      // accountId:"11",
      accountId: ""
    };
  },
  mounted() {
    this.accountId = JSON.parse(getStore("userInfo")).userid||JSON.parse(getStore("userInfo")).accountname;
    setTimeout(() => {
      this.initMap();
    }, 1000);
  },
  watch: {
    modalData(newValue, old) {
      this.initMap();
    }
  },
  methods: {
    saveInfo() {
      const actionStatus = this.$refs.actionStatus.stateValue;
      if (actionStatus) {
        const accountId = this.accountId;
        const { uid } = this.modalData;
        this.visible = false;
        const remark = this.$refs.remark.stateValue;
        this.$store.commit("escortAlarm/save", {
          uid,
          remark,
          actionStatus,
          accountId
        });
        this.$store.dispatch(
          "escortAlarm/confirmEscortAlarmAsync",
          this.message
        );
      } else {
        this.$message.error("请选择处置类型！");
      }
    },
    initMap() {
      const { longitude, latitude } = this.modalData;
      this.map = new AMap.Map("alarmLocation", {
        resizeEnable: true, //窗口大小调整
        // center: [104.06327,30.66074], //中心 firstArr: [116.478935, 39.997761],
        center: [longitude, latitude], //中心 firstArr: [116.478935, 39.997761],
        zoom: 12
        //  viewMode: "3D" //使用3D视图
      });
      let icon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(36, 36),
        // 图标的取图地址
        image:
          "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
        // 图标所用图片大小
        imageSize: new AMap.Size(25, 40)
        // 图标取图偏移量
        // imageOffset: new AMap.Pixel(-9, -3)
      });
      this.marker = new AMap.Marker({
        map: this.map,
        position: [longitude, latitude],
        icon,
        // offset: new AMap.Pixel(-26, -13), //调整图片偏移
        autoRotation: true //自动旋转
        // angle: -90 //图片旋转角度
      });
    },
    cancel() {
      this.visible = false;
    },
    message(result) {
      if (result) {
        this.$message.success("保存成功！");
      } else {
        this.$message.error("保存失败！");
      }
    }
  }
};
</script>

<style lang="less" scpoed>
.alarmHandleModal {
  .modalContent {
    .modalTimeHeader {
      display: flex;
      p {
        font-weight: 700;
        font-size: 14px;
        margin-bottom: 12px;
      }
      .modalTime {
        margin-right: 10px;
        #alarmLocation {
          width: 438px;
          height: 248px;
          //  background-color: aqua;
          // border: 1px solid #f40;
        }
      }
    }
    .modalHandle {
      padding: 15px 0;
    }
    .footer {
      padding: 15px 0 15px 42px;
      .svg-icon {
        margin-right: 5px;
        vertical-align: -4px;
      }
    }
  }
  .ant-btn-primary {
    background-color: #398fe6;
    border-color: #398fe6;
    margin-right: 20px;
  }
  .ant-modal-body {
    padding: 10px 30px;
  }
  .ant-btn {
    padding: 0 15px;
  }
}
// .ant-modal-content {
// }
</style>