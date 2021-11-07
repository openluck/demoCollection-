<template>
  <div class="contact_right">
    <form action="" method="get">
      <div>
        <input type="text" :placeholder="$t('contact.input.name')">
        <input type="text" :placeholder="$t('contact.input.mail')">
      </div>
      <input type="text" :placeholder="$t('contact.input.theme')" class="theme">
      <textarea :placeholder="$t('contact.input.say')" rows="10">

          </textarea>
      <p class="sendout">{{this.$t('contact.input.send')}}</p>
    </form>
  </div>
</template>

<script>
  export default {
    name: "ContactRight"
  }
</script>

<style scoped lang="scss">
  .contact_right {
    margin-top: 20px;

    div {
      display: flex;

      input:first-of-type {
        margin-right: 20px;
      }

      input {
        width: 50%;
        height: 50px;
        background: #EAEAEA;
        border: none;
        box-sizing: border-box;
        padding-left: 20px;
      }
    }

    .theme {
      width: 100%;
      height: 50px;
      background: #EAEAEA;
      border: none;
      box-sizing: border-box;
      padding-left: 20px;
      margin-top: 20px;
    }

    textarea {
      height: 150px;
      background: #EAEAEA;
      border: none;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      margin-top: 20px;
      resize: none;
    }

    .sendout {
      width: 250px;
      height: 50px;
      background: #1390D2;
      margin-top: 20px;
      text-align: center;
      line-height: 50px;
      color: white;
      font-size: 24px;
    }
  }
</style>
