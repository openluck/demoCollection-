<!--
 * @Description: 
 * @Version: 
 * @Autor: cb
 * @Date: 2021-02-25 14:34:17
 * @LastEditors: YanQY
 * @LastEditTime: 2021-07-27 16:20:30
-->
<template>
  <div> </div>
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
