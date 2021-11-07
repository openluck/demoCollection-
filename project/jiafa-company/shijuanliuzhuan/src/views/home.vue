<template>
  <div class="container">
    <!-- 头部区域 -->
    <!-- <template v-show="isDev"> -->
    <!-- <head-bar v-show="isDev"></head-bar> -->
    <!-- 导航菜单栏 -->
    <div class="containerBody">
      <nav-bar v-show="isDev"></nav-bar>
      <!-- </template> -->
      <!-- 主内容区域 -->
      <main-content></main-content>
    </div>
  </div>
</template>

<script>
import HeadBar from "@/components/content/HeadBar/HeadBar";
import NavBar from "@/components/content/NavBar/NavBar";
import MainContent from "@/components/content/MainContent/MainContent";
export default {
  components: {
    HeadBar,
    NavBar,
    MainContent
  },
  data() {
    return {
      isDev: true
    };
  },
  mounted() {
    if (process.env.NODE_ENV == "development") {
      this.isDev = true;
    } else if (process.env.NODE_ENV == "production") {
      this.isDev = false;
    }
  }
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  display: flex;
  flex-direction:column;
  .containerBody{
    width: 100%;
    flex-grow: 1;
    display: flex;
  }
}
</style>  