<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-05-24 13:23:08
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-14 13:58:05
-->
<template>
  <div class="container">
    <a-spin size="large" :tip="tip">
      <div class="container"></div>
    </a-spin>
  </div>
</template>
<script>
import Vue from "vue";
import { mapMutations } from "vuex";
import moment from "moment";
// import axios from 'axios';
// import api from '@/http/api';
import { spin, message } from "ant-design-vue";
import mapMenu from "@/config/mapMenu";
Vue.use(spin);
Vue.prototype.$message = message;
export default {
  data() {
    return {
      loading: false,
      token: "",
      examid: "",
      tip: "加载中...",
    };
  },
  created() {
    sessionStorage.setItem("token", this.$route.query.token);
    sessionStorage.setItem("orgCode", this.$route.query.orgCode);
    sessionStorage.setItem("appId", this.$route.query.appId);
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations("app", ["setUserName"]),
    doMapMenu(mapMenu, menuList) {
      //该项不属任何菜单项，故单独加入
      if (!menuList) {
        this.$message.warning("未获取到菜单信息");
        return;
      }
      menuList.push({
        id: "kbgl_00",
        title: "消息页面",
        icons: "",
        path: "Message/Message",
        isChildPage: true,
        hasChildMenu: false,
        isHideMenu: true,
      });
      mapMenu.forEach((item, index) => {
        menuList.forEach((i) => {
          if (item.id === i.spyCode) {
            i.path = mapMenu[index].path;
            i.hasChildMenu = mapMenu[index].hasChildMenu;
            i.isHideMenu = mapMenu[index].isHideMenu;
            i.icons = mapMenu[index].icons;
          }
          //将没有子菜单的菜单的子页面加到menuList
          if (
            !i.hasChildMenu &&
            item.id.includes(i.spyCode) &&
            item.isChildPage &&
            item.id !== i.spyCode
          ) {
            menuList.push(item);
          }
          //处理子菜单
          if (i.children && i.hasChildMenu) {
            i.children.forEach((itemC, indez) => {
              if (itemC.spyCode === item.id) {
                itemC.path = mapMenu[index].path;
                itemC.hasChildMenu = mapMenu[index].hasChildMenu;
                itemC.isHideMenu = mapMenu[index].isHideMenu;
              }
              //添加子菜单的子页面
              if (item.isHideMenu && item.id.includes(i.spyCode)) {
                //去重
                if (
                  i.children.every((someItem) => someItem.spyCode !== item.id)
                ) {
                  i.children.push(item);
                }
              }
            }, (i.children = [...new Set(i.children)]));
          }
        });

        return menuList;
      });
    },
    async init() {
      let res = await this.$api.common.getMenuList({
        appId: sessionStorage.getItem("appId"),
      });

      if (res.code === "200") {
        debugger;
        sessionStorage.setItem("baseInfo", JSON.stringify(res.data.baseInfo));
        console.log('res.data.menuList',res.data.menuList);
        const menuList = res.data.menuList;
        await this.getUserInfo();
        await this.getBasicList();
        this.getTeachWeekBySemester();
        this.doMapMenu(mapMenu, menuList);
        this.$store.dispatch(
          "add_Routes",
          JSON.parse(JSON.stringify(menuList))
        );
        let defaultRouter = this.$router.options.routes[0].children[0];
        if (defaultRouter.children.length > 0) {
          this.$router.push(defaultRouter.children[0].path);
        } else {
          this.$router.push(defaultRouter.path);
        }
      } else {
        this.tip = res.message;
        this.$message.error(res.message);
      }
    },
    async getUserInfo() {
      try {
        debugger;
        const res = await this.$api.common.getUserInfo();
        if (res.code === "200") {
          console.log("res.data", res.data);
          sessionStorage.setItem("userInfo", JSON.stringify(res.data));
          this.setUserName(res.data.accountName);
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log("getUserInfo err", error);
      }
    },
    async getBasicList() {
      try {
        const res = await this.$api.common.getBasicList();
        if (res.code === "200") {
          //学段年级列表
          sessionStorage.setItem("secList", JSON.stringify(res.data.secList));
          //学年列表
          sessionStorage.setItem(
            "schoolYearList",
            JSON.stringify(res.data.schoolYearList)
          );
          //当前学期的开始结束时间和当前时间是否在学期内的状态
          let temp = {
            semesterStartTime: "",
            semesterEndTime: "",
            inSemester: null,
            schoolYearId: "",
            semesterId: "",
            defaultTime: "",
          };

          if (res.data.schoolYearList.length > 0) {
            for (let i = 0; i < res.data.schoolYearList.length; i++) {
              const element = res.data.schoolYearList[i];
              if (element.isCurrentSchoolYear) {
                temp.schoolYearId = element.schoolYearId;
                element.semesterList.map((item) => {
                  if (item.isCurrentSchoolSemester) {
                    temp.semesterId = item.semesterId;
                    temp.semesterStartTime = item.semesterStartTime;
                    temp.semesterEndTime = item.semesterEndTime;
                    temp.defaultTime = item.defaultTime;
                    if (moment(item.semesterEndTime) < moment(new Date())) {
                      temp.inSemester = false;
                    } else {
                      temp.inSemester = true;
                    }
                  }
                });
              }
            }
          }
          sessionStorage.setItem("nowSemester", JSON.stringify(temp));
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
    async getTeachWeekBySemester() {
      try {
        const params = {
          schoolYearId: "",
          semesterId: "",
        };
        const res = await this.$api.common.getTeachWeekBySemester(params);
        if (res.code === "200") {
          //学段年级列表
          sessionStorage.setItem("teachWeekList", JSON.stringify(res.data));
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
  },
};
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100vh;
}
</style>
