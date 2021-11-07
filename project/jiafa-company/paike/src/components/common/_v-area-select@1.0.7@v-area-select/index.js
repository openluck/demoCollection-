import Select from './src/VueAreaSelect'
const VueAreaSelect = {
  install(Vue) {
    Vue.component(Select.name, Select)
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.VueAreaSelect = VueAreaSelect
  Vue.use(VueAreaSelect)
}
export { Select as VueAreaSelect }
export default VueAreaSelect
