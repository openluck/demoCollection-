<template>
  <div>
    <WebHead></WebHead>
  <div class="main" :style="{ height: pcHeight }">
    <div class="content-title">
      <span class="title1">公司主营业务</span>
    </div>
    <div class="container">
      <div class="content">
        <div class="content-all">
          <img src="../../assets/img/smallprogram.png">
          <span class="con-title1">微信小程序定制</span>
          <span class="con-title2">助力小程序流量红利期，提高用户体验度</span>
        </div>
        <div class="content-all">
          <img src="../../assets/img/wechat.png">
          <span class="con-title1">微信公众号开发</span>
          <span class="con-title2">结合微信营销，实现个性化应用开发</span>
        </div>
        <div class="content-all">
          <img src="../../assets/img/web.png">
          <span class="con-title1">网页开发</span>
          <span class="con-title2">网站策划、自主研 发、原创设计方案</span>
        </div>
        <div class="content-all">
          <img src="../../assets/img/app.png">
          <span class="con-title1">APP制作</span>
          <span class="con-title2">互动体验创意设计，注重用户体验建设</span>
        </div>
        <div class="content-all">
          <img src="../../assets/img/ui.png">
          <span class="con-title1">设计制作</span>
          <span class="con-title2">UI、平面、包装设计</span>
        </div>
      </div>
    </div>
  </div>
    <WebFooter></WebFooter>
  </div>
</template>

<script>
  import WebHead from "./WebHead";
  import WebFooter from "./WebFooter";
    export default {
        name: "mBusiness",
      components: {WebFooter, WebHead},
      data() {
          return {

          }
        },
      computed: {
        pcHeight() {
          return (document.documentElement.clientHeight - 167) + 'px'
        }
      },
      methods: {

      }
    }
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  font-family:PingFang SC;
  background-color: #ffffff;
  min-height: 450px;
  .content-title {
    text-align: center;
    /*margin-top: 30px;*/
    padding-top: 30px;
    .title1 {
      font-size:14px;
      font-weight:800;
      color:rgba(0,0,0,1);
    }
    .title2 {
      font-size:14px;
      font-family:PingFang SC;
      /*font-weight:800;*/
      color: #666666;
    }
  }
  .container {
    /*height: 627px;*/
    /*background-color: blue;*/
    .content {
      overflow: hidden;
      padding-left: 12px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .content-all {
        /*width: 113px;*/
        width: 30%;
        height: 158px;
        background-color: #F7F7F7;
        text-align: center;
        margin-right: 8px;
        margin-top: 12px;
        box-sizing: border-box;
        border-radius: 6px;
        img {
          padding-top: 12px;
          width: 45px;
          height: 45px;
        }
        .con-title1 {
          display: block;
          font-size:13px;
          font-family:PingFang SC;
          font-weight:800;
          color:rgba(51,51,51,1);
          line-height:10px;
          text-align: center;
          padding-top: 12px;
          padding-bottom: 5px;
        }
        .con-title2 {
          display: block;
          font-size:10px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(102,102,102,1);
          line-height:17px;
          padding: 5px 5px 0;
          letter-spacing: 2px;
        }
      }
    }
  }
}
</style>
