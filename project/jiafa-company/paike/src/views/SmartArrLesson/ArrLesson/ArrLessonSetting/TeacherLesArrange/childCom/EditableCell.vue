<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-23 10:49:47
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-30 09:23:01
-->
<template>
  <div>
    <div class="editable-cell">
      <div v-if="editable" class="editable-cell-input-wrapper">
        <a-input-number
          v-model="temValue"
          @change="handleChange"
          @pressEnter="check"
          class="ainput"
          placeholder="0"
        /><a-icon
          type="check"
          class="editable-cell-icon-check"
          @click="check"
        />
      </div>
      <div v-else class="editable-cell-text-wrapper">
        {{ text }}
        <a-icon type="edit" class="editable-cell-icon" @click="edit" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    text: "",
  },
  data() {
    return {
      // value: this.text,
      editable: false,
      temValue: "",
    };
  },
  mounted() {
    // console.log(" this.value", this.value);
    this.temValue = this.text;
  },
  methods: {
    handleChange(e) {
      // console.log('e',e);
      // console.log('e.target.value',e.target.value);
      // const value = e.target.value;
      // const value = e;
      let courseValueStr = e;
      let courseValueReg = Number(e);
      // 正整数
      var reg = /^[1-9]\d*$/;
      let courseReg = reg.test(courseValueReg);
      let courseNum = courseValueStr == 0.5;
      if (courseNum || courseReg) {
        // alert("成功");
        // this.text = e;
        console.log("子组件的e", e);
        this.temValue = e;
        // this.$parent.getTeacherGroupList();
      } else {
        // alert("失败");
        this.$message.warning("课时只能设置0.5或者大于等于1的正整数");
      }
      // this.text = e;
      // alert("handleChange");
    },
    check() {
      this.editable = false;
      // this.text = this.temValue;
      this.$emit("change", this.temValue);
      // alert("check");
    },
    edit() {
      this.editable = true;
      // alert("edit");
    },
  },
};
</script>

<style lang="less" scoped>
.ainput {
  width: 120px;
}
</style>