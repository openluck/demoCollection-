<!--
 * @Descripttion: test font
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-14 09:31:21
 * @LastEditors: xutao
 * @LastEditTime: 2021-04-25 17:26:03
-->
<template>
  <div class="personal-list">
    <a-modal v-model="visible" title="删除班级组合" :destroyOnClose="true">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <template slot="closeIcon">
        <a-icon @click="handleCancel" type="close" style="color:#1ba4b3;" />
      </template>
      <p>{{delErrorInfo}}</p>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {

    };
  },
  computed: {
    // 从vuex中获取模态框的状态
    visible() {
      return this.$store.state.adminClass.delModalStatus
    },
    // 从vuex获取行政班级的数据
    delErrorInfo() {
      return this.$store.state.adminClass.delErrorInfo
    },
  },
  watch: {
  },
  mounted() {
  },
  methods: {

    // 模态框-确定
    handleOk(e) {
      this.$store.commit('adminClass/setDelModalStatus', false)
    },
    // 模态框-取消事件
    handleCancel() {
      this.$store.commit('adminClass/setDelModalStatus', false)
    },
  },
}
</script>

<style scoped lang = "less">
/deep/.ant-btn {
  &:hover {
    color: #000;
    border-color: #1ba4b3;
  }
}
</style>