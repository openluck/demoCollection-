<template>
  <div>
    <div v-if="isLoading" class="wait-scroll-loading">
      <van-loading color="#ffd4b2" :size="25"/>
    </div>
    <div class="integral" v-else>
      <div class="to-index">
        <div class="index-btn"
             v-on:click="$router.push('/index')"
        >去商城逛逛</div>
      </div>
      <img :src="bar" alt="img" class="bar-img"/>
      <div class="total">
        <div class="title">
          <span>/////</span>
          <div>我的积分</div>
          <span>/////</span>
        </div>
        <div class="invited" v-on:click="toList">
          助力好友
          <span class="iconfont iconfont-yuanjiaojuxingkaobei invited-icon"></span>
        </div>
        <div class="integral-total">
          {{message.score | getScore}}
        </div>
        <div v-if="message.redeem_status > 0">
          <p class="total-info">
            已经兑换第
            <span>{{message.prize_index}}</span>
            关奖品
          </p>
          <p class="total-info">
            谢谢您的参与
          </p>
        </div>
        <div v-else-if="message.score < 3">
          <p class="total-info">
            暂不能兑换奖品
          </p>
          <p class="total-info">
            距离下一关还差
            <span>{{message.score | getNextScore(prizeList)}}</span>
            积分
          </p>
        </div>
        <div v-else>
          <p class="total-info">
            可兑换
            <span>{{message.score | getLevel(prizeList)}}</span>
            奖品
          </p>
          <p class="total-info" v-if="message.score < 1300">
            距离下一关还差
            <span>{{message.score | getNextScore(prizeList)}}</span>
            积分
          </p>
        </div>
        <div class="line">
          <img :src="line" alt="img"/>
          <img :src="line" alt="img"/>
        </div>
      </div>
      <div class="prize-list">
        <div class="title">
          <span>/////</span>
          <div>奖品兑换</div>
          <span>/////</span>
        </div>
        <p class="tips">只能兑换一次请慎重选择</p>
        <table class="">
          <thead>
          <tr>
            <th v-for="value in prizeTitle" :key="value"
                :class="{'prize': value === '奖品列表'}"
            >{{value}}</th>
          </tr>
          </thead>
          <tr v-for="(item, index) in prizeList" :key="index"
          >
            <td class="level">{{item.level}}</td>
            <td class="prize">{{item.prize}}</td>
            <td class="conversion-btn">
              <button class="inconvertibility"
                      v-if="message.redeem_status > 0 && message.prize_index !== index + 1"
              >
                不可兑换
              </button>
              <button class="convertible"
                      v-else-if="message.redeem_status > 0 && message.prize_index === index + 1"
                      v-on:click=""
              >已兑换</button>
              <button class="convertible"
                      v-else-if="message.score >= item.total"
                      v-on:click="conversionPrize(index)"
              >
                兑换
              </button>
              <button v-else
                      class="lackIntegral"
                      v-on:click="lackIntegral"
              >
                积分不足
              </button>
            </td>
          </tr>
        </table>
      </div>
<!--   提示实名认证   -->
      <van-overlay :show="isShow" z-index="10" v-on:click="()=>{isShow = false}">
        <div class="cash-rewards" v-on:click.stop="">
          <div class="cancel-icon">
            <van-icon class-prefix="iconfont" name="zu1" @click="cancel" color="#F26835"/>
          </div>
          <div class="title">
            <span>/////</span>
            <div>兑换认证</div>
            <span>/////</span>
          </div>

        </div>
      </van-overlay>
      <!--   提示实名认证   -->
      <van-overlay :show="isShow" z-index="10" v-on:click="()=>{isShow = false}">
        <div class="cash-rewards" v-on:click.stop="">
          <div class="cancel-icon">
            <van-icon class-prefix="iconfont" name="zu1" @click="cancel" color="#F26835"/>
          </div>
          <div class="title">
            <span>/////</span>
            <div>兑换认证</div>
            <span>/////</span>
          </div>
          <div class="user-auth">
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
            <button v-on:click="()=>{this.$router.push('/user/auth')}" :disabled="!isRead">
              已了解，我要认证
            </button>
          </div>
        </div>
      </van-overlay>
      <!--   确认是否兑换奖品   -->
      <van-overlay :show="isConversion" z-index="10" v-on:click="()=>{isConversion = false}">
        <div class="cash-rewards" v-on:click.stop="">
          <div class="cancel-icon">
            <van-icon class-prefix="iconfont" name="zu1" @click="cancel" color="#F26835"/>
          </div>
          <div class="title">
            <span>/////</span>
            <div>兑换认证</div>
            <span>/////</span>
          </div>
          <div>
            <p class="is-conversion">奖品只能兑换一次，请慎重选择！</p>
            <button class="sure-conversion" v-on:click="sureConversion">
              确定兑换
            </button>
          </div>
        </div>
      </van-overlay>
      <!--   输入支付宝账号   -->
      <van-overlay :show="isAlipay" z-index="10" v-on:click="()=>{isAlipay = false}">
        <div class="cash-rewards" v-on:click.stop="">
          <div class="cancel-icon">
            <van-icon class-prefix="iconfont" name="zu1" @click="cancel" color="#F26835"/>
          </div>
          <div class="title">
            <span>/////</span>
            <div>兑换认证</div>
            <span>/////</span>
          </div>
          <div class="account">
            <p>活动结束后5个工作日内，闲蛋商城会将您兑换的现金红包转入您提供的支付宝账号。</p>
            <input type="text" placeholder="请填写您的支付宝账号" v-model="alipay">
            <button v-on:click="putAccount">兑换</button>
          </div>
        </div>
      </van-overlay>
