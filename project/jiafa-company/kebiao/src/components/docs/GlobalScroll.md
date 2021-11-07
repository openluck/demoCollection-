<!--
 * @Description: 
 * @version: 
 * @Author: lrf
 * @Date: 2021-08-04 13:29:19
 * @LastEditors: went
 * @LastEditTime: 2021-09-08 11:34:30
-->

```
//将滚动条组件包裹在需要用到滚动条处
//myStyle  写入需要更改的样式     可选
//scrollListen  滚动监听触发事件  可选
<template>
   	<GlobalScroll :myStyle="'width:100%;height:calc(100% - 64px)'" @scrollListen="scrollListen">
        //这里放需要用到滚动条的内容
      </GlobalScroll>
</template>
import GlobalScroll from '@/components/common/GlobalScroll.vue'
export default {
    components: { GlobalScroll }, 
  data() {
    return {
    };
  },
}
```

