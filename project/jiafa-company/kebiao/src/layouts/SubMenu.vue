<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:28:59
 * @LastEditors: went
 * @LastEditTime: 2021-09-24 15:33:01
-->
<template functional>
  <a-sub-menu :key="props.menuInfo.path">
    <template #title>
      <svg-icon
        :icon-class="props.menuInfo.meta.icon"
        :scale="1.2"
        style="margin-right:14px"
      ></svg-icon>
      <span
        v-if="!props.collapse"
        class="parent-menu"
      >{{ props.menuInfo.name }}</span>
    </template>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="!item.children&&!item.meta.isHideMenu"
        :key="item.path"
        @click="() => parent.$router.push({ name: item.name })"
      >
        <!-- <a-icon  v-if="item.meta.icon" type="pie-chart" /> -->
        <span style="margin-left:4px">{{ item.name }}</span>
      </a-menu-item>
      <!-- <sub-menu v-else :key="item.path" :menu-info="item" /> -->
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ["menuInfo", "collapse"],
  computed: {},
  watch: {},
  mounted() {
  }
};
</script>