<!--      兑换成功-->
      <van-overlay :show="finished" z-index="10" v-on:click="()=>{finished = false}">
        <div class="cash-rewards" v-on:click.stop="">
          <div class="cancel-icon">
            <van-icon class-prefix="iconfont" name="zu1" @click="cancel" color="#F26835"/>
          </div>
          <div class="title">
            <span>/////</span>
            <div>兑换认证</div>
            <span>/////</span>
          </div>
          <div class="finished">
          <p>兑换成功</p>
          <img :src="finishImg" alt="img"/>
        </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
"use strict";

import Vue from 'vue';
import { Overlay, Toast,Checkbox,Loading,Dialog,Icon } from 'vant';

Vue.use(Overlay)
  .use(Toast)
  .use(Checkbox)
  .use(Loading)
  .use(Dialog)
  .use(Icon);
import bar from '../../../images/icon/bar.png';
import myIntegral from '../../../images/icon/myIntegral.png';
import conversion from '../../../images/icon/conversion.png';
import line from '../../../images/icon/line.png';
import finishImg from '../../../images/icon/finished.png';

export default {
  name: "integral",
  data() {
    return {
      bar,
      line,
      myIntegral,
      conversion,
      finishImg,
      isLoading: true,
      isRead: false,
      disable:true,
      isConversion: false, // 确认是否兑换奖品
      isShow: false,  //提示实名认证
      finished: false, // 兑换成功
      isAlipay:false, //输入支付宝账号
      alipay: "",
      message:{
        score: 0,
        code: '',
        prize_index: "",
        redeem_status: "",
        redeem_code:"",
        alipay_account:"",
        order_id: "",
      },
      index: 0,
      prizeTitle:["关卡", "奖品列表", "兑换"],
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
  created() {
    this.fetchMessage();
    if(this.isSuccess ) {
      this.finished = true;
      this.$store.commit('updateSuccess', false);
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    isSuccess() {
      return this.$store.state.isSuccess
    }
  },
  filters: {
    // 活动分数
    getScore(score) {
      if(typeof score === 'number') {
        if (score >= 1000) {
          return score;
        } else if (score >= 100) {
          return "0" + score.toString();
        } else if (score >= 10) {
          return "00" + score.toString();
        } else {
          return "000" + score.toString();
        }
      } else {
        return score;
      }
    },
    // 距离下一关积分
    getNextScore(score,prizeList) {
      for(let i = 0;i < prizeList.length ; i += 1) {
        if(prizeList[i].total > score) {
          return prizeList[i].total - score;
        }
      }
    },
    // 当前关数
    getLevel(score,prizeList) {
      for(let i = 0; i < prizeList.length ; i++) {
        if(prizeList[i].total > score && i > 0) {
          return prizeList[i-1].level;
        }
      }
      return prizeList[prizeList.length - 1].level;
    },
  },
  methods:{
    fetchMessage() {
      this.$http.get('/api/events/2020/anniversary')
        .then((res) => {
          if(res.data.code === 0) {
            this.message = res.data.message;
            this.isLoading = false;
          }
        })
    },
    conversionPrize(index) {
      this.index = index + 1;
      if(this.user.is_auth !== 2) {
        // 如果未进行实名认证
        this.isShow = true;
      } else{
        // 如果已经实名认证，则确认提示框
        this.isConversion = true;
      }
    },
    sureConversion(){
      this.isConversion = false;
      if(this.index === 1) {
        // 获取红包
        this.$http.post('/api/events/2020/anniversary/redeem',{index:this.index})
          .then((res) => {
            if(res.data.code === 0) {
              this.finished = true;
              this.fetchMessage();
            } else {
              Toast(res.data.message);
            }
          })
      } else if (this.index >= 2 && this.index <= 5) {
        //  获取商品实物奖励，跳转输入收货信息页面
        this.$router.push(`/anniversary/conversionprize/${this.index}`);
      } else {
        //  获取支付宝现金奖励
        this.isAlipay = true;
      }
    },
    putAccount() {
      if(this.alipay === "") {
        Toast("请输入支付宝账号")
      } else {
        this.isAlipay = false;
      //  提交支付宝账号
        const url = '/api/events/2020/anniversary/redeem';
        const data = {
          index: this.index,
          alipay: this.alipay,
        };
        this.$http.post(url,data)
        .then((res) => {
          if(res.data.code === 0) {
            this.fetchMessage();
            this.finished = true;
          } else {
            Toast(res.data.message);
          }
        })
      }
    },
    lackIntegral() {
      Toast("积分不足，请继续加油");
    },
    toList() {
      this.$router.push({
        path:'/anniversary/list',
        query:{code: this.message.code}
      })
    },
    cancel() {
      this.isShow = false;
      this.finished = false;
      this.isConversion = false;
      this.isAlipay = false;
    },
  },
}
</script>

<style scoped type="text/scss">
.integral{
  background:rgba(255,212,178,1);
  padding: 18px 5px;

  .to-index{
    margin-left: -5px;
    margin-bottom: 12px;
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
      letter-spacing:3px;
    }
  }
  .bar-img{
    width: 100%;
  }
  .title{
    display: flex;
    justify-content: center;
    font-size:13px;
    font-family:Alibaba PuHuiTi;
    font-weight:400;
    color:rgba(242,104,53,1);
    div{
      font-size: 16px;
      margin: -2px 6px 0 6px;
      font-weight: bold;
    }
  }
  .total{
    background:rgba(255,255,255,1);
    border-radius:0px 0px 12px 12px;
    padding: 36px 10px 18px 10px;
    position: relative;
    margin: -15px 7px 0 7px;
    .invited{
      position: absolute;
      right: 5px;
      top: 36px;
      font-size:13px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      .invited-icon{
        font-size: 13px;
        color: #333333;
      }
    }
    .integral-total{
      margin: 10px auto;
      width: 70%;
      box-sizing: border-box;
      padding: 12px;
      background:rgba(240,94,45,1);
      box-shadow:0px 0px 5px 0px rgba(210,45,34,0.85) inset;
      border-radius:8px;
      text-align: center;
      font-size:36px;
      font-family:Alibaba PuHuiTi;
      font-weight:800;
      color:rgba(255,255,255,1);

    }
    .total-info{
      padding-top: 6px;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      text-align: center;
      span{
        color: #F26835;
      }
    }
    .line{
      position: absolute;
      display: flex;
      justify-content: space-between;
      width: calc(100% - 20px);
      bottom: -35px;
      img{
        width: 12px;
        display: block;
        height: 57px;
      }
    }
  }
  .prize-list{
    margin: 15px 7px 0 7px;
    padding: 17px 12px 12px 12px;
    background:rgba(255,255,255,1);
    border-radius:12px;
    .tips{
      font-size:13px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      margin: 10px 0 12px 0;
      text-align: center;
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
      .prize{
        text-align: left;
        padding-left: 10px;
        border-left: 2px solid rgba(255,144,56,1);
      }
      .conversion-btn{
        width: 30%;
        padding: 6px 5px;
        box-sizing: border-box;
        button{
          border: none;
          border-radius:4px;
          width: 100%;
          /*padding: 5px 0;*/
          font-size: 13px;
          font-family:PingFang SC;
          font-weight:500;
          box-sizing: border-box;
        }
        /* 积分不足 */
        .lackIntegral{
          border:2px solid rgba(240,94,45,1);
          color:rgba(240,94,45,1);
          background: rgba(256,256,256,1);
        }
        /* 兑换 已经兑换 */
        .convertible{
          background:rgba(240,94,45,1);
          color:rgba(255,255,255,1);
        }
        /* 不可兑换 */
        .inconvertibility{
          border:2px solid rgba(153,153,153,1);
          border-radius:8px;
          background: #ffffff;
        }
      }
    }
  }
  .cash-rewards{
    margin: calc(50vh - 60%) 12px 0 12px;
    background: #ffffff;
    padding: 24px 21px 40px 21px;
    box-sizing: border-box;
    border-radius: 6px;
    .cancel-icon{
      text-align: right;
    }
    .account{
      p{
        font-size:14px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height: 21px;
        margin: 10px 0 18px 0;
      }
      input{
        display: block;
        border: none;
        outline: none;
        background: rgba(245,245,245,1);
        font-size:14px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        text-align: center;
        padding: 12px 0;
        width: 100%;
      }
    }
    .finished{
      p{
        padding: 10px 0;
        text-align: center;
      }
      img{
        display: block;
        margin: 0 auto;
        width: 128px;
      }
    }
    .user-auth{
      .read-rule{
        font-size:12px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        margin: 14px 0 18px 0;
        display: flex;
        input{
          display: block;
        }
        span{
          color: #F05E2D;
        }
      }
      p{
        padding: 5px 0;
        font-size:14px;
        font-family:PingFang SC;
        color: #333333;
        span{
          color:rgba(242,104,53,1);
        }
      }
      button[disabled]{
        background-color: #cecece;
      }
    }

    button{
      display: block;
      background:rgba(240,94,45,1);
      border-radius:6px;
      padding: 11px 44px;
      margin: 24px auto 0 auto;
      outline: none;
      border: none;
      font-size:13px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:20px;
    }
    .is-conversion{
      text-align: center;
      color: #333333;
      margin: 15px 0;
    }
  }
}
</style>