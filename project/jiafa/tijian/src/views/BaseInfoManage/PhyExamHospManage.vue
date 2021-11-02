<template>
  <iframe class="full" :src="backendPath" frameborder="0"></iframe>
</template>
 
<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      backendPath: "",
    };
  },
  computed: {},
  mounted() {
        const { menuLoadType } = this.$store.state.app
    let backendPath = this.$route.meta.backendPath;
    if (menuLoadType === '0') {
      this.backendPath = "http://" + window.location.host + backendPath
    } else if (menuLoadType === '1') {
      this.backendPath = backendPath
    }
    if (window.location.host === '118.122.144.187:28100') {
     this.backendPath = 'http://118.122.144.187:28102/' + backendPath.replace("/NET/EXSME/", "")
    }
    // this.backendPath = this.$route.meta.backendPath;
  },
  methods: {},
};
</script>
 
<style lang = "less">
.full {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
</style>