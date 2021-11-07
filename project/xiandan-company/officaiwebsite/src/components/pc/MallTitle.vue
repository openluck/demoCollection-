<template>
  <div class="mallTitle">
    <div class="fadeInLeft animated mallTitleLeft">
      <p class="fadeIn animated">跨境电商</p>
      <p class="fadeIn animated">C r o s s - b o r d e r e l e c t r i c i t y</p>
    </div>
    <div class=" bounceInRight animated mallTitleRight">
      <div>
        <p>{{this.$t('mallTitle.title')}}<span></span></p>
        <p>MALL</p>
      </div>
      <div>
        {{this.$t('mallTitle.words')}}
      </div>
      <div @click="goContact(5)">
        {{this.$t('mallTitle.contact')}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MallTitle",
    methods: {
      goContact(index) {
        this.$emit('contact', index)
      }
    }
  }
</script>

<style scoped lang="scss">
  .mallTitle {
    width: 100%;
    height: 560px;
    margin-top: 60px;
    position: relative;
    margin-bottom: 120px;

    .mallTitleLeft {
      width: 50%;
      height: 100%;
      background: url("../../assets/img/center.png") no-repeat center center;
      background-size: cover;

      p:nth-of-type(1) {
        font-size: 80px;
        color: white;
        width: 80px;
        margin-top: 15px;
        margin-left: 49%;
        line-height: 110px;
        display: inline-block;
        font-family: Alibaba PuHuiTi;
        font-weight: 700;
      }

      p:nth-of-type(2) {
        font-size: 16px;
        color: white;
        width: 10px;
        display: inline-block;
        margin-left: 17px;
        position: relative;
        top: 64px;
        font-weight: bold;
      }
    }

    .mallTitleRight {
      width: 700px;
      background: white;
      position: absolute;
      top: 50%;
      left: 38%;
      transform: translateY(-50%);
      padding: 30px;
      box-sizing: border-box;

      div:nth-of-type(1) {
        display: flex;

        p:nth-of-type(1) {
          font-size: 28px;
          font-weight: bold;
          position: relative;
          margin: 0px;

          span {
            display: inline-block;
            width: 20px;
            height: 6px;
            background: black;
            position: absolute;
            bottom: 25px;
            left: 1px;
          }
        }

        p:nth-of-type(2) {
          font-size: 69px;
          font-weight: bold;
          margin: 0px;
          opacity: 0.15;
          margin-left: 15px;
          margin-top: -6px;
        }
      }

      div:nth-of-type(2) {
        font-size: 14px;
        color: #666666;
        line-height: 28px;
      }

      div:nth-of-type(3) {
        border: 1px solid #707070;
        width: 140px;
        height: 40px;
        font-size: 14px;
        font-weight: bold;
        line-height: 40px;
        text-align: center;
        margin-top: 30px;
      }
    }
  }
</style>
