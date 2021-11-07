<template>
  <div>
    <WebHead></WebHead>
    <div class="main" >
      <div class="container">
        <div class="content-title">
          <div class="title-first">
            <span class="case-first">案例展示</span>
          </div>
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
  import WebHead from './WebHead'
  import WebFooter from './WebFooter'
    export default {
        name: "Case",
      data(){
        return{
          cur:0,
          smallDetails: true,
          bigDetails: false,
        }
      },
      created() {
          if(this.$route.query.index) {
            this.cur = this.$route.query.index;
          }
      },
      computed: {
        pcHeight() {
          return (window.innerHeight - 243 ) + 'px';
        }
      },
      components: {
          WebHead,
          WebFooter
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
  background: #ffffff;
  font-family:PingFang SC;
  .container {
   .content-title {
     text-align: center;
     /*margin-top: 112px;*/
     padding-top: 56px;
     .title-first {
       .case-first {
         width:380px;
         height:29px;
         font-size:28px;
         font-weight:800;
         color:rgba(0,0,0,1);
       }
       .case-second {
         font-size:28px;
         /*font-weight:800;*/
         color: #666666;
       }
     }
     .title-second {
       /*margin-top: 15px;*/
       /*font-size:14px;*/
       /*font-weight:500;*/
       /*color:rgba(0,0,0,1);*/
       /*line-height:21px;*/
     }
   }
   .content {
     /*width: 1500px;*/
     width: 100%;
     margin: 28px auto 0;
     .name-box {
       width: 610px;
       margin: 0 auto;
       .ul-box {
         display: flex;
         justify-content: space-between;
         .name-li {
           width: 87px;
           height: 40px;
           line-height: 40px;
           background: #F7F7F7;
           text-align: center;
           border-radius: 8px;
           .name {
             font-size:16px;
             font-weight:500;
             color:rgba(0,0,0,1);
           }
         }
         .active {
           width:87px;
           height:40px;
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
       width: 100%;
       /*background: yellow;*/
       overflow: hidden;
       margin-top: 28px;
       padding-bottom: 28px;
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
           width: 238px;
           height: 190px;
           border-radius: 14px;
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
         width: 663px;
         margin: 0 auto;
       }
     }
   }
  }
}


</style>
