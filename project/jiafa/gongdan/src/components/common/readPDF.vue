
<template>
  <div class="pdf">
    <!-- <a-modal v-model="visible" class="modal" :footer="null" :closable="true">
      <iframe :src="joinPageUrl" frameborder="0" class="iframe"></iframe>
    </a-modal> -->
    <GlobalModal
      class="modal"
      :visible="visible"
      @cancel="() => (visible = false)"
      :destroyOnClose="true"
      :footer="null"
      :width="400"
      :centered="true"
      title="PDF查看"
    >
      <iframe :src="joinPageUrl" frameborder="0" class="iframe"></iframe>
    </GlobalModal>
  </div>
</template>
 
<script>
import GlobalModal from "@/components/common/draggableModal";
export default {
  name: "",
  components: {GlobalModal},
  props: {
    pageUrl: {
      // 嵌入页面URL
      type: String,
      default: ""
    },
    pdfInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      pdfBaseUrl: ""
    };
  },
  mounted() {},
  computed: {
    joinPageUrl() {
      return this.pdfBaseUrl + this.pageUrl;
    }
  },
  methods: {
    showModal() {
      this.visible = true;
      this.fetchBasicConfig();
    },
    handleOk() {
      this.visible = false;
    },
    async fetchBasicConfig() {
      const basicUrl = await this.$store.dispatch("fetchBasicConfig");
      this.pdfBaseUrl = basicUrl.pdfBaseUrl;
    }
  }
};
</script>

<style scoped lang = "less">
.pdf {
  height: 100%;
  width: 100%;
}
.modal {
  /* /deep/.ant-modal-close-x{
    line-height: 33px;
  } */
  /deep/.ant-modal-wrap {
    .ant-modal {
      width: 40% !important;
      height: 60% !important;
      transform-origin: 0 !important;
      .ant-modal-content {
        height: 100%;
        width: 100%;
        .ant-modal-body {
          width: 100%;
          height: 100%;
          padding: 0px;
          .iframe {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>