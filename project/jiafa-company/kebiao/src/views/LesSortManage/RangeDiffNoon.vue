<!--
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-16 09:29:51
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-30 09:51:45
-->
<template>
  <div
    class="yqy-range-diff"
    ref="yqy-range-diff"
  >
    <h3 class="title">{{curSec.secName}}</h3>
    <!-- 授课节次变化:{{teachLesChange}}
     非授课节次变化: {{noTeachLesChange}}
     课表删除: {{lesTableDel}} -->
    <div class="filter">
      <div class="name-box">
        <span class="text">节次方案名称:</span>
        <InputSuffix
          v-model.trim="lesSortPlanName"
          placeholder="请输入节次方案名称"
          style="width:240px"
        />
        <a-button
          @click="updateDiffNoonRange"
          style="margin-left:16px"
        >
          <svg-icon
            icon-class="lesSort_setting"
            style="margin-right: 6px"
          />设置时段
        </a-button>
      </div>
      <div class="button-box">
        <a-button @click="lastStep"> 上一步 </a-button>
        <a-button
          type="primary"
          @click="createLesSort"
          :loading="btnLoading"
        >
          {{lesSortPlanId?'修改':"创建"}}</a-button>
      </div>
    </div>

    <a-table
      class="table"
      :columns="columns"
      :data-source="tableData"
      :rowKey="(row) => row.lesSortIndex"
      bordered
      :pagination="false"
      :loading='tableLoading'
    >
      <TableCell v-if="false" />
    </a-table>

    <DiffNoonModal
      v-if="diffNoonRangeModalVisi"
      :diffNoonRangeModalVisi="diffNoonRangeModalVisi"
      :diffNoonList="diffNoonList"
      :diffNoonRangeList="diffNoonRangeList"
      :lesSortList="lesSortList"
      :allRanged="allRanged"
      @rangeDiffnoon="rangeDiffnoon"
      @resetDiffnoon="resetDiffnoon"
    />
  </div>
