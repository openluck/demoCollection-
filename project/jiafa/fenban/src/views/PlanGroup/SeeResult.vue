<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-04-21 15:29:39
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-05 13:22:47
-->

<template>
  <div class="see-result">
    <a href="javascript:;" class="back" @click="$router.go(-1)">
      <a-icon class="icon" type="left-circle" />返回
    </a>
    <iframe
      class="full"
      :src="isStuList === 'True' ? hasStudentListUrl1 : noStudentListUrl1"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
// import { noStudentListUrl, hasStudentListUrl } from "../../../public/config";
export default {
  name: "",
  data() {
    return {
      OrganizationId: "",
      CourseGroupId: "",
      isStuList: "",
      noStudentListUrl: "",
      hasStudentListUrl: "",
    };
  },
  mounted() {
    this.noStudentListUrl = window.G.noStudentListUrl;
    this.hasStudentListUrl = window.G.hasStudentListUrl;
    // console.log('window.G.hasStudentListUrl',window.G.hasStudentListUrl);
    console.log("noStudentListUrl1", noStudentListUrl1);
  },
  created() {
    this.OrganizationId = sessionStorage.getItem("fenban_orgcode");
    this.CourseGroupId = this.$route.query.selCourseId;
    this.isStuList = this.$route.query.isStuList;
  },
  computed: {
    noStudentListUrl1() {
      let linkUrl =
        noStudentListUrl.url +
        "?OrganizationId=" +
        this.OrganizationId +
        "&" +
        "CourseGroupId=" +
        this.CourseGroupId +
        "&" +
        noStudentListUrl.shareToken;
      console.log("noStudentListUrl1-linkUrl", linkUrl);
      return linkUrl;
    },
    hasStudentListUrl1() {
      let linkUrl =
        hasStudentListUrl.url +
        "?OrganizationId=" +
        this.OrganizationId +
        "&" +
        "CourseGroupId=" +
        this.CourseGroupId +
        "&" +
        hasStudentListUrl.shareToken;
      console.log("hasStudentListUrl1-linkUrl", linkUrl);
      return linkUrl;
    },
  },
};
</script>

<style lang="less" scoped>
.see-result {
  padding: 10px 30px;
  box-sizing: border-box;
  background-color: #fff;
  height: 100%;
  width: 100%;
  .full {
    width: 100%;
    height: 100%;
  }
  .back {
    color: #000;
    font-size: 20px;
    margin-bottom: 10px;
    display: inline-block;
    .icon {
      margin-right: 8px;
    }
  }
}
</style>