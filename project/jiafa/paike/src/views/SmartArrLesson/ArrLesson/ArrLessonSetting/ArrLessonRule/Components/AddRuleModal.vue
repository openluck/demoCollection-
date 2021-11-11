<!--
 * @descripttion: 排课规则-添加规则modal
 * @version: v1.0
 * @Author: WuQiao
 * @Date: 2021-6-04 13:26:12
-->
<template>
  <div class="add-rule">
    <a-modal class="modal" v-model="addModalVisible" title="新增规则" @ok="handleOnSubmit" :destroyOnClose="true"
    :footer="false"
      :keyboard="false" :maskClosable="false" :width="1200" centered @cancel="handleOnCancel">
      <AddRule ref="AddRule" @closeModal="closeModal"
        :style="{ height: (innerHeight- 180) + 'px', overflowY: 'auto' }" />
    </a-modal>
  </div>
</template>
 
<script>
import AddRule from './AddRule'
export default {
  name: 'AddRuleModal',
  components: { AddRule },
  props: {},
  data() {
    return {
      addModalVisible: false,
      innerHeight: 0
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    this.innerHeight = window.innerHeight;
    console.log(this.innerHeight);
  },
  methods: {
    showModal() {
      this.addModalVisible = true;
    },
    closeModal() {
      this.addModalVisible = false
      this.$parent.getRuleList()
    },
    handleOnSubmit() {
      // this.$refs.AddRule.onSubmit()
      this.addModalVisible = false
      this.$parent.getRuleList()
    },
    handleOnCancel () {
      this.$parent.getRuleList()
    }
  },
}
</script>
 
<style scoped lang="less">
</style>