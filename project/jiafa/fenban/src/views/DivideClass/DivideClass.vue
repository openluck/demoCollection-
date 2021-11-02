<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-04-27 09:44:53
-->
<template>
  <div class="container">
    <div class="bread">
      <span>智能分班&nbsp;/&nbsp;</span>
      <span>新高考分班</span>
    </div>
    <div class="divide-list">
      <!-- 标题 -->
      <div class="head-list">
        <p class="title">
          <a-icon @click="goBack" class="icon" type="left-circle" />{{ name }}
        </p>
        <a-button class="start-input btn-style" @click="startDivide()">
          <!-- <a-icon type="play-circle" />  -->
          <svg-icon class="fblist_ksfb" icon-class="fblist_ksfb"></svg-icon>
          开始分班
        </a-button>
      </div>
      <!-- 发布按钮等 -->
      <div class="head-ctrl">
        <div class="head-button">
          <a-button class="themeBtn btn-style" @click="startInput()">
            <!-- <a-icon type="play-circle" /> -->
            <svg-icon class="fblist_ksfb" icon-class="fblist_fabu"></svg-icon>
            发布
          </a-button>
          <a-button class="btn-style" @click="startExport()">
            <svg-icon class="fblist_ksfb" icon-class="fblist_daochu"></svg-icon>
            导出
          </a-button>
          <a-button class="btn-style" @click="goReport()">
            <svg-icon class="fblist_ksfb" icon-class="fblist_fadb"></svg-icon>
            方案对比
          </a-button>

          <a-popconfirm
            title="删除该分班方案后，数据不可恢复，请谨慎操作！"
            @confirm="() => allDel()"
          >
            <a-button class="btn-style">
              <svg-icon
                class="op_daoru"
                icon-class="xuanke_del"
                style="color: #929599"
              ></svg-icon>
              批量删除
            </a-button>
          </a-popconfirm>
        </div>
        <a-input-search
          placeholder="请输入分班方案编号"
          @search="onSearch"
          style="width: 330px"
        >
          <a-button slot="enterButton" class="themeBtn">搜索</a-button>
        </a-input-search>
      </div>
      <!-- 表格 -->
      <a-table
        class="app divide-class-list"
        :bordered="true"
        :scroll="{ y: 'calc(100vh - 370px)' }"
        :loading="loading"
        :rowKey="(row) => row.divideSchemId"
        :pagination="pagination"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="rowSelection"
      >
        <!-- 发布状态 -->
        <template slot="inputState" slot-scope="text">
          <div class="input-state">
            <div v-if="text" class="can-input">可发布</div>
            <div v-else class="no-finish">未完成</div>
          </div>
        </template>
        <!-- 发布结果 -->
        <template slot="inputResult" slot-scope="text">
          <div class="input-result">
            <div v-if="text" class="has-input">已发布</div>
            <div v-else class="no-input">未发布</div>
          </div>
        </template>
        <!-- 最后一次修改时间 -->
        <template slot="lastInputTime" slot-scope="text">
          <div class="last-input-time">
            {{ text }}
          </div>
        </template>
        <!-- 操作 -->
        <template slot="operate" slot-scope="text, record">
          <div class="divide-class">
            <div>
              <span
                v-if="record.inputState"
                class="report"
                @click="goReportOne(record)"
              >
                <svg-icon
                  class="fblist_ksfb"
                  icon-class="fblist_fabg"
                ></svg-icon>
                方案报告
              </span>
              <span v-else class="no-report">
                <svg-icon
                  class="fblist_ksfb"
                  icon-class="fblist_fabg"
                ></svg-icon>
                方案报告
              </span>
            </div>
            <div>
              <span
                v-if="record.inputResult && record.inputState"
                class="see-result"
                @click="seeResult(record)"
              >
                <svg-icon
                  class="fblist_ksfb"
                  icon-class="fblist_ckjg"
                ></svg-icon>
                查看结果
              </span>
              <span
                v-else
                class="has-dicide"
                style="cursor: pointer"
                @click="countineDivide(record.divideSchemId)"
              >
                <svg-icon
                  class="fblist_ksfb"
                  icon-class="fblist_ksfb"
                ></svg-icon>
                继续分班
              </span>
            </div>
          </div>
        </template>
      </a-table>
    </div>
    <!-- 检测分班是否完成，自动分班-> 弹框 -->
    <DetectionAndAuto ref="DetectionAndAuto" :planId="selectList[0]" />
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
// 表头
const columns = [
  {
    title: "分班方案编号",
    dataIndex: "divideSchemeNum",
    align: "left",
    width: 450,
  },
  {
    title: "状态",
    dataIndex: "inputState",
    scopedSlots: { customRender: "inputState" },
    align: "left",
  },
  {
    title: "发布结果",
    dataIndex: "inputResult",
    scopedSlots: { customRender: "inputResult" },
    align: "left",
  },
  {
    title: "最后一次修改时间",
    dataIndex: "lastInputTime",
    scopedSlots: { customRender: "lastInputTime" },
    align: "left",
  },
  {
    title: "操作",
    dataIndex: "operate",
    scopedSlots: { customRender: "operate" },
    align: "left",
    width: 200,
  },
];
import { downloadFile } from "../../Utils/util";
import DetectionAndAuto from "./childCom/DetectionAndAuto";
export default {
  name: "DivideClass",
  data() {
    return {
      dataSource: [], // 表格数据
      columns, // 表格头数据
      pagination: {
        // 表格分页
        current: 1,
        defaultPageSize: 10,
        showTotal: (total, range) =>
          `当前显示${range[0]}至${range[1]}条，共${total}条数据`, // 显示总数
        total: 0, //总条数
        size: "middle",
        onChange: this.onPageChange.bind(this), // 改变每页条数
      },
      loading: false,
      selectList: [], // 表格选择项
      selecNametList: [], // 选课名字
      selectRowsList: [], // 表格选择项
      planGroupId: "", // 分班方案id
      pageCurrent: 1, // 当前请求页数，从1开始
      pageSize: 10, // 每页数据条数
      searchValue: "", // 搜索参数
      name: this.$route.query.name, // 活动名字
    };
  },
  components: {
    DetectionAndAuto,
  },
  computed: {
    // 表格选项
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectList = selectedRows.map((item) => item.divideSchemId);
          this.selectRowsList = selectedRows;
          // 导出方案文件名
          this.selecNametList = selectedRows.map(
            (item) => item.divideSchemeNum
          );
        },
        selectedRowKeys: this.selectList,
      };
    },
    // 存分班方案列表第几页
    ...mapState("adminClass", ["divideClassPage"]),
  },
  mounted() {
    // 获取planGroupId
    this.planGroupId = this.$route.query.id;
    // 表格数据初始化
    // this.getDivideClassTable();
    this.onPageChange(this.divideClassPage);
  },
  methods: {
    /**
     * @name: 获取分班方案表格数据
     * @msg:
     * @param {*} searchValue 查询参数
     * @return {*}
     */
    async getDivideClassTable(searchValue) {
      this.loading = true;
      const data = {
        planGroupId: this.planGroupId,
        current: this.pageCurrent,
        pageSize: this.pageSize,
        divideSchemeNum: searchValue,
      };
      let res = await this.$api.getDivideClassList.getDivideSchemList(data);
      if (res.code === "200") {
        this.dataSource = res.data.list;
        this.pagination.total = res.data.pagination.total;
        this.selectList = [];
      } else {
        this.$message.warning(res.message, 5);
      }
      this.loading = false;
    },

    /**
     * @name: 分页
     * @msg:
     * @param {*} page 表格页数
     * @return {*}
     */
    ...mapMutations("adminClass", ["setdivideClassPage"]),
    onPageChange(page) {
      this.setdivideClassPage(page);
      this.pageCurrent = page;
      this.pagination.current = page;
      this.getDivideClassTable();
    },

    /**
     * @name: 搜索分班方案编号
     * @msg:
     * @param {*} searchValue 查询参数
     * @return {*}
     */
    onSearch(searchValue) {
      // if (searchValue === "") {
      //   this.$message.error("请输入分班方案编号");
      // } else if (!new RegExp(/^[0-9]*$/).test(parseInt(searchValue))) {
      //   this.$message.error("分班方案编号为数字");
      // }
      this.getDivideClassTable(searchValue);
    },

    /**
     * @name:  开始分班
     * @msg:
     * @param {*}
     * @return {*}
     */
    async startDivide() {
      let planGroupId = this.$route.query.id;
      let res = await this.$api.getDivideClassList.getAddPlan({ planGroupId });
      if (res.code === "200") {
        // const planId = res.data.planId;
        const {
          data: { planId },
        } = res;
        this.$store.commit("adminClass/setDivideclassType", "1");
        const { id, name } = this.$route.query;
        this.$router.push({
          path: "/SmartDivideClass",
          query: { id, name, planId },
        });
      } else {
        this.$message.error(res.message, 5);
      }
    },

    /**
     * @name: 继续分班
     * @msg:
     * @param {*} planId
     * @return {*}
     */
    countineDivide(planId) {
      const { id, name } = this.$route.query;
      this.$store.commit("adminClass/setDivideclassType", "1");
      this.$router.push({
        path: "/SmartDivideClass",
        query: { id, name, planId },
      });
    },

    /**
     * @name: 发布
     * @msg:
     * @param {*}
     * @return {*}
     */
    async startInput() {
      if (this.selectRowsList.length === 0) {
        this.$message.error("请选择需要发布的分班方案", 5);
      } else if (this.selectRowsList.length > 1) {
        this.$message.error("只能发布一个分班方案", 5);
      } else if (this.selectRowsList.length === 1) {
        if (this.selectRowsList[0].inputState) {
          // const res = await this.$api.getDivideClassList.inputDivideClass({
          //   divideSchemId: this.selectList[0],
          // });
          // if (res.code === "200") {
          //   this.$message.success("发布成功");
          //   this.getDivideClassTable();
          // }
          this.getSaveData();
        } else {
          this.$message.error("方案未完成", 5);
        }
      }
    },

    // 获取该分班方案下的选考和学考是否完成，冲突
    async getSaveData() {
      const res = await this.$api.adminClass.getSaveData({
        planId: this.selectList[0],
      });
      if (res.code === "200") {
        // 只检测选考完成1-提示弹窗
        if (res.data.accomplishState === "1") {
          this.$refs.DetectionAndAuto.showModal();
        } else {
          const res = await this.$api.getDivideClassList.inputDivideClass({
            divideSchemId: this.selectList[0],
          });
          if (res.code === "200") {
            this.$message.success("发布成功", 5);
            this.getDivideClassTable();
          }
        }
      } else {
        this.$message.warning(res.message, 5);
      }
    },

    /**
     * @name: 导出
     * @msg:
     * @param {*}
     * @return {*}
     */
    async startExport() {
      try {
        let selectListLength = this.selectList.length;
        if (selectListLength > 1) {
          this.$message.error("只能导出一个方案", 5);
        } else if (selectListLength === 0) {
          this.$message.error("请选择导出的方案", 5);
        } else {
          let data = {
            planId: this.selectList[0],
          };
          const res = await this.$api.getDivideClassList.OutputDivideSchem(
            data
          );
          let fileName = this.selecNametList[0] + "分班方案";
          downloadFile(res, fileName);
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * @name: 方案对比
     * @msg:
     * @param {*}
     * @return {*}
     */
    goReport() {
      let selectList = this.selectList.length;
      let inputState = this.selectRowsList.some(
        (item) => item.inputState === false
      );
      if (selectList === 0) {
        this.$message.error("请选择方案", 5);
      } else if (selectList > 3) {
        this.$message.error("选择的方案最多只能选3个", 5);
      } else if (inputState) {
        this.$message.error("有未完成的方案，请重新选择方案，进行对比", 5);
      } else {
        this.$router.push({
          path: "/SchemeCompare",
          query: {
            divideSchemeList: JSON.stringify(this.selectList),
            planGroupId: this.planGroupId,
          },
        });
      }
    },

    /**
     * @desc 删除分班方案编号
     */
    async allDel() {
      if (!this.selectRowsList.length) {
        this.$message.warning("请先选择需要删除的分班方案！", 5);
      } else {
        const list = this.selectRowsList;
        let planIds = [];
        list.map((item) => {
          planIds.push(item.divideSchemId);
        });
        const data = { planIds };
        const res = await this.$api.getDivideClassList.deleList(data);
        if (res.code === "200") {
          let page = 1;
          if (this.pagination.current === 1) {
            page = 1;
          } else {
            if (this.dataSource.length === this.selectRowsList.length) {
              page = this.pagination.current - 1;
            } else page = this.pagination.current;
          }
          this.pageCurrent = page;
          this.pagination.current = page;
          this.getDivideClassTable(this.searchValue);
        } else {
          this.$message.warning(res.message, 5);
        }
      }
    },

    /**
     * @name: 方案报告页面
     * @msg:
     * @param {*} record
     * @return {*}
     */
    goReportOne(record) {
      let { divideSchemId } = record;
      let arr = [];
      arr.push(divideSchemId);
      let newArr = JSON.stringify(arr);
      this.$router.push({
        path: "/SchemeCompare",
        query: {
          divideSchemeList: newArr,
          planGroupId: this.planGroupId,
        },
      });
    },

    /**
     * @name: 返回上一页
     * @msg:
     * @param {*}
     * @return {*}
     */
    goBack() {
      // this.$router.go(-1);
      this.$router.push("/PlanGroup");
    },

    /**
     * @name: 查看结果
     * @msg:
     * @param {*} record 选项
     * @return {*}
     */
    seeResult(record) {
      let { divideSchemId } = record;
      const { id, name } = this.$route.query;

      this.$router.push({
        path: "/ViewResult",
        query: {
          planId: divideSchemId,
          id,
          name,
        },
      });
    },
  },
};
</script> 

<style lang="less"  scoped>
.container {
  width: 100%;
  height: 100%;
  // overflow: hidden;

  .divide-list {
    padding: 10px 30px;
    box-sizing: border-box;
    background-color: #fff;
    margin-top: 10px;
    width: 100%;
    height: 96%;
    .head-list {
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 20px;
        .icon {
          margin-right: 8px;
        }
      }
      .start-input {
        background-color: #e09140;
        color: #fff;
      }
      .btn-style {
        margin-right: 7px;
        span {
          margin-left: 2px;
        }
      }
    }
    .head-ctrl {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .head-button {
        .btn-style {
          margin-right: 7px;
          span {
            margin-left: 2px;
          }
        }
      }
    }

    .divide-class-list {
      width: 100%;
      // height: calc(100% - 20%);
      // overflow-y: scroll;
      .input-state {
        .can-input {
          width: 75px;
          height: 25px;
          text-align: center;
          line-height: 25px;
          background-color: #d8f1e4;
          color: #72c89d;
          border-radius: 5px;
        }
        .no-finish {
          width: 75px;
          height: 25px;
          text-align: center;
          line-height: 25px;
          background-color: #f9e0e0;
          color: #fe6060;
          border-radius: 5px;
        }
      }
      .input-result {
        .has-input {
          color: #000;
        }
        .no-input {
          color: #ff7c7c;
        }
      }
      .divide-class {
        display: flex;
        justify-content: space-around;
        .report,
        .see-result {
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .no-report {
          // color: #eee;
          color: rgba(0, 0, 0, 0.35);
        }
      }
    }
  }
  .fblist_ksfb {
    width: 1em;
    height: 1em;
    margin-bottom: 1px;
    margin-right: 4px;
  }
  .op_daoru {
    width: 1em;
    height: 1em;
    margin-bottom: 1px;
    margin-right: 4px;
  }
}
</style>