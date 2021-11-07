<template>
  <div>
    <WebHead></WebHead>
<!--    :style="{ height: mHeight }"-->
    <div class="main" :style="{ height : pcHeight}">
      <div class="content-title">
        <span class="title1">解决流程</span>
<!--        <span class="title2">Solving process</span>-->
<!--        <div class="title-second">-->
<!--          <p>展示我们公司如何帮助客户解决流程</p>-->
<!--        </div>-->
      </div>
      <div class="content">
        <div class="process">
          <img src="../../assets/img/msolve.png">
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
        name: "MSolve",

      computed: {
        pcHeight() {
          return (document.documentElement.clientHeight - 167) + 'px'
        }
      },
      components: {
          WebHead,
          WebFooter
          }
    }
</script>

<style scoped lang="scss">
.main {
  background-color: #ffffff;
  min-height: 450px;
  /*padding-bottom: 72px;*/
  /*box-sizing: border-box;*/
  .content-title {
    text-align: center;
    /*margin-top: 30px;*/
    padding-top: 24px;
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
    .title-second {
      p {
        font-size:12px;
        font-weight:500;
        line-height:15px;
        margin-top: 10px;
        color: #666666;
      }
    }
  }
  .content {
    margin-top: 14px;
    .process {
      text-align: center;
      img {
        width: calc( 100% - 40px);
      }
    }
    .team-title {
      margin-top: 30px;
      /*margin-bottom: 12px;*/
      text-align: center;
      .title-first {
        .team-first {
          width:174px;
          height:14px;
          font-size:14px;
          font-family:PingFang SC;
          font-weight:800;
          color:rgba(0,0,0,1);
        }
        .team-second {
          width:174px;
          height:14px;
          font-size:14px;
          font-family:PingFang SC;
          font-weight:800;
          color:#666666;
        }
      }
      .title-second {
        font-size:10px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
        line-height:15px;
        margin-top: 12px;
        margin-bottom: 14px;
      }
    }
    .rotation-chart{
      /*width: calc(100% - 440px);*/
      /*width: 1373px;*/
      /*width: calc( 100% - 40px );*/
      /*width: 1802px;*/
      margin: auto;
      /*background: red;*/
      /*background-image: url("../../assets/img/bgline.png");*/
      .el-carousel {
        /*width: 1373px;*/
        /*background: yellow;*/
        .el-carousel__item{
          /*background: red;*/
          .item-content {
            margin:auto;
            /*width:319px;*/
            width: 120px;
            /*height: 354px;*/
            height: 159px;
            background: #F4F5F5;
            text-align: center;
            .car-img {
              /*width: 190px;*/
              /*height: 190px;*/
              width: 90px;
              height: 90px;
              border-radius: 50%;
              /*margin-top: 48px;*/
              margin-top: 20px;
            }
            .item_div{
              box-sizing: border-box;
              .jobs {
                display: block;
                font-size:11px;
                font-family:PingFang SC;
                font-weight:500;
                color:rgba(51,51,51,1);
                line-height:11px;
                margin-top: 13px;
              }
              .name {
                font-size:12px;
                font-family:PingFang SC;
                font-weight:bold;
                color:rgba(51,51,51,1);
                line-height:11px;
                margin-top: 6px;
              }
            }
          }
        }

      }
    }

  }
}
</style>
