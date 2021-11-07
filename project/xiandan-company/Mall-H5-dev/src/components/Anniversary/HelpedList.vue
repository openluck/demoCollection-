<template>
  <div>
    <div v-if="isLoading" class="wait-scroll-loading">
      <van-loading color="#ffd4b2" :size="25"/>
    </div>
    <div class="helped-list" v-else>
      <div class="to-index">
        <div class="index-btn"
             v-on:click="$router.push('/index')"
        >去商城逛逛</div>
      </div>
      <img :src="bar" alt="img" class="bar-img"/>
      <div class="helped-area">
        <div class="title">
          <span>/////</span>
          <div>以下好友已经为你助力</div>
          <span>/////</span>
        </div>
        <div class="list" v-if="list.length > 0">
          <div class="item" v-for="(item,index) in list" :key="index">
            <img :src="item.head || finished" alt="img"/>
            <p>{{item.name}}</p>
          </div>
        </div>
        <div class="list-none" v-else>
          <img :src="listNone" alt="img">
          <p class="help-none">暂无好友助力</p>
          <p class="invited">赶紧邀请好友帮忙助力吧</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
'use strict';
import bar from '../../../images/icon/bar.png';
import finished from '../../../images/icon/finished.png';
import listNone from '../../../images/icon/list-none.png';
import Vue from 'vue';
import {Loading} from 'vant';
Vue.use(Loading);


export default {
  name: "HelpedList",
  data() {
    return {
      bar,
      finished,
      listNone,
      list:[],
      isLoading: true,
    }
  },
  created() {
    const url = `/api/events/2020/anniversary/boosts`;
    this.$http.get(url)
    .then((res) => {
       this.list = res.data.data;
       this.isLoading = false;
    })
  }
}
</script>

<style scoped type="text/scss">
.helped-list{
  background:rgba(255,212,178,1);
  min-height: 100vh;
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
  .helped-area{
    background: #ffffff;
    position: relative;
    z-index: 3;
    margin: -17px 7px 0px 7px;
    padding: 30px 10px 9px 10px;
    border-radius:0px 0px 6px 6px;
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
      }
      img{
        width: 62px;
        height: 16px;
        margin: 0 6px;
        display: block;
      }
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      .item{
        width: 25%;
        box-sizing: border-box;
        padding: 9px 15px;
        img{
          width: 100%;
          border-radius: 50%;
        }
        p{
          font-size:12px;
          font-family:PingFang SC;
          font-weight:bold;
          color:rgba(51,51,51,1);
          text-align: center;
          margin-top: 10px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
      }
    }
    .list-none{
      padding: 10px;
      img{
        width: 198px;
        display: block;
        margin: 0 auto;
      }
      .help-none{
        text-align: center;
        font-size:13px;
        font-family:Alibaba PuHuiTi;
        font-weight:400;
        color:rgba(51,51,51,1);
        margin-top: 10px;
      }
      .invited{
        text-align: center;
        font-size:13px;
        font-family:Alibaba PuHuiTi;
        font-weight:400;
        color:rgba(153,153,153,1);
        margin-top: 8px;
      }
    }
  }
}
</style>