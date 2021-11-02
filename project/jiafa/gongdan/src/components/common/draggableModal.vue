<template>
  <a-modal
    :class="[modalClass, simpleClass]"
    :width="width"
    :title="title"
    :visible="visible"
    v-bind="$props"
    :footer="null"
    :bodyStyle="{padding:0}"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="ant-modal-body" :style="bodyStyle">
      <slot></slot>
    </div>
    <div class="ant-modal-footer relative">
      <slot name="footer"></slot>
    </div>
    <div v-if="!title && title !== ''" slot="title">
      <slot name="title"></slot>
    </div>
  </a-modal>
</template>

<script>
import props from "./props.js";
var mouseDownX = 0;
var mouseDownY = 0;
var deltaX = 0;
var deltaY = 0;                                                                           
var sumX = 0;
var sumY = 0;

var header = null;
var contain = null;
var modalContent = null;

var onmousedown = false;
export default {
  name: "DragModal",
  mixins: [props],
  props: {
    // 容器的类名
    modalClass: {
      type: String,
      default: () => {
        return "modal-box";
      }
    },
    visible: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    title: {
      type: String,
      default: () => {
        return undefined;
      }
    },
    width: {
      type: Number,
      default: () => {
        return 600;
      }
    },
    footer: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    simpleClass() {
      return Math.random()
        .toString(36)
        .substring(2);
    }
  },
  watch: {
    visible() {
      this.$nextTick(() => {
        this.initialEvent(this.visible);
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initialEvent(this.visible);
    });
  },
  created() {},
  beforeDestroy() {
    this.removeMove();
    window.removeEventListener("mouseup", this.removeUp, false);
  },
  methods: {
    handleOk(e) {
      this.resetNum();
      this.$emit("ok", e);
    },
    handleCancel(e) {
      this.resetNum();
      this.$emit("cancel", e);
    },
    resetNum() {
      mouseDownX = 0;
      mouseDownY = 0;
      deltaX = 0;
      deltaY = 0;
      sumX = 0;
      sumY = 0;
    },
    handleMove(event) {
      const delta1X = event.pageX - mouseDownX;
      const delta1Y = event.pageY - mouseDownY;

      deltaX = delta1X;
      deltaY = delta1Y;
      // console.log('delta1X:' + delta1X, 'sumX:' + sumX, 'delta1Y:' + delta1Y, 'sumY:' + sumY)
      modalContent.style.transform = `translate(${delta1X + sumX}px, ${delta1Y +
        sumY}px)`;
    },
    initialEvent(visible) {
      // console.log('--------- 初始化')
      // console.log('simpleClass===>', this.simpleClass)
      // console.log('document===>', document)
      if (visible) {
        setTimeout(() => {
          window.removeEventListener("mouseup", this.removeUp, false);
          contain = document.getElementsByClassName(this.simpleClass)[0];
          header = contain.getElementsByClassName("ant-modal-header")[0];
          modalContent = contain.getElementsByClassName("ant-modal-content")[0];

          modalContent.style.left = 0;
          modalContent.style.transform = "translate(0px,0px)";

          // console.log('初始化-header:', header)
          // console.log('初始化-contain:', contain)
          // console.log('初始化-modalContent:', modalContent)

          header.style.cursor = "all-scroll";

          // contain.onmousedown = (e) => {
          header.onmousedown = e => {
            onmousedown = true;
            mouseDownX = e.pageX;
            mouseDownY = e.pageY;
            document.body.onselectstart = () => false;
            window.addEventListener("mousemove", this.handleMove, false);
          };

          window.addEventListener("mouseup", this.removeUp, false);
        }, 0);
      }
    },
    removeMove() {
      window.removeEventListener("mousemove", this.handleMove, false);
    },
    removeUp(e) {
      // console.log('removeUp')
      document.body.onselectstart = () => true;

      if (onmousedown && !(e.pageX === mouseDownX && e.pageY === mouseDownY)) {
        onmousedown = false;
        sumX = sumX + deltaX;
        sumY = sumY + deltaY;
        // console.log('sumX:' + sumX, 'sumY:' + sumY)
      }

      this.removeMove();
     // this.checkMove();
    }
  }
};
</script>

