
<template functional>
  <a-sub-menu :key="props.menuInfo.path">
    <span slot="title">
      <svg-icon :icon-class="props.menuInfo.meta.icon" style="margin-right:5px"></svg-icon>
      <!-- <a-icon v-if="props.menuInfo.meta.icon" type="props.menuInfo.meta.icon" /> -->
      <span>{{ props.menuInfo.name }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="!item.children "
        v-show="item.name"
        :key="item.path"
        @click="()=>parent.$router.push({path:item.path})"
        style="margin-left:10px"
      >
        <!-- <a-icon  v-if="item.meta.icon" type="pie-chart" /> -->
        <span >{{ item.name }}</span>
      </a-menu-item>
      <!-- <sub-menu v-else :key="item.path" :menu-info="item" /> -->
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ["menuInfo"]
};
</script>
