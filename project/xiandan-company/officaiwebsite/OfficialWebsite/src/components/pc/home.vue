<template>
  <div style="background: #ffffff; width: 100%">
    <div class="showCode" @mousewheel.prevent v-if="showQrcode" @click="disappearCode" >
      <div class="qrcode-border" >
        <div class="qrcode-content">
          <span class="security-login">微信安全登陆</span>
          <div class="qrcode-content-border" v-loading="loading">
<!--            <div id="qrcode"></div>-->
                <vue-qrcode :value="qrCodeUrl" :width="220" style="margin-top: 5px" ></vue-qrcode>
          </div>
          <span class="scanning-login">微信扫描二维码登陆</span>
        </div>
      </div>
    </div>
    <web-header></web-header>
    <div class="home-container">
      <div class="home-top">
        <div class="raffle-left-img">
          <div class="raffle-left-img-bottom">
            <img src="../../assets/img/home-left-img.png" alt="" class="img1">
          </div>
          <div class="raffle-left-img-top">
            <img src="../../assets/img/home-middle.png" alt="" class="img2">
          </div>
        </div>
        <div class="raffle-right-img">
          <div class="raffle-logo">
            <img :src="raffleImg">
          </div>
          <div class="raffle-text">
            <div class="chinese">
              抽奖<span>CEO</span>热门
              <br/>
              小程序
            </div>
            <div class="english">

            </div>
          </div>
          <div class="to-raffle" v-on:click="login">
            <span class="iconfont icongift"></span>
            尝试抽奖
          </div>
        </div>
      </div>
      <div class="setting-bar">
        <div class="right-img">
          <img :src="middle"/>
        </div>
        <div class="right-desc">
          <div class="desc-title">抽奖CEO特点</div>
          <div class="info-card">
            <div class="card-icon">
              <span class="iconfont icongift"></span>
            </div>
            <div class="card-text">
              1. PC Web端也可发起抽奖，抽奖内容可以是富文本，丰富抽奖页面展示提升运营效率。
            </div>
          </div>
          <div class="info-card">
            <div class="card-icon">
              <span class="iconfont iconbutt"></span>
            </div>
            <div class="card-text">
              2.可以通过API接口对接发起抽奖，方便和您的软件进行对接。
            </div>
          </div>
          <div class="info-card">
            <div class="card-icon">
              <span class="iconfont iconresearch"></span>
            </div>
            <div class="card-text">
              3.正在研发基于区块链的抽奖技术，保障抽奖的公平公正。
            </div>
          </div>
        </div>
      </div>
      <div class="solutions-bar">
        <div class="solution-title">
          提供解决方法
        </div>
        <div class="solution-desc">
        </div>
        <div class="solution-list">
          <div class="solution-card" v-for="(item,index) in solutionList" :key="index">
            <div class="chinese">{{item.chinese}}</div>
            <div class="solution-icon">
              <img :src="item.icon"/>
            </div>
          </div>
        </div>
      </div>
      <div class="products-bar">
        <div class="products-title">
          公司其他部分产品
        </div>
        <div class="products-desc">
<!--          公司其他产品，在发展期间公司帮助其他人开发产品及其自己产品的制作-->
        </div>
        <div class="product-list">
          <div class="product-card" v-for="(product,index) in productList"  @click="toCase(index)" :key="index">
            <div class="product-img">
              <img :src="product.img"/>
            </div>
            <div class="product-name">{{product.name}}</div>
            <div class="product-info">{{product.desc}}</div>
          </div>
        </div>
      </div>
    </div>
    <web-footer></web-footer>
  </div>
</template>

