<template>
  <div class="footer-container">
    <p>Copyright © 2020 厚普创优(成都)网络科技有限公司</p>
    <a href="http://www.beian.miit.gov.cn/" class="company-name">蜀ICP备18037207号-1</a>
    <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51011502000300" style="display: block">川公网安备 51011502000300号</a>
  </div>
</template>

<script>
export default {
  name: "WebFooter.vue"
}
</script>

<style scoped lang="scss">
  .footer-container{
    background:rgba(247,247,247,1);
    font-size:13px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:18px;
    text-align: center;
    padding: 18.5px 0;
    .company-name{
      margin: 15px 0 3px 0;
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
</style>
