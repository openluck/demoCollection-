<!--
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-14 09:31:21
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-07 17:32:49
-->

<template>
  <div class="PermissionSetting">
    <a-table
      :columns="permissionColumns"
      :bordered="isBorder"
      :data-source="permissionData"
      :rowKey="(row) => row.roleId"
      :loading="authLoading"
      :pagination="false"
    >
      <template slot="personList" slot-scope="text, record">
        <span :title="formatPerson(record)">{{ formatPerson(record)}}</span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <span @click="personSetting(record)" style="cursor:pointer">
          <a-icon type="setting" style="margin-right:6px" />人员设置
        </span>
      </template>
    </a-table>
    <personSettingModal ref="personSettingModal" />
  </div>
</template>

<script>
import personSettingModal from "./ChildCom/personSettingModal";
// import func from "../../../vue-temp/vue-editor-bridge";
const permissionColumns = [
  {
    title: "角色",
    dataIndex: "roleName",
    key: "roleName",
    width: 150
  },
  {
    title: "权限",
    dataIndex: "rolePermission",
    key: "rolePermission",
    width: "25%"
  },
  {
    title: "人员",
    dataIndex: "personList",
    key: "personList",
    ellipsis: true,
    width: "35%",
    scopedSlots: { customRender: "personList" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    width: "15%",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  name: "",
  components: { personSettingModal },
  data() {
    return {
      permissionColumns,
      isBorder: true,
      authLoading: false,
      permissionData: []
    };
  },
  computed: {
    formatPerson() {
      return function(record) {
        let arr = [];
        record.personList.map(item => {
          arr.push(item.personName);
        });
        return arr.join(" / ");
      };
    }
  },
  mounted() {
    this.getPermission();
  },
  methods: {
    personSetting(record) {
      this.$refs.personSettingModal.personName = "";
      this.$refs.personSettingModal.filterTeaName("");
      this.$refs.personSettingModal.getSelectedPersonList(record.roleId);
      this.$refs.personSettingModal.visible = true;
    },
    async getPermission() {
      try {
        this.authLoading = true;
        let res = await this.$api.permissionSetting.getRoleList();
        if (res.code === 200 || res.code === "200") {
          this.permissionData = res.data;
        }
      } catch (error) {
        console.log("authsetting page error is:", error);
      } finally {
        this.authLoading = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
.PermissionSetting {
  width: 100%;
  height: 100%;
  padding: 16px 16px 20px 16px;
  background-color: #ffffff;
}
</style>
