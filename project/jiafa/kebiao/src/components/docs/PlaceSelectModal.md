<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: cb
 * @Date: 2021-05-26 15:00:00
 * @LastEditors: went
 * @LastEditTime: 2021-05-28 13:06:33
-->

* 示例

```
<template>
   <PlaceSelectModal ref="PlaceSelectModal" @getPalceSelect='getPalceSelect'/>
</template>


import PlaceSelectModal from "@/components/PlaceSelectModal";

components: {PlaceSelectModal },

methods: {
    //获取教室对象
    getPalceSelect(item) { 
      console.log(item);
    },
    //开启场所选择弹框
    showPlaceModal() {
       this.$refs.PlaceSelectModal.showModal()
    }
}
```