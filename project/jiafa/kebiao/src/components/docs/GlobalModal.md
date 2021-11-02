<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: wentan
 * @Date: 2021-05-17 10:13:02
 * @LastEditors: went
 * @LastEditTime: 2021-09-28 15:21:09
-->

``` 
<template>
  <div class>
    //弹窗开关
    <button @click="testVisible=true">modal</button>
    //弹窗组件引用
    <global-modal
      :visible="testVisible"         //弹窗显示隐藏
      :title="testTitle"             //弹窗标题
      :defaultBtn="true"             //是否使用默认按钮
      @confirm="myConfirm"           //默认按钮确认事件
      @cancel="testVisible=false"    //默认按钮取消事件
      @afterClose="afterClose"       //弹窗关闭回调事件
      :comfirmText="comfirmText"     //默认按钮文本
      :showFooter="null"             //注意：不需要底部操作按钮和边界线才传入null,否则不传该属性
    >
      //弹窗主体内容
      <div class="modal-inner">弹窗主体内容</div>
      //添加自定义按钮设置  :defaultBtn="false" slot="selfBtn"
      <template #selfBtn>
          <a-button style="margin-right: 15px" @click="cancel"> 取消 </a-button>
          <a-button type="primary" @click="submit" :loading="loading">
            提交
          </a-button>
        </template>
    </global-modal>
  </div>
</template>
 
<script>
import GlobalModal from "@/components/common/GlobalModal";
export default {
  name: "",
  components: { GlobalModal },
  data() {
    return {
      content: "",
      testVisible: false,
      testTitle: "我是标题",
      comfirmText: "提交",
      myClass: "my-modal"
    };
  },
  computed: {},
  mounted() {},
  methods: {
    myConfirm() {
      console.log("做确定时要做的事");
      this.testVisible = false;
    }
  }
};
</script>
 
<style scoped lang = "less">
.modal-inner {
  background: red;
}
</style>
```
