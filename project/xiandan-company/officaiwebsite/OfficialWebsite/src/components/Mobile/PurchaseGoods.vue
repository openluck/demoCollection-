<template>
    <div class="purchase_goods">
      <div>
        {{this.$t('purchaseGoods.title')}}
      </div>
      <div>
        <img src="../../assets/img/qrcode.png" alt="">
        <img src="../../assets/img/qrcode_url.png" alt="">
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
        width: calc(100% - 32px);
        margin: auto;
        div:nth-of-type(1){
          font-size: 14px;
          text-align: center;
        }
        div:nth-of-type(2){
          margin-top: 20px;
          text-align: center;
          img{
            width: 48%;
            height: 48%;
          }
        }
      }
</style>
