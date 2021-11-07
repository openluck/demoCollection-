<template>
  <div>
    <web-head></web-head>
    <div class="main" :style="{ height: pcHeight }">
      <div class="container">
        <div class="content-title">
          <div class="title-first">
            <span class="case-first">联系我们</span>
          </div>
<!--          <div class="title-second">-->
<!--            <p>联系我们可以进行商业合作</p>-->
<!--          </div>-->
        </div>
        <div class="map" :style="{ paddingTop: paddingHeight, paddingBottom: paddingHeight } ">
<!--        <div class="map">-->
          <div class="left">
            <div class="message">
              <span class="iconfont iconphone"></span>
              <a href="tel://+ (86) 28 67649839" style="margin-top: 27px; display: block">+ (86) 28 67649839 </a>
<!--              <p>+ (86)17311477303</p>-->
            </div>
          </div>
          <div class="center">
            <div class="message">
              <span class="iconfont iconaddress"></span>
<!--              <p style="margin-top: 27px">四川省成都市青白江区天美广场三栋</p>-->
              <a href="https://j.map.baidu.com/49/ras" style="margin-top: 27px; display: block">四川省成都市青白江区天美广场三栋</a>
            </div>
          </div>
          <div class="right">
            <div class="message">
              <span class="iconfont iconemail"></span>
<!--              <p style="margin-top: 27px">official@hopeyoo.com</p>-->
              <a href="mailto://official@hopeyoo.com" style="margin-top: 27px; display: block">official@hopeyoo.com</a>
<!--              <p>mall@kylins.com </p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <web-footer></web-footer>
  </div>
</template>

<script>
  import WebHead from './WebHead'
  import WebFooter from './WebFooter'
    export default {
        name: "Contact",
        components: {
          WebHead,
          WebFooter,
          // Height,
        },
      computed: {
        pcHeight() {
          return (window.innerHeight - 243 ) + 'px';
        },
        paddingHeight() {
          return ((window.innerHeight - 434)/3) + 'px'
          // this.Height = (window.innerHeight - 434);
          // return (this.Height / 2) + 'px';
          // alert(((window.innerHeight - 434)/4) + 'px')
        },
        mapHeight() {
          return (window.innerHeight - 300 ) + 'px';
        },
        paddingTopHeight() {
          return ((window.innerHeight - 434)/3) + 'px'
        }
      }
    }
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  background-color: #ffffff;
  /*margin-bottom: 20px;*/
  .container {
    .content-title {
      text-align: center;
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
    @media screen and (max-width: 1920px){
      .content-title {
        text-align: center;
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
            color: #666666;
          }
        }
        .title-second {
          margin-top: 15px;
          font-size:14px;
          font-weight:500;
          color:rgba(0,0,0,1);
          line-height:21px;
        }
      }
    }
    .map {
       width:1008px;
      /*width: calc(100% - 500px);*/
      /*height: 100%;*/
      background-image: url("../../assets/img/map.png");
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      margin: 16px auto 0;
      display: flex;
      justify-content: space-around;
      box-sizing: border-box;

      .left {
        p {
          width:123px;
          font-size:14px;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height: 20px;
        }
        .center {
          .iconaddress {
            margin-left: 52px;
          }
          p {
            width:226px;
            height:15px;
            font-size:14px;
            font-weight:400;
            color:rgba(51,51,51,1);
          }
        }
        .right {
          p {
            width:176px;
            height:40px;
            font-size:14px;
            font-weight:400;
            color:rgba(51,51,51,1);
          }
        }
      }
      .message {
        margin-top: 20px;
        text-align: center;
        .iconfont {
          font-size: 47px;
        }
      }
    }
  }
}

</style>
