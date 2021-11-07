<template>
    <div class="M_Mall_title">
      <div :style="{height: width*0.65*0.76 + 'px'}">
        <p>跨境电商</p>
        <p>Cross-border E-commerce</p>
      </div>
      <div class="M_Mall_title_title">
        <div class="top">
          <p>{{this.$t('mallTitle.title')}}</p>
          <p>MALL</p>
          <p></p>
        </div>
        <div>
          {{this.$t('mallTitle.words')}}
        </div>
        <div @click="goContact(5)"> {{this.$t('mallTitle.contact')}}</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "MallTitle",
      data() {
        return {
          width:window.innerWidth
        }
      },
      methods: {
        goContact(index) {
          this.$emit('contact', index)
        }
      }
    }
</script>

<style scoped lang="scss">
  .M_Mall_title{
    margin-top: 20px;
    &>div:nth-of-type(1){
      width: 65%;
      background: url("../../assets/img/center.png") no-repeat center center;
      background-size: cover;
      padding: 10px 16px;
      box-sizing: border-box;
      p{
        font-weight: bold;
        color: white;
      }
      p:nth-of-type(1){
        font-size: 28px;
      }
      p:nth-of-type(2){
        color: white;
        margin-top: 4px;
        font-size: 12px;
      }
    }
    .M_Mall_title_title{
      width: 80%;
      margin-top: -30%;
      box-shadow:0px 2px 20px rgba(0,0,0,0.16);
      background: white;
      margin-left: 20%;
      padding: 16px;
      box-sizing: border-box;
      .top{
        position: relative;
        &>p{
          color: #333333;
          display: inline-block;
        }
        p:nth-of-type(1){
          font-size: 18px;
          font-weight: bold;
        }
        p:nth-of-type(2){
          font-size: 23px;
          font-weight: bold;
          opacity: 0.15;
        }
        p:nth-of-type(3){
          width: 12px;
          height: 2px;
          background: black;
          position: absolute;
          left: 0px;
          bottom: -5px;
        }
      }
      div:nth-of-type(2){
        font-size: 12px;
        color: #666666;
        margin-top: 14px;
      }
      div:nth-of-type(3){
        font-size: 14px;
        width: 100%;
        height: 32px;
        line-height: 32px;
        border: 1px solid #707070;
        text-align: center;
        font-weight: bold;
        margin: auto;
        margin-top: 20px;
      }

    }
  }
</style>
