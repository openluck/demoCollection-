<!--
 * @Description: 
 * @Version: 
 * @Autor: cb
 * @Date: 2021-06-10 19:27:13
 * @LastEditors: cb
 * @LastEditTime: 2021-06-10 19:29:06
-->
```
<template>
    <a-button @click="getStaffList" type="primary">
      多选人员列表
    </a-button>



  <SelectPersonList ref="SelectPersonList" @getPerson='getPerson' @setData='setData'/>
</template>


import SelectPersonList from "@/components/SelectPersonList";

components: {SelectPersonList },

data() {
    return {
      personData: {
        current: 1, // 初次请求需要页码
        pageSize: 10,
        identify: ['1', '2', '3'], //人员类型 1学生2教职工3家长
      }
    };
  },

methods: {
    // 获取人员列表（根据公共组件内的方法调用不同的api，只作为例子）
    async getStaffList() {
      const res = await this.$api.user.getStaffList(this.personData);
      if (res.code === "200" && res.result) {
        this.$refs.SelectPersonList.showModal(res.data, '1') // 1学生2教职工3家长
      }
    },
    //获取选中人员列表
    getPerson(list) {
      console.log(list);//人员列表数据
    },
    //组件内页码改变，搜索值改变调用父组件的list事件
    setData(obj) {
      Object.assign(this.personData, obj)
      this.getStaffList()
    }
}
```