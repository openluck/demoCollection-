<template>
  <div>
    <WebHead></WebHead>
    <div class="main">
      <div class="container">
        <div class="content-title">
          <div class="title-first">
            <span class="case-first">案例展示</span>
          </div>
<!--          <div class="title-second">-->
<!--            <p>公司其他产品，在发展期间公司帮助其他人开发产品及其自己产品的制作</p>-->
<!--          </div>-->
        </div>
        <div class="content">
          <div class="name-box">
            <ul class="ul-box">
              <li @click="cur=0" :class="{active:cur==0}" class="name-li"><span class="name" :class="{activeName:cur==0}">公众号</span></li>
              <li @click="cur=1" :class="{active:cur==1}" class="name-li"><span class="name" :class="{activeName:cur==1}">VI设计</span></li>
              <li @click="cur=2" :class="{active:cur==2}" class="name-li"><span class="name" :class="{activeName:cur==2}">APP</span></li>
              <li @click="cur=3" :class="{active:cur==3}" class="name-li"><span class="name" :class="{activeName:cur==3}">UI设计</span></li>
            </ul>
          </div>
          <div class="show">
            <ul class="topnav-show" v-show="cur==0">
              <li>
                <img src="../../assets/img/public.png" alt="" class="details">
              </li>
            </ul>
            <ul class="topnav-show" v-show="cur==1">
              <li>
                <img src="../../assets/img/logodetails.png" alt="" class="details">

              </li>
            </ul>
            <ul class="topnav-show" v-show="cur==2">
              <li>
                <img src="../../assets/img/notedetail.png" alt="" class="details">
              </li>
            </ul>
            <ul class="topnav-show" v-show="cur==3">
              <li>
                <img src="../../assets/img/date.png" alt="" class="details">
              </li>
            </ul>
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
        name: "MCase",
        data(){
          return{
            cur:0,
            smallDetails: true,
            bigDetails: false,
          }
        },
        computed: {
          pcHeight() {
            return (document.documentElement.clientHeight - 167) + 'px'
          }
        },
      created() {
        if(this.$route.query.index) {
          this.cur = this.$route.query.index;
        }
          },
      components: {
          WebFooter,
          WebHead,
        },
        methods: {
          showDetails() {
            this.smallDetails = !this.smallDetails;
            this.bigDetails = !this.bigDetails;
          },
          dispearDetails() {
            this.smallDetails = !this.smallDetails;
            this.bigDetails = !this.bigDetails;
          }
        }
    }
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  background-color: #ffffff;
  padding-bottom: 13px;
  .container {
    .content-title {
      text-align: center;
      /*margin-top: 112px;*/
      padding-top: 24px;
      .title-first {
        .case-first {
          width:190px;
          height:15px;
          font-size:14px;
          font-family:PingFang SC;
          font-weight:800;
          color:rgba(0,0,0,1);
        }
        .case-second {
          font-size:14px;
          /*font-weight:800;*/
          color: #666666;
        }
      }
      .title-second {
       /* width:638px;
        height:20px;*/
        /*width: 319px;*/
        font-size:12px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
        line-height:17px;
        margin: 0 auto;
        /*padding-top: 11px;*/
        padding: 11px 28px 0;
      }
    }
    .content {
      /*width: 1500px;*/
      margin: 35px auto 0;
      .name-box {
        /*width: 610px;*/
        width: 295px;
        margin: 0 auto;
        .ul-box {
          display: flex;
          justify-content: space-between;
          .name-li {
            width:47px;
            height:22px;
            background: #F7F7F7;
            border-radius:8px;
            text-align: center;
            .name {
              font-size:12px;
              font-family:PingFang SC;
              font-weight:500;
              color:#333333;
            }
          }
          .active {
            width:47px;
            height:22px;
            background:rgba(188,67,67,1);
            border-radius:8px;
            .activeName {
              color: #ffffff;
            }
          }
        }
      }
      .show {
        /*width: 1440px;*/
        /*background: yellow;*/
        overflow: hidden;
        /*margin-top: 28px;*/
        padding-top: 24px;
        .box {
          background: #F7F7F7;
          display: inline-block;
          float: left;
          width: 339px;
          height: 368px;
          box-sizing: border-box;
          padding-top: 28px;
          padding-left: 28px;
          margin-right: 28px;
          border-radius: 14px;
          img {
            width:298px;
            height:863px;
          }
          span {
            font-size:20px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(55,55,55,1);
            display: block;
            margin-top: 28px;
          }
          p {
            width:280px;
            height:56px;
            font-size:14px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(0,0,0,1);
            line-height:21px;
            margin-top: 12px;
          }
        }
        .details {
          display: block;
          width:298px;
          /*height:863px;*/
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
