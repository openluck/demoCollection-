<template>
  <div>
    <web-head></web-head>
    <div class="main" :style="{ minHeight: pcHeight }">
      <div class="container" :style="{ paddingTop: paddingTopHeight }">
        <div class="left-img">
          <img src="../../assets/img/mainbusiness.png">
        </div>
        <div class="right-content">
          <div class="content-title">
            <span class="title1">公司主营业务</span>
          </div>
          <div class="products-bar">
            <div class="product-list">
              <div class="product-card" v-for="product in productList">
                <div class="product-img">
                  <img :src="product.img"/>
                </div>
                <div class="product-name">{{product.name}}</div>
                <div class="product-info">{{product.desc}}</div>
              </div>
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
  import smallprogram from '@/assets/img/smallprogram.png';
  import wechat from '@/assets/img/wechat.png';
  import web from '@/assets/img/web.png';
  import app from '@/assets/img/app.png';
  import ui from '@/assets/img/ui.png';
    export default {
        name: "MainBusiness",
      data() {
          return {
            productList: [
              {
                name:'微信小程序定制',
                desc:'助力小程序流量红利期，提高用户体验度',
                img: smallprogram
              },
              {
                name:'微信公众号开发',
                desc:'结合微信营销,实现个性化应用开发',
                img: wechat
              },
              {
                name:'网页开发',
                desc:'网站策划、自主研发、原创设计方案',
                img: web
              },
              {
                name:'APP开发',
                desc:'互动体验创意设计，注重用户体验建设',
                img: app
              },
              {
                name:'平面设计',
                desc:'UI、平面、包装设计',
                img: ui
              }
            ],
          }
      },
      components: {
          WebHead,
          WebFooter
      },
      computed: {
          pcHeight() {
            return (window.innerHeight - 243 ) + 'px';
          },
          paddingTopHeight() {
            return ((window.innerHeight - 434)/3) + 'px'
          },
        paddingHeight() {
          return ((window.innerHeight - 434)/3) + 'px'
          // this.Height = (window.innerHeight - 434);
          // return (this.Height / 2) + 'px';
          // alert(((window.innerHeight - 434)/4) + 'px')
        },
      }
    }
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .container {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 140px;
    .left-img {

    }
    .right-content {
      margin-left: 32px;
      .content-title {
        .title1 {
          font-size: 28px;
          font-weight: 800;
          color: #000000;
        }
        .title2 {
          font-size:28px;
          color: #666666;
        }
      }
      .products-bar{
        /*padding-bottom: 112px;*/
        margin-top: 25px;
        .product-list{
          display: flex;
          width: 100%;
          .product-card{
            width:calc(20% - 15px);
            background:rgba(247,247,247,1);
            border-radius:14px;
            padding: 16px 28px;
            text-align: center;
            .product-img{
              width: 100%;
              margin-bottom: 16px;
              img{
                width: 40%;
              }
            }
            .product-name{
              font-size:10px;
              font-family:PingFang SC;
              font-weight:500;
              color:rgba(51,51,51,1);
              line-height:12px;
              margin-bottom: 7px;
            }
            .product-info{
              font-size:8px;
              font-family:PingFang SC;
              font-weight:500;
              color:rgba(51,51,51,1);
              line-height:16px;
            }
          }
          .product-card+.product-card{
            margin-left: 8px;
          }
        }
      }
    }
  }
}

</style>
