<!--
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-14 09:31:21
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 09:55:07
-->

<template>
  <div class="person-setting-modal">
    <a-modal
      :destroyOnClose="true"
      v-model="visible"
      title="人员设置"
      width="730px"
      @ok="handleOk"
    >
      <a-transfer
        :dataSource="dataSource"
        :targetKeys="targetKeys"
        :list-style="{
          width: '315px',
          height: '400px',
        }"
        :lazy="true"
        show-search
        @search="handleSearch"
        :render="renderItem"
        @change="handleChange"
        :titles="titles"
      ></a-transfer>
      <div class="notice">
        <span>
          <a-icon
            type="exclamation-circle"
            theme="filled"
            style="margin: 0 8px 0 16px"
          />
        </span>
        <span>修改权限后，与之关联的人员所对应的权限也将同步更新</span>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      visible: false,
      dataSource: [],
      // selectedKeys: [],
      //targetKeys: ["000B37B2DAF52EF24B9F1100EFB25B16", "000206673C3FE2986AFE06CD446B26FD", "00BCD96BA3CAD06BC4BA453E68826277", "00BB1A562E635F7C8138E9E6F727EACD", "01D1DF9306B9C1EC50F63A113F2B768D", "01D91F02C8E996D512134B27B1F93AE4"],
      targetKeys: [],
      titles: ['教师', '排课教师'],
      personName: '',
      roleId: '',
      loading: false,
    }
  },
  computed: {},
  mounted() {
    // this.filterTeaName('')
    // this.getSelectedPersonList()
  },
  methods: {
    renderItem(item) {
      const customLabel = (
        <span class="item">
          <span class="title">{item.personName}</span>
          <span class="sex">
            {item.gender === '1' ? '男' : item.gender === '2' ? '女' : '未知'}
          </span>
          <span title={item.idNumber} class="id">
            {item.idNumber}
          </span>
        </span>
      )
      return {
        label: customLabel, // for displayed item
        value: item.personName, // for title and filter matching
      }
    },
    handleChange(targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    filterTeaNamet() {
      this.filterTeaName(this.personName)
    },
    handleSearch(dir, value) {
      // this.filterTeaNamet()
    },
    // 添加key值
    handleDealFilter(arr, key, replaceKey) {
      let newArr = []
      arr.forEach((item, index) => {
        item[key] = item[replaceKey]
        item.title = item.personName
        newArr.push(item)
      })
      return newArr
    },
    handleOk() {
      this.addSys_Workers()
    },
    // 获取人员List
    async filterTeaName(name) {
      let data = {
        personName: name,
      }
      let res = await this.$api.permissionSetting.getPersonList(data)
      if (res.code === 200 || res.code === '200') {
        this.dataSource = this.handleDealFilter(res.data, 'key', 'personId')
      }
    },
    async getSelectedPersonList(id) {
      this.roleId = id
      let data = {
        roleId: id,
      }
      let res = await this.$api.permissionSetting.getSelectedPersonList(data)
      if (res.code === 200 || res.code === '200') {
        if (res.data) {
          let arr = []
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i]
            arr.push(element.personId)
          }
          this.targetKeys = arr
          // this.selectedKeys = arr
        }
      }
    },
    async addSys_Workers() {
      let data = {
        personId: this.targetKeys,
        roleId: this.roleId,
      }
      let res = await this.$api.permissionSetting.setPerson(data)
      if (res.code === '200') {
        this.visible = false
        this.$message.success(res.message,5)
        this.$parent.getPermission()
      }
    },
  },
}
</script>

<style lang="less">
.notice {
  margin-top: 8px;
  height: 40px;
  line-height: 40px;
  background-color: #f6eeea;
  span {
    color: #eb7438;
  }
}
.ant-transfer-list-content-item {
  display: flex;
  .item {
    width: 100%;
    display: flex;
    .title {
      width: 70px;
      margin-right: 8px;
      float: left; /* 左对齐，不设置的话只在IE下好用 */
      overflow: hidden; /* 超出的部分隐藏起来 */
      white-space: nowrap; /* 不显示的地方用省略号...代替 */
      text-overflow: ellipsis; /* 支持 IE */
      -o-text-overflow: ellipsis; /* 支持 Opera */
    }
    .sex {
      width: 40px;
      margin-right: 8px;
    }
  }
}
</style>
