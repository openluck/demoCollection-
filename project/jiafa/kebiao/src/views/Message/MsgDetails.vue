<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-08-02 15:10:36
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-19 13:54:28
-->
<template>
  <div class="msg-details">
    <a-modal
      class="msg-details-modal"
      :destroyOnClose="true"
      v-model="visible"
      @ok="handleOk"
      :footer="null"
    >
      <div class="info">
        <a-icon
          type="exclamation-circle"
          style="color: #2abf8e; font-size: 20px; margin-top: 4px"
        />
        <p>{{ information }}</p>
      </div>
      <div class="comfirm">
        <a-button type="primary" @click="handleOk">知道了 </a-button>
      </div>
    </a-modal>
  </div>
</template>
 
<script>
export default {
  name: "msgDetails",
  components: {},
  data() {
    return {
      visible: false,
      information: "",
    };
  },
  computed: {},
  mounted() {},
  methods: {
    showModal(record) {
      const { information } = record;
      this.information = information;
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
    },
  },
};
</script>
 
<style scoped lang="less">
.msg-details-modal {
  /deep/.ant-modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .info {
    margin-top: 15px;
    width: 90%;
    display: flex;
    // align-items: center;
    font-size: 16px;
    p {
      margin-left: 15px;
      margin-top: 2px;
    }
  }
  .comfirm {
    margin-top: 15px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /* button{
       width: 80px;
       height: 40px;
     } */
  }
  p {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>