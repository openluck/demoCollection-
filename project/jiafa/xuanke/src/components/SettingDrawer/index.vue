<template>
  <div>
    <a-drawer
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <template slot="handle">
        <div class="handle" @click="visible=!visible">
          <a-icon :type="visible?'close':'setting'"></a-icon>
        </div>
      </template>
      <div>
        <template>
          <div>
            <h2>主题颜色</h2>
            <a-radio-group
              name="radioGroup"
              :value="$route.query.navTheme||'dark'"
              @change="(e)=>handleSettingChange('navTheme',e.target.value)"
            >
              <a-radio value="dark">黑色</a-radio>
              <a-radio value="light">白色</a-radio>
            </a-radio-group>
            <h2>导航模式</h2>
            <a-radio-group
              name="radioGroup"
              :value="$route.query.navLayout||'left'"
              @change="(e)=>handleSettingChange('navLayout',e.target.value)"
            >
              <a-radio value="left">左侧</a-radio>
              <a-radio value="top">顶部</a-radio>
            </a-radio-group>
          </div>
        </template>
      </div>
    </a-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false
    };
  },

  methods: {
    afterVisibleChange(val) {
      console.log("visible", val);
    },

    onClose() {
      this.visible = false;
    },
    handleSettingChange(type, value) {
      this.$router.push({ query: { ...this.$route.query, [type]: value }});
    }
  }
};
</script>
<style scoped>
.handle {
  position: absolute;
  top: 247px;
  right: 270px;
  width: 48px;
  height: 48px;
  background: royalblue;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  border-radius: 3px 0 03px;
}
</style>