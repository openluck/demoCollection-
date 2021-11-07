<template>
  <div class="pdf-main">
    <SerchEscort @urlFromSon="padUrlChange" :actyKey="'2'"></SerchEscort>
    <iframe class="pdf-iframe" :src="pdfUrl"></iframe>
  </div>
</template>

<script>
import SerchEscort from "./ChildCon/SerchEscort";
export default {
  components: {
    SerchEscort,
  },
  data() {
    return {
      pdfUrl: {
        type: String,
        defaul: "",
      },
    };
  },
  created() {
  },
  mounted() {
    // this.pdfUrl = "http://" + this.$route.params.pdfUrl;
    this.$nextTick(this.padUrlChange());
    // console.log(this.pdfUrl);
  },
  methods: {
    padUrlChange(url) {
      this.pdfUrl = url;
    },
  },
};
</script>

<style lang="less" scoped>
.pdf-main {
  width: 100%;
  height: 100%;
}

.pdf-iframe {
  width: 100%;
  height: calc(100% - 72px);
}
</style>

