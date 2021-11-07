<template>
  <div v-loading="loading">
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
<!--    :style="{height: pcHeight}"-->
    <div class="raffle-container" :style="{height: pcHeight}">
      <div class="login-name">
        {{userName}}
        <span class="iconfont icondonwslip" @click="showMenu"></span>
        <div class="loginOut" v-if="showLoginOut" @click="loginOut">
          <el-button  @click="loginOut">退出登陆</el-button>
        </div>
      </div>
      <div class="raffle-title">
        <div class="title-left">发起抽奖列表</div>
        <div class="title-right" v-on:click="toRaffleDetail">
          <span class="iconfont iconraffle"></span>
          <span class="initiate-text">发起抽奖</span>
        </div>
      </div>
      <div class="table-style">
<!--         :height="tableHeight"-->
          <el-table-plus ref="table"
                         style="padding: 0 12.5%"
                         pagination-align="right"
                         :current-change-async="loadingData"
                         :columns="tableColumns"
                         :cell-style="tableCellStyle"
                         :header-cell-style="tableHeaderColor"
                         :page-size="8">
            <!--        序列-->
            <el-table-column
              label="序列"
              width="100px"
              header-align="center"
              align="center"
              type="index">
            </el-table-column>
            <!--        活动-->
            <el-table-column
              label="活动"
              prop="title"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <!--        需满人数/结束时间-->
            <el-table-column
              label="需满人数/结束时间"
              prop="open_time"
              :formatter="formatterTime"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <!--        状态-->
            <el-table-column
              label="状态"
              header-align="center"
              align="center"
              prop="status">
              <template slot-scope="scope">
              <span :style="scope.row.status === '1'? 'color:#BC4343': 'color:#3B9CE7' ">
                {{scope.row.status === '0'? '待开奖' : '已结束'}}
              </span>
              </template>
            </el-table-column>
            <!--        详情-->
            <el-table-column
              header-align="center"
              align="center"
              label="详情">
              <template slot-scope="scope" >
                <div @click="open(scope.row.qr_url.replace('cloud://luck-ceo-fqpk1.6c75-luck-ceo-fqpk1-1257185141/','https://6c75-luck-ceo-fqpk1-1257185141.tcb.qcloud.la/'))">查看</div>
              </template>
            </el-table-column>
            <!--        数据为空的时候显示-->
            <template slot="empty">
              <div class="active-none">
                <img :src="raffleNone" alt="">
                <p>列表空空的哦</p>
              </div>
            </template>
          </el-table-plus>
      </div>
    </div>
    <div v-for="(item,index) in detailQrcodeAry" :key="index">
      <img :src="item" alt="" style="height: 100px; width: 100px">
    </div>
    <web-footer></web-footer>
  </div>
</template>

