<template>
  <div class="main-content">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>
<script>
export default {
}
</script>
<style scoped lang='less'>
  .main-content {
    width: 100%;
    // margin-left: 200px;
    height: 100%;
    // flex-grow: 1;
  }
</style>
