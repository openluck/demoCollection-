<template>
    <div class="purchase_goods">
      <div class="code_Img">
        <img src="../../assets/img/qrcode.png" alt="">
        <img src="../../assets/img/qrcode_url.png" alt="">
      </div>
      <div class="purchase_title">
        <p>{{this.$t('purchaseGoods.public')}}</p>
        <p>{{this.$t('purchaseGoods.title')}}</p>
      </div>
    </div>
</template>

<script>
    export default {
        name: "PurchaseGoods"
    }
</script>

<style scoped lang="scss">
  .purchase_goods{
    width: calc(100% - 440px);
    margin: auto;
    position: relative;
    .code_Img{
      box-sizing: border-box;
      img{
        width: 265px;
        height: 265px;
      }
      img:nth-of-type(2){
        margin-left: 20px;
      }
    }
    .purchase_title{
      width: calc(100% - 590px);
      margin-left: 20px;
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0px;
      p:nth-of-type(1){
        font-size: 26px;
        color: #333333;
        font-weight: bold;
      }
      p:nth-of-type(2){
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }
</style>
