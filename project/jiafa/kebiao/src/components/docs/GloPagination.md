<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-05-21 09:23:13
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-30 09:47:45
-->

```

/**
 * @desc: glo-pagination组件说明及示例
 * total 数据总条数
 * onChange  页码切换事件  调用时无需做pagination.current的修改，只修改接口入参的current
 * onSizeChange  每页条数切换事件  
 * ref  搜索筛选时通过$refs 调用组件内部initCurrent方法将当前页置为1 
 * @author: went
 */

<template>
   <glo-pagination :total="201" @onChange="onChange" ref="gloPagination" @onSizeChange="sizeChange"></glo-pagination>
</template>

<script>

methods:{
    sizeChange(current, size) {
      this.param.pageSize = size;
      this.param.current = current;
      this.getList();
    }
}

</script>

```
