<template>
    <div class="title">
      <slot name="title">{{this.$t('title.course')}}
        <span></span>
      </slot>
    </div>
</template>

<script>
    export default {
        name: "MoaderTitle"
    }
</script>

<style scoped lang="scss">
  .title{
    p{
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      line-height: 66px;
      position: relative;
      span:nth-of-type(1){
        display: inline-block;
        width: 24px;
        height: 2px;
        background: black;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20px;
      }
    }
  }
</style>
