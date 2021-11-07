<template>
  <div>
    <a-menu
      :selected-keys="selectedKeys"
      :open-keys.sync="openKeys"
      mode="inline"
      @openChange="onOpenChange"
      :theme="theme"
    >
      <template v-for="item in menuData">
        <sub-menu
          v-if="item.children && item.children.length > 0"
          :key="item.path"
          :menu-info="item"
          :collapse="collapse"
        />
        <a-menu-item
          v-else-if="!item.meta.hasChildMenu && !item.meta.isHideMenu"
          :key="item.path"
          @click="() => $router.push({ name: item.name })"
        >
          <div>
            <svg-icon
              :class="{ 'svg-class': collapse }"
              :icon-class="item.meta.icon"
              :scale="1.2"
              style="margin-right:10px;"
            ></svg-icon>
            <span
              class="menu-class"
              :class="{ 'menu-name-class': collapse }"
            >
              {{
              item.name
              }}
            </span>
          </div>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
    this.selectedKeysMap =
      JSON.parse(sessionStorage.getItem("selectedKeysMap")) || {}; //路由和选中菜单key的映射表
    this.openKeysMap = JSON.parse(sessionStorage.getItem("openKeysMap")) || {}; //陆毅和展开菜单key的映射表
    let str = this.$route.path
    str = str.split("/")[1]
    return {
      // selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.openKeysMap[this.$route.path] ? this.openKeysMap[this.$route.path] : [str]
    };
  },

  watch: {
    //点击父级菜单时没有触发 “$route.path” 数据变化
    "$route.path": function (val) {
      // this.selectedKeys = this.selectedKeysMap[val];
      this.openKeys = this.openKeysMap[val];
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
    },
    selectedKeys() {
      //点击、刷新、初始化都走这套流程
      if (!this.selectedKeysMap[this.$route.path]) {
        return [this.$route.path];
      }
      let arr = [];
      if (
        //处理进入子页面的菜单选中效果
        this.selectedKeysMap[this.$route.path][0] ===
        "/TimetableManage/ImportCheck" ||
        this.selectedKeysMap[this.$route.path][0] ===
        "/TimetableManage/ImportManually" ||
        this.selectedKeysMap[this.$route.path][0] ===
        "/TimetableManage/ImportVerify" ||
        this.selectedKeysMap[this.$route.path][0] ===
        "/TimetableManage/ImportSuccess"
      ) {
        arr = ["/TimetableManage/timetableManage"];
      } else {
        arr = this.selectedKeysMap[this.$route.path]
      }
      return arr;
    },
    ...mapState("app", ["collapse"])
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
      // debugger
      sessionStorage.setItem(
        "selectedKeysMap",
        JSON.stringify(this.selectedKeysMap)
      );

      return menuData;
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.ant-menu {
  .ant-menu-item,
  .ant-menu-submenu-title {
    font-size: 14px;
    color: @font-color-title;
    margin: 0 12px 0 10px;
    padding-right: 20px;
    width: 90%;
    height: 48px;
    line-height: 48px;
    list-style-position: inside;
    list-style-type: disc;
  }
  .svg-icon {
    margin-right: 16px;
    color: #a5aeb8;
  }
  .ant-menu-item-selected {
    color: #2abf8e;
    background: #dff6ee;
    padding-right: 20px;
    margin: 0 12px 0 10px;
    border-radius: 8px;
    .svg-icon {
      color: #2abf8e;
    }
    /deep/ .ant-tooltip-inner {
      background: red;
      color: turquoise;
    }
  }
  .ant-menu-submenu-open {
    .svg-icon {
      color: #2abf8e;
    }
    .parent-menu {
      color: #2abf8e;
    }
  }
  .ant-menu-item-active {
    color: #2abf8e;
    .svg-icon {
      color: #2abf8e;
    }
  }
  .ant-menu-submenu-active {
    .svg-icon {
      color: #2abf8e;
    }
    .parent-menu {
      color: #2abf8e;
    }
  }
}
/deep/.ant-menu-sub.ant-menu-inline > .ant-menu-item,
.ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  height: 48px;
  line-height: 48px;
  list-style-position: inside;
  list-style-type: disc;
}
/deep/.ant-menu-inline .ant-menu-selected::after,
.ant-menu-inline .ant-menu-item-selected::after {
  transform: scaleY(1);
  opacity: 0;
  transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
    opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/.ant-menu-inline-collapsed {
  width: 48px;
  .ant-menu-item,
  .ant-menu-submenu-title {
    font-size: 14px;
    color: #494b4d;
    background: transparent;
    margin-left: -18px;
    padding-right: 20px;
    width: 90%;
    height: 48px;
    line-height: 48px;
    list-style-position: inside;
    list-style-type: disc;
    .svg-class:hover {
      color: #1bb280;
    }
    .menu-name-class {
      display: none;
    }
  }
}
</style>
