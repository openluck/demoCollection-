<template>
  <div class="pdf-main">
    <SerchEscort @urlFromSon="padUrlChange" :actyKey="'3'"></SerchEscort>
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
    // console.log(this.pdfUrl);
    this.$nextTick(this.padUrlChange());
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

