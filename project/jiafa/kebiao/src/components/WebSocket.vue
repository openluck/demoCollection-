<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-06-08 16:04:17
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-08 11:44:18
-->
<template>
  <div class></div>
</template>
 
<script>
import { socketUrl } from "@/Utils/global";
export default {
  name: "",
  components: {},
  data() {
    return {
      msg: "",
      resData: "",
      ws: null,
      timer: null,
      lockReconnect: false,
      baseToken: "",
      baseOrgCode: ""
    };
  },
  watch: {
    /*消息红点显示：
        type: login-需要登录,    task-token正常，无需登录  onlyNewTips-只监听有无消息，
        isAllowMutiPcOnline： 0-token过期，被挤下线，  1-正常
        isTokenEnable：0-token过期，  1-token正常
        hasNewTips：0-无消息   1-有消息
    */
    resData: function (val) {
      if (val.type === "onlyNewTips" && val.hasNewTips === "1") {
        this.$store.commit("app/getHasNewTips", true);
      } else if (val.type === "onlyNewTips" && val.hasNewTips === "0") {
        this.$store.commit("app/getHasNewTips", false);
      } else {
        if (
          val.type === "login" &&
          (val.isAllowMutiPcOnline === "0" || val.isTokenEnable === "0")
        ) {
          // 关闭webSocket连接
          this.ws.close();
          this.$warning({
            title: "当前登录用户已失效，请重新登录",
            okText: "知道了",
            okType: "danger",
            onOk() {
              if (
                navigator.userAgent.indexOf("Firefox") !== -1 ||
                navigator.userAgent.indexOf("Chrome") !== -1
              ) {
                // window.location.href = window.G.portalLoginUrl;
                window.opener = null;
                window.open("", "_self");
                window.close();
                // window.close();
              }
            },
            onCancel() {
              console.log("Cancel");
            }
          });
          return false;
        }
      }
    }
  },
  computed: {},
  created() {
    // 课表的token，orgCode
    this.baseToken = sessionStorage.getItem("token");
    this.baseOrgCode = sessionStorage.getItem("orgCode");
    // public中的config定义
    this.createWebSocket();
  },
  mounted() { },
  methods: {
    createWebSocket() {
      if ("WebSocket" in window) {
        try {
          this.initSocket(); //对websocket对象进行初始化
        } catch (e) {
          this.websocketReconnect(); //调用重连方法
        }
      } else {
        alert("您的浏览器不支持websocket 请更换浏览器后重试！");
      }
    },

    initSocket() {
      clearInterval(this.timer);
      this.ws = new WebSocket(
        `${socketUrl}?orgCode=${this.baseOrgCode}&token=${this.baseToken}`
      );
      this.ws.addEventListener("open", this.handleWsOpen.bind(this), false);
      this.ws.addEventListener("close", this.handleWsClose.bind(this), false);
      this.ws.addEventListener("error", this.handleWsError.bind(this), false);
      this.ws.addEventListener(
        "message",
        this.handleWsMessage.bind(this),
        false
      );
    },
    //当WebSocket创建成功时，触发onopen事件
    handleWsOpen(e) {
      console.log("FE:ws open", e);
      // this.handleSendClick();
    },
    //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
    handleWsClose(e) {
      console.log("FE:ws close", e);
      // this.websocketReconnect();
    },
    //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
    handleWsError(e) {
      console.log("FE:ws error", e);
      this.websocketReconnect();
    },
    //当客户端收到服务端发来的消息时，触发handleWsMessage事件，参数e.data包含server传递过来的数据
    handleWsMessage(e) {
      // console.log(e.data);
      this.resData = JSON.parse(e.data);
    },
    //将消息发送到服务端
    handleSendClick() {
      const msg = this.msg;
      this.ws.send(
        JSON.stringify({
          id: new Date(),
          msg: msg
        })
      );
    },
    websocketReconnect() {
      if (this.lockReconnect) {
        // 是否已经执行重连
        return;
      }
      this.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.createWebSocket();
        this.lockReconnect = false;
      }, 2000);
    }
  },
  beforeDestroy() { }
};
</script>
 
<style scoped lang = "less">
</style>