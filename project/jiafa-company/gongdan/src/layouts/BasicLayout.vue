<template>
  <div :class="[`nav-theme-${navTheme}`, `nav-layout-${navLayout}`]">
    <a-layout id="components-layout-demo-side" style>
      <a-layout-header
        v-if="pure !== '1'"
        style="background: #3380CC; padding: 0; color:#FFF;height:60px;"
      >
        <Header></Header>
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          v-if="navLayout === 'left' && pure !== '1'"
          width="256px"
          v-model="collapsed"
          :theme="navTheme"
          :trigger="null"
          collapsible
          style="position:static;min-height: calc(100vh - 60px);overflow-y: auto"
        >
          <!-- <div class="logo">数据修改工单管理系统</div> -->
          <SideMenu :theme="navTheme" @getMetaInfo="getMetaInfo"></SideMenu>
        </a-layout-sider>
        <a-layout-content
          v-if="delay"
          style="margin:16px !important;  height: calc(100vh - 100px); overflow-y: auto;"
        >
          <router-view v-if="isShow"></router-view>
        </a-layout-content>
        <a-spin v-else :spinning="!delay" tip="加载中...">
          <div class="spin-content"></div>
        </a-spin>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Header from "./Header";
import SideMenu from "./SideMenu";
// import axios from 'axios'
import config from "../config/global.congfig";
import staticRouter from "../router/static.router";
import { mapState } from "vuex";
let staticRouter1 = JSON.parse(JSON.stringify(staticRouter));
export default {
  data() {
    return {
      collapsed: false,
      metaInfo: {
        title: "123"
      },
      parentRouter: [],
      isShow: true, //修改考试计划时刷新页面
      pure: "",
      commitOrgList: []
    };
  },
  watch: {
    "$route.path": function() {
      this.parentRouter = this.$route.matched.slice(1);
    },
    exId: function(newValue, oldValue) {
      if (oldValue) {
        this.isShow = false;
        this.$nextTick(() => {
          this.isShow = true;
        });
      }
    }
  },
  created() {
    this.pure = sessionStorage.getItem("pure");
    sessionStorage.setItem("asyncRouter", config.asyncRouter);
    this.$store.commit("gettedInfo", false);
    this.setMenus();
    this.parentRouter = this.$route.matched.slice(1);
    this.initCodeTable();
  },
  mounted() {
    // this.setMenus()
    this.getAlterCommitOrgList();
  },
  computed: {
    exId() {
      return this.$store.state.app.exId;
    },
    navTheme() {
      // return this.$route.query.navTheme || "dark";
      return "light";
    },
    navLayout() {
      return this.$route.query.navLayout || "left";
    },
    delay() {
      return this.$store.state.app.isGettedInfo;
    },
    ...mapState("codeTable", ["returnCodeList", "auditTypeList"])
  },
  methods: {
    // 获取meta
    getMetaInfo(val) {
      this.metaInfo = val;
    },
    filterRouter(router, del) {
      const a = router.filter(item => {
        item.path !== del;
      });
      return a;
    },
    async setMenus() {
      let routerRedirect = "";
      await this.$api.user
        .getUserInfo({})
        .then(res => {
          if (res.code === "200") {
            sessionStorage.setItem("orgId", res.data.orgId);
            sessionStorage.setItem("orgCode", res.data.orgCode);
            sessionStorage.setItem("userInfo", JSON.stringify(res.data));
            // 获取考试计划列表
            this.getExaminationList();
            // 判断静态路由还是异步路由
            if (sessionStorage.getItem("asyncRouter") !== "true") {
              // 本地路由模式
              if (sessionStorage.getItem("pure") !== "1") {
                // 机构类型Id(orgtypeId):4,报名点,3区县,2地市,1省级
                let filterRouter = [];
                switch (res.data.orgTypeId) {
                  case "4":
                    staticRouter[0].redirect = "/WorkOrderApply";
                    routerRedirect = "/WorkOrderApply";
                    // 过滤得到符合条件的菜单路由
                    filterRouter = staticRouter[0].children.filter(item => {
                      return !(
                        item.path === "/WorkOrderSetting" ||
                        item.path === "/DataModifyOrder/WorkOrderAudit" ||
                        item.path === "/ModifyStatistic"
                      );
                    });

                    break;
                  case "3":
                    staticRouter[0].redirect = "/WorkOrderApply";
                    routerRedirect = "/WorkOrderApply";
                    // 过滤得到符合条件的菜单路由
                    filterRouter = staticRouter[0].children.filter(item => {
                      return !(item.path === "/WorkOrderSetting");
                    });
                    break;
                  case "2":
                    staticRouter[0].redirect = "/WorkOrderApply";
                    routerRedirect = "/WorkOrderApply";
                    // 过滤得到符合条件的菜单路由
                    filterRouter = staticRouter[0].children.filter(item => {
                      return !(item.path === "/WorkOrderSetting");
                    });
                    break;
                  case "1":
                    staticRouter[0].redirect = "/WorkOrderSetting";
                    routerRedirect = "/WorkOrderSetting";
                    // 过滤得到符合条件的菜单路由
                    filterRouter = staticRouter[0].children.filter(item => {
                      return !(item.path === "/WorkOrderApply");
                    });
                    break;
                }
                staticRouter[0].children.length = 0;
                staticRouter[0].children = [...filterRouter];
                this.$store.dispatch("add_Routes", staticRouter);
              }
            } else {
              // 异步路由
              this.$store.dispatch("add_Routes", staticRouter);
              console.log("进入异步路由");
            }
            this.$store.commit("gettedInfo", true);
          } else {
            this.$message.error("获取用户信息失败");
          }
        })
        .then(() => {
          if (sessionStorage.getItem("pure") !== "1") {
            if (routerRedirect === "/WorkOrderSetting") {
              this.$router.replace("/WorkOrderSetting");
            } else if (routerRedirect === "/WorkOrderApply") {
              this.$router.replace("/WorkOrderApply");
            }
            staticRouter[0].children = staticRouter1[0].children;
          }
        });
    },
    async getExaminationList() {
      let resp = await this.$api.common.getExaminationList();
      if (resp.code === "200") {
        if (!sessionStorage.getItem("exId")) {
          sessionStorage.setItem("exId", resp.data.list[0].exId);
        }
        sessionStorage.setItem("exList", JSON.stringify(resp.data.list));
        this.$store.commit("changeExId", this.exId);
      }
    },
    // 获取提交机构树列表
    async getAlterCommitOrgList() {
      const res = await this.$api.ModifyStatistic.getAlterCommitOrgList();
      let data = res.data.list;
      if (res.code === "200") {
        data.map(item => {
          item["id"] = item["orgId"];
          item["pId"] = item["parentId"];
          item["title"] = item["orgName"];
          item["value"] = item["orgId"];
        });
        this.commitOrgList = [...data];
        sessionStorage.setItem(
          "commitOrgList",
          JSON.stringify(this.commitOrgList)
        );
      } else {
        this.$message.error(res.message);
      }
    },
    initCodeTable() {
      this.$store.dispatch("codeTable/queryCodeTable", {
        type: "gdtulx",
        auditType: "2"
      });
      this.$store.dispatch("codeTable/queryCodeTable", {
        type: "shgdzt",
        auditType: "2"
      });
    }
  },
  components: {
    Header,
    SideMenu
  }
};
</script>

<style lang="less" scoped>
.trigger-icon {
  padding: 0 20px;
  line-height: 64px;
  font-size: 20px;
}
.trigger-icon :hover {
  background: #eeeeee;
}
.logo {
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  text-align: center;
}
// .nav-theme-dark .logo {
//   color: white;
// }
.ant-breadcrumb {
  margin: 8px 16px 8px 16px !important;
}
.ant-layout-content {
  background: #fff;
  margin: 0 16px 16px 16px !important;
}
.spin-content {
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  grid-row: 1;
  margin: 0px;
  padding: 100px;
}
</style
>>
