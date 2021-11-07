<template>
    <div :class= "{'MobileIndex': true, 'bodyFixed': loginShow}">
      <web-head></web-head>
      <div class="index-container">
        <div class="index-top">
          <img :src="homeTop" class="top-img"/>
          <div class="raffle-info">
            <div class="raffle-logo">
              <img :src="raffleImg"/>
            </div>
            <div class="raffle-text">
              <div class="chinese">
                抽奖
                <span>CEO</span>
                热门
                <br/>
                小程序
              </div>
            </div>
            <img src="../assets/img/mcode.png" class="mcode" v-on:click="toggleLogin" @touchmove.stop>
          </div>
        </div>
        <div class="ceo-info">
          <div class="presentation">
            抽奖CEO特点
          </div>
          <div class="info-card">
            <div class="card-icon">
              <span class="iconfont icongift"></span>
            </div>
            <div class="card-text left-blank">
              1. PC Web端也可发起抽奖，抽奖内容可以是富文本，丰富抽奖页面展示提升运营效率。
            </div>
          </div>
          <div class="info-card">
            <div class="card-text right-blank">
              2.可以通过API接口对接发起抽奖，方便和您的软件进行对接。
            </div>
            <div class="card-icon">
              <span class="iconfont iconbutt"></span>
            </div>
          </div>
          <div class="info-card">
            <div class="card-icon">
              <span class="iconfont iconresearch"></span>
            </div>
            <div class="card-text left-blank">
              3.正在研发基于区块链的抽奖技术，保障抽奖的公平公正。
            </div>
          </div>
        </div>
        <div class="setting-bar">
            <img :src="middle"/>
        </div>
        <div class="solutions-bar">
          <div class="solution-title">
            提供解决方法
          </div>
          <div class="solution-list">
            <div class="solution-card" v-for="(item,index) in solutionList" :key="index">
              <div class="solution-icon">
                <img :src="item.icon"
                     :class="{'font-27': index === 0 || index === 3,
                              'font-25': index === 1,
                              'font-29': index === 2,
                              'font-23': index === 4 || index === 7,
                              'font-22': index === 5,
                              'font-33': index === 6,
                     }"
                />
              </div>
              <div class="chinese">{{item.chinese}}</div>
            </div>
          </div>
        </div>
        <div class="products-bar">
          <div class="products-title">
            <div class="chinese">
              部分案例展示
            </div>
          </div>
          <div class="product-list">
            <div class="product-card" v-for="(product,index) in productList" @click="toMCase(index)">
              <div class="product-img">
                <img :src="product.img"/>
              </div>
              <div class="product-name">{{product.name}}</div>
              <div class="product-info">{{product.desc}}</div>
            </div>
          </div>
        </div>
        <div class="login-box" v-on:click="toggleLogin" v-show="loginShow">
          <div class="login-area"v-on:click.stop="">
            <p class="cancel-box">
              <span class="iconfont iconcancel"  v-on:click="toggleLogin" ></span>
            </p>
            <p class="login-title">关注CEO微信小程序</p>
            <div class="login-img">
              <img :src="ceoSearch"/>
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
    import middle from "@/assets/img/mMiddlebg.png";
    import xianMall from '@/assets/img/xiandanmall.png';
    import monitor from '@/assets/img/monitor.png';
    import note from '@/assets/img/note.png';
    import calendar from '@/assets/img/calendar.png';
    import WebHead from './Mobile/WebHead'
    import WebFooter from './Mobile/WebFooter'
    import homeTop from '../assets/img/mobile-home.png'
    import loginImg from '../assets/img/mobileCode.jpg'
    import ceoSearch from '../assets/img/searchCEO.png'
    import $ from 'jquery'
    // Vue.use(animated)
    export default {
        name: 'MbIndex',
        data() {
            return {
              raffleImg,
              middle,
              homeTop,
              loginImg,
              ceoSearch,
              loginShow: false,
              solutionList: [
                {
                  chinese:'饮食行业',
                  icon: food
                },
                {
                  chinese:'文化行业',
                  icon: movie
                },
                {
                  chinese:'旅游行业',
                  icon: plane
                },
                {
                  chinese:'公司活动',
                  icon: company
                },
                {
                  chinese:'商品抽奖',
                  icon: commodity
                },
                {
                  chinese:'小区福利',
                  icon: estate
                },
                {
                  chinese:'人数推广',
                  icon: person
                },
                {
                  chinese:'大众福利',
                  icon: welfare
                }
              ],
              productList: [
                {
                  name:'闲蛋商城',
                  desc:'一款基于微信公众号的跨境电商商城.',
                  img: xianMall
                },
                {
                  name:'闲蛋猫VI ',
                  desc:'logo 吉祥物 名片等设计',
                  img: monitor
                },
                {
                  name:'购物笔记',
                  desc:'记录、导出、一键转发',
                  img: note
                },
                {
                  name:'日历',
                  desc:'新一代电子墨水屏日历',
                  img: calendar
                }
              ],
            }
        },
        components: {
            WebHead,
            WebFooter,
        },
        watch: {
        },
        mounted() {
          const bodyObj = document.querySelector('MobileIndex');
        },
      methods: {
          toggleLogin() {
            const ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) === "micromessenger") {
              //在微信中打开,直接跳转小程序
            } else {
              //不在微信中打开，则弹出二维码
              this.loginShow = !this.loginShow;
            }
          },
          // 跳转到指定页面
          toMCase(index) {
            this.$router.push( {name: 'MCase', query: {index: index} });
            window.scrollTo(0,0);
          }
        }
    }
