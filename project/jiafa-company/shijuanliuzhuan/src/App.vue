<template>
  <a-config-provider :locale='zh_CN'>
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import Vue from 'vue'
import {ConfigProvider} from 'ant-design-vue'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
Vue.use(ConfigProvider)
export default {
  name: 'App',
  data(){
    return{
      zh_CN,
    }
  }
}
</script>

<style>
#app {
height: 100%;
}
body *{
  vertical-align: middle;
}
</style>
