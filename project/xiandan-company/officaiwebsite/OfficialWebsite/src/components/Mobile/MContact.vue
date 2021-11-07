<template>
  <div>
    <WebHead></WebHead>
<!--    :style="{ height: pcHeight }"-->
    <div class="main"  :style="{ height: pcHeight }">
      <div class="container">
        <div class="content-title">
          <div class="title-first">
            <span class="case-first">联系我们</span>
          </div>
<!--          <div class="title-second">-->
<!--            <p>联系我们可以进行商业合作</p>-->
<!--          </div>-->
        </div>
        <div class="map">
          <div class="left">
            <div class="message">
              <span class="iconfont iconphone"></span>
              <p style="margin-top: 12px"><a href="tel://+ (86) 28 67649839" >+ (86) 28 67649839 </a></p>
            </div>
          </div>
          <div class="right">
            <div class="message">
                <span class="iconfont iconemail"></span>
              <p style="margin-top: 12px">  <a href="mailto://official@hopeyoo.com">official@hopeyoo.com</a></p>
            </div>
          </div>
          <div class="center">
            <div class="message">
              <span class="iconfont iconaddress"></span>
              <p style="margin-top: 12px"> <a href="https://j.map.baidu.com/49/ras">四川省成都市青白江区天美广场三栋</a></p>
            </div>
          </div>
        </div>
        <div class="map-image">
          <img src="../../assets/img/map.png" alt="">
        </div>
      </div>
    </div>
    <WebFooter></WebFooter>
  </div>
</template>

<script>
  import WebHead from "./WebHead";
  import WebFooter from "./WebFooter";
    export default {
        name: "MContact",
      components: {WebFooter, WebHead},
      computed: {
        pcHeight() {
          return (document.documentElement.clientHeight - 167) + 'px'
        }
      },
    }
</script>

<style scoped lang="scss">
.main {
  /*padding-bottom: 50px;*/
  /*margin-bottom: 6px;*/
  background-color: #ffffff;
  min-height: 450px;
  .container {
    .content-title {
      text-align: center;
      /*margin-top: 112px;*/
      padding-top: 24px;
      .title-first {
        .case-first {
          width:190px;
          height:15px;
          font-size:14px;
          font-family:PingFang SC;
          font-weight:800;
          color:rgba(0,0,0,1);
        }
        .case-second {
          font-size:14px;
          /*font-weight:800;*/
          color: #666666;
        }
      }
      .title-second {
        /* width:638px;
         height:20px;*/
        width: 319px;
        font-size:12px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
        line-height:17px;
        margin: 0 auto;
        padding-top: 11px;
      }
    }
    .map {
      width: calc(100% - 60px );
      margin: 32px auto 0;
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      .left {
        .message {
          p {
            font-size:11px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(51,51,51,1);
            line-height:17px;
            a {
              text-decoration: none;
            }
            a:link{		/*默认状态*/
              color: black;
            }
            a:visited{	/*浏览过的*/
              color:black;
            }
            a:hover{	/*悬浮状态*/
              color:black;
            }
            a:active{	/*激活过的*/
              color: black;
            }
          }
        }
      }
      .center {
        margin-top: 24px;
        .message {
          p {
            font-size:10px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(51,51,51,1);
            margin-top: 6px;
            a {
              text-decoration: none;
            }
            a:link{		/*默认状态*/
              color: black;
            }
            a:visited{	/*浏览过的*/
              color:black;
            }
            a:hover{	/*悬浮状态*/
              color:black;
            }
            a:active{	/*激活过的*/
              color: black;
            }
          }
        }
      }
      .right {
        margin-left: 36px;
        .message {
          p {
            font-size:10px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(51,51,51,1);
            line-height:15px;
            a {
              text-decoration: none;
            }
            a:link{		/*默认状态*/
              color: black;
            }
            a:visited{	/*浏览过的*/
              color:black;
            }
            a:hover{	/*悬浮状态*/
              color:black;
            }
            a:active{	/*激活过的*/
              color: black;
            }
          }
        }
      }
      .iconphone {
        font-size: 26px;
        color: #333333;
      }
      .iconaddress {
        font-size: 26px;
        color: #333333;
      }
      .iconemail {
        font-size: 26px;
        color: #333333;
      }
    }
    .map-image {
      margin-top: 32px;
      text-align: center;
      img {
        width: calc(100% - 24px);

      }
    }
  }
  @media screen and (max-height: 640px) {
    .map {
      width: calc(100% - 30px ) !important;
      margin: 32px auto 0;
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      .left {
        .message {
          p {
            font-size:11px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(51,51,51,1);
            line-height:17px;
          }
        }
      }
      .center {
        margin-top: 24px;
        .message {
          p {
            font-size:10px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(51,51,51,1);
            margin-top: 6px;
          }
        }
      }
      .right {
        margin-left: 36px;
        .message {
          p {
            font-size:10px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(51,51,51,1);
            line-height:15px;
          }
        }
      }
      .iconphone {
        font-size: 23px;
        color: #333333;
      }
      .iconaddress {
        font-size: 21px;
        color: #333333;
      }
      .iconemail {
        font-size: 25px;
        color: #333333;
      }
    }
  }

}

</style>
