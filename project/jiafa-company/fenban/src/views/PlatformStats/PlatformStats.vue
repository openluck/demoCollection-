<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-08 10:21:54
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-26 10:05:36
-->
<template>
  <div></div>
</template>

<script>
export default {
  created() {
    if (sessionStorage.getItem("role") === "1") {
      //学生
      if (window.location.hash === "#/platformStats") {
        this.$router.push("/studentExam");
      }
    } else if (sessionStorage.getItem("role") === "2") {
      //老师
      if (window.location.hash === "#/platformStats") {
        this.$router.push("/TeacherExam");
      }
    } else if (sessionStorage.getItem("role") === "3") {
      //管理员
      if (window.location.hash === "#/platformStats") {
        this.$router.push("/TeacherExam");
      }
    }
  }
};
</script>

<style></style>
