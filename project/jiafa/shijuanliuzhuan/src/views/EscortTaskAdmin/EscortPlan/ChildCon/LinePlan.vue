<template>
  <div class="line-plan">
    <div class="line-operation">
      <div class="line-tips">
        提示：绘制区域内为规定行驶范围，超出行驶范围触发报警
      </div>
      <div class="btn-left">
        <a-dropdown :disabled="disableInfo">
          <a-button>
            <icon-font style="font-size: 20px" type="iconlujing" />路径规划
          </a-button>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item
              v-for="item in DrivingPolicy"
              :key="item.type"
              :data="item.type"
              >{{ item.text }}</a-menu-item
            >
          </a-menu>
        </a-dropdown>
        <a-button type="default" @click="clickDrawArea" :disabled="disableInfo">
          <icon-font
            style="font-size: 20px"
            type="iconrenwuzhiding"
          />绘制电子围栏
        </a-button>
        <a-button type="default" @click="clearArea" :disabled="disableInfo">
          <icon-font style="font-size: 20px" type="iconqingchu" />清除电子围栏
        </a-button>
      </div>
      <div>
        <a-button
          v-if="istaskId"
          type="default"
          @click="saveLine()"
          :disabled="disableInfo"
          >保存
        </a-button>
      </div>
    </div>
    <div id="container"></div>
  </div>
</template>
<script>
import Vue from "vue";
import { Button, Dropdown, Icon, message } from "ant-design-vue";
import { createNamespacedHelpers } from "vuex";
import { getArrayObj, getStore } from "../../../../utils/util.js";
const { mapActions, mapState, mapMutations } = createNamespacedHelpers(
  "escortPlan"
);
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1814330_pl18gus56wg.js",
});

