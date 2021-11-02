<!--
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-02 15:27:48
 * @LastEditors: went
 * @LastEditTime: 2021-09-14 16:21:49
-->
<template>
  <svg :class="svgClass" aria-hidden="true" :style="{'fill':color,transform: 'scale('+scale+')'}">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: "svgIcon",
  props: {
    iconClass: {
      required: true
    },
    className: {
      type: String,
      default: ""
    },
    color: {
      type: String
    },
    scale: {
      type: Number
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.2em;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
  /* margin-right: 0.5em; */
}
</style>
