<template>
  <div class="person-setting-modal">
    <a-modal :destroyOnClose='true' v-model="visible" title="人员设置" width="700px" @ok="handleOk">
      <!-- <a-form layout="inline">
        <a-form-item>
          <a-input v-model="teacheName" placeHolder="请输入教师姓名"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button @click="filterTeaNamet" type="primary">搜索</a-button>
        </a-form-item>
      </a-form> -->
      <!-- <a-spin tip="Loading..."> -->
        <a-transfer
          :dataSource="dataSource"
          :targetKeys="targetKeys"
          :list-style="{
            width: '300px',
            height: '400px',
          }"
          :lazy="true"
          show-search
          @search="handleSearch"
          :render="renderItem"
          @change="handleChange"
          :titles="titles"
        >
        </a-transfer>
        <div class="notice">
          <span
            ><a-icon
              type="exclamation-circle"
              theme="filled"
              style="margin: 0 8px 0 16px"
          /></span>
          <span>修改权限后，与之关联的人员所对应的权限也将同步更新</span>
        </div>
        <!-- </a-spin> -->
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
      titles: ['教师', '选课教师'],
      teacheName: '',
      roleId: ''
    }
  },
  computed: {},
  watch: {
    dataSource: {
      handler(a) {
        console.log("new", a, typeof a);
      },
      immediate: true
    }
  },
  mounted() {
    // this.filterTeaName('')
    // this.getOldTeacherList()
  },
  methods: {
    renderItem(item) {
      const customLabel = (
        <span class='item'>
          <span title={item.name} width='100' class='title'>
            {item.name}
          </span>
          <span class='sex'>{item.gender === 1 ? '男' : item.gender === 2 ? '女' : '未知'}</span>
          <span title={item.idNumber}>{item.idNumber}</span>
        </span>
      )
      return {
        label: customLabel, // for displayed item
        value: item.name // for title and filter matching
      }
    },
    handleChange(targetKeys, direction, moveKeys) {
      // console.log(targetKeys);
      this.targetKeys = targetKeys
    },
    filterTeaNamet() {
      this.filterTeaName(this.teacheName)
    },
    handleSearch(dir, value) {
      // console.log('search:', dir, value);
    },
    handleDealFilter(arr, key, replaceKey) {
      let newArr = [];
      arr.forEach((item, index) => {
        // for (var i = 0; i < key.length; i++) {
          item[key] = item[replaceKey];
          // console.log(item[key] + '....' + index);
        // }
        newArr.push(item);
      });
      // console.log(newArr);
      return newArr;
    },
    handleOk() {
      this.addSys_Workers()
    },
    async filterTeaName(name) {
      let data = {
        teacheName: name
      }
      let res = await this.$api.admin.getTeacherList(data)
      if (res.code === 200) {
        this.dataSource = res.data.map(item => ({ ...item, key: item.workerId }));
        // this.dataSource = this.handleDealFilter(res.data, 'key', 'workerId');
        // console.log(this.dataSource);
      }
    },
    async getOldTeacherList(id) {
      // console.log("getOldTeacherList");
      this.roleId = id
      let data = {
        roleId: id
      }
      let res = await this.$api.admin.getOldTeacherList(data)
      if (res.code === 200) {
        if (res.data) {
          let arr = []
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            arr.push(element.workerId)
          }
          this.targetKeys = arr
          // this.selectedKeys = arr
        }
      }
    },
    async addSys_Workers() {
      console.log(this.targetKeys);
      let data = {
        userId: this.targetKeys,
        roleId: this.roleId
      }
      let res = await this.$api.admin.addSys_Workers(data)
      if (res.code === 200) {
        this.visible = false
        this.$message.success(res.message)
        this.$parent.getPermission()
      }
    }
  }
}
</script>

<style  lang="less">
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
    .title{
      width: 60px;
      margin-right: 20px;
      float: left;/* 左对齐，不设置的话只在IE下好用 */  
      overflow: hidden; /* 超出的部分隐藏起来 */  
      white-space: nowrap;/* 不显示的地方用省略号...代替 */  
      text-overflow: ellipsis;/* 支持 IE */  
      -o-text-overflow: ellipsis;/* 支持 Opera */  
    }
    .sex{
       width: 40px;
    }
  }
}

</style>
