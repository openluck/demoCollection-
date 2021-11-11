<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-09-16 16:56:10
 * @LastEditors: went
 * @LastEditTime: 2021-09-22 09:23:26
-->
<template>
  <div class="wt-graphic">
    <div class="wt-graphic-item">
      <span class="wt-graphic-item-pan-selected"></span>
      <span>选中课程</span>
    </div>
    <div class="wt-graphic-item">
      <span class="wt-graphic-item-pan-replaceable"></span>
      <span>可对调课程</span>
    </div>
  </div>
</template>
 
<script>
export default {
  name: '',
  components: {},
  data() {
    return {

    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {

  }
}
</script>
 
<style scoped lang = "less">
.wt-graphic {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .wt-graphic-item {
    margin-left: 48px;
    .wt-graphic-item-pan-selected {
      display: inline-block;
      width: 24px;
      height: 14px;
      margin-right: 10px;
      background: rgba(255, 143, 87, 0.15);
      border: 3px solid #ed9173;
      vertical-align: middle;
    }
    .wt-graphic-item-pan-replaceable {
      display: inline-block;
      width: 24px;
      height: 14px;
      margin-right: 10px;
      background: rgba(234, 249, 244);
      border: 3px solid #87ccb5;
      vertical-align: middle;
    }
  }
}
</style>