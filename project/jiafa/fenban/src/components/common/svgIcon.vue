<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-08 10:21:54
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-13 16:48:13
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
  /* margin-right: 0.5em; */
}
</style>
