<template>
  <div class="PermissionSetting">
    <a-table
      :columns="permissionColumns"
      :bordered="isBorder"
      :data-source="permissionData"
       :rowKey="(row) => row.roleID"
       :pagination='false'
    >
      <div slot="perSonnlList" slot-scope="text, record">
        <span v-for="item in record.perSonnlList" :key="item.index">
          {{item.perSonnel}}，
        </span>
      </div>
      <template slot="operation" slot-scope="text, record">
        <span @click="personSetting(record)">
          <a-icon type="setting" />
          人员设置
        </span>
      </template>
    </a-table>
    <personSettingModal  ref="personSettingModal" />
  </div>
</template>

<script>
import personSettingModal from './ChildCom/personSettingModal'
const permissionColumns = [
  {
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName',
    width: '25%'
  },
  {
    title: '人员',
    dataIndex: 'perSonnlList',
    key: 'perSonnlList',
    width: '35%',
    scopedSlots: { customRender: 'perSonnlList' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: '15%',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: '',
  components: { personSettingModal },
  data() {
    return {
      permissionColumns,
      isBorder: true,
      permissionData: []
    }
  },
  computed: {},
  mounted() {
    this.getPermission()
  },
  methods: {
    async personSetting(record) {
      this.$refs.personSettingModal.teacheName = ''
      await this.$refs.personSettingModal.getOldTeacherList(record.roleID)
      await this.$refs.personSettingModal.filterTeaName('') 
      this.$refs.personSettingModal.visible = true
    },
    async getPermission() {
      let data = {
         sysType: 1
      }
      let res = await this.$api.admin.getPermission(data)
      if (res.code === 200) {
        this.permissionData = res.data
      }
    }
  }
}
</script>

<style scoped lang="less">
.PermissionSetting {
  width: 100%;
  height: 100%;
  padding: 16px 16px 20px 16px;
  background-color: #ffffff;
}
</style>
