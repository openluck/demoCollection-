<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-18 10:57:29
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-18 10:59:00
-->
<template>
  <div class="base-input">
    <input type="text" :value="value" @change="handleChange" />
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleChange(e) {
      this.$emit("input", e.target.value);
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="" scoped>
</style>