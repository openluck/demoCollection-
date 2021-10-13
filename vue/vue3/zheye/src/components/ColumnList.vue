<template>
  <ul>
    <li v-for="column in list" :key="column.id">
      {{ column.description }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
export interface ColumnProps {
  id: number; // id
  title: string; // 标题
  avatar: string; // 头像 img
  description: string; // 描述
}
export default defineComponent({
  name: "ColumnList",
  // 父组件传过来的值
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      require: true,
    },
  },
});
</script>
<style scoped >
</style>
