<template>
    <div class="title">
      <slot name="title">{{this.$t('title.course')}}</slot>
    </div>
</template>

<script>
    export default {
        name: "HeaderName"
    }
</script>

<style scoped lang="scss">
  .title{
    p{
      font-weight: bold;
      font-size: 28px;
      text-align: center;
      line-height: 137px;
    }
  }
</style>