Vue.use(Icon).use(Button).use(Dropdown).use(message);
export default {
  components: {
    IconFont,
  },
  props: {
    startPo: {
      type: Array,
      required: true,
    },
    endPo: {
      type: Array,
      required: true,
    },
    newDriveArea: {
      type: String,
    },
    planType: {
      type: String,
      required: true,
    },
    taskStatus: {
      type: String,
    },
  },
  data() {
    return {
      h3tit: "人员轨迹",
      timer: null, //单人定时
      manyTime: null, //多人实时
      zoom: 20,
      markerSpeed: 200,
      speedCount: 1,
      pName: "---",
      lineArr: [104.08, 30.6579],
      marker: {},
      map: {},
      path: [],
      circle: {},
      driving: {},
      // markers: [], //点的集合  用来清除点标记
      DrivingPolicy: [
        {
          policy: "AMap.DrivingPolicy.LEAST_TIME",
          text: "最快路径",
          type: "1",
        },
        {
          policy: "AMap.DrivingPolicy.LEAST_FEE",
          text: "经济路径",
          type: "2",
        },
        {
          policy: "AMap.DrivingPolicy.LEAST_DISTANCE",
          text: "最短距离",
          type: "3",
        },
        {
          policy: "AMap.DrivingPolicy.REAL_TRAFFIC",
          text: "实时路况",
          type: "4",
        },
      ],
      disableInfo: false,
      polyline: {},
      polygon: {},
      polygon2: {},
      polyEditor: {},
      isDriveArea: false,
      driveArea: "",
      drivingOption: "",
      policy: "",
      drivingOptionPolicy: {},
      passedPolyline: {},
      flag: false,
      drivingFlag: false,
      istaskId: "",
      lineType: "",
    };
  },
  computed: {
    defaultCneter() {
      return getArrayObj(
        this.$store.state.app.orgTree,
        JSON.parse(getStore("userInfo")).orgcode
      );
    },
  },
  created() {
    if (
      this.taskStatus == "3" ||
      this.taskStatus == "4" ||
      this.taskStatus == "5"
    ) {
      this.disableInfo = true; //当任务状态为完成时任务不能修改，disabled为true
    }
  },
  mounted() {
    setTimeout(() => {
      this.initMap();
      this.istaskId = this.$route.query.taskId;
      if (this.istaskId != "") {
        if (this.planType) {
          this.drivingPlan(this.planType);
          this.drivingFlag = true;
        }
        if (this.newDriveArea) {
          this.drawArea(JSON.parse(this.newDriveArea));
        }
      }
    }, 1000);
  },
  methods: {
    initMap() {
      this.map = new AMap.Map("container", {
        resizeEnable: true, //窗口大小调整
        center: this.defaultCneter,
        zoom: 16,
        viewMode: "3D", //使用3D视图
      });
      //构造路线导航类
      this.driving = new AMap.Driving({
        map: this.map,
        // panel: "panel"
      });

      // 绘制轨迹
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArr,
        showDir: true,
        strokeColor: "#28F", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });

      var passedPolyline = new AMap.Polyline({
        map: this.map,
        strokeColor: "#AF5", //线颜色
        //path: this.lineArr,
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });

      this.map.setFitView();
    },
    handleMenuClick(e) {
      if (this.startPo.length > 0 && this.endPo.length > 0) {
        this.drivingPlan(e.key); //传入路径规划类型
        this.lineType = e.key;
      } else {
        message.error("请选择起始机构和目的机构");
      }
    },
    drivingPlan(option) {
      // console.log("option",option);
      this.map.clearMap();
      this.drivingOption = option;
      switch (option) {
        case "1":
          this.policy = "AMap.DrivingPolicy.LEAST_TIME";
          break;
        case "2":
          this.policy = "AMap.DrivingPolicy.LEAST_FEE";
          break;
        case "3":
          this.policy = "AMap.DrivingPolicy.LEAST_DISTANCE";
          break;
        case "4":
          this.policy = "AMap.DrivingPolicy.REAL_TRAFFIC";
          break;
      }

      this.drivingOptionPolicy = {
        policy: this.policy,
      };
      this.driving.setPolicy(this.drivingOptionPolicy);

      if (this.startPo[0] && this.endPo[0]) {
        this.driving.search(this.startPo, this.endPo, (status, result) => {
          if (status === "complete") {
            let origonlng = parseFloat(result.origin.lng);
            let origonlat = parseFloat(result.origin.lat);
            let destinationlng = parseFloat(result.destination.lng);
            let destinationlat = parseFloat(result.destination.lat);
            this.drivingFlag = true;
            if (origonlng < destinationlng) {
              origonlng = origonlng - 0.01;
              destinationlng = destinationlng + 0.01;
            } else {
              origonlng = origonlng + 0.01;
              destinationlng = destinationlng - 0.01;
            }
            if (origonlat < destinationlat) {
              origonlat = origonlat - 0.01;
              destinationlat = destinationlat + 0.01;
            } else {
              origonlat = origonlat + 0.01;
              destinationlat = destinationlat - 0.01;
            }
            this.path = [
              [origonlng, origonlat],
              [origonlng, destinationlat],
              [destinationlng, destinationlat],
              [destinationlng, origonlat],
            ];
          } else {
            console.log("获取驾车数据失败：" + result);
          }
        });
      } else {
        this.$message.error("未获取到起始点或目的点坐标信息");
      }
    },
    clickDrawArea() {
      this.drawArea(this.path);
    },
    drawArea(elecPath) {
      this.clearArea();
      if (this.drivingFlag && this.isDriveArea == false) {
        this.polygon = new AMap.Polygon({
          path: elecPath,
          fillColor: "rgba(255,255,255)", // 多边形填充颜色
          fillOpacity: "0.6",
          borderWeight: 1, // 线条宽度，默认为 1
          strokeColor: "red", // 线条颜色
        });
        this.map.add(this.polygon);
        this.polyEditor = new AMap.PolyEditor(this.map, this.polygon);
        this.polyEditor.open();
        this.isDriveArea = true;
      } else if (this.drivingFlag == false) {
        message.error("请先进行路径规划");
      } else if (this.isDriveArea == true) {
        message.info("已绘制电子围栏");
      }
    },
    clearArea() {
      if (this.isDriveArea === true) {
        this.map.remove(this.polygon);
        this.map.remove(this.polyEditor);
        this.polygon = null;
        this.polyEditor.close();
        this.isDriveArea = false;
      } else {
      }
    },
    saveArea() {
      if (this.polygon) {
        let saveSave = this.polygon.getPath();
        let arr = [];
        saveSave.forEach((item, index) => {
          arr.push([item.lng, item.lat]);
          this.driveArea = JSON.stringify(arr);
        });
        this.polyEditor.close();
      } else {
        this.driveArea = "";
      }
    },

    saveLine() {
      this.saveArea();
      // console.log("parents",this.driveArea,this.lineType);
      this.saveMapCircuit();
    },

    async saveMapCircuit() {
      try {
        const res = this.$api.escortTask.saveMapCircuit({
          taskId: this.istaskId,
          mapCircuit: {
            circuitArea: this.driveArea,
            circuitType: this.lineType || this.planType,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped lang="less">
.line-plan {
  position: relative;
  width: 100%;
  height: 100%;
  #container {
    position: absolute;
    width: 100%;
    height: 800px;
  }
  .line-operation {
    width: 100%;
    height: 50px;
    line-height: 50px;
    vertical-align: middle;
    display: flex;
    position: relative;
    padding-left: 6px;
    .line-tips {
      color: rgba(0, 0, 0, 0.4);
    }
    .btn-left {
      margin: 0 20px;
    }
    .btn-right {
      position: absolute;
      right: 6px;
      margin-right: 6px;
    }
  }
}
</style>