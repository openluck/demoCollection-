
<template>
  <div class="pdf">
    <!-- <a-modal
      v-model="visible"
      class="modal"
      :footer="null"
      :width="400"
      :centered="true"
      title="签名"
    >
      <img :src="joinPageUrl" alt srcset class="iframe" />
    </a-modal> -->

    <GlobalModal
      class="modal"
      :visible="visible"
      @cancel="() => (visible = false)"
      :destroyOnClose="true"
      :footer="null"
      :width="400"
      :centered="true"
      title="签名"
    >
      <img class="img" :src="joinPageUrl" alt srcset  />
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
      signBaseUrl: ""
    };
  },
  mounted() {},
  computed: {
    joinPageUrl() {
      return this.signBaseUrl + this.pageUrl;
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
      this.signBaseUrl = basicUrl.signBaseUrl;
    }
  }
};
</script>

<style scoped lang = "less">
/deep/.ant-modal-body{
  display: flex;
  justify-content: center;
  align-items: center;
} 
.pdf {
  width: 100%;
  height: 100%;
  
}
.modal {
  height: 200px;
  width: 300px !important;
  img{
    max-width: 300px;
    max-height: 300px;
  }
}
</style>