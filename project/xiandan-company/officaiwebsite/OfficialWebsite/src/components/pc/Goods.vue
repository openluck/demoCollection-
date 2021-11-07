<template>
    <div class="goods">
      <div>
        <div class="center">
            <icon name="huazhuangpin"></icon>
          <span>{{this.$t('goods.columns[0]')}}</span>
        </div>
      </div>
      <div>
        <div class="center">
            <icon name="riyongpin"></icon>
          <span>{{this.$t('goods.columns[1]')}}</span>
        </div>
      </div>
      <div>
        <div class="center">
            <icon name="muying2"></icon>
          <span>{{this.$t('goods.columns[2]')}}</span>
        </div>
      </div>
      <div>
        <div class="center">
            <icon name="unie61a"></icon>
          <span>{{this.$t('goods.columns[3]')}}</span>
        </div>
      </div>
    </div>
</template>

<script>
  import Icon from '@/components/public/Icon'
    export default {
        name: "Goods",
      components: {
        Icon
      }
    }
</script>

<style scoped lang="scss">
  .goods{
    display: flex;
    justify-content: center;
    &>div{
      width: 285px;
      height: 285px;
      border: 1px solid #D1CDCD;
      margin-right: 20px;
      border-radius: 50%;
      text-align: center;
      position: relative;
      .center{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
          .icon{
            font-size: 60px;
          }
        span{
          font-size: 24px;
          display: block;
          margin-top: 20px;
        }
        &>div:last-of-type{
          margin-right: 0px;
        }
      }
    }
    &>div:nth-of-type(1),&>div:nth-of-type(2){
      margin-bottom: 10px;
    }
  }
</style>