</script>

<style scoped lang="scss">
  .index-container{
    background: #ffffff;
    position: relative;
    .index-top{
      padding: 12px;
      box-sizing: border-box;
      position: relative;
      box-sizing: border-box;
      .top-img{
        width: 100%;
      }
      .raffle-info{
        position: absolute;
        top: 18px;
        left: 18px;
        .raffle-logo{
          width: 35px;
          height: 35px;
          padding: 3.5px;
          box-sizing: border-box;
          background: #ffffff;
          border-radius: 4.5px;
          img{
            width: 100%;
          }
        }
        .raffle-text{
          .chinese{
            font-size:16px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(25,25,25,1);
            line-height:24px;
            span{
              color: #BE1A21;
            }
          }
          .english{
            font-size: 10px;
            width: 86.5px;
            margin-left: 1.5px;
            color:rgba(154,154,154,1);
          }
        }
        .login-btn{
          /*width:116px;*/
          height:35px;
          background:#333333;
          border-radius:17px;
          margin-top: 17.5px;
          color: #ffffff;
          font-size: 12px;
          padding: 9px 18px;
          box-sizing: border-box;
        }
        .mcode {
          margin-top: 17.5px;
          width: 113px;
          height: 35px;
        }
        @media screen and (max-width: 350px) {
         .mcode {
           margin-top: 15px;
           width: 85px;
           height: 30px;
         }
        }
      }
    }
    .ceo-info{
      padding: 3px;
      box-sizing: border-box;
      flex-wrap: wrap;
      .presentation{
        margin: 30px auto 17px auto;
        text-align: center;
        font-size:14px;
        font-family:PingFang SC;
        font-weight:800;
        color:rgba(0,0,0,1);
      }
      .info-card{
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        background:rgba(247,247,247,1);
        margin: 18px;
        border-radius: 6px;
        padding: 18px;
        .card-icon{
          width: 36px;
          height: 36px;
          box-sizing: border-box;
          background:rgba(255,255,255,1);
          padding: 5px;
          border-radius: 6px;
          .iconfont{
            color: #BC4343;
            font-size: 22px;
          }
        }
        .card-text{
          font-size:13px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(51,51,51,1);
          line-height:19.5px;
        }
      }
      .left-blank{
        margin-left: 12px;
      }
      .right-blank{
        margin-right: 12px;
      }
    }
    .setting-bar{
      /*margin: 6px 0;*/
      /*padding: 12px;*/
      padding: 12px 12px;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      /*background-image: url("../assets/img/mMiddlebg.png");*/
      /*background-size: 100% 100%;*/
      img{
        width: 100%;
      }
    }
    .solutions-bar{
      margin: 6px 0;
      padding: 12px;
      .solution-title{
        font-size:14px;
        font-family:PingFang SC;
        font-weight:800;
        color:rgba(0,0,0,1);
        text-align: center;
        padding-bottom: 16px;
        span{
          color: #666666;
        }
      }
      .solution-desc{
        /*font-size:13px;*/
        /*font-family:PingFang SC;*/
        /*font-weight:500;*/
        /*color:rgba(102,102,102,1);*/
        /*line-height:22px;*/
        /*margin: 10.5px 0 12.5px 0;*/
        /*text-align: center;*/
      }
      .solution-list{
        background:rgba(247,247,247,1);
        border-radius:12px;
        width: 100%;
        padding: 3px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        .solution-card{
          margin: 3px;
          width: calc(25% - 6px);
          box-sizing: border-box;
          padding: 6px;
          background: #ffffff;
          border-radius: 6px;
          .solution-icon{
            width: 100%;
            height: 27px;
            img{
              width: 26px;
              display: block;
              margin: 0 auto;
            }
            .font-27{
              width: 27px;
            }
            .font-25{
              width: 25px;
            }
            .font-29{
              width: 29px;
            }
            .font-23{
              width: 23px;
            }
            .font-24{
              width: 24px;
            }
            .font-22{
              width: 22px;
            }
            .font-33{
              width: 31px;
            }
          }
          .chinese{
            margin: 12.5px 0 6px 0;
            height:9.5px;
            font-size:10px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(55,55,55,1);
            text-align: center;
          }
        }
      }
    }
    .products-bar{
      padding: 15px 9px;
      .products-title{
        font-size:14px;
        font-family:PingFang SC;
        font-weight:800;
        line-height:21px;
        text-align: center;
        padding: 0 3px;
        color:rgba(0,0,0,1);
        padding-bottom: 16px;
      }
      .products-desc{
        /*font-size:13px;*/
        /*font-family:PingFang SC;*/
        /*font-weight:500;*/
        /*color:rgba(102,102,102,1);*/
        /*line-height:22px;*/
        /*text-align: center;*/
        /*margin: 10.5px 3px 12px 3px;*/
      }
      .product-list{
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        .product-card{
          box-sizing: border-box;
          width: calc(50% - 6px);
          margin: 3px;
          padding: 15.5px 12px;
          background:rgba(247,247,247,1);
          border-radius: 6px;
          .product-img{
            width: 100%;
            img{
              width: 100%;
            }
          }
          .product-name{
            margin: 11.5px 0 4.5px 0;
            font-size:12px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(55,55,55,1);
          }
          .product-info{
            font-size:13px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(102,102,102,1);
            line-height:15px;
          }
        }
      }
    }
    .login-box{
      width: 100%;
      height: 100vh;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(51,51,51,.3);
      padding-top: 138px;
      .login-area{
        width: calc(100% - 117px);
        background: rgba(247,247,247,1);
        margin: 0 auto;
        border-radius: 6px;
        box-sizing: border-box;
        padding: 12px;
        .cancel-box::after{
          content: '';
          display: block;
          clear: both;
        }
        .iconfont{
          float: right;
          font-size: 8px;
        }
        .login-title{
          font-size:13px;
          font-family:PingFang SC;
          font-weight:bold;
          color:rgba(51,51,51,1);
          line-height:10px;
          text-align: center;
        }
        .login-img{
          /*width: 130px;*/
          /*height: 130px;*/
          margin: 11.5px auto 0 auto;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .login v-leave{
        opacity: 1;
      }
      .login v-leave-active{
        transition: opacity 1s;
      }
      .login v-leave-to{
        opacity: 0;
      }
      .login v-enter{
        opacity: 0;
      }
      .login v-enter-active{
        transition: opacity 1s;
      }
      .login v-enter-to{
        opacity: 1;
      }
    }
  }
  .bodyFixed {
    position: fixed;
  }
</style>
