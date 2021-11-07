<template>
  <div>
    <div v-if="isLoading" class="wait-scroll-loading">
      <van-loading color="#ffd4b2" :size="25"/>
    </div>
    <div class="anniversary">
      <div class="find-total" v-if="code !== ''">
        <div class="find-text" v-on:click="()=>{this.$router.push('/anniversary/integral')}">
          查看积分
        </div>
      </div>
      <div class="top-img">
        <img :src="anniversaryImg" alt="img"/>
        <div class="to-index">
          <div class="index-btn"
               v-on:click="() => {$router.push('/index')}"
          >去商城逛逛</div>
        </div>
      </div>
      <div class="bottom-info">
        <div class="info-top-big">
          <div class="info-top-middle"></div>
        </div>
        <div class="info-area">
          <div class="title">
            <span>/////</span>
            <div>活动说明</div>
            <span>/////</span>
          </div>
          <p class="explain-text">
            邀请好友点击助力，即可获得对应助力积分，新老用户助力分值不同，积分越高可兑换奖励越大，千元现金等您来领！
          </p>
          <button class="invitation-button"
                  v-on:click="invitedFriend"
          >{{this.code === "" ? "报名参与" : "点击邀请好友"}}</button>
          <div class="title">
            <span>/////</span>
            <div>活动奖品</div>
            <span>/////</span>
          </div>
          <p class="prize-text">
            积分比例请点击查看
            <span v-on:click="()=>{this.$router.push('/anniversary/rule')}">
            《活动规则》
          </span>
          </p>
          <table>
            <thead>
            <tr>
              <th v-for="value in prizeTitle" :key="value">{{value}}</th>
            </tr>
            </thead>
            <tr v-for="(item, index) in prizeList" :key="index"
            >
              <td class="level">{{item.level}}</td>
              <td class="total">{{item.total}}</td>
              <td class="prize">{{item.prize}}</td>
            </tr>
          </table>
        </div>
      </div>
      <van-overlay :show="isShow" v-on:click="()=>{isShow = false}" z-index="5">
        <div v-on:click.stop="">
          <div v-if="!isLogin" class="warm-prompt">
            <div class="title">
              <span>/////</span>
              <div>温馨提示</div>
              <span>/////</span>
            </div>
            <p class="info">需要先去登录才能进行报名</p>
            <button v-on:click="login">
              去登录
            </button>
          </div>
          <div class="apply" v-else-if="code === ''">
            <div class="title">
              <span>/////</span>
              <div>参加报名</div>
              <span>/////</span>
            </div>
            <p class="info">
              <span>1.</span>
              参与活动者需为闲蛋商城注册会员
            </p>
            <p>
              <span>2.</span>
              兑换奖品必须完成闲蛋商城实名认证，避免虚假交易、作弊、恶意套取等行为。
            </p>
            <p>
              <span>3.</span>
              本活动最终解释权归闲蛋电商所有。
            </p>
            <div class="read-rule">
              <van-checkbox type="checkbox" v-model="isRead" checked-color="#F26835" name="checkbox">
                我已阅读
                <span v-on:click="()=>{this.$router.push('/anniversary/rule')}" class="rule-link">
                《活动规则》
              </span>
              </van-checkbox>
            </div>
            <button v-on:click="apply" :disabled="!isRead">
              立即报名
            </button>
          </div>
          <div v-else class="share-link">
            <img :src="toInvited" alt="img"/>
          </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
'use strict';
import Vue from 'vue';
import { Overlay, Toast,Checkbox,Loading } from 'vant';
import anniversaryImg from '../../../images/icon/anniversary.jpg';
import titleImg from '../../../images/icon/anniversary-title.png';
import explain from '../../../images/icon/explain.png';
import toInvited from '../../../images/icon/to-invited.png';
import {weixinShare, login} from "@/common/js/tools";

Vue.use(Overlay).use(Toast).use(Checkbox).use(Loading);

