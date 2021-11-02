<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-09 16:03:01
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-11 13:34:03
-->
<template>
  <div>
    <a-drawer
      title="自动排课次数"
      placement="right"
      :maskClosable="false"
      :closable="false"
      :visible="autoPkNumberVisible"
      @close="onClose"
      width="300"
    >
      <div>
        <span>自动排课次数:</span>
        <a-input-number
          :formatter="(value) => `${value}`.replace(/[^\d]/g, '')"
          :parser="(value) => value"
          :min="1"
          :max="10"
          :default-value="1"
        >
        </a-input-number>
      </div>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button @click="onClose">取消</a-button>
        <a-button
          :style="{ marginLeft: '8px' }"
          type="primary"
          @click="handleOk"
          >开始自动排课</a-button
        >
      </div>
    </a-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      autoPkNumberVisible: false,
    };
  },
  methods: {
    showDrawer() {
      this.autoPkNumberVisible = true;
    },
    onClose() {
      this.autoPkNumberVisible = false;
    },
    handleOk() {
      this.onClose();
      this.$parent.autoArrange();
    },
  },
};
</script>
