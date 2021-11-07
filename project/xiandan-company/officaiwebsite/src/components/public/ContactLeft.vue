<template>
  <div class="contact_left">
    <div>
      <P>{{this.$t('contact.address.title')}}</P>
      <span>{{this.$t('contact.address.details')}}</span>
    </div>
    <div>
      <p>{{this.$t('contact.telephone.title')}}</p>
      <span>+ (86) 28 67649839</span><br>
      <span>+ (86)17311477303</span>
    </div>
    <div>
      <p>{{this.$t('contact.mail.title')}}</p>
      <span>contact@xiandanmall.com</span><br>
      <span>mall@kylins.com</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ContactLeft"
  }
</script>

<style scoped lang="scss">
  .contact_left {
    width: 100%;
    margin-top: 46px;
    div {
      color: #262626;
      margin-bottom: 30px;

      p {
        font-size: 20px;
        margin-bottom: 4px;
      }

      span {
        font-size: 14px;
        margin-top: 12px;
      }
    }
  }
</style>
