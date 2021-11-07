<template>
  <div>
    <web-head></web-head>
    <div class="main" :style="{minHeight: pcHeight}">
      <div class="container">
        <div class="content-title">
          <div class="title-first">
            <span class="solve-first"> 解决流程</span>
          </div>
        </div>
        <div class="content" :style="{ paddingTop: paddingHeight, paddingBottom: paddingHeight } ">
          <div class="process">
            <img src="../../assets/img/process.png">
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
        name: "Solve",
        components: {
        WebHead,
        WebFooter
        },
        computed: {
          pcHeight() {
            return (window.innerHeight - 243 ) + 'px';
          },
          paddingHeight() {
            return (window.innerHeight/9) + 'px';
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
   background-color: #ffffff;
   .container {
     /*background: blue;*/
     .content-title {
       text-align: center;
       /*margin-top: 112px;*/
       /*margin-bottom: 56px;*/
       padding-top: 56px;
       /*padding-bottom: 56px;*/
       .title-first {
         font-family:PingFang SC;
         .solve-first {
           width:380px;
           height:29px;
           font-size:28px;
           font-weight:800;
           color:rgba(0,0,0,1);
         }
         .solve-second {
           font-size:28px;
           /*font-weight:800;*/
           color: #666666;
         }
       }
       .title-second {
         /*font-size:14px;*/
         /*font-weight:500;*/
         /*color:rgba(0,0,0,1);*/
         /*line-height:21px;*/
         /*margin-top: 15px;*/
       }
     }
     .content {
       margin: 0 12.5%;
      .process {
        width: 100%;
        margin: 27px auto 0;
        img{
          width: 100%;
          display: block;
        }
      }
       .team-title {
         text-align: center;
         margin-top: 74px;
         margin-bottom: 27px;
         .title-first {
           .team-first {
             width:380px;
             height:29px;
             font-size:28px;
             font-weight:800;
             color:rgba(0,0,0,1);
           }
           .team-second {
             font-size:28px;
             /*font-weight:800;*/
             color: #666666;
           }
         }
         .title-second {
           font-size:14px;
           font-weight:500;
           color:rgba(0,0,0,1);
           line-height:21px;
           margin-top: 26px;
         }
       }
       .rotation-chart{
         width: calc(100% - 300px);
         /*background-color: red;*/
         margin: auto;
         background-image: url("../../assets/img/bgline.png");
         .el-carousel {
           .el-carousel__item{
             .item-content {
               margin: 0 auto;
               width:319px;
               height: 354px;
               background: #F4F5F5;
               /*background-color: blue;*/
               text-align: center;
               .car-img {
                 width: 190px;
                 height: 190px;
                 border-radius: 50%;
                 margin-top: 48px;
               }
               .item_div{
                 box-sizing: border-box;
                 margin-top: 40px;
                 .jobs {
                   width:79px;
                   height:20px;
                   font-size:20px;
                   font-weight:bold;
                   color:rgba(51,51,51,1);
                   line-height:21px;
                   margin-right: 86px;
                 }
                 .name {
                   width:59px;
                   height:19px;
                   font-size:20px;
                   font-weight:500;
                   color:rgba(51,51,51,1);
                   line-height:21px;
                 }
               }
             }
           }

         }
       }

     }

   }
 }
</style>
