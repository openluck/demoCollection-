<template>
  <div class="video_modal">
    <a-modal
      v-model="appVideoModalVisible"
      footer
      @cancel="appVideoModalVisible = false"
      wrapClassName="my-modal"
    >
      <!-- <div id="largeVideo" v-if="isGetedVideo" ref="myref" style="width:100%; height:100%;">
        <div class="no_video" v-show="isAllOneVideo">
          <img style="width:100%;height:100%" alt src="@/assets/false_video.jpg" />
        </div>
      </div>
      <div class="no_video" v-else>
        <img style="width:100%;height:100%" alt src="@/assets/no_video.png" />
      </div>-->
      <div class="mainContainer" style="width: 100%; height: 200px">
        <video
          id="largeVideo"
          style="width: 100%; height: 600px"
          class="centeredVideo"
          controls
          autoplay
          muted
          width="1015"
          height="576"
        >
          Your browser is too old which doesn't support HTML5 video.
        </video>
      </div>
      <div class="header">
        <a-select
          class="video_change"
          dropdownClassName="select-class-modal"
          @change="(v, op) => videoChange(v, op, 1)"
          v-model="defaultDevice"
        >
          <a-select-option
            v-for="(item, index) in aioDevice"
            :key="index"
            :type="item.devType"
            :value="item.deviceId"
            >{{ item.devName }}</a-select-option
          >
          <a-select-option
            v-for="(item, index) in cameraDevice"
            :key="index"
            :type="item.devType"
            :value="item.deviceId"
            >{{ item.devName }}</a-select-option
          >
          <a-select-opt-group
            v-for="(item, index) in vehicleDeviceList"
            :key="index"
          >
            <span slot="label" style="font-size: 14px"
              >车载设备{{ index + 1 }}</span
            >
            <a-select-option
              :type="item1.devType"
              :parentId="item1.deviceId"
              :channelNum="item1.deviceIndex"
              v-for="item1 in item"
              :key="item1.deviceId"
              >{{ item1.deviceName }}</a-select-option
            >
          </a-select-opt-group>
        </a-select>
        <!-- <select name id>
          <option value="1">1</option>
          <option value="1">1</option>
          <option value="1">1</option>
        </select>-->
        <div class="narrow_logo" @click="closeModal">
          <img src="../../../../../assets/narrow_logo.png" alt />
        </div>
      </div>
    </a-modal>
  </div>
</template>
 
