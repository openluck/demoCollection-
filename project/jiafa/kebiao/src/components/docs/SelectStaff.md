<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-05-24 15:21:49
 * @LastEditors: went
 * @LastEditTime: 2021-05-24 15:47:41
-->

* 示例

```
<template>
    <select-staff
      :selectStaffVisible="selectStaffVisible"
      :identify="identify"
      @rowClick="rowClick"
      @cancel="handleCancel"
    ></select-staff>
</template>
import SelectStaff from "@/components/common/SelectStaff";

components: {SelectStaff },
data() {
    selectStaffVisible: false,//模态框显示隐藏
    identify:[]  //身份类型id  "1" 教师  "2" 家长 "3" 学生
}
methods: {
    handleCancel() {
      this.selectStaffVisible = false;
    },
    //点击某行选择某人获取到该人员id
    rowClick(record, index) {
      console.log("selected id is", record.personId);

      this.selectStaffVisible = false;
    }

}
```
