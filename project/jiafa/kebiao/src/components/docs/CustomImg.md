<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-06-07 14:30:35
 * @LastEditors: went
 * @LastEditTime: 2021-06-07 15:00:04
-->

```
//src:图片地址，字符串类型，必传
//width:图片地址，字符串类型，非必传,不传该值宽度为100%
//height:图片地址，字符串类型，非必传，不传该值高度为100%
//alt：字符串类型，非必传

<template>
   <custom-img :src="imgUrl" :width="width" :height="height"></custom-img> 
</template>
export default {
  name: "tm-image",
  data() {
    return {
      imgUrl: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2306696130,3636777462&fm=26&gp=0.jpg",
      width: "200",
      height:"200"
    };
  },
}
```
