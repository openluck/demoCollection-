<template>
  <div class="applyPerson-info">
    <a-modal class="applyPerson-modal" v-model="visible" :title="personName" :destroyOnClose="true" :footer="null" :width="400" >
      <div class="applyPerson">
        <!-- <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1194131577,2954769920&fm=26&gp=0.jpg" alt=""> -->
        <img :src="imgUrl" :alt="personName">
      </div>
    </a-modal>
  </div>
</template>
 
<script>
export default {
  name: 'ApplyPersonInfo',
  components: {},
  data () {
    return {
      visible: false,
      imgUrl: "",
      personName: ""
     }
  },
  computed: {
  
  },
  mounted() {
  
  },
  methods: {
     showModal(applyPerson) {
      this.imgUrl =  applyPerson.imgUrl;
      this.personName =  applyPerson.personName;
      this.visible = true;
    },
  },
}
</script>
 
<style scoped lang="less">
.applyPerson-modal{
  img{
      width: 350px;
    }
}
</style>