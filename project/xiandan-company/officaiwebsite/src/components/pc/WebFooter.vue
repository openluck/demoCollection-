<template>
    <div class="footer">
      <p class="company-name">Copyright © 2020 厚普创优(成都)网络科技有限公司</p>
      <a href="http://www.beian.miit.gov.cn/"  class="a-style">蜀ICP备18037207号-1</a>
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51011502000300" class="a-style" style="display: block">川公网安备 51011502000300号</a>
    </div>
</template>

<script>
    import Icon from '@/components/public/Icon'
    export default {
        data () {
            return {
                hostname: location.hostname
            }
        },
        name: 'Footer',
        components: {
            Icon
        },
        filters: {
            'copyright': company => {
                return `Copyright © ${new Date().getFullYear()} ${company}`
            }
        }
    }
</script>

<style scoped lang="scss">
    .footer {
        width: 100%;
        height: 183px;
        /*margin-top: 70px;*/
        background: #f7f7f7;
        text-align: center;
        box-sizing: border-box;
        padding: 54px 0 53px 0;
        font-size: 14px;
        min-width: 1260px;
        .company-name{
          margin-bottom: 16px;
        }
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
  @media screen  and (min-width: 1920px){
    .footer {
      width: 100%;
      height: 183px;
      /*margin-top: 70px;*/
      background: #f7f7f7;
      text-align: center;
      box-sizing: border-box;
      padding: 54px 0 53px 0;
      /*padding: 20px 0 20px 0;*/
      font-size: 14px;
      .company-name{
        margin-bottom: 16px;
      }
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
</style>