</template>
<script>
import TableCell from "./LesSortSettingChildren/TableCell";
import DiffNoonModal from "./LesSortSettingChildren/DiffNoonModal.vue";
import InputSuffix from "../../components/InputSuffix";

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
  components: { TableCell, DiffNoonModal, InputSuffix },
  data() {
    return {
      lesSortPlanId: "", //节次方案id
      lesSortPlanName: "", //节次方案名称
      status: 1, //当前页面状态 1:编辑   2:预览    3:已发布
      diffNoonRangeModalVisi: false, //弹窗显隐
      diffNoonRangeList: [], //已设置范围的时段列表
      diffNoonList: [], //时段列表
      lesSortList: [], //节次列表
      // lesSortList: [],
      tableLoading: false,
      btnLoading: false,
      inputValue: "",
      datedate: null,
      teachLesChange: false, //授课节次变化
      noTeachLesChange: false, //非授课节次变化
      lesTableDel: false //课表删除
    };
  },
  computed: {
    curSec() {
      return this.$store.state.lesSort.curSec;
    },
    lesSortPlanList() {
      return this.$store.state.lesSort.lesSortPlanList;
    },
    teachLes() { //判断是否有变化
      return this.$store.state.lesSort.teachLes;
    },
    allRanged() {
      if (this.diffNoonRangeList.length && this.lesSortList.length) {
        const endIndex =
          this.diffNoonRangeList[this.diffNoonRangeList.length - 1].endIndex;
        if (
          endIndex ===
          this.lesSortList[this.lesSortList.length - 1].lesSortIndex
        ) {
          return true;
        }
      }
      return false;
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
            if (this.isMergeArray.includes(index)) {
              return {
                children: text,
                attrs: {
                  colSpan: 0
                }
              };
            } else {
              return {
                children: (
                  <TableCell
                    value={text}
                    row={row}
                    arrLindex={arrLindex}
                    status={this.status}
                  />
                )
              };
            }
          }
        });
      });

      return arr;
    },

    showTimeFrameList() {
      let arr = this.diffNoonRangeList.map((i) => ({
        ...i,
        diffNoonName: i.diffNoonName ? i.diffNoonName : "???"
      }));
      // debugger
      for (let i = 0, j = this.lesSortList.length; i < j; i++) {
        const result = this.judgeIndex(i, arr);
        if (!result) {
          arr.push({
            diffNoonName: "???",
            rowSpan: 1,
            startIndex: i + 1,
            endIndex: i + 1
          });
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
        if (item.lesSortType === "0" && item.showType === "1") {
          arr.push(index);
        }
      });
      // console.log("isMergeArray", arr);
      return arr;
    }
  },
  created() {
    const lesSortPlanId = this.$store.state.lesSort.lesSortPlanId;
    this.getDiffNoonList();
    if (lesSortPlanId) {
      this.lesSortPlanId = lesSortPlanId;
    }
  },
  beforeMount() {
  },
  mounted() {
    this.lesSortList = this.$store.state.lesSort.tempLesSortList;
    this.lesSortPlanName = this.$store.state.lesSort.tempLesSortPlanName;
    this.diffNoonRangeList = this.$store.state.lesSort.tempDiffNoonRangeList;
  },
  updated() {
  },

  methods: {
    /**
     * @description: 传入lesSortIndex,找到所属时段
     * @param {*} list 时段列表
     * @param {*} index 传入index
     * @return {*} {}
     * @author:
     */
    findDiffNoon(list, index) {
      // console.log(list, index);
      return list.filter(
        (i) => i.startIndex <= index && i.endIndex >= index
      )[0];
    },
    toPage(url) {
      this.$router.push(url);
    },
    updateDiffNoonRange() {
      //['yqy-range-diff']
      this.diffNoonRangeModalVisi = true;
    },

    //比较数据贩判断对应变化         teachLesChange: false, //授课节次变化
    //noTeachLesChange: false, //非授课节次变化
    //lesTableDel: false //课表删除
    compareArray(origin, data) {
      const lesList1 = origin.filter(i => i.lesSortType === '1')
      const lesList2 = data.filter(i => i.lesSortType === '1')
      if (lesList1.length !== lesList2.length) {
        this.lesTableDel = true
      }
      // const length1 = origin.length;
      // const length2 = data.length;
      // for (let j = 0; j < length2; j++) {
      //   if (this.teachLesChange && this.noTeachLesChange) return
      //   if (data[j].lesSortPlanOptionId) { //当id存在时
      //     let temp = origin.filter(item => item.lesSortPlanOptionId === data[j].lesSortPlanOptionId)[0];
      //     if (temp.lesSortType !== data[j].lesSortType) { //节次授课类型变化
      //       this.teachLesChange = true
      //       this.noTeachLesChange = true
      //       return;
      //     } else if (temp.lesSortIndex !== data[j].lesSortIndex) { //序号变化
      //       if (temp.lesSortType === "1") {
      //         this.teachLesChange = true
      //       } else {
      //         this.noTeachLesChange = true
      //       }
      //       if (data[j].lesSortType === "1") {
      //         this.teachLesChange = true
      //       } else {
      //         this.noTeachLesChange = true
      //       }
      //     } else if (temp.lesSortName !== data[j].lesSortName) { //名称变化
      //       temp.lesSortType === '1'
      //         ? this.teachLesChange = true
      //         : this.noTeachLesChange = true
      //     } else if (temp.lesType !== data[j].lesType) { //是否自习变化
      //       this.teachLesChange = true
      //     } else if (temp.showType !== data[j].showType) { //展示形式变化
      //       this.noTeachLesChange = true
      //     }
      //   } else { //当id不存在时，是新增的数据
      //     if (data[j].lesSortType === '1') {
      //       this.teachLesChange = true
      //     } else {
      //       this.noTeachLesChange = true
      //     }
      //   }
      // }
      // if (this.teachLesChange && this.noTeachLesChange) return
      // const dataArr = data.filter(i => i.lesSortPlanOptionId).map(i => i.lesSortPlanOptionId);
      // for (let i = 0; i < length1; i++) {
      //   if (this.teachLesChange && this.noTeachLesChange) return
      //   if (!dataArr.includes(origin[i].lesSortPlanOptionId)) {
      //     if (origin[i].lesSortType === '1') {
      //       this.teachLesChange = true
      //     } else {
      //       this.noTeachLesChange = true
      //     }
      //   }
      // }
    },

    lastStep() {
      this.$store.commit('lesSort/changeTempDiffNoonRangeList', this.diffNoonRangeList)
      this.toPage('/LesSortManage/EditLesSortItem?isBack=t')
    },

    async createLesSort() {
      //判断名称是否重复
      const repeatName = this.lesSortPlanList.some(i => i.lesSortPlanName === this.lesSortPlanName && (this.lesSortPlanId ? i.lesSortPlanId !== this.lesSortPlanId : true))
      if (repeatName || !this.lesSortPlanName || !this.allRanged) {
        return this.$error({
          title: <span style={{ color: '#F25555', fontSize: "16px" }}> {this.lesSortPlanId ? '修改' : "创建"}失败</span >,
          content: () => {
            return (<div>
              {repeatName ? <div style={{ fontSize: '14px', color: "#303233" }}>方案名称重复</div> : ""}
              {!this.lesSortPlanName ? <div style={{ fontSize: '14px', color: "#303233" }}>请填写方案名称</div> : ""}
              {!this.allRanged ? <div style={{ fontSize: '14px', color: "#303233" }}>节次项存在未设置时段</div> : ""}
            </div>
            )
          }
        });
      }
      if (this.allRanged) {
        const lesSortList = this.lesSortList.map((i) => {
          const obj = this.findDiffNoon(this.diffNoonRangeList, i.lesSortIndex);
          return {
            ...i,
            belongDiffNoonCode: obj.diffNoonCode,
            belongDiffNoonName: obj.diffNoonName
          };
        });
        let result;
        if (this.lesSortPlanId) {
          let origin = this.$store.state.lesSort.originalLesSortList;
          this.compareArray(origin, lesSortList)
          // return
          const { lesTableDel } = this
          // style="color:red"
          this.$confirm({
            title: () => {
              if (lesTableDel) {
                return <span>授课节次项进行增加或删除对应的课表将被<span style="color:#F64646">删除</span>，节次时间方案将会发生变化，确定继续修改吗？</span>
              } else {
                return <span>修改节次方案后对应使用的课表也会发生变化，确定继续修改吗？</span>
              }
            },
            icon: () => (
              <svg-icon class="anticon" icon-class="com_warn" style="fontSize:20px;cursor: default" />
            ),
            onOk: async () => {
              result = await this.updateLesSortPlan({
                secId: this.curSec.secId,
                lesSortPlanId: this.lesSortPlanId,
                lesSortPlanName: this.lesSortPlanName,
                lesSortList,
                diffNoonList: this.diffNoonRangeList
                // teachLesChange,
                // noTeachLesChange,
                // lesTableDel
              });

              if (result) {
                this.toPage("/LesSortManage/lesSortSetting");
              }
            }
          });
        } else {
          result = await this.addLesSortPlan({
            secId: this.curSec.secId,
            lesSortPlanName: this.lesSortPlanName,
            lesSortList,
            diffNoonList: this.diffNoonRangeList
          });
          if (result) {
            this.toPage("/LesSortManage/lesSortSetting");
          }
        }
        // } else {
        //   this.$warning({
        //     title: "请先安排完全部节次"
        //   });
      }
    },

    /**
     * @name: judgeIndex
     * @msg: 判断index是否在 数组中 对象范围内
     * @param {Number} index 对应节次列表中的index
     * @param {Array<object>} arr 处理前的时段列表
     * @return {Boolean}
     */

    judgeIndex(index, arr) {
      return arr.some(
        (i) => i.startIndex <= index + 1 && i.endIndex >= index + 1
      );
    },

    /**
     * @name: judgeReturnName
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

    rangeDiffnoon(data) {
      this.diffNoonRangeList.push(data);
      this.diffNoonRangeModalVisi = false;
    },
    resetDiffnoon() {
      this.diffNoonRangeList = [];
      this.$message.success("节次项设置已清空")
    },

    //获取时段列表
    async getDiffNoonList() {
      try {
        const res = await this.$api.diffNoonSetting.getDiffNoonList();
        if (res.code === "200" && res.result) {
          if (res.data) {
            this.diffNoonList = res.data.map((i) => ({
              ...i,
              value: i.diffNoonCode,
              label: i.diffNoonName,
              title: i.diffNoonName
            }));
          }
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // this.tableLoading = false;
      }
    },

    async addLesSortPlan(data) {
      this.btnLoading = true;
      try {
        const res = await this.$api.lesSortSetting.addLesSortPlan(data);
        if (res.code === "200" && res.result) {
          // this.lesSortList = res.data.lesSortList
          this.$message.success("创建成功");

          return true;
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.btnLoading = false;
      }
    },
    async updateLesSortPlan(data) {
      this.btnLoading = true;
      try {
        const res = await this.$api.lesSortSetting.updateLesSortPlan(data);
        if (res.code === "200" && res.result) {
          this.$message.success("修改成功");
          return true;
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.btnLoading = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
.yqy-range-diff {
  padding: 24px;
  height: 100%;
  .title {
    margin: 0;
    padding: 0;
    font-size: 18px;
    color: #303233;
    margin-bottom: 20px;
  }

  .filter {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    .name-box {
      .text {
        padding: 0 8px;
        color: #494b4d;
        &::before {
          content: "*";
          display: inline-block;
          color: red;
          vertical-align: sub;
          margin-right: 6px;
        }
      }
      .ant-btn {
        color: #616366;
        &:hover {
          color: @primary-color;
        }
      }
    }
    .button-box {
      .ant-btn + .ant-btn {
        margin-left: 16px;
      }
    }
  }

  .table {
    /deep/.ant-table-bordered {
      .ant-table-tbody > tr > td {
        height: 65px;
        font-weight: 400;
        color: #494b4d;
        // padding: 16px 0;
      }
      .ant-table-thead > tr > th {
        font-weight: 700;
        color: #797c7f;
      }
    }
  }

  .ant-btn-danger {
    background-color: #f28955;
    border-color: #f28955;
  }

  /deep/.ant-table-tbody .ant-table-row-cell-break-word {
    background-color: #fff;
  }
  /deep/.ant-table-tbody > tr > td {
    padding: 16px;
  }
}
</style>