<script>
  import raffleImg from "@/assets/img/raffle.svg";
  import commodity from "@/assets/img/commodity.png";
  import estate from "@/assets/img/estate.png";
  import food from "@/assets/img/food.png";
  import movie from "@/assets/img/movie.png";
  import welfare from "@/assets/img/welfare.png";
  import company from "@/assets/img/company.png";
  import plane from "@/assets/img/plane.png";
  import person from "@/assets/img/person-number.png";
  import middle from "@/assets/img/home-middle.png";
  import xianMall from '@/assets/img/xiandanmall.png';
  import monitor from '@/assets/img/monitor.png';
  import note from '@/assets/img/note.png';
  import calendar from '@/assets/img/calendar.png';
  import raffle from "./raffle";
  import webHeader from './WebHead';
  import webFooter from './WebFooter';
  import {Loading} from 'element-ui';
  import Vue from 'vue';
  import VueQrcode from 'vue-qrcode'

  Vue.use(Loading);
  export default {
    name: "home.vue",
    data() {
      return {
        raffleImg,
        middle,
        solutionList: [
          {
            chinese: '饮食行业',
            icon: food
          },
          {
            chinese: '文化行业',
            icon: movie
          },
          {
            chinese: '旅游行业',
            icon: plane
          },
          {
            chinese: '公司活动',
            icon: company
          },
          {
            chinese: '商品抽奖',
            icon: commodity
          },
          {
            chinese: '小区福利',
            icon: estate
          },
          {
            chinese: '人数推广',
            icon: person
          },
          {
            chinese: '大众福利',
            icon: welfare
          }
        ],
        productList: [
          {
            name: '闲蛋商城',
            desc: '一款基于微信公众号的跨境电商商城',
            img: xianMall
          },
          {
            name: '闲蛋猫VI',
            desc: 'logo 吉祥物 名片等设计',
            img: monitor
          },
          {
            name: '购物笔记',
            desc: '记录、导出、一键转发',
            img: note
          },
          {
            name: '日历',
            desc: '新一代电子墨水屏日历',
            img: calendar
          }
        ],
        temToken: '',
        showQrcode: false,
        testToken: '',
        qrCodeUrl:'',
        loading: false,
      }
    },
    components: {
      webHeader,
      webFooter,
      VueQrcode
    },
    methods: {
      // 登陆
      login() {
        //已经登陆
        if (global.token) {
          // 延长token的时间
          this.$http.get('/user/refresh_token', {params : { skey: global.token }});
          this.$router.push({name: 'raffle'});
          return;
        }
        this.showQrcode = true;
        // 请求临时访问token，展示二维码
        this.loading = true;
        this.$http.get('/lottery/access_token').then((res) => {
          this.loading = false;
          this.temToken = res.data.data.access_token;
          // 通过获取临时token，拼接字符串生成二维码
          this.qrCodeUrl = "https://lottery.hopeyoo.com/wechat/auth/" + this.temToken;
          // 请求正式token，扫描二维码登陆
          setTimeout(() => {
            this.checkLogin();
          }, 1000)
        })
      },
      // 检查登陆
      checkLogin() {
        this.$http.get(`/lottery/check_login`, {params: {token: this.temToken}}).then((res) => {
          if (res.data.code === 1) {
            this.loading = false;
            this.showQrcode = false;
            global.token = res.data.data.token;
            this.$http.defaults.headers['X-WX-Skey'] = global.token;
            this.$router.push({name: 'raffle'});
          }
          else if (res.data.code === 0) {
            setTimeout(() => {
              this.checkLogin();
            }, 1000)
          } else {
            this.$message.error({
              message: '可能因为网络原因，请重新刷新网页进行扫描登陆！'
            });
            this.disappearLoading();
            this.showQrcode = false;
          }

        })
      },
      // 二维码消失
      disappearCode() {
        this.showQrcode = false;
      },
      toCase(index) {
        this.$router.push({name : 'Case',query:{index:index}});
        window.scrollTo(0,0);
      }
    },
  }
</script>

