<template>
  <object
    width="100%"
    height="100%"
    id="ReportViewer"
    type="application/x-grplugin6-displayviewer"
  >
    <param name="AutoRun" value="false" />
    <param
      name="SerialNo"
      value="GA1F6NS5D6CPYN6FD1G6061B8EFLI5KI0L4Y1233TR5C74WND6898W9DJRJ9Y0AR69VTS4FNJN8L2SD5J9GK3AVET4TGTG4CWFZ4V9E98AWRM5SW4F817198A3UA5Y4TZ9EBIN44QNM56BIA988BR4"
    />
    <param name="UserName" value="" />
  </object>
</template>
 
<script>
import axios from "axios";

export default {
  name: "",
  components: {},
  data() {
    return {
      viewer: {},
      reportobj: null,
      torun: null,
      report: null,
      data: null,
      onreportload: null,
      ondataload: null,
      isIE: false, //是否IE
      typeid: null,
    };
  },
  computed: {},
  async created() {
    this.isIE = window.navigator.userAgent.toLowerCase().indexOf("msie") > 0;
    console.log("this.$route.query", this.$route.query);
    // this.getListData();
  },
  async mounted() {
    this.InsertDisplayViewer({ type: "displayviewer" });
    // InsertDisplayViewer(prepareViewArgs());
  },
  methods: {
    MsgPluginFailed() {
      console.log("in  MsgPluginFailed");
      //弹出alert提示信息，可修改为更适合的表述
      alert("创建插件失败，当前浏览器不支持插件，或插件在当前电脑上没有安装！");
    },
    InsertDisplayViewer(args) {
      console.log("in InsertDisplayViewer", args);
      args.type = "displayviewer";
      this.doInsertPlugin(args);
    },

    doInsertPlugin(args) {
      console.log("in doInsertPlugin", args);
      this.type = "printviewer";
      this.oncreate = args.oncreate;
      let plugin;

      if (this.isIE) {
        if (this.type === "printviewer") {
          this.typeid = "ABB64AAC-D7E8-4733-B052-1B141C92F3CE";
        } else {
          this.typeid = "600CD6D9-EBE1-42cb-B8DF-DFB81977122E";
        }
        this.typeid = 'classid="clsid:' + this.typeid + gr_CodeBase;
      } else {
        this.typeid = 'type="application/x-grplugin6-' + this.type + '"';
      }

      plugin = document.getElementById("ReportViewer");

      if (!plugin || !plugin.Report) {
        this.MsgPluginFailed();
        return;
      }
      this.oncreate && this.oncreate(plugin);

      this._viewerStart(plugin, args);
    },

    async _viewerStart(viewer, args) {
      console.log("in _viewerStart", viewer, args);
      this.viewer = viewer;
      this.reportobj = viewer.Report;
      this.torun = args.autorun || args.autorun === undefined;
      this.report = args.report || viewer.ReportURL;
      this.data = args.data || viewer.DataURL;
      this.onreportload = args.onreportload;
      this.ondataload = args.ondataload;
      await this.getGRF();
      await this.getListData();
      this.run();
    },

    run() {
      let _report = this.viewer._gr_report;
      let _data = this.viewer._gr_data;
      if (_report && _data) {
        if (_report !== "{}") {
          this.reportobj.LoadFromStr(_report);
          this.onreportload && this.onreportload(this.reportobj);
        }

        if (!this.reportobj.DataLoaded) {
          this.reportobj.LoadDataFromXML(_data);
        }

        this.ondataload && this.ondataload(this.reportobj);

        this.torun && this.viewer.Start();

        this.viewer._gr_report = undefined;
        this.viewer._gr_data = undefined;
      }
    },

    async getGRF() {
      try {
        const res = await axios.get("/printNote/ReportSckstjkPd.grf");
        this.viewer._gr_report = res.request.responseText;
        // console.log("getGRF", res);
        // console.log("getGRF", this.viewer);
        // console.log("getGRF", this.viewer._gr_report);
        // this.run();
      } catch (error) {}
    },
    async getListData() {
      try {
        const token = sessionStorage.getItem('temporaryV1.20_token')
        const userName = sessionStorage.getItem('temporaryV1.20_userName')
        // console.log("temporaryV1", token, userName);
        const res = await this.$api.studentApplication.getListData({ token, userName });
        // const res = await this.$api.studentApplication.getListData({ token: token, userName: userName });
        // console.log("getListData", res);
          this.$message.error(res.message);

        if (res.code === "200" || res.code === 200) {
          this.viewer._gr_data = JSON.stringify({ ...res, data: res.data.list });
          // this.run();
        } else {
          console.log("ressss", res)
          alert(res.message)
          this.$message.error(res.message);
        }
      } catch (error) {}
    },
  },
};
</script>
 
<style scoped lang = "less">
</style>