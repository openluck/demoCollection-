<template>
  <div class="PDF-check">
    <a-modal class="PDF-check-modal" v-model="visible" :title="fileName" :destroyOnClose="true" :footer="null" :width="1400" centered>
      <div class="PDF-check-i">
        <iframe :src="fileUrl" width="100%" height="100%" />
        <!-- <embed src="http://www.bhlib.com/pdf/001-ljmx.pdf" type="application/pdf" width="100%" height="100%"> -->
      </div>
    </a-modal>
  </div>
</template>
 
<script>
/**
 * @description 查看PDF
 * @date 2020-12-9 15:49:28
 */
export default {
  name: 'PDFCheck',
  components: {},
  data () {
    return {
      visible: false,
      fileUrl: "",
      fileName: ""
     }
  },
  computed: {
  
  },
  mounted() {
  
  },
  methods: {
     showModal(currentOrgDatum) {
      // this.fileUrl =  currentOrgDatum.fileUrl;
      this.fileUrl =  "http://www.bhlib.com/pdf/001-ljmx.pdf";
      this.fileName = currentOrgDatum.fileName;
      this.visible = true;
    }
  }
}
</script>
 
<style scoped lang="less">
/deep/ .PDF-check-modal{
  // height: 500px !important;
}
.PDF-check-i{
  height: 800px;
}
</style>