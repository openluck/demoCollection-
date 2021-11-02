<template functional>
  <a-sub-menu :key="props.menuInfo.path">
    <span slot="title">
      <svg-icon
        :icon-class="props.menuInfo.meta.icon"
        :scale="1.2"
        style="margin-right:10px"
      ></svg-icon
      >&nbsp;&nbsp;
      <span>{{ props.menuInfo.name }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="!item.children || !item.isShow"
        :key="item.path"
        v-show="!item.meta.isShow"
        @click="() => parent.$router.push({ path: item.path })"
      >
        <span>{{ item.name }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.path" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ['menuInfo'],
}
</script>
<style lang="less" scoped>
/deep/.ant-menu.ant-menu-dark .ant-menu-item-selected,
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
  background-color: #fff !important;
}
</style>