export default {
  name: "anniversary",
  data() {
    return {
      anniversaryImg,
      titleImg,
      explain,
      toInvited,
      isRead: false,
      isShow:false,
      isLoading:true,
      code:"",//报名成功的id，作为分享链接的params
      prizeTitle:["关卡", "积分", "奖品列表"],
      prizeList:[
        {level:"第一关", total:3, prize:"5元闲蛋红包"},
        {level:"第二关", total:7, prize:"大创美白精华30ml一瓶"},
        {level:"第三关", total:25, prize:"OPERA薏仁水500ml一瓶"},
        {level:"第四关", total:46, prize:"SANA豆乳水乳一套"},
        {level:"第五关", total:150, prize:"安耐晒小金瓶防晒霜90ml一瓶"},
        {level:"第六关", total:500, prize:"500元现金红包"},
        {level:"第七关", total:1300, prize:"1000元现金红包"},
      ]
    }
  },
  computed:{
    isLogin() {
      return this.$store.getters.isLogin
    }
  },
  created() {
    // 如果已经登陆，获取是否已经参与并获得活动code
    if(this.isLogin) {
      this.$http.get('/api/events/2020/anniversary')
        .then((res) => {
          if(res.data.code === 0) {
            this.code = res.data.message.code;
            this.isLoading = false;
            weixinShare("快来点击帮我助力吧",
              "我正在参加闲蛋商城周年庆活动，点击帮我助力吧，你也可以一起参与哦！千元现金...",
              `${this.$http.defaults.baseURL}/mall/anniversary/invited/${this.code}`,
              "https://s.xiandanmall.com/anniversary.jpg"
            )
          }
        })
    } else {
      this.isLoading = false;
    }
  },
  methods: {
    //修改分享给好友的链接
    invitedFriend() {
      this.isShow = true;
      // 如果已经登陆并且参与获得了code
      if(this.isLogin && this.code !== "") {
        weixinShare("快来点击帮我助力吧",
          "我正在参加闲蛋商城周年庆活动，点击帮我助力吧，你也可以一起参与哦！千元现金...",
          `${this.$http.defaults.baseURL}/mall/anniversary/invited/${this.code}`,
          "https://s.xiandanmall.com/anniversary.jpg"
        )
      }
    },
    //报名参与功能
    apply() {
      this.$http.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      this.$http.post('/api/events/2020/anniversary/signup')
        .then((res)=>{
          if(res.data.code === 0) {
            this.code = res.data.message.code;
            Toast('报名成功');
            // 如果已经登陆并且参与获得了code
            if(this.isLogin && this.code !== "") {
              weixinShare("闲蛋商城周年庆活动",
                "我正在参加闲蛋商城周年庆活动，点击帮我助力吧，你也可以一起参与哦！千元现金...",
                `${this.$http.defaults.baseURL}/mall/anniversary/invited/${this.code}`,
                "https://s.xiandanmall.com/anniversary.jpg"
              )
            }
          } else {
            Toast(res.data.message);
          }
        })
      this.isShow = false;
    },
    login: function () {
      if (!this.$store.getters.isLogin) {
        login(this.$router);// 去登录
      }
    },
  },
}
</script>

