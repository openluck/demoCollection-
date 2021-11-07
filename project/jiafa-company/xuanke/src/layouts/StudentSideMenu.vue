<template>
  <div class="stuSide">
    <div class="stuTit">选课走班管理系统</div>
    <div class="stuInfo">
      <div>
        <!-- <img v-if="user.photo" class="pic" :src="user.photo" alt=""> -->
        <img  class="pic" src="../assets/0.png" alt="">
      </div>
      <div class="name">{{user.name?user.name:'--'}}</div>
      <div class="stuClass">
        <div class="class">班级：{{user.className?user.className:'暂无数据'}}</div>
        <div class="class">学校：{{user.organizationName?user.organizationName:'暂无数据'}}</div>
        <div class="class">班主任：{{user.ClassHeaderName?user.ClassHeaderName:'暂无数据'}}</div>
        <!-- <div class="class">副班主任：暂无数据</div> -->
      </div>
    </div>
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
      default: "light"
    }
  },
  data() {
    this.selectedKeysMap =
      JSON.parse(sessionStorage.getItem("selectedKeysMap")) || {}; //路由和选中菜单key的映射表
    this.openKeysMap = JSON.parse(sessionStorage.getItem("openKeysMap")) || {}; //陆毅和展开菜单key的映射表
    return {
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.openKeysMap[this.$route.path],
      user: {}
    };
  },
  mounted() {
  },
  watch: {
    //点击父级菜单时没有触发 “$route.path” 数据变化
    "$route.path": function(val) {
      // console.log(this.$route)
      this.$emit("getMetaInfo", this.$route.meta);
      this.selectedKeys = this.selectedKeysMap[val];
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
    }
  },
  created() {
    this.$store.commit("gettedInfo", false);
    this.getSysStudentsByStudentId();
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
      sessionStorage.setItem(
        "selectedKeysMap",
        JSON.stringify(this.selectedKeysMap)
      );
      this.selectedKeys = JSON.parse(sessionStorage.getItem("selectedKeysMap"))[this.$route.path]
      this.openKeys = JSON.parse(sessionStorage.getItem("openKeysMap"))[this.$route.path]
      return menuData;
    },
    async getSysStudentsByStudentId() {
       try {
        const res = await this.$api.student.getSysStudentsByStudentId();
        // console.log(res);
        if (res.code === 200) {
          this.user = res.data
        //  this.$message.success(res.message)
        } else {
          // this.$message.error(res.message);
        }
      } catch (error) {
        // this.$message.error("请求失败！" + error);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.stuSide{
  width: 256px;
  height: 100%;
  background-color: #266fb7;
  display: flex;
  flex-direction: column;
}
.stuTit{
  height: 64px;
  line-height: 64px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: white;
}
.stuInfo{
  width: 226px;
  height: 274px;
  background-color: #297ccd;
  margin-left: 15px;
  border-radius: 5%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.pic{
  width: 74px;
  height: 74px;
  background-color: #6aa3dc;
  padding: 5px;
  border-radius: 50%;
}
.name{
  font-size: 16px;
  color: white;
  margin: 10px 0 10px 0;
}
.stuClass{
  width: 100%;
  height: 100%;
  background-color: #4990d6;
  border-radius: 5%;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}
.class{
  width: 100%;
  height:21px;
  padding-left: 16px;
  color: white;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>