<style scoped lang="scss">
  .home-container {
    width: 75%;
    margin: 36px auto 0 auto;
    background: #ffffff;
    min-width: 1260px;
    .home-top {
      height: 820px;
      background: url("../../assets/img/home-topbg.png") no-repeat;
      background-size: 100% 80%;
      box-sizing: border-box;
      margin-bottom: 87px;
      .raffle-logo {
        width: 125px;
        height: 125px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 46px 0px rgba(0, 0, 0, 0.05);
        border-radius: 20px;
        margin-left: 42px;
        padding: 14px 12px 10px 12px;
        box-sizing: border-box;
        margin-top: 44px;
      }
      .raffle-left-img {
        /*width: 50%;*/
        float: right;
        position: relative;
        .raffle-left-img-bottom {
          img {

          }
        }
        .raffle-left-img-top {
          position: absolute;
          top: 30%;
          left: 31%;
          right: 0;
          bottom: 0;
          margin: auto;
        }
      }

      @media screen and (min-width: 1920px) {
        .raffle-left-img {
          /*width: 50%;*/
          float: right;
          position: relative;
          margin-right: 100px;

          .raffle-left-img-bottom {

          }

          .raffle-left-img-top {
            position: absolute;
            top: 30%;
            left: 30%;
            right: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }

      .raffle-text {
        margin: 62px 0 0 42px;

        .chinese {
          font-size: 60px;
          font-family: PingFang SC;
          font-weight: 800;
          color: rgba(25, 25, 25, 1);
          line-height: 90px;

          span {
            color: #BE1A21;
          }
        }

        .english {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 800;
          color: rgba(154, 154, 154, 1);
          margin-top: 27px;
        }
      }

      .to-raffle {
        margin: 43px 0 0 42px;
        width: 220px;
        height: 61px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 46px 0px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(190, 26, 33, 1);
        box-sizing: border-box;
        padding: 16px 46px 16px 41px;

        .iconfont {
          font-size: 26px;
        }
      }

      .to-weixin {
        margin-top: 156px;
        width: 147px;
        height: 48px;
        background: rgba(0, 0, 0, 1);
        border-radius: 24px;
        color: #ffffff;
        padding: 5px 0 5px 8px;
        box-sizing: border-box;
        display: flex;

        .iconfont {
          font-size: 30px;
          margin-left: 5px;
          margin-right: 12px;
        }

        .weixin-text {
          line-height: 23px;
          font-size: 14px;
          display: block;
          padding-top: 8px;
        }
      }
      @media screen  and (min-width: 1920px){
        .raffle-right-img{
          .raffle-logo{
            margin-top: 44px;
          }
          .raffle-text{
            margin-top: 62px;
          }
          .to-raffle{
            margin-top: 43px;
          }
          .to-weixin{
            margin-top: 156px;
          }
        }
      }
      @media screen and (min-width: 1320px) and (max-width: 1919px){
        .raffle-left-img{
          .raffle-logo{
            margin-top: 22px;
          }
          .raffle-text{
            margin-top: 31px;
          }
          .to-raffle{
            margin-top: 21px;
          }
          .to-weixin{
            margin-top: 78px;
          }

        }
      }
    }

    .setting-bar {
      display: flex;
      margin-bottom: 112px;
      justify-content: space-between;

      .right-img {
        width: 57%;
        margin-right: 56px;
        background-image: url("../../assets/img/home-middle-bg.png");
        background-repeat: no-repeat;
        /*background-size: cover;*/
        background-size: 100% 100%;
        text-align: center;
        position: relative;

        img {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;

        }
      }

      .right-desc {
        width: 42%;
        /*padding-top: 67px;*/
        .desc-title {
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 800;
          color: rgba(0, 0, 0, 1);
        }

        .info-card {
          margin-top: 38px;
          box-sizing: border-box;
          padding: 15px;
          background: rgba(247, 247, 247, 1);
          border-radius: 12px;
          display: flex;

          .card-icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 1);
            border-radius: 12px;
            box-sizing: border-box;
            padding: 16px;
            margin-right: 14px;
            text-align: center;

            .iconfont {
              color: #BC4343;
              font-size: 44px;
            }
          }

          .card-text {
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            line-height: 24px;
            padding-top: 17px;
          }
        }
      }
    }

    .solutions-bar {
      margin-bottom: 84px;

      .solution-title {
        text-align: center;
        height: 27px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 800;
        color: rgba(0, 0, 0, 1);
        margin-bottom: 26px;
      }

      .solution-desc {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 21px;
        margin-bottom: 56px;
        text-align: center;
      }

      .solution-list {
        padding: 0 0 28px 28px;
        box-sizing: border-box;
        background: rgba(247, 247, 247, 1);
        border-radius: 24px;
        display: flex;
        flex-wrap: wrap;

        .solution-card {
          margin: 28px 28px 0 0;
          width: calc(25% - 28px);
          height: 225px;
          background: rgba(255, 255, 255, 1);
          border-radius: 12px;
          padding: 28px 0 41px 0px;
          box-sizing: border-box;

          .chinese {
            height: 19px;
            font-size: 20px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(55, 55, 55, 1);
            margin-bottom: 14px;
            text-align: center;
          }

          .solution-icon {
            margin-top: 44px;
            height: 80px;

            img {
              /*height: 80px;*/
              /*width: 86px;*/
              display: block;
              margin: 0 auto;
            }
          }
        }
      }
    }

    .products-bar {
      padding-bottom: 112px;

      .products-title {
        height: 29px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 800;
        color: rgba(0, 0, 0, 1);
        text-align: center;
      }

      .products-desc {
        /*height: 14px;*/
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 21px;
        text-align: center;
        margin: 10px 0 56px 0;
      }

      .product-list {
        display: flex;
        width: 100%;

        .product-card {
          width: calc(25% - 21px);
          background: rgba(247, 247, 247, 1);
          border-radius: 14px;
          padding: 28px;

          .product-img {
            width: 100%;
            margin-bottom: 28px;

            img {
              width: 100%;
            }
          }

          .product-name {
            font-size: 20px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(55, 55, 55, 1);
            margin-bottom: 12px;
          }

          .product-info {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 1);
            line-height: 21px;
          }
        }

        .product-card + .product-card {
          margin-left: 28px;
        }
      }
    }

  }
  .showCode {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, .3);
    z-index: 2;

    .qrcode-border {
      width: 350px;
      height: 350px;
      background-color: #FBFBFB;
      margin: 18% auto;
      border-radius: 10px;
      text-align: center;

      .qrcode-content {
        padding-top: 31px;
        text-align: center;

        .security-login {
          font-size: 17px;
          font-family: PingFang SC;
          font-weight: 800;
          color: rgba(51, 51, 51, 1);
          line-height: 12px;
          padding-top: 31px;
        }

        .qrcode-content-border {
          border: 1px solid #E2E2E2;
          width: 221px;
          height: 226px;
          margin: 12px auto;
          text-align: center;
          #qrcode {
            /*padding-left: 100px;*/
            padding-top: 10px;
            padding-left: 15px;
            padding-bottom: 10px;
            text-align: center;
            z-index: 3;
          }
        }

        .scanning-login {
          font-size: 9px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 12px;
        }
      }
    }
  }

  .raffle-right-img {
    padding-top: 44px;
  }
</style>