<script>
  import RaffleList from "./raffleList";
  import webHeader from './WebHead';
  import webFooter from './WebFooter';
  import {Loading} from 'element-ui';
  import ElTablePlus from '../public/ElTablePlus.js';
  import 'el-table-plus/lib/index.css';
  import login from '@/assets/img/login.png';
  import raffleNone from '@/assets/img/raffle-none.png';
  import Vue from 'vue';
  import VueQrcode from 'vue-qrcode'
  Vue.use(Loading);
  export default {
    name: "raffle.vue",
    data() {
      return {
        pages: 1,
        activePage: 3,
        newPage: '',
        raffleNone,
        raffleList: [],
        loading: false,
        userList: [],
        userName: '',
        showLoginOut: false,
        tableHeight:'tableHeight',
        tableColumns: [],
        // 表格数据
        lotteryList: [],
        // 转换时间和人数
        timePeople: [],
        refToken:'',
        detailQrcode:'',
        detailQrcodeSrPre:'https://6c75-luck-ceo-fqpk1-1257185141.tcb.qcloud.la',
        detailQrcodeAry: [],
        showDetails:false,
        showQrcode: false,
        qrCodeUrl:'',
      }
    },
    components: {
      RaffleList,
      webHeader,
      webFooter,
      ElTablePlus,
      VueQrcode
    },
    mounted() {
      this.fetchLoginList();
      // this.$http.defaults.headers['x-wx-skey'] = this.testToken;
      this.fetchList();
      // 设置表格的宽度
      this.$nextTick(() => {
        this.tableHeight =(window.innerHeight - 220);
      })
    },
    computed: {
      pcHeight() {
        return (window.innerHeight - 60) + 'px';
      },
    },
    methods: {
      toRaffleDetail() {
        this.loading = true;
        this.$http.get('/user/refresh_token', {params: {skey: global.token}}).then(res => {
          if(res.data.code === 0) {
            this.loading = false;
            this.$router.push({name: 'raffleDetail'});
          }else if(res.data.code === -1) {
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
          }
        })
      },
      // 检查登陆
      checkLogin() {
        this.$http.get(`/lottery/check_login`, {params: {token: this.temToken}}).then((res) => {
          if (res.data.code === 1) {
            this.loading = false;
            this.showQrcode = false;
            // global.token = res.data.data.token;
            // this.$http.defaults.headers['X-WX-Skey'] = global.token;
            var queryParams = new URLSearchParams(window.location.search);
            // queryParams.set(global.token, token);
            queryParams.set(global.token,res.data.data.token);
            history.replaceState(null, null, "?"+queryParams.toString());
            this.$router.push({name: 'raffleDetail'});
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
      // 获取抽奖列表内容
      fetchList() {
        this.loading = true;
        this.$http.get(`/user/lotteryList?mode=1`).then((res) => {
          this.lotteryList = res.data.data;
          this.loading = false;
          this.$refs.table.reload();
          if(res.data.code === -1) {
             this.loading = false;
          }else{
            this.$http.get('/user/refresh_token',{ params : { skey: global.token }});
          }
        }).catch((err) => {
          this.loading = false;
          console.log(err);
        })
      },
      // 获取用户列表
      fetchLoginList() {
        this.loading = true;
        this.$http.get('/user').then((res) => {
          this.userName = res.data.data.userinfo.nickName;
          this.loading = false;
            if(res.data.code === -1) {
            this.loading = false;
          }else{
            this.$http.get('/user/refresh_token',{ params : { skey: global.token }});
          }
        }).catch((err) => {
          this.loading = false;
          console.log(err);
        })
      },
      // 表格的数据
      loadingData(currentPage, pageSize) {
        const total = this.lotteryList.length;
        const data = this.lotteryList.slice( (currentPage - 1) * pageSize , Math.min(currentPage * pageSize,  total));
        return {data, total}
      },
      // 退出功能
      loginOut() {
        global.quiting = true;
        global.token = null;
        this.$router.push({name: 'home' })
      },
      // 展示退出下拉菜单
      showMenu() {
        this.showLoginOut = !this.showLoginOut;
      },
      // 点击查看详情
      open(url) {
        this.$alert(`<div style="text-align: center"><img src="${url}" style="width: 350px;height: 350px;"/><p style="margin-top: 5px">微信扫描二维码</p></div>`, '请扫描小程序二维码查看', {
          dangerouslyUseHTMLString: true,
          center: true,
          showConfirmButton: false,
        });
      },
      // 开奖类型判断
      formatterTime(row,column){
        if(row.open_type === "1") {
          return row.open_time.replace(/-/g, '/').substring(0,10);
        }else {
          return  "需要满" + row.open_count + '人';
        }
      },
      //修改头部的样式
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if(rowIndex === 0) {
          return 'background-color:#E8E8E8; font-size:16px; color:#0F0F0F '
        }
      },
      //修改表格行的样式
      tableCellStyle({row, rowIndex}) {
          // return 'rowStyle';
        return {
          fontSize: '16px',
          fontWeight: '500',
          color: '#0F0F0F'
        }
      },
      // 二维码消失
      disappearCode() {
        this.showQrcode = false;
      },

      // 取消加载loading
      disappearLoading() {
        let loadingInstance = Loading.service();
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      },

      // 检查用户的token是否过期
      checkUserToken(){
        this.$http.get('/user/refresh_token', {params : { skey: global.token }}).then(res => {
          // if(res.code)
          console.log(res.code);
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
    .raffle-container {
      padding: 0 12.5px;
      width: 100%;
      background: #ffffff;
      box-sizing: border-box;
      min-height: 300px;
      .raffle-title {
        margin: 0px 12.5%;
        padding: 0 0 18px 0;
        display: flex;
        justify-content: space-between;

        .title-left {
          height: 27px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          line-height: 21px;
          padding: 11px 0 10px 0;
        }

        .title-right {
          /*width: 156px;*/
          height: 48px;
          background: rgba(188, 67, 67, 1);
          box-shadow: 0px 8px 24px 3px rgba(86, 15, 15, 0.18);
          border-radius: 24px;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 30px;
          text-align: right;
          padding: 8px 27px 8px 28px;
          box-sizing: border-box;
          display: flex;

          .iconfont {
            font-size: 30px;
          }

          .initiate-text {
            display: block;
            margin-left: 6px;
          }
        }
      }
      .table-style {
        padding: 0 12.5px;
      }
      .jump-page {
        height: 52px;
        margin: 0 12.5%;
        padding-top: 14px;
        box-sizing: border-box;

        .go-btn {
          float: right;
          width: 38px;
          height: 22px;
          background: rgba(188, 67, 67, 1);
          border-radius: 4px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 21px;
          text-align: center;
        }

        .page-value {
          float: right;
          display: block;
          width: 42px;
          height: 24px;
          border: 1px solid rgba(102, 102, 102, 1);
          border-radius: 4px;
          box-sizing: border-box;
          margin: 0 13px;
          text-align: center;
        }

        .jump-text {
          float: right;
          height: 13px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(15, 15, 15, 1);
          line-height: 21px;
          margin-left: 28px;
        }

        .page-list {
          float: right;
          display: flex;
          height: 11px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(15, 15, 15, 1);
          line-height: 21px;

          ul {
            display: flex;
            margin: 0 10.5px;
            padding: 0 10.5px;

            li {
              margin: 0 10.5px
            }

            .active {
              height: 24px;
              width: 24px;
              text-align: center;
              background: rgba(188, 67, 67, 1);
              border-radius: 50%;
              font-family: PingFang SC;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              line-height: 21px;
              margin-top: -3px;
              padding-top: 1.5px;
            }
          }

          .iconfont {
            color: #333333;
          }

          .noClick {
            color: #999999;
          }
        }
      }

      .login-name {
        padding: 18px 12.5%;
        font-size: 18px;
        /*display: flex;*/
        /*background-color: red;*/
        height: 18px;
        line-height: 18px;
        .icondonwslip {
          font-size: 10px;
          margin-left: 6px;
        }
        .loginOut {
          width: 113px;
          z-index: 100;
          .out {
            display: inline-block;
            width: 113px;
            height: 38px;
            line-height: 38px;
            color: #ffffff;
            text-align: center;
            font-size: 13px;
            border-radius: 6px;
            background-color: #333333;
            z-index: 3;
          }
        }
      }
    }
  .active-none {
    width: 159px;
    margin: 200px auto 200px  auto;

    img {
      width: 159px;
      height: 122px;
      display: block;
    }

    p {
      margin-top: 28px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(15, 15, 15, 1);
      line-height: 21px;
      padding-right: 45px;
    }
  }
    .cellStyle {
      background-color: red;
    }
    .el-button {
      background-color: #333333;
      color: white;
      z-index: 99;
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
</style>
