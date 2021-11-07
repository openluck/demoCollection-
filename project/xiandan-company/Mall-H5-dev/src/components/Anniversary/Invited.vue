<template>
  <div>
    <div v-if="isLoading" class="wait-scroll-loading">
      <van-loading color="#ffd4b2" :size="25"/>
    </div>
    <div class="invited" >
      <!--  邀请好友助力页面  -->
      <div class="to-index">
        <div class="index-btn"
             v-on:click="() => {$router.push('/index')}"
        >去商城逛逛</div>
      </div>
      <img :src="bar" alt="img" class="bar-img"/>
      <div class="invited-top">
        <div class="title">
          <span>/////</span>
          <div>{{isInvited ? "已成功为好友助力" : "为好友助力"}}</div>
          <span>/////</span>
        </div>
        <div v-if="!isInvited">
          <img :src="friend_head || finished" alt="img" class="friend-picture"/>
          <p class="friend-name">{{friend_name}}</p>
          <p class="tips-text">我正在参加闲蛋商城周年庆活动，点击帮我助力吧，你也可以一起参与哦！千元现金大奖我们一起领！</p>
        </div>
        <div v-else class="success-text">
          <p>闲蛋商城周年庆</p>
          <p>
            <span>千元现金大奖&安耐晒小金瓶</span>
          </p>
          <p>等您来领</p>
          <p>快来参加吧</p>
        </div>
        <button v-on:click="joinInvited">{{this.isInvited ? "参与活动" : "帮助好友助力" }}</button>
        <div class="line" v-if="list.length > 0">
          <img :src="line" alt="img"/>
          <img :src="line" alt="img"/>
        </div>
      </div>
      <div class="invited-list" v-if="list.length > 0">
        <div class="title">
          <span>/////</span>
          <div>已经助力</div>
          <span>/////</span>
        </div>
        <div class="invited-info" v-for="(item,index) in list" :key="index">
          <img :src="item.head || finished" alt="img"/>
          <div class="right-info">
            <div class="name">{{item.name}}</div>
            <div class="info">
              <div class="number">
                助力
                <span>{{item.score}}</span>
                积分
              </div>
              <div class="time">{{item.time | getTime}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
'use strict';

import Vue from 'vue';
import { Overlay, Toast, Dialog,Loading } from 'vant';

Vue.use(Overlay).use(Toast).use(Dialog).use(Loading);

import bar from '../../../images/icon/bar.png';
import line from '../../../images/icon/line.png';
import finished from '../../../images/icon/finished.png';
import {login} from "@/common/js/tools";

export default {
  name: "invited",
  data() {
    return{
      finished,
      bar,
      line,
      code: 0,
      isLoading: true,
      invitedCode: "",
      isInvited: false,
      isShow: false,
      friend_name: "",
      friend_head:"",
      list: [],
    }
  },
  created() {
    this.invitedCode = this.$route.params.code;
    // 保存邀请码用于助力
    this.getInfo();
  },
  filters: {
    // 获取好友的助力列表在多久之前助力
    getTime(time) {
      const now = Math.floor((new Date).getTime()/1000);
      const before = now - time;
      if(before/86400 >= 1) {
        return `${Math.floor(before/86400)}天前`;
      } else if(before/3600 >= 1) {
        return `${Math.floor(before/3600)}小时前`;
      } else if(before/60 >= 1) {
        return `${Math.floor(before/60)}分钟前`;
      } else if(before >= 1){
        return `${Math.floor(before)}秒前`;
      } else {
        return "1秒前";
      }
    }
  },
  methods: {
    // 获取好友的助力信息
    getInfo() {
      const url = `/api/events/2020/anniversary/${this.invitedCode}/boost`;
      this.$http.get(url)
        .then((res) => {
          // 1表示已助力， 0表示未助力， -2表示访客未登录 都可以拿到正确的结果
          if(res.data.code === 1) {
            this.isInvited = true;
            this.friend_name = res.data.message.friend_name;
            this.friend_head = res.data.message.friend_head;
            this.list = res.data.message.list;
          } else if (res.data.code === 0 || res.data.code === -2){
            this.friend_name = res.data.message.friend_name;
            this.friend_head = res.data.message.friend_head;
            this.list = res.data.message.list;
          }else if(res.data.code === -1) {
            Toast(res.data.message);
          } else if(res.data.code === -3) {
            Toast("您的好友未报名,将为您跳转到活动首页");
            setTimeout(() => {
              this.$router.replace('/anniversary');
            },1500)
          } else if(res.data.code === -4) {
            // 表示自己进了自己的链接
            this.$router.replace('/anniversary');
          }
          this.isLoading = false;
        })
    },
    //为好友助力或者参与活动
    joinInvited() {
        if(!this.isInvited) {
        //  未助力时，先进性注册，然后可以为好友助力
          if(!this.$store.getters.isLogin){
            this.login();
          } else {
            this.$http.post(`/api/events/2020/anniversary/${this.invitedCode}/boost`)
              .then((res) => {
                if(res.data.code === 0) {
                  Toast('助力成功');
                  this.isInvited = true;
                  this.isLoading = true;
                  this.getInfo();
                } else {
                  Toast(res.data.message);
                }
              })
          }
        } else {
          // 为true表示已助力,我想参与直接跳转活动主页面
          this.$router.push('/anniversary');
        }
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
.invited{
  background:rgba(255,212,178,1);
  padding: 18px 5px;
  min-height: 100vh;
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
    margin: 15px 0 10px 0;
    div{
      font-size: 16px;
      margin: -2px 6px 0 6px;
      font-weight: bold;
    }
  }
  .invited-top{
    padding: 30px 15px 20px 15px;
    position: relative;
    margin: -17px 7px 12px 7px;
    border-radius:0px 0px 6px 6px;
    background: #ffffff;
    .friend-picture{
      display: block;
      width: 60px;
      border-radius: 50%;
      margin: 0 auto;
    }
    p{
      text-align: center;
      margin-top: 10px;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      span{
        color: #F26835;
      }
    }
    .success-text{
      margin: 18px 0 10px 0;
      line-height: 18px;
    }
    .tips-text{
      line-height: 18px;
      padding: 10px 0 10px 0;
      text-align: center;
    }
    .friend-name{
      font-weight: bold;
    }
    button{
      outline: none;
      border: none;
      width: 100%;
      margin: 10px 0 30px 0;
      padding: 5px 0;
      box-sizing: border-box;
      background:linear-gradient(0deg,rgba(240,123,48,1),rgba(255,203,129,1));
      box-shadow:0px 10px 21px 0px rgba(245,111,17,0.47);
      border-radius:8px;
      font-size:18px;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(255,255,255,1);
      line-height:39px;
    }
    .line{
      position: absolute;
      display: flex;
      justify-content: space-between;
      width: calc(100% - 20px);
      img{
        width: 12px;
        display: block;
        height: 57px;
      }
    }
  }
  .invited-list{
    background: #ffffff;
    border-radius:6px;
    margin: 0 7px;
    padding: 26px 0 17px 0;
    .invited-info{
      display: flex;
      margin: 0 15px;
      box-sizing: border-box;
      img{
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      .right-info{
        width: calc(100% - 70px);
        padding-left: 10px;
        padding-top: 8px;
        .name{
          font-size:13px;
          font-family:PingFang SC;
          font-weight:bold;
          color:rgba(51,51,51,1);
        }
        .info{
          display: flex;
          justify-content: space-between;
          font-size:12px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(102,102,102,1);
          span{
            color: #F26835;
          }
        }
      }
    }
    .invited-info+.invited-info{
      margin-top: 20px;
    }
  }
  .join-mall{
    background: #ffffff;
    margin: 150px 12px 0 12px;
    border-radius: 6px;
    padding: 24px 17px;
    p{
      text-align: center;
      margin-top: 10px;
      font-size:16px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      text-align: left;
      span{
        color: #F26835;
      }
    }
    button{
      display: block;
      width: 144px;
      margin: 10px auto 0 auto;
      outline: none;
      border: none;
      background:rgba(240,94,45,1);
      border-radius:8px;
      font-size:13px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:39px;
    }
  }
}
</style>