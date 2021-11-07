/*
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-19 16:25:43
 * @LastEditors: YanQY
 * @LastEditTime: 2021-08-19 17:27:49
 */

import Vue from "vue"
import maskLoading from '../components/Loading.vue'

// 我们通过模板 构造一个 Mask
const Mask = Vue.extend(maskLoading)
// Mask 是否需要更新，也就是 loading 展示效果是否需要更新
const toggleLoading = (el, binding) => {
  // console.log("el, binding", el.style.position)
  el.style.position = el.style.position || "relative"
  // 如果指令传入的值为 true 或是有值，就显示这个模板，挂到父级元素上去或是body上
  if (binding.value) {
    Vue.nextTick(() => {
      if (binding.modifiers.fullscreen) {
        // 全屏的话就挂载到 body 上
        document.body.appendChild(el.mask)
      } else {
        // 非全屏就挂到当前组件上去
        let height = el.clientHeight
        let width = el.clientWidth
        // let offsetTop = el.offsetTop
        el.mask.style.display = 'block'
        // el.mask.style.top = offsetTop + 'px'
        el.mask.style.height = height + 'px'
        el.mask.style.width = width + 'px'
        el.appendChild(el.mask)
      }
    })
  } else {
    // 如果传入的值是 false，或是没有值，就销毁 Mask
    el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask)
    el.instance && el.instance.$destroy()
  }
}

Vue.directive('loading', {
  bind(el, binding) {
    // console.log("el, binding", el, binding);
    // 指令第一次绑定到元素上时，初始化一些属性，这些属性可以通过字面量的形式传，也可以通过 dataset或是其他方式，我还没想好。
    let background = binding.value.background
    let text = binding.value.text
    // let iconSrc = binding.value.iconSrc
    let iconWidth = binding.value.iconWidth
    let iconHeight = binding.value.iconHeight
    let color = binding.value.color
    let fontSize = binding.value.fontSize
    // console.log('binding.value: ', binding.value)
    // 构造了一个 Mask 实例
    const mask = new Mask({
      el: document.createElement('div'),
      data: {
        fullscreen: !!binding.modifiers.fullscreen,
        background: background || '255, 255, 255, 0.5',
        text: text || '加载中...',
        // iconSrc: iconSrc || require('../assets/loading.gif'),
        iconWidth: iconWidth || null,
        iconHeight: iconHeight || null,
        color: color || null,
        fontSize: fontSize || null
      }
    })
    el.instance = mask
    el.mask = mask.$el
    // 更新 Mask的展示
    toggleLoading(el, binding)
  },
  // 所在组件的 VNode 更新时调用
  update(el, binding) {
    if (binding.oldValue !== binding.value) {
      toggleLoading(el, binding)
    }
  },
  unbind(el) {
    el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask)
    el.instance && el.instance.$destroy()
  }
})