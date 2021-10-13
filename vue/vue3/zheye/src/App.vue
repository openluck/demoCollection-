<template>
  <div class="container">
    <column-list :list="testData"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap 压缩样式
import ColumnList, { ColumnProps } from "./components/ColumnList.vue"; // 把interface也拿过来
let testData: ColumnProps[] = [
  {
    id: 1,
    title: "标题1",
    description: "描述",
    avatar: "头像",
  },
  {
    id: 2,
    title: "标题1",
    description: "描述",
    avatar: "头像",
  },
]; // 写完之后在setuo中返回
export default defineComponent({
  name: "App",
  components: { ColumnList },
  setup() {
    return {
      testData,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
