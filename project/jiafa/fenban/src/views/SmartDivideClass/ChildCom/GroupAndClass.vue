<!--
 * @Descripttion: 
 * @version: v3.10
 * @Author: wentan
 * @Date: 2021-04-13 14:57:47
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-18 10:24:41
-->
<template>
  <div class="content-item">
    <div
      class="group"
      :style="{ borderLeft: `2px solid ${group.color || '#1ba4b3'}` }"
    >
      <!-- A组件 -> B组件 -> C组件 -->
      <!-- C组件中能直接触发A组件的事件的原因在于 B组件调用C组件时 使用 v-on 绑定了$listeners 属性 -->
      <!-- 通过v-bind 绑定$attrs属性，C组件可以直接获取到A组件中传递下来的props（除了B组件中props声明的） -->
      <GroupItem class="sticky" v-bind="$attrs" v-on="$listeners" :G="group" />
    </div>
    <div class="class">
      <div class="add" v-if="divideclassType === '1'">
        <a @click="addAdminClass">
          <a-icon type="plus" style="margin-right: 8px" />新建行政班级
        </a>
      </div>
      <div v-if="group.adminClassList.length">
        <AdminClass
          v-for="item in group.adminClassList"
          :adminClass="item"
          :groupId="group.groupId"
          :key="item.adminClassId"
          :giveColor="group.giveColor"
        >
        </AdminClass>
      </div>
      <a-empty v-else style="position: relative; top: 50%" />
    </div>
  </div>
</template>

<script>
import AdminClass from "./AdminClass";
import GroupItem from "./Group/GroupItem";
import { mapState } from "vuex";
export default {
  name: "",
  components: { AdminClass, GroupItem },
  props: ["group"],
  data() {
    return {
      groupList: [],
      adminClassList: [],
      isDefault: true,
    };
  },
  created() {
    // this.adminClassList = this.group.adminClassList
  },
  computed: {
    // 分班类型
    ...mapState("adminClass", ["divideclassType"]),
  },
  mounted() {},
  methods: {
    addAdminClass(adminClassId) {
      // 如果子组件没有传adminClassId， 就把adminClassId 置为空字符串
      typeof adminClassId === "object" ? (adminClassId = "") : adminClassId;
      this.$emit(
        "addAdminClass",
        this.group.combinationList,
        this.group.groupId,
        adminClassId // 行政班级的id
      );
    },
  },
};
</script>

<style scoped lang="less">
.sticky {
  position: sticky;
  top: 0;
  z-index: 99;
  left: 0;
}
.content-item {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 8px;
  margin-bottom: 16px;
  align-items: stretch;
  .group {
    margin-right: 16px;
    height: inherit;
    position: relative;
    background-color: #1ba4b3;
    width: 360px;
  }
  .class {
    height: 100%;
    flex: 1;
    .add {
      background-color: #ffffff;
      position: sticky;
      width: 20%;
      top: 0;
      z-index: 99;
      left: 0;
      margin: 10px 0;
      font-size: 14px;
      color: #1ba4b3;
      font-weight: 600;
    }
  }
}
</style>
