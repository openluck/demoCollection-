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
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.2em;
  fill: currentColor;
  overflow: hidden;
  /* margin-right: 0.5em; */
}
</style>
