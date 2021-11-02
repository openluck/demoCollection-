import { Message } from "ant-design-vue"

const debounce = (func, time, isDebounce, ctx) => {
  var timer, lastCall, rtn;
  //防抖函数
  if (isDebounce) {
    rtn = (...params) => {
      if (timer) {
        Message.warn('您点击得太快了'
        );
        clearTimeout(timer)
      }
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null
      }, time);
      if (callNow) func.apply(ctx, params);
    };
  } else {
    //节流函数
    rtn = (...params) => {
      const now = new Date().getTime();
      if (now - lastCall < time && lastCall) return;
      lastCall = now;
      func.apply(ctx, params);
    };
  }
  return rtn;
};

export default {
  name: "Debounce",
  abstract: true,
  // functional: true,
  props: {
    time: {
      type: Number,
      default: 800
    },
    events: {
      type: String,
      default: "click"
    },
    isDebounce: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.eventKeys = this.events.split(",");
    this.originMap = {};
    this.debouncedMap = {};
  },
  render(createElement, context) {
    // console.log("context", context);
    const vnode = this.$slots.default[0]
    // console.log("vnode", vnode);

    this.eventKeys.forEach((key) => {
      const target = vnode.data.on[key]
      if (target === this.originMap[key] && this.debouncedMap[key]) {
        vnode.data.on[key] = this.debouncedMap[key]
      } else if (target) {
        this.originMap[key] = target
        this.debouncedMap[key] = debounce(target, this.time, vnode)
        vnode.data.on[key] = this.debouncedMap[key]
      }
    })
    // console.log("vnode", vnode);

    return vnode
  }
};
