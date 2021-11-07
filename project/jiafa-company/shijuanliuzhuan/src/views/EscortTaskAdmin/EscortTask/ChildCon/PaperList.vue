<template>
  <div class="paper-list">
    <a-tabs v-model="activeKey">
      <a-tab-pane key="1" tab="普通类">
        <a-spin tip="加载中..." :spinning="spinning">
          <div v-if="html1" class="paper-content" v-html="html1"></div>
          <div v-else class="loading">暂无普通高考试卷发放清单</div>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="3" tab="对口类">
        <a-spin tip="加载中..." :spinning="spinning">
          <!-- <div v-html="html1" ></div> -->
          <div v-if="html3" class="paper-content" v-html="html3"></div>
          <div v-else class="loading">暂无对口试卷发放清单</div>

        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="2" tab="一类">
        <a-spin tip="加载中..." :spinning="spinning">
          <!-- <div v-html="html1" ></div> -->
          <div v-if="html2" class="paper-content" v-html="html2"></div>
          <div v-else class="loading">暂无一类试卷发放清单</div>

        </a-spin>
      </a-tab-pane>

      <a-button slot="tabBarExtraContent" @click="exportFile()">
        导出试卷信息
      </a-button>
    </a-tabs>
  </div>
</template>
 
<script>
import { downloadFile } from "@/utils/util.js";
import mammoth from "mammoth";
export default {
  name: "",
  props: {
    orgCode: {
      type: String,
      required: true,
    },
    orgName: {
      type: String,
      required: true,
    },
    esCode: {
      // type: String,
      default: null,
    },
  },
  components: {},
  data() {
    return {
      spinning: false,
      activeKey: "1",
      // orgCode: "86.45.10.23",
      // examid: "20201001",
      html1: null,
      html2: null,
      html3: null,
      url1: null,
      url2: null,
      url3: null,
      blob1: null,
      blob2: null,
      blob3: null,
      clickedArr: [],
    };
  },
  computed: {},
  watch: {
    activeKey: {
      handler(newValue) {
        if (!this.clickedArr.includes(newValue)) {
          this.exportGeneral(newValue,this.orgCode);
          // this.exportPaper()
          this.clickedArr.push(newValue);
        }
      },
      immediate: true,
    },
    orgCode: {
      handler(newValue){
          this.clickedArr=[this.activeKey]
          this.exportGeneral(this.activeKey,newValue);
      }
    }
  },
  created() {},
  mounted() {

  },
  methods: {
    exportFile() {
      let fileName = "";
      let year = new Date().getFullYear();
      switch (this.activeKey) {
        case "1":
          fileName = this.orgName +year+"年"+"普通高考试卷发放清单.docx";
          break;
        case "2":
          fileName = this.orgName +year+"年"+"一类试卷发放清单.docx";
          break;
        case "3":
          fileName = this.orgName +year+"年"+"对口试卷发放清单.docx";
          break;
      }

      downloadFile(this["blob" + this.activeKey],fileName);
    },
    //导出普通类
    async exportGeneral(str,orgCode) {
      this.spinning = true;
      let esCode;
      if(Array.isArray(this.esCode)){
        esCode = this.esCode
        // esCode = this.esCode.join(",")
      }else if( typeof this.esCode === "string"){
        esCode = this.esCode.split(",")
        // esCode = this.esCode
      }else if(this.esCode ===null){
        esCode = null
      }

      // let esCode = Array.isArray(this.esCode)?this.esCode.split(","):this.esCode
      let res
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
        const that = this
        await reader.readAsText(res);
        reader.onload = function() {
          const obj = JSON.parse(this.result)
          that.$message.error(obj.message)
        }
      } finally {
        this.spinning = false;
      }
    },
  },
};
</script>
 
<style lang = "less">
.paper-list {
  .ant-spin-blur{
    opacity: 0;
  }
  .loading{
    height: 400px;
  }
  .paper-content {
    min-height: 400px;
    margin: 0px 50px;
    box-shadow: 2px 2px 4px 2px #ccc;
    padding: 20px 0;
    margin-bottom: 20px;
  }
  p {
    text-align: center;
  }
  table {
    border: 1px solid #000;
    border-collapse: collapse;
    margin: 10px auto;
    text-align: center;
  }
  td,
  tr {
    border: 1px solid #000;
    padding: 5px;
  }
  strong {
    font-weight: 600;
  }
}
</style>