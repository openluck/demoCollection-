<!--
 * @Description: 滚动条组件
 * @version: 
 * @Author: lrf
 * @Date: 2021-08-04 10:05:36
 * @LastEditors: went
 * @LastEditTime: 2021-09-08 14:19:11
-->
<template>
  <Vuescroll
    :ops="ops"
    :style="myStyle"
    @handle-scroll="handleScroll"
  >
    <slot></slot>
  </Vuescroll>
  
</template>

<script>
import Vuescroll from 'vuescroll';
export default {
  components: { Vuescroll },
  data() {
    return {
      ops: { //滚动条配置项
        vuescroll: {
          wheelScrollDuration: 200 //滚轮滚到位置所需时间
        },
        bar: {
          background: '#DAE0E5', //滚动条背景色
          minSize: 0.1 //滚动条最小大小
        }
      }
    }
  },
  props: {
    myStyle: { //滚动条样式
      type: String,
      default: ''
    }
  },
  methods: {
    /** 
     * @param {Object} vertical 竖向滚动条参数  
     * type:滚动条类型 
     * barSize:滚动条大小 
     * process:滚动条所在位置百分比（1为100%）
     * scrollTop:滚动条所在位置距离顶部距离
     * @param {Object} horizontal 横向滚动条参数（参数同竖向滚动条）
     */
    handleScroll(vertical, horizontal, nativeEvent) {
      this.$emit("scrollListen", vertical, horizontal, nativeEvent)
    }
  }
}
</script>

<style>

</style>