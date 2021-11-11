<!--
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-07-29 14:29:48
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-06 13:26:40
-->

<template>
  <a-input
    :value="value"
    autocomplete="off"
    :placeholder="placeholder"
    :maxLength="limit"
    :disabled="disabled"
    :suffix="value.length + '/' + limit"
    @input="inputChange($event)"
    @blur="$emit('blurEvent')"
  />
</template>

<script>
export default {
  name: "",
  model: { prop: "value", event: "input" },
  components: {},
  props: {
    value: {
      type: String,
      require: true
    },
    limit: {
      type: Number,
      default: 10
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
    // blurEvent:{

    // }
  },
  data() {
    return {};
  },
  computed: {},
  created() {
    // console.log(this);
  },
  mounted() {},
  methods: {
    /**
     * @description:
     * @param {*} e
     * @return {*}
     */
    inputChange(e) {
      // console.log("valval", e);
      this.$emit("input", e.target.value);
    }
  }
};
</script>

<style scoped lang="less">
.ant-input-affix-wrapper {
  /deep/.ant-input {
    padding-right: 50px;
  }
  /deep/.ant-input-suffix {
    color: #d2d5d9;
  }
}
</style>
