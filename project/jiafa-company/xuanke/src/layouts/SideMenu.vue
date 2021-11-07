<template>
  <div style="width: 256px；">
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
          v-show="!item.meta.isShow"
          @click="()=>$router.push({path:item.path})"
        >
          <svg-icon  :icon-class="item.meta.icon" :scale="1.2" style="margin-right:10px"></svg-icon>&nbsp;&nbsp;
          <span>{{ item.name }}</span> 
          
        </a-menu-item>
        <sub-menu v-else  :key="item.path+collapsed" :menu-info="item" :subCollapsed="subCollapsed"/>
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
    },
    collapsed: {
      type: Boolean
    }
  },
  data() {
    this.selectedKeysMap =
      JSON.parse(sessionStorage.getItem("selectedKeysMap")) || {}; //路由和选中菜单key的映射表
    this.openKeysMap = JSON.parse(sessionStorage.getItem("openKeysMap")) || {}; //陆毅和展开菜单key的映射表
    // console.log(this.selectedKeysMap[this.$route.path], '第一次');
    // console.log(this.openKeysMap[this.$route.path]);

    return {
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.openKeysMap[this.$route.path],
      subCollapsed: false
    };
  },
  mounted() {
  },
  watch: {
    collapsed(val) {
      this.subCollapsed = val
    },
    //点击父级菜单时没有触发 “$route.path” 数据变化
    "$route.path": {
      handler: function(val) {
        this.$emit("getMetaInfo", this.$route.meta);
        this.selectedKeys = this.selectedKeysMap[val];
        this.openKeys = this.openKeysMap[val];
      },
      immediate: true,
    }
  },
  computed: {
    // subCollapsed() {
    //   console.log('this.collapsed', this.collapsed);
    //   return this.collapsed
    // },
    menuData() {
      // console.log(this.$store.state.addRoutes.rootRoute);
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
  methods: {
    onOpenChange(openKeys) {
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
      this.$emit("getMetaInfo", this.$route.meta);
      const menuData = [];
      for (const item of routes) {
        if (item) {
          this.openKeysMap[item.path] = parentKeys;
          // debugger
          // console.log(this.selectedKeysMap, 'map')
          this.selectedKeysMap[item.path] = [selectedKeys || item.path];
          // debugger
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
      // console.log(this.selectedKeysMap);
      sessionStorage.setItem("openKeysMap", JSON.stringify(this.openKeysMap));
      sessionStorage.setItem(
        "selectedKeysMap",
        JSON.stringify(this.selectedKeysMap)
      );
      this.selectedKeys = JSON.parse(sessionStorage.getItem("selectedKeysMap"))[this.$route.path]
      this.openKeys = JSON.parse(sessionStorage.getItem("openKeysMap"))[this.$route.path]
      return menuData;
    }
  }
};
</script>


