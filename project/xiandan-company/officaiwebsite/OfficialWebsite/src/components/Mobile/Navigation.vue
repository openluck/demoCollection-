<template>
    <div class="M_navigation" :style="{height: width*0.56 + 'px'}">
        <p>{{this.$t('navigation.company')}}</p>
        <p>{{this.$t('navigation.shopping')}}<span></span></p>
        <p>{{this.$t('navigation.platform')}}</p>
        <p @click="toBuy(4)">{{this.$t('navigation.go')}}</p>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          width:window.innerWidth
        }
      },
      methods: {
        toBuy(index) {
          this.$emit('buy',index)
        }
      }
    }
</script>

<style scoped lang="scss">
  .M_navigation{
    background: url("../../assets/img/navigation.png") no-repeat center center;
    background-size: cover;
    width: 100%;
    height:211px;
    P{
      color: white;
      text-align: center;
    }
    P:nth-of-type(1){
      font-size: 16px;
      padding-top: 10%;
    }
    p:nth-of-type(2){
      font-size: 28px;
      margin-top: 2%;
    }
    p:nth-of-type(3){
      font-size: 12px;
      margin-top: 3%;
    }
    p:nth-of-type(4){
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #1CA0E6;
      font-size: 14px;
      margin: auto;
      margin-top: 3%;
    }
  }
</style>
