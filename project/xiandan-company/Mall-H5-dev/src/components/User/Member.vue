<template>
  <div class="member">
    <div class="member-title">
      {{user.vip_level > 0 ? "您已是闲蛋商城VIP" : "闲蛋商城VIP开通"}}
    </div>
    <div class="member-desc" v-if="user.vip_level > 0">
      您的特权是全场商品
      <span>9.5折</span>
      的优惠、 并且在
      <span>商城特价区</span>
      有更加
      <span>优惠</span>
      的价格.
    </div>
    <div class="member-desc" v-else>
      开通本商城VIP，将会获得全场商品
      <span>9.5折</span>
      的优惠、 并且在
      <span>商城特价区</span>
      有更加
      <span>优惠</span>
      的价格.
    </div>
    <img :src="user.vip_level > 0 ? member : dredge" alt="img" class="middle-img"/>
    <p class="residue-time" v-if="user.vip_level > 0">
      距离结束还剩
      <span>10</span>
      天
    </p>
    <button class="pay-btn" v-on:click="dredgeVip">
      {{user.vip_level > 0 ? "我要续费" : "开通VIP 199元/年"}}
    </button>
    <div class="read-rule">
      <van-checkbox v-model="isRead" checked-color="#D48827">
        已阅读并同意
        <span v-on:click.stop="" v-on:click="toRule">《闲蛋商城VIP会员用户协议》</span>
      </van-checkbox>
    </div>
    <van-popup v-model="codeShow">
      <div class="code">
        <qrcode url="https://www.xiandanmall.com/mall" :wid="200" :hei="200"/>
        <p>请前往闲蛋公众号商城开通vip会员</p>
      </div>
    </van-popup>
  </div>
</template>

<script>

import member from '../../../images/icon/member.png';
import dredge from '../../../images/icon/dredge.png';

import Vue from 'vue';
import { Checkbox, Toast, Popup } from 'vant';
import {getPlatform} from "@/common/js/tools";
import qrcode from 'vue_qrcodes';
import store from "@/store";

Vue.use(Checkbox).use(Toast).use(Popup);

export default {
  name: "member",
  data() {
    return {
      dredge,
      member,
      isRead: false,
      codeShow: false,
    }
  },
  components:{
    qrcode,
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    toRule() {
      this.$router.push('/user/member_rule');
    },
    dredgeVip(){
      const platform = getPlatform();
      if(!this.isRead) {
        Toast('请先阅读并同意《闲蛋商城VIP会员用户协议》')
      } else if(platform !== 'WECHAT') {
      //  如果没有在微信中登录，则提示用户前往微信开通
        this.codeShow = true;
      } else {
      //  开通会员函数
        this.$http.post('/api/user/vip')
        .then((response) => {
          if (response.data.code === 0) {
            wx.chooseWXPay({
              timestamp: response.data.message.timestamp,
              nonceStr: response.data.message.nonceStr,
              package: response.data.message.package,
              signType: response.data.message.signType,
              paySign: response.data.message.paySign,
              success: () => {
                Toast.loading({ message: '开通成功，稍后将返回上一页面',
                  forbidClick: true,
                  onClose: ()=>{
                    store.commit('changeVipLevel',1);
                    this.$router.back();
                  } })
              },
              cancel: res => {
                Toast({ message: '微信支付失败！' });
              }
            });
          } else {
            Toast({
              message: response.data.message
            });
          }
        })
      }
    },
  }
}
</script>

<style scoped type="text/scss">
.member{
  padding-bottom: 60px;
  min-height: 100%;
  overflow: hidden;
  .member-title{
    padding: 40px 0 18px 0;
    text-align: center;
    font-size:24px;
    font-family:PingFang SC;
    font-weight:800;
    color:rgba(51,51,51,1);
    overflow: hidden;
  }
  .member-desc{
    margin: 0 35px 9px 35px;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:20px;
    text-align: center;
    span{
      color: #F10D0D;
    }
  }
  .middle-img{
    width: 140%;
    margin-left: -17%;
    display: block;
    margin-bottom: 40px;
  }
  .residue-time{
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    text-align: center;
    margin-bottom: 12px;
    span{
      color: #F10D0D;
    }
  }
  .pay-btn{
    display: block;
    margin: 0 auto;
    padding: 15px 50px;
    border: none;
    outline: none;
    background:linear-gradient(90deg,rgba(250,189,113,1),rgba(212,135,38,1));
    border-radius:40px;
    font-size:16px;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(255,255,255,1);
  }
  .read-rule{
    text-align: center;
    font-size:12px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    display: flex;
    justify-content: center;
    margin-top: 12px;
    span{
      color: #D48827;
    }
  }

  .code{
    padding: 10px;
    p{
      font-size: 14px;
      text-align: center;
      color: #333333;
      padding-top: 10px;
    }
  }
}
</style>