<script>
import flvjs from "flv.js";
export default {
  name: "",
  components: {},
  props: {
    aioDevice: {
      type: Array,
    },
    cameraDevice: {
      type: Array,
    },
    vehicleDeviceList: {
      type: Array,
    },
    isGetedVideo: {
      type: Boolean,
    },
    isAllOneVideo: {
      type: Boolean,
    },
  },
  data() {
    return {
      defaultDevice: "",
      showSelect: false,
      flvPlayerObjM1: null,
      sourceUrl: "",
      appVideoModalVisible: false,
      videoObject: {
        width: 1015, // 宽度，也可以支持百分比(不过父元素宽度要有)
        height: 574, // 高度，也可以支持百分比
        container: "#largeVideo", //“#”代表容器的ID，“.”或“”代表容器的class
        variable: "player", //该属性必需设置，值等于下面的new chplayer()的对象
        autoplay: true, //自动播放
        live: true,
        video: "", //视频地址(必填)
      },
      aioHeartTimerM1: null,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    initFlvM1(url) {
      let that = this;
      let flvPlayerRef1 = document.getElementById("largeVideo");
      if (flvjs.isSupported()) {
        this.flvPlayerObjM1 = flvjs.createPlayer(
          {
            type: "flv",
            isLive: true,
            url: url,
            hasAudio: true,
            hasVideo: true,
          },
          {
            cors: true, // 是否跨域
            stashInitialSize: 128, // 缓存大小(kb)  默认384kb
            enableStashBuffer: false, // 是否启用缓存
            enableWorker: true, // 是否多线程工作
            autoCleanupSourceBuffer: true, // 是否自动清理缓存
          }
        );


        this.flvPlayerObjM1.attachMediaElement(flvPlayerRef1);
        this.flvPlayerObjM1.load(); //加载
        this.flvPlayerObjM1.play();
        that.flvPlayerObjM1.on(flvjs.Events.STATISTICS_INFO, function (res) {
          if (this.lastDecodedFrame == 0) {
            this.lastDecodedFrame = res.decodedFrames;
            return;
          }
          if (this.lastDecodedFrame != res.decodedFrames) {
            this.lastDecodedFrame = res.decodedFrames;
          } else {
            this.lastDecodedFrame = 0;
            if (that.flvPlayerObjM1) {
              that.flvPlayerObjM1.pause();
              that.flvPlayerObjM1.unload();
              that.flvPlayerObjM1.detachMediaElement();
              that.flvPlayerObjM1.destroy();
              that.flvPlayerObjM1 = null;
              that.initFlvM1(url);
            }
          }
        });
        // 断流重连
        that.flvPlayerObjM1.on(
          flvjs.Events.ERROR,
          (errorType, errorDetail, errorInfo) => {
            console.log("errorType:", errorType);
            console.log("errorDetail:", errorDetail);
            console.log("errorInfo:", errorInfo);
            //视频出错后销毁重新创建
            if (that.flvPlayerObjM1) {
              setTimeout(() => {
                that.flvPlayerObjM1.pause();
                that.flvPlayerObjM1.unload();
                that.flvPlayerObjM1.detachMediaElement();
                that.flvPlayerObjM1.destroy();
                that.flvPlayerObjM1 = null;
                that.initFlvM1(url);
              }, 1000);
            }
          }
        );
        // 视频卡顿监听
        that.flvPlayerObjM1.on(
          flvjs.Events.VIDEO_FROZEN,
          (errorType, errorDetail, errorInfo) => {
            console.log("errorType:", errorType);
            console.log("errorDetail:", errorDetail);
            console.log("errorInfo:", errorInfo);
            //视频出错后销毁重新创建
            if (that.flvPlayerObjM1) {
              setTimeout(() => {
                that.flvPlayerObjM1.pause();
                that.flvPlayerObjM1.unload();
                that.flvPlayerObjM1.detachMediaElement();
                that.flvPlayerObjM1.destroy();
                that.flvPlayerObjM1 = null;
                that.initFlvM1(url);
              }, 1000);
            }
          }
        );
      }
    },
    playVideo(url) {
      if (this.flvPlayerObjM1 !== null) {
        this.flvPlayerObjM1.unload();
        this.flvPlayerObjM1.detachMediaElement();
        this.flvPlayerObjM1.destroy();
        this.flvPlayerObjM1 = null;
      }
      this.initFlvM1(url);

      this.aioHeartTimerM1 = setInterval(() => {
        this.aioVideoStreamHeart(this.taskId);
      }, 3000);
    },
    closeModal() {
      this.appVideoModalVisible = false;
    },
    getDefaultDevice() {
      if (this.aioDevice) {
        return this.aioDevice[0].deviceId;
      } else if (this.cameraDevice) {
        return this.cameraDevice[0].deviceId;
      }
    },
    /**
     * 一体机拉流心跳
     */
    aioVideoStreamHeart(taskId) {
      this.$api.taskMonitor
        .aioVideoStreamHeart({ escortId: taskId })
        .then((res) => {});
    },
    /**
     * 视频流设备切花
     * @param {*} value 设备id
     */
    videoChange(value, option, sort) {
      let deviceType = option.data.attrs.type;
      if (this.player && this.player2 && deviceType !== "606") {
        //this.player.dispose();
        this.player = null;
        this.$api.taskMonitor
          .askMobileVideo({ taskId: this.taskId, type: 0 })
          .then((res) => {
            // this.$message.info("视频流已关闭");
          });
        clearInterval(this.aioHeartTimerM1);
        this.aioHeartTimerM1 = null;
      }

      if (deviceType === "606") {
        setTimeout(() => {
          this.initPlay();
        }, 100);
      } else if (deviceType === "604") {
        if (sort === 1) {
          this.playCamera(value, sort, this.gTaskId);
        } else {
          this.playCamera(value, sort, this.gTaskId2);
        }
      } else if (deviceType === "602") {
        //车载设备
        this.isAllOneVideo = false;
        let channelNum = option.data.attrs.channelNum;
        let parentId = option.data.attrs.parentId;
        let basevehivleVideo = JSON.parse(sessionStorage.getItem("systemConf"))
          .dssServer;
        let endPosition = basevehivleVideo.indexOf("{SourceId}");
        basevehivleVideo = basevehivleVideo.slice(0, endPosition);
        this.dssServerReal = `${basevehivleVideo}${parentId}%24${channelNum}/substream/1.m3u80`;
        if (sort === 1) {
          this.videoObject.video = this.dssServerReal;
          new ckplayer(this.videoObject);
        } else {
          this.videoObject2.video = this.dssServerReal;
          new ckplayer(this.videoObject2);
        }
      } else {
        this.$message.error("设备类型错误");
      }
    },
  },
  beforeDestroy() {
    if (this.aioHeartTimerM1) {
      clearInterval(this.aioHeartTimerM1);
      this.aioHeartTimerM1 = null;
    }
  },
};
</script>
 
<style   lang = "less">
.select-class-modal {
  .ant-modal-close-x {
    display: none;
    width: 56px;
    height: 56px;
    font-size: 16px;
    font-style: normal;
    line-height: 56px;
    text-align: center;
    text-transform: none;
    text-rendering: auto;
  }
}
.header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 36px;
  background: rgba(0, 0, 0, 0.65);
  .video_change {
    display: inline-block;
    width: 160px;
    margin: 2px;
    .ant-select-selection--single {
      position: relative;
      height: 100%;
      cursor: pointer;
      background: rgba(0, 0, 0, 0);
      border: 1px solid rgba(255, 255, 255, 0.8);
      color: aliceblue;
    }
    .ant-select-arrow {
      display: inline-block;
      color: inherit;
      font-style: normal;
      line-height: 0;
      text-align: center;
      text-transform: none;
      vertical-align: -0.125em;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      position: absolute;
      top: 50%;
      right: 11px;
      margin-top: -6px;
      color: rgba(0, 0, 0, 0.25);
      font-size: 12px;
      line-height: 1;
      -webkit-transform-origin: 50% 50%;
      transform-origin: 50% 50%;
      color: white;
    }
  }
  .narrow_logo {
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 4px;
    width: 28px;
    height: 28px;
    background: #3380cc;
    text-align: center;
    padding-top: 4px;
    border-radius: 20px;
    img {
      width: 14px;
      height: 14px;
    }
  }
}

.ant-select-dropdown.select-class-modal {
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.4);

  .ant-select-dropdown-menu-item {
    position: relative;
    display: block;
    padding: 5px 12px;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.8);
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    -webkit-transition: background 0.3s ease;
    transition: background 0.3s ease;
  }
  .ant-select-dropdown-menu-item-active {
    position: relative;
    display: block;
    padding: 5px 12px;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.4);
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    -webkit-transition: background 0.3s ease;
    transition: background 0.3s ease;
  }
  .ant-select-dropdown-menu-item-selected {
    color: rgba(0, 0, 0, 0.65);
    font-weight: 600;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
</style>