<!--
 * @descripttion: 框选表格
 * @version: v1.0
 * @Author: mzc
 * @Date: 2021-09-28 13:54:28
-->
<template>
  <div class="grad-table" id="selectContainer" @mousedown="handleMouseDown">
    <div class="gridtable">
      <div class="tr">
        <div class="th" style="width: 103px"></div>
        <div
          class="th"
          style="width: 149px"
          v-for="(item, index) in weekEnum"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="tr" v-for="(item, index) in tableData" :key="index">
        <div style="width: 103px" class="week-first-td">
          第{{ index + 1 }}节
        </div>
        <div
          v-for="(temp, key) in item"
          :key="key"
          style="width: 149px"
          :class="`week-data-td ${temp.canEdit ? '' : 'cantEdit'}`"
          @click="handleClickTimeData(temp, index)"
          :style="`background:${temp.checked ? '#3af' : ''}`"
        >
          <div class="ruleb">
            <div class="rule" v-for="rule in temp.ruleList" :key="rule.ruleId">
              <template v-if="rule.useClass && rule.useClass.length">
                【
                <span v-for="(item, index) in rule.useClass" :key="index">
                  {{ index !== 0 ? "/" + item : item }}
                </span>
                】
              </template>
              <span>{{ rule.rules }}</span>
              <span>{{ rule.ruleWeight }}</span>
              <span>{{ rule.useObject }}</span>
              <span class="del" @click.stop="delRule(rule.ruleId)"
                ><a-icon
                  type="delete"
                  style="color: rgba(0, 0, 0, 0.5); fontsize: 15px"
              /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="mask"
      v-show="is_show_mask"
      :style="
        'width:' +
        mask_width() +
        'left:' +
        mask_left() +
        'height:' +
        mask_height() +
        'top:' +
        mask_top()
      "
    ></div>
  </div>
</template>
 
