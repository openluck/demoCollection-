/**
 * @description eventBus
 *              Vue 事件总线, 可实现Vue兄弟组件通信
 *              在两个组件之间没有任何引入或被引入的情况下，进行通信
 * @date 2021-4-12 15:08:15
 */
import Vue from 'vue'

const eventBus = new Vue();

console.log(eventBus);
export default eventBus;