<template>
  <div class="search-all">
    <label for="orgId">领卷机构：</label>
    <a-tree-select
      v-model="orgCodeTreeValue"
      :dropdown-style="{ maxHeight: '240px', overflow: 'auto' }"
      style="width: 280px"
      dropdownClassName="org-tree-select"
      :tree-data="options"
      placeholder="请选择领卷机构"
      @change="changeOrg"
    ></a-tree-select>
    <a-button type="primary" @click="searchPdf" icon="search"> 查询 </a-button>
    <div class="left-btn">
      <a-button type="primary" title="当前导出为word" @click="exportFile">
        导出当前
      </a-button>
      <a-button
        title="该操作会将当前用户所有直瞎机构的领券清单一次性导出。"
        type="primary"
        @click="downAll"
      >
        导出全部
      </a-button>
    </div>
  </div>
</template>

<script>
import { downloadFile } from "@/utils/util.js";
import { baseUrl } from "@/utils/global.js";
import mammoth from "mammoth";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("escortPlan");

export default {
  name: "",
  props: {
    actyKey: String,
  },
  data() {
    return {
      orgCodeTreeValue: undefined,
      UserOrgCode: Array,
      options: [],
      orgTypeId: String,
      orgName: String,
      orgCode: "86.45.10.23",
      url: String, //pdf链接
      orgStatus: Boolean, //是否存在未考点
      spinning: false,
      activeKey: "1", //试卷类型
      esCode: "",
      clickedArr: [],
      listAll: null,
      listNow: null,
    };
  },
  watch: {
    activeKey: {
      handler(newValue) {
        if (!this.clickedArr.includes(newValue)) {
          this.exportGeneral(newValue, this.orgCode);
          // this.exportPaper()
          this.clickedArr.push(newValue);
        }
      },
      immediate: true,
    },
    orgCode: {
      handler(newValue) {
        this.clickedArr = [this.activeKey];
        this.exportGeneral(this.activeKey, newValue);
      },
    },
  },
  created() {
    let timer = setInterval(() => {
      this.options = this.$store.state.app.orgs;
      if (this.options.length) {
        clearInterval(timer);
      }
      const filterTask = {
        OrgCode: JSON.parse(sessionStorage.getItem("userInfo")).orgcode,
        //  OrgCode: "01",
        TaskTypeId: "",
        TaskStatusId: "",
        TaskInfo: "",
        PageIndex: 1,
        PageSize: 10000,
      };
      // 获取escode
      this.$api.escortPlan.queryEscortPlanList(filterTask).then((res) => {
        this.listAll = res.data.list;
        this.getEscode();
      });
      // 初始化数据
      this.activeKey = this.actyKey;
      this.options = this.searchArry(this.options).filter((v) => (v ? v : ""));
      console.log(this.options);
      this.orgCodeTreeValue = this.options[0].children[0].orgName;
      this.orgName = this.options[0].children[0].orgName;
      this.orgCode = this.options[0].children[0].orgCode;
      this.esCode = this.options[0].children[0].esCode;
    }, 500);
  },
  mounted() {
    setTimeout(() => {
      this.searchPdf();
    }, 500);
  },
  methods: {
    ...mapActions(["queryEscortAsync"]),
    // 去除考点结构
    searchArry(arr, v) {
      const that = this;
      return arr.map((e) => {
        if (e.orgTypeId != "4" && e.key != "01" && e.key != "02") {
          if (Array.isArray(e.children)) {
            if (e.orgTypeId == "3") {
              delete e.children;
              return e;
            }
            that.searchArry(e.children, v);
          }
          return e;
        }
      });
    },
    // 改变机构时调取，
    changeOrg(value, label, extra) {
      this.orgCode = value;
      this.orgName = label[0];
    },
    // 查询搜索 // 获取pdf
    async searchPdf() {
      await this.$api.escortPlan
        .exportPdf({
          orgCode: this.orgCode,
          orgName: this.orgName,
          categoryType: this.activeKey,
          url: baseUrl,
          token: sessionStorage.getItem("CToken"),
        })
        .then((res) => {
          this.url = res.data.pdfUrl;
          this.$emit("urlFromSon", this.url);
        });
    },
    // 下载当前
    exportFile() {
      let fileName = "";
      let year = new Date().getFullYear();
      switch (this.activeKey) {
        case "1":
          fileName = this.orgName + year + "年" + "普通高考试卷发放清单.docx";
          break;
        case "2":
          fileName = this.orgName + year + "年" + "一类试卷发放清单.docx";
          break;
        case "3":
          fileName = this.orgName + year + "年" + "对口试卷发放清单.docx";
          break;
      }

      downloadFile(this["blob" + this.activeKey], fileName);
    },
    // 检索该机构下的一个场次escode
    getEscode() {
      this.listNow = this.listAll.filter((v) =>
        v.startOrgName == this.orgName ? v : ""
      );
      this.esCode = this.listNow
        .map((v) => v.session)
        .filter((v) => (v ? v : ""));
    },
    //导出普通类
    async exportGeneral(str, orgCode) {
      this.spinning = true;
      let esCode;
      if (Array.isArray(this.esCode)) {
        esCode = this.esCode;
        // esCode = this.esCode.join(",")
      } else if (typeof this.esCode === "string") {
        esCode = this.esCode.split(",");
        // esCode = this.esCode
      } else if (this.esCode === null) {
        esCode = null;
      }
      // let esCode = Array.isArray(this.esCode)?this.esCode.split(","):this.esCode
      let res;
      let reader = new FileReader();
      try {
        //takeListExportNormal    takeListExportCounterpart    takeListExportFirst
        res = await this.$api.escortPlan.exportPaper({
          orgCode: orgCode,
          esCode,
          type: str,
        });

        //返回是文件流
        this["blob" + str] = res;

        let that = this;
        reader.readAsArrayBuffer(res.data);
        reader.onload = function () {
          var buf = new Uint8Array(this.result);
          // console.log("this.result", this.result);
          mammoth.convertToHtml({ arrayBuffer: buf }).then((result) => {
            that["html" + str] = result.value;
          });
        };
      } catch (error) {
        //解析成ArrayBuffer失败，说明是正常JSON格式
        const that = this;
        await reader.readAsText(res);
        reader.onload = function () {
          const obj = JSON.parse(this.result);
          // that.$message.error(obj.message);
        };
      } finally {
        this.spinning = false;
      }
    },
    //下载所有
    downAll() {
      this.reportTable();
    },

    async reportTable(val) {
      let esCode;
      if (Array.isArray(this.esCode)) {
        esCode = this.esCode;
        // esCode = this.esCode.join(",")
      } else if (typeof this.esCode === "string") {
        esCode = this.esCode.split(",");
        // esCode = this.esCode
      } else if (this.esCode === null) {
        esCode = null;
      }
      await this.$api.escortPlan
        .exportTable({
          orgCode: this.orgCode,
          esCode,
          type: this.activeKey,
        })
        .then((res) => {
          this.downloadFile2(res.data);
        })
        .catch((res) => {
          this.downloadFile2(res.data);
        });
    },
    // 导出
    downloadFile2(data) {
      let year = new Date().getFullYear();
      let fileName;
      switch (this.activeKey) {
        case "1":
          fileName = this.orgName + year + "年" + "普通高考试卷发放所有清单";
          break;
        case "2":
          fileName = this.orgName + year + "年" + "一类试卷发放所有清单";
          break;
        case "3":
          fileName = this.orgName + year + "年" + "对口试卷发放所有清单";
          break;
      }
      let blob = new Blob([data], { type: "application/zip" });
      let url = window.URL.createObjectURL(blob);
      const link = document.createElement("a"); // 创建a标签
      link.href = url;
      link.download = fileName; // 重命名文件
      link.click();
      URL.revokeObjectURL(url); // 释放内存
    },
  },
};
</script>

<style lang="less" scoped>
.search-all {
  padding: 20px;
  box-sizing: border-box;
  &::before {
    clear: both;
  }
  .left-btn {
    float: right;
  }
}
</style>