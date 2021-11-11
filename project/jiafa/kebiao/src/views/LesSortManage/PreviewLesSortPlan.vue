<!--
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-17 14:38:13
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-26 11:21:58
-->
<template>
  <div class="yqy-preview-lessort-plan">
    <header class="header">
      <svg-icon icon-class="lesSort_back" style="fontSize:22px;margin-right: 10px;vertical-align: middle"
        @click.native="toPage('/LesSortManage/lesSortSetting')">
      </svg-icon>
      <span>预览节次方案</span>

    </header>
    <a-table class="table" :columns="columns" :data-source="tableData"
      :rowKey="(row) => row.lesSortIndex" bordered :pagination="false" :loading='tableLoading'>
      <TableCell v-if="false" />
    </a-table>
  </div>
</template>
 
<script>
import TableCell from "./LesSortSettingChildren/TableCell";

let dayList = [
  { title: "周一", key: "Monday" },
  { title: "周二", key: "Tuesday" },
  { title: "周三", key: "Wednesday" },
  { title: "周四", key: "Thursday" },
  { title: "周五", key: "Friday" },
  { title: "周六", key: "Saturday" },
  { title: "周日", key: "Sunday" }
];
export default {
  name: '',
  components: {},
  data() {
    return {
      lesSortList: [], //节次列表
      diffNoonRangeList: [], //已设置范围的时段列表
      status: 2, //当前页面状态 1:编辑   2:预览    3:已发布
      tableLoading: false
    }
  },
  computed: {
    curSec() {
      return this.$store.state.lesSort.curSec
    },
    lesSortPlanId() {
      return this.$store.state.lesSort.lesSortPlanId;
    },
    columns() {
      const arr = [];
      arr.push({
        title: "时段",
        dataIndex: "diffNoon",
        align: "center",
        width: 105,
        // ellipsis: true,
        customRender: (text) => {
          // console.log("text", text);
          if (text) {
            const temp = this.showTimeFrameList.filter(
              (i) => i.diffNoonName === text
            );
            // console.log("temptemp", temp);
            let rowSpan = 0;
            if (temp.length) {
              rowSpan = temp[0].rowSpan || 0;
            } else {
              rowSpan = 1;
            }
            return {
              children: text === "???" ? <span style="color:#F64646">* 必设</span> : text,
              attrs: {
                rowSpan: rowSpan
              }
            };
          } else {
            // console.log("in else");
            return {
              children: text,
              attrs: {
                rowSpan: 0
              }
            };
          }
        }
      });
      arr.push({
        title: "节次",
        align: "center",
        dataIndex: "lesSort",
        customRender: (text, row, index) => {
          if (this.isMergeArray.includes(index)) {
            return {
              children: text,
              attrs: {
                colSpan: 8
              }
            };
          } else {
            return {
              children: text
            };
          }
        }
      });
      dayList.forEach((item, arrLindex) => {
        arr.push({
          title: item.title,
          align: "center",
          ellipsis: true,
          key: item.key,
          dataIndex: "remarkList",
          customRender: (text, row, index) => {
            if (!arrLindex) {
              // console.log(text, row, index, this.status, this.isMergeArray);
            }
            if (this.isMergeArray.includes(index)) {
              return {
                children: text,
                attrs: {
                  colSpan: 0
                }
              };
            } else {
              return {
                children: <TableCell value={text} row={row} arrLindex={arrLindex} status={this.status} />
              };
            }
          }
        })
      })

      return arr;
    },
    showTimeFrameList() {
      let arr = this.diffNoonRangeList.map(i => ({ ...i, diffNoonName: i.diffNoonName ? i.diffNoonName : "???" }));
      // console.log("...this.diffNoonRangeList", this.diffNoonRangeList);
      for (let i = 0, j = this.lesSortList.length; i < j; i++) {
        const result = this.judgeIndex(i, arr);
        if (!result) {
          arr.push({ diffNoonName: "???", rowSpan: 1, startIndex: i + 1, endIndex: i + 1 });
        }
      }
      arr.sort((a, b) => a.startIndex - b.startIndex);
      arr = arr.map((i) => ({ ...i, rowSpan: i.endIndex - i.startIndex + 1 }));
      // console.log("showTimeFrameList", arr);
      return arr;
    },
    tableData() {
      const arr = this.lesSortList.map((item, index) => ({
        ...item,
        lesSort: item.lesSortName,
        diffNoon: this.judgeReturnName(index, this.showTimeFrameList)
      }));

      // console.log("tableData ", arr);
      return arr;
    },
    isMergeArray() {
      let arr = [];
      this.lesSortList.forEach((item, index) => {
        if (item.lesSortType === '0' && item.showType === '1') {
          arr.push(index);
        }
      });
      // console.log("isMergeArray", arr);
      return arr;
    }
  },
  created() {
    this.getLesSortPlanInfo({ secId: this.curSec.secId, lesSortPlanId: this.lesSortPlanId })
  },
  mounted() {

  },
  methods: {
    toPage(url) {
      this.$router.push(url)
    },
    /**
     * @name: judgeIndex
     * @test: test font
     * @msg: 判断index是否在 数组中 对象范围内
     * @param {Number} index 对应节次列表中的index
     * @param {Array<object>} arr 处理前的时段列表
     * @return {Boolean}
     */
    judgeIndex(index, arr) {
      // console.log("index, arr", index, arr);
      return arr.some((i) => i.startIndex <= index + 1 && i.endIndex >= index + 1);
    },

    /**
 * @name: judgeReturnName
 * @test: test font
 * @msg: 根据index 返回时段名称 如果数组中有一项的start= index+1 ，则返回那一项的名称，否则返回空
 * @param {Number} index
 * @param {Array<object>} arr 处理好的数段列表
 * @return {String}
 */
    judgeReturnName(index, arr) {
      for (let i = 0, j = arr.length; i < j; i++) {
        if (arr[i].startIndex === index + 1) {
          return arr[i].diffNoonName;
        }
      }
      return "";
    },

    async getLesSortPlanInfo(data) {
      this.tableLoading = true
      try {
        const res = await this.$api.lesSortSetting.getLesSortPlanInfo(data)
        if (res.code === '200' && res.result) {
          this.lesSortList = res.data.lesSortList.sort((a, b) => a.lesSortIndex - b.lesSortIndex);
          this.diffNoonRangeList = res.data.diffNoonList.sort((a, b) => a.startIndex - b.startIndex)
        } else {
          this.$message.warn(res.message)
        }
      } catch (error) {
        this.$message.warn(error)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>
 
<style scoped lang = "less">
.yqy-preview-lessort-plan {
  padding: 24px;
  .header {
    color: #303233;
    font-size: 18px;
    margin-bottom: 20px;
    /* border-bottom: 1px solid #e6e8eb;s */
  }
  /deep/.ant-table-tbody > tr > td{
    padding: 16px;
  }
}
</style>