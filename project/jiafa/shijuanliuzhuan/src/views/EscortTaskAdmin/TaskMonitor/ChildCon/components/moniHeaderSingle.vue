<template>
  <div class="moni_header">
    <div class="bread_crump">
      <a-breadcrumb>
        <a-breadcrumb-item>任务列表</a-breadcrumb-item>
        <a-breadcrumb-item>任务详情</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="go_back">
      <a-button size="large" @click="$router.go(-1)">
        <a-icon type="left" />返回
      </a-button>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
 
<style scoped lang = "less">
.moni_header {
  display: inline-block;
  width: 100%;
  height: 60px;
  line-height: 60px;
  position: relative;
  .bread_crump {
    display: inline-block;
    vertical-align: middle;
  }
  .go_back {
    display: inline-block;
    position: absolute;
    right: 10px;
  }
}
</style>