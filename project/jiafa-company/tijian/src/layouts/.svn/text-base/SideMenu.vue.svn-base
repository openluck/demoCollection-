<template>
  <div class="side-menu" style="width: 200px">
    <a-menu
      :selected-keys="selectedKeys"
      :open-keys.sync="openKeys"
      mode="inline"
      @openChange="onOpenChange"
      :theme="theme"
    >
      <template v-for="item in menuData">
        <a-menu-item
          v-if="!item.children"
          :key="item.path"
          @click="()=>$router.push({path:item.path})"
        >
          <!-- <svg-icon :icon-class="item.meta.icon" :scale="1.2" style="margin-right:10px"></svg-icon> -->
          <span>{{ item.name }}</span>
        </a-menu-item>
        <sub-menu v-else :key="item.path" :menu-info="item" />
      </template>
    </a-menu>
  </div>
</template>

<script>
import SubMenu from "./SubMenu.vue";

export default {
  components: {
    "sub-menu": SubMenu
  },
  props: {
    theme: {
      type: String,
      default: "dark"
    }
  },
  data() {
    this.selectedKeysMap = JSON.parse(sessionStorage.getItem("selectedKeysMap")) || {}; //路由和选中菜单key的映射表
    this.openKeysMap = JSON.parse(sessionStorage.getItem("openKeysMap")) || {}; //路由和展开菜单key的映射表
    return {
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.openKeysMap[this.$route.path]
    };
  },

  watch: {
    //点击父级菜单时没有触发 “$route.path” 数据变化
    "$route.path": function(val) {
      this.selectedKeys = this.selectedKeysMap[val];
      this.openKeys = this.openKeysMap[val];
      // console.log(666, this.selectedKeys, this.openKeys);
    }
  },

  computed: {
    menuData() {
      return this.getMenuData(this.$store.state.addRoutes.rootRoute);
    },
    rootSubmenuKeys() {
      const rootSubmenuKeys = [];
      this.menuData.forEach(item => {
        rootSubmenuKeys.push(item.path);
      });
      return rootSubmenuKeys;
    }
  },
  created() {
    this.$store.commit("gettedInfo", false);
  },
  mounted() {
    this.bus.$on("changeSelectedKey", (data) => {
      this.selectedKeys = this.selectedKeysMap[data];
      this.openKeys = this.openKeysMap[data];
      // console.log(777, this.selectedKeys, this.openKeys);
    })
  },
  methods: {
    onOpenChange(openKeys) {
      // console.log(openKeys)
      const latestOpenKey = openKeys.find(
        key => this.menuData[0].path.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
    getMenuData(routes = [], parentKeys = [], selectedKeys) {
      const menuData = [];
      for (const item of routes) {
        if (item) {
          this.openKeysMap[item.path] = parentKeys;
          this.selectedKeysMap[item.path] = [selectedKeys || item.path];
          const newItem = { ...item };
          delete newItem.children;
          if (item.children && !item.hideChildrenInMenu) {
            newItem.children = this.getMenuData(item.children, [
              ...parentKeys,
              item.path
            ]);
          } else {
            this.getMenuData(
              item.children,
              selectedKeys ? parentKeys : [...parentKeys, item.path],
              selectedKeys || item.path
            );
          }
          menuData.push(newItem);
        } else if (item.children) {
          menuData.push(
            ...this.getMenuData(item.children, [...parentKeys, item.path])
          );
        }
      }
      sessionStorage.setItem("openKeysMap", JSON.stringify(this.openKeysMap));
      sessionStorage.setItem("selectedKeysMap", JSON.stringify(this.selectedKeysMap));
      return menuData;
    }
  }
};
</script>

<style lang = "less">
 /* .side-menu{

 } */
</style>