<script>
export default {
  name: "ChooseBox",
  props: {
    tableList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      weekArr: [1, 2, 3, 4, 5, 6, 0],
      tableData: [[], [], [], [], [], [], [], [], [], []],
      weekEnum: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ],
      start_x: 0,
      start_y: 0,
      end_x: 0,
      end_y: 0,
      trigger: false, //解决框选两个再回到一个，触发两次提交问题
      is_show_mask: false,
    };
  },
  watch: {
    tableList: function (tableList) {
      this.initTableData(tableList);
      this.trigger = false;
    },
  },
  methods: {
    /**
     * @desc 删除规则
     */
    delRule(ruleId) {
      this.$emit("delRule", ruleId);
    },
    /**
     * @desc 数据初始化
     */
    initTableData(tableList) {
      let tableData = [];
      let weekObj = {
        lesMon: "lesMon",
        lesTue: "lesTue",
        lesWed: "lesWed",
        lesThu: "lesThu",
        lesFri: "lesFri",
        lesSat: "lesSat",
        lesSun: "lesSun",
      };
      let i = 0;
      tableList.map((item, index) => {
        tableData.push([]);
        for (let week in weekObj) {
          let info = tableList[index][week];
          info.key = i;
          tableData[index].push(info);
          i++;
        }
      });
      this.tableData = tableData;
      console.log("tableData", this.tableData);
    },
    /**
     * @desc 单点提交
     */
    handleClickTimeData(obj, index) {
      console.log("trigger", this.trigger);
      if (!obj.canEdit || this.trigger) return;
      this.$emit("handleSettingRuleForCourse", [obj.lesId]);
    },

    // 框选范围边界
    mask_width() {
      return `${Math.abs(this.end_x - this.start_x)}px;`;
    },

    mask_height() {
      return `${Math.abs(this.end_y - this.start_y)}px;`;
    },

    mask_left() {
      // return `${Math.min(this.start_x, this.end_x) - this.box_screen_left}px;`;
      return `${Math.min(this.start_x, this.end_x)}px;`;
    },

    mask_top() {
      // return `${Math.min(this.start_y, this.end_y) - this.box_screen_top}px;`;
      return `${Math.min(this.start_y, this.end_y)}px;`;
    },

    handleMouseDown(e) {
      this.is_show_mask = true;
      this.start_x = e.clientX;
      this.start_y = e.clientY;
      this.end_x = e.clientX;
      this.end_y = e.clientY;
      document.body.addEventListener("mousemove", this.handleMouseMove);
      document.body.addEventListener("mouseup", this.handleMouseUp);
    },
    handleMouseMove(e) {
      this.end_x = e.clientX;
      this.end_y = e.clientY;

      this.addColor();
    },
    /**
     * @desc 框选色块添加
     */
    addColor() {
      const dom_mask = window.document.querySelector(".mask");
      const rect_select = dom_mask.getClientRects()[0];
      let selectKeys = [];
      document.querySelectorAll(".week-data-td").forEach((node, index) => {
        const rects = node.getClientRects()[0];
        if (this.collide(rects, rect_select) === true) {
          selectKeys.push(index);
        }
      });

      if (selectKeys.length < 2) return; //小于一个就按点击作用算
      let tableList = JSON.parse(JSON.stringify(this.tableData));
      tableList = tableList.map((item, key) => {
        return item.map((temp) => {
          if (selectKeys.indexOf(temp.key) > -1 && temp.canEdit) {
            temp.checked = true;
          }
          return temp;
        });
      });
      this.tableData = tableList;
    },
    handleMouseUp(e) {
      document.body.removeEventListener("mousemove", this.handleMouseMove);
      document.body.removeEventListener("mouseup", this.handleMouseUp);
      this.is_show_mask = false;
      this.addSelectRules();
      this.resetXY();
    },
    /**
     * @desc 框选锚点重置
     */
    resetXY() {
      this.start_x = 0;
      this.start_y = 0;
      this.end_x = 0;
      this.end_y = 0;
    },
    /**
     * @desc 框选提交
     */
    addSelectRules() {
      const tableList = JSON.parse(JSON.stringify(this.tableData));
      let lesIds = [];
      tableList.map((item) => {
        item.map((temp) => {
          if (temp.checked) {
            lesIds.push(temp.lesId);
            temp.checked = false;
          }
        });
      });
      this.tableData = tableList;

      if (lesIds.length) {
        this.trigger = true;
        this.$emit("handleSettingRuleForCourse", lesIds);
      }
    },
    /**
     * @desc 计算格子是否在框选范围内
     */
    collide(rect1, rect2) {
      const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
      const maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
      const minX = Math.min(rect1.x, rect2.x);
      const minY = Math.min(rect1.y, rect2.y);
      if (
        maxX - minX <= rect1.width + rect2.width &&
        maxY - minY <= rect1.height + rect2.height
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
 
<style scoped lang="less">
.grad-table {
  margin-top: 10px;
  height: calc(90% - 60px);
  position: relative;
  user-select: none;
}
.grad-table .mask {
  // position: absolute;
  position: fixed;
  background: #409eff;
  opacity: 0.4;
  z-index: 10000000000000;
}
.grad-table .gridtable {
  width: 100%;
  height: 100%;
  border: 0.1px solid #eee;
}
.grad-table .gridtable .tr {
  display: flex;
}
.grad-table .gridtable .th {
  background: #f8f8f9;
  line-height: 54px;
  text-align: center;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.grad-table .gridtable .week-first-td {
  background: #f8f8f9;
  min-height: 75px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.grad-table .gridtable .week-data-td {
  // height: 50px;
  // line-height: 50px;
  vertical-align: top;
  font-size: 10px;
  position: relative;
  cursor: pointer;
  min-height: 75px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
.grad-table .gridtable .week-data-td.cantEdit {
  cursor: no-drop;
  background: url("./../../../../../../assets/img/rulesno.png");
}
.ruleb {
  padding: 10px 3px;
}
.grad-table .gridtable .week-data-td .rule {
  font-size: 14px;
  text-align: center;
  position: relative;
}
.grad-table .gridtable .week-data-td .rule .del {
  position: absolute;
  right: -3px;
  top: -3px;
}
.grad-table .gridtable .week-data-td .td-data-p {
  position: absolute;
  width: 200%;
  display: block;
  left: 0;
  z-index: 10;
  text-align: center;
}
.grad-table .gridtable .week-data-td .td-data-content {
  bottom: 0;
}
.grad-table .gridtable .white-font {
  color: rgba(255, 255, 255, 0.8);
}
</style>