<!--
 * @Descripttion: 
 * @version: v3.10
 * @Author: wentan
 * @Date: 2021-04-14 16:57:31
 * @LastEditors: cb
 * @LastEditTime: 2021-09-23 17:08:02
-->
<template>
  <div class="global-modal">
    <a-modal
      :visible="visible"
      :footer="showFooter"
      :confirm-loading="confirmLoading"
      :destroyOnClose="true"
      :width="width"
      :title="title"
      :maskClosable="false"
      :warpClassName="selfClass"
      :keyboard="false"
      @cancel="handleCancel"
      :afterClose="afterClose"
    >

      <div class="global-modal-content">
        <!-- 弹窗主体内容 -->
        <slot></slot>
      </div>
      <template v-slot:[footer]>
        <div
          v-if="defaultBtn"
          class="op-btn"
        >
          <a-button @click="handleCancel">{{cancelText}}</a-button>
          <a-button
            @click="handleConfirm"
            :loading="requestLoading"
            style="margin-left:20px"
            type="primary"
          >{{comfirmText}}
          </a-button>
        </div>
        <div
          class="self-btn"
          v-else
        >
          <slot name="selfBtn"></slot>
        </div>
      </template>
    </a-modal>
  </div>
</template>
 
<script>
export default {
  name: "",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 弹窗宽度
    width: {
      type: Number,
      default: () => {
        return 600;
      }
    },
    //弹窗标题
    title: {
      type: String,
      default: ""
    },
    //确认按钮文本
    comfirmText: {
      type: String,
      default: "确定"
    },
    //取消按钮文本
    cancelText: {
      type: String,
      default: "取消"
    },
    //如果不使用组件默认操作按钮则传入false
    defaultBtn: {
      type: Boolean,
      default: true
    },
    // 自定义类名
    selfClass: {
      type: String,
      default: "default-class"
    },
    //是否显示右上角的关闭按钮
    closable: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: String
    },
    //按钮loading
    requestLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      confirmLoading: false,
      footer: "footer"
    };
  },
  computed: {},
  mounted() { },
  methods: {
    handleCancel(e) {
      this.$emit("cancel", e);
    },
    handleConfirm(e) {
      this.$emit("confirm", e);
    },
    afterClose(e) {
      this.$emit("afterClose", e);
    }
  }
}
</script>
 
<style scoped lang = "less">
.global-modal-content {
  position: relative;
  .go-back {
    position: absolute;
    top: -30px;
    right: 10px;
  }
}
/deep/.ant-modal-header {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  height: 48px;
}
/deep/.ant-modal-title {
  margin: 0 -6px;
  color: #616366;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  word-wrap: break-word;
  text-align: left;
}
/deep/.ant-modal-body {
  padding: 0px 0;
}
/deep/.ant-modal-footer {
  padding: 16px 16px;
  text-align: right;
  background: transparent;
  border-top: 1px solid #e8e8e8;
  border-radius: 0 0 4px 4px;
}
.op-btn {
  text-align: center;
}
.self-btn {
  text-align: center;
}
</style>