<style scoped type="text/scss">
  .anniversary{
    background:rgba(255,212,178,1);
    padding-bottom: 18px;
    position: relative;
    .find-total{
      position: fixed;
      z-index: 5;
      right: 0;
      top: 240px;
      background:rgba(253,179,147,1);
      border-radius:12px 0px 0px 12px;
      width: 48px;
      padding: 12px 0 12px 12px;
      .find-text{
        background:linear-gradient(-30deg,rgba(240,123,48,1),rgba(255,203,129,1));
        box-shadow:0px 0px 16px 0px rgba(245,111,17,0.58);
        border-radius:12px 0px 0px 12px;
        padding: 17px 12px 14px 15px;
        font-size:16px;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(255,255,255,1);
      }
    }
    .to-index{
      position: absolute;
      top: 18px;
      left: 0;
      display: flex;
      .index-btn{
        background:rgba(242,104,53,1);
        box-shadow:0px 0px 18px 0px rgba(210,45,34,0.68) inset;
        border-radius:0px 17px 17px 0px;
        padding: 10px 16px;
        font-size:16px;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(255,255,255,1);
        letter-spacing: 3px;
      }
    }
    .top-img{
      img{
        width: 100%;
      }
    }
    .title{
      display: flex;
      justify-content: center;
      color:rgba(242,104,53,1);
      span{
        font-size:13px;
        font-family:Alibaba PuHuiTi;
        font-weight:400;
      }
      div{
        font-size: 16px;
        margin: 0 6px;
        font-weight: bold;
      }
    }
    .bottom-info{
      position: relative;
      .info-top-big{
        margin: 0 5px;
        width: calc(100% - 10px);
        height: 27px;
        box-sizing: border-box;
        padding: 9px 5px;
        background:rgba(255,144,56,1);
        border-radius:6px;
        .info-top-middle{
          border-radius: 3px;
          height:9px;
          background:rgba(205,73,14,1);
          border-radius:4px;
        }
      }
      .info-area{
        background: #ffffff;
        margin: -14px 12.5px 0 12.5px;
        width: calc(100% - 25px);
        box-sizing: border-box;
        padding: 26px 12px 18px 12px;
        border-radius:0px 0px 12px 12px;
        .explain-text{
          font-size:13px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(51,51,51,1);
          line-height:18px;
          text-align: center;
          margin: 11px 0 14px 0;
        }
        .invitation-button{
          background:linear-gradient(0deg,rgba(240,123,48,1),rgba(255,203,129,1));
          box-shadow:0px 10px 21px 0px rgba(245,111,17,0.47);
          border-radius:8px;
          border: none;
          width: 100%;
          padding: 15px 0;
          font-size:16px;
          font-family:PingFang SC;
          font-weight:bold;
          color:rgba(255,255,255,1);
          line-height:20px;
          margin-bottom: 30px;
        }
        .prize-text{
          text-align: center;
          margin: 12px 0 18px 0;
          font-size:13px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(51,51,51,1);
          span{
            color: #F26835;
          }
        }
        table{
          border-spacing:0;
          width: 100%;
          text-align: center;
          border-radius: 6px;
          border:2px solid rgba(255,144,56,1);
          th{
            font-size:14px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(242,104,53,1);
            line-height:39px;
          }
          th+th,td+td{
            border-left: 2px solid rgba(255,144,56,1);
          }
          td{
            font-size:13px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:39px;
            border-top: 2px solid rgba(255,144,56,1);
          }
          .level{
            width: 20%;
          }
          .total{
            width: 16%;
          }
        }
      }
    }
    .warm-prompt{
      margin: 200px 10px 0 10px;
      padding: 24px 16px 18px 16px;
      background: #ffffff;
      border-radius: 6px;
      p{
        margin: 10px 0 20px 0;
        font-size:13px;
        font-family:PingFang SC;
        font-weight:800;
        color:#333333;
        text-align: center;
      }
      button{
        outline: none;
        border: none;
        padding: 10px 20px;
        background:rgba(240,94,45,1);
        border-radius:4px;
        font-weight:500;
        font-size: 13px;
        color:rgba(255,255,255,1);
        display: block;
        margin: 0 auto;
      }
    }
    .apply{
      margin: calc(50vh - 50%) 12px 0 12px;
      background:rgba(255,255,255,1);
      border-radius:6px;
      padding: 24px 16px;
      p{
        font-size:14px;
        padding: 5px 0;
        font-family:PingFang SC;
        line-height: 22px;
        color: #333333;
        span{
          color:rgba(242,104,53,1);
        }
      }
      .info{
        margin-top: 10px;
      }
      .read-rule{
        font-size:12px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        margin: 14px 0 18px 0;
        display: flex;
        .rule-link{
          color: #F05E2D;
        }
      }
      button{
        outline: none;
        border: none;
        padding: 10px 40px;
        background:rgba(240,94,45,1);
        border-radius:4px;
        font-weight:500;
        font-size: 13px;
        color:rgba(255,255,255,1);
        display: block;
        margin: 0 auto;
      }
      button[disabled]{
        background-color: #cecece;
      }
    }
    .share-link{
      width: 108px;
      position: absolute;
      right: 10px;
      top: 10px;
      img{
        width: 100%;
      }
    }
  }

</style>