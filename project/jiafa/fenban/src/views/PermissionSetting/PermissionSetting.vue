<!--
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-14 09:31:21
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-21 18:20:30
-->

<template>
  <div class="PermissionSetting">
    <a-table
      :columns="permissionColumns"
      :bordered="isBorder"
      :data-source="permissionData"
      :rowKey="(row) => row.roleId"
      :pagination="false"
    >
      <template slot="personList" slot-scope="text, record">
        <!-- <span v-for="item in record.personList" :key="item.index">
          {{ item.personName }}，
     
        </span> -->
        <span :title="formatPerson(record)">
          <!-- {{ item.personName }}， -->
          {{ formatPerson(record) }}
        </span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <span @click="personSetting(record)">
          <a-icon type="setting" />人员设置
        </span>
      </template>
    </a-table>
    <personSettingModal ref="personSettingModal" />
  </div>
</template>

<script>
import personSettingModal from "./ChildCom/personSettingModal";
const permissionColumns = [
  {
    title: "角色",
    dataIndex: "roleName",
    key: "roleName",
    width: "25%",
  },
  {
    title: "权限",
    dataIndex: "rolePermission",
    key: "rolePermission",
    width: "25%",
  },
  {
    title: "人员",
    dataIndex: "personList",
    key: "personList",
    width: "35%",
    ellipsis: true,
    scopedSlots: { customRender: "personList" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    width: "15%",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  name: "",
  components: { personSettingModal },
  data() {
    return {
      permissionColumns,
      isBorder: true,
      permissionData: [],
    };
  },
  computed: {
    formatPerson() {
      return function (record) {
        let arr = [];
        record.personList.map((item) => {
          arr.push(item.personName);
        });
        return arr.join(" / ");
      };
    },
  },
  computed: {
    formatPerson() {
      return function (record) {
        let arr = [];
        record.personList.map((item) => {
          arr.push(item.personName);
        });
        return arr.join(" / ");
      };
    },
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
      let data = {
        // sysType: 1,
      };
      let res = await this.$api.permissionSetting.getRoleList(data);
      if (res.code === 200 || res.code === "200") {
        this.permissionData = res.data;
      }
    },
  },
};
</script>

<style scoped lang="less">
.PermissionSetting {
  width: 100%;
  height: 98%;
  padding: 16px 16px 20px 16px;
  margin-top: 16px;
  background-color: #ffffff;
}
/deep/ .ant-table-row-cell-ellipsis,
.ant-table-row-cell-ellipsis .ant-table-column-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
