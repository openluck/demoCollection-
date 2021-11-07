
<template functional>
  <a-sub-menu :key="props.menuInfo.path">
    <span slot="title">
      <!-- <svg-icon :icon-class="props.menuInfo.meta.icon" :scale="1.2" style="margin-right:10px"></svg-icon>&nbsp;&nbsp; -->
      <span>{{ props.menuInfo.meta.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <template v-if="!item.children">
        <a-menu-item
          v-if="!item.meta.hidden"
          :key="item.path"
          @click="()=>parent.$router.push({path:item.path})"
        >
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
      </template>
      <sub-menu v-else :key="item.path" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ["menuInfo"]
};
</script>
