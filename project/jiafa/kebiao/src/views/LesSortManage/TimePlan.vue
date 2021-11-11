<!--
 * @Descripttion: 时间方案列表页面
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-10 14:18:50
 * @LastEditors: YanQY
 * @LastEditTime: 2021-10-18 11:16:24
-->
<template>
  <div class="yqy-time-plan">
    <header class="back common-title">
      <div class="back-left">
        <!-- <a-icon type="left-circle" style="fontSize:22px;color:#929599;margin-right:10px"/> -->
        <svg-icon
          icon-class="lesSort_back"
          style="fontSize:22px;margin-right: 10px;vertical-align: middle"
          @click.native="toPage('/LesSortManage/lesSortSetting')"
        >
        </svg-icon>
        <span>{{curSec.secName}}学段</span>
      </div>
    </header>

    <template v-if="timePlanType">
      <div class="title">
        <span class="bold">{{returnTimePlanName(timePlanType)}}</span>设置节次时间方案
        <a-button
          v-if="enable==='1'"
          type="link"
          @click="reset"
        >
          <svg-icon
            icon-class="lesSort_reset"
            style="width:14px;margin-right: 8px"
          />重新设置
        </a-button>
        <a-button
          v-if="enable==='1'"
          type="primary"
          @click="addPlan"
          style="float:right"
        >
          <svg-icon
            icon-class="com_add"
            style="width:14px;margin-right: 8px"
          />
          创建节次时间方案
        </a-button>
      </div>

      <a-table
        class="table"
        :columns="columns"
        :data-source="timePlanList"
        :pagination="false"
        :loading="tableLoading"
        :rowKey="r=>r.timePlanId"
      >
        <template #planStatus="text">
          <span
            class="cus-tag red"
            v-if="text==='0'"
          >未发布</span>
          <span
            class="cus-tag  green"
            v-if="text==='1'"
          >已发布</span>
        </template>
        <template #timeRange="text,row">
          <span>{{ row.startDate +"~"+row.endDate}}</span>
        </template>
        <template #action="text,row">
          <div class="btn-box">
            <a-button
              type="link"
              @click="getPlan(row.timePlanId)"
            >
              <svg-icon
                icon-class="com_detail"
                style="width:14px;margin-right: 8px"
              />详情
            </a-button>
            <a-button
              v-if="enable==='1'"
              type="link"
              @click="editPlan(row.timePlanId)"
            >
              <svg-icon
                icon-class="com_edit"
                style="width:14px;margin-right: 8px"
              />
              编辑
            </a-button>
            <a-button
              v-if="enable==='1'"
              type="link"
              @click="delPlan(row.timePlanId)"
            >
              <svg-icon
                icon-class="com_delete"
                style="width:14px;margin-right: 8px"
              />删除
            </a-button>
          </div>
        </template>
      </a-table>
    </template>
    <template v-else>
      <div class="select-type">
        <p class="text">请选择方案应用维度</p>
        <div class="box">
          <div
            class="box-item"
            v-for="i in timePlanTypeList"
            :key="i.value"
            @click="clickItem(i.value)"
          >
            <img
              :src="require(`../../assets/img/按${i.name}.png`)"
              alt="i.name"
            >
            <span class="type-text">按{{i.name}}</span>
            <span class="gray-text">设置节次时间方案</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
 
<script>
const columns = [
  {
    dataIndex: 'timePlanName',
    key: 'timePlanName',
    title: '节次时间方案名称',
    width: 185,
    ellipsis: true
  },
  {
    key: 'timeRange',
    title: '重复周期',
    scopedSlots: { customRender: 'timeRange' },
    width: 210,
    ellipsis: true
  },
  {
    dataIndex: 'applyNameList',
    key: 'applyNameList',
    title: '应用对象',
    ellipsis: true

  },
  {
    title: '操作',
    key: 'action',
    width: 292,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: '',
  components: {},
  data() {
    return {
      columns,
      timePlanList: [],
      enable: "0",
      tableLoading: false
      // lesSortPlanId: null,
    }
  },
  computed: {
    curSec() {
      return this.$store.state.lesSort.curSec;
    },
    lesSortPlanId() {
      return this.$store.state.lesSort.lesSortPlanId;
    },
    timePlanTypeList() {
      return this.$store.state.lesSort.timePlanTypeList;
    },
    timePlanType() {
      return this.$store.state.lesSort.timePlanType
    }
  },
  created() {
    // this.timePlanType = this.$store.state.lesSort.timePlanType
    // console.log("timePlanType", this.timePlanType);
  },
  mounted() {
    this.getTimePlanList({ secId: this.curSec.secId, lesSortPlanId: this.lesSortPlanId });
  },
  methods: {
    toPage(url) {
      this.$router.push(url)
    },
    returnTimePlanName(type) {
      for (const item of this.timePlanTypeList) {
        if (item.value === type) {
          return item.imgName
        }
      }
      return "--"
    },
    async reset() {
      this.$confirm({
        title: "重新设置需清空现有节次时间方案并删除对应使用的课表，确认重新设置吗？",
        icon: () => <svg-icon class="anticon" icon-class="com_warn" style="fontSize:20px;cursor: default" />,
        onOk: async () => {
          const result = await this.resetTimePlanList({ secId: this.curSec.secId, lesSortPlanId: this.lesSortPlanId })
          if (result) {
            this.$store.commit('lesSort/changeTimePlanType', null)
          }
        }
      })
    },
    addPlan() {
      this.$store.commit('lesSort/changeTimePlanId', null)
      this.$store.commit('lesSort/changeDis', 't')
      this.toPage("/LesSortManage/EditTimePlan")
    },
    getPlan(timePlanId) {
      this.$store.commit('lesSort/changeTimePlanId', timePlanId)
      // this.$store.commit('lesSort/changeDis', 't')
      this.$store.commit('lesSort/changeDis', null)
      this.toPage("/LesSortManage/EditTimePlan")

      // this.$router.push(`/LesSortManage/EditTimePlan?timePlanId=${timePlanId}`)
    },
    editPlan(timePlanId) {
      this.$store.commit('lesSort/changeTimePlanId', timePlanId)
      this.$store.commit('lesSort/changeDis', 't')
      this.toPage("/LesSortManage/EditTimePlan")

      // this.$router.push(`/LesSortManage/EditTimePlan?timePlanId=${timePlanId}&dis=t`)
    },
    delPlan(timePlanId) {
      this.$confirm({
        title: "删除节次时间方案后对应课表将被删除，确认继续删除吗？",
        icon: () => <svg-icon class="anticon" icon-class="com_warn" style="fontSize:20px;cursor: default" />,
        onOk: async () => {
          const res = await this.delTimePlan({ timePlanId })
          console.log("resres", res);
          if (res) {
            this.getTimePlanList({ secId: this.curSec.secId, lesSortPlanId: this.lesSortPlanId });
          }
        }
      })
    },

    async clickItem(timePlanType) {
      if (this.enable === '0') {
        return this.$warning({
          title: "非当前使用的节次方案，不能进行节次时间方案编辑管理"
        })
      }
      const result = await this.setTimePlanDimension({
        secId: this.curSec.secId,
        lesSortPlanId: this.lesSortPlanId,
        timePlanType
      })
      if (result) { //去新增时间方案页面
        this.$store.commit('lesSort/changeTimePlanType', timePlanType)
        this.$store.commit('lesSort/changeTimePlanId', null)
        this.$store.commit('lesSort/changeDis', 't')
        this.toPage("/LesSortManage/EditTimePlan")
      }
    },

    formatDate(str) {
      if (str) {
        const arr = str.split('-')
        arr.shift();
        return arr.join('-')
      } else {
        return '--/--'
      }
    },

    //0813-节次设置-获取时间方案列表
    async getTimePlanList(data) {
      this.tableLoading = true;
      try {
        const res = await this.$api.timePlan.getTimePlanList(data);
        if (res.code === "200" && res.result) {
          this.enable = res.data.enable
          this.timePlanList = res.data.list
          this.$store.commit('lesSort/changeTimePlanList', res.data.list)
        } else {
          this.timePlanList = []
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.tableLoading = false;
      }
    },

    //0813-节次设置-重置时间方案列表
    async resetTimePlanList(data) {
      try {
        const res = await this.$api.timePlan.resetTimePlanList(data);
        if (res.code === "200" && res.result) {
          this.$message.success("重置成功")
          return true
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // this.tableLoading = false;
      }
    },

    /* 删除节次时间方案 */
    async delTimePlan(data) {
      try {
        const res = await this.$api.timePlan.delTimePlan(data);
        if (res.code === "200" && res.result) {
          this.$message.success('删除成功')
          return true
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // this.tableLoading = false;
      }
    },
    /* 设置时间方案维度 */
    async setTimePlanDimension(data) {
      try {
        const res = await this.$api.timePlan.setTimePlanDimension(data);
        if (res.code === "200" && res.result) {
          this.$message.success('设置成功')
          return true
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // this.tableLoading = false;
      }
    }
  }
}
</script>
 
<style scoped lang = "less">
.yqy-time-plan {
  .back {
    height: 56px;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6e8eb;
    .back-left {
      span {
        color: #303233;
        font-size: 18px;
        vertical-align: middle;
      }
    }
  }
  .title {
    margin-top: 24px;
    padding: 0 24px;
    font-size: 16px;
    color: #494b4d;
    .bold {
      font-weight: bold;
    }
  }
  .table {
    padding: 24px;

    .cus-tag {
      display: inline-block;
      width: 64px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 4px;
    }
    .green {
      color: #56bf8b;
      background-color: #e2f9ed;
      border: 1px solid #c1f3d9;
    }
    .red {
      color: #fe7272;
      background-color: #ffecec;
      border: 1px solid #fed6d6;
    }
    .btn-box {
      width: 260px;
      .ant-btn {
        color: #797c7f;
        &:hover {
          color: @primary-color;
        }
      }
    }
    /deep/.ant-table-thead > tr > th {
      padding: 16px;
    }
    /deep/.ant-table-tbody > tr > td {
      padding: 16px;
      /* padding-left: 0; */
    }
    .ant-btn + .ant-btn {
      margin-left: 0;
    }
    /deep/.ant-table-tbody .ant-table-row-cell-break-word {
      background-color: #fff;
    }
    /deep/.ant-table-tbody > .ant-table-row > td:nth-child(3) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/.ant-table-thead .ant-table-row-cell-last {
      padding-left: 32px;
    }
  }

  .select-type {
    width: max-content;
    margin: 0 auto;
    .text {
      margin-top: 54px;
      margin-bottom: 26px;
      text-align: center;
      color: #303233;
      font-size: 20px;
    }
    .box {
      display: flex;
      width: 960px;
      margin: auto;
    }
    .box-item {
      display: flex;
      flex-direction: column;
      /* justify-content: space-between; */
      align-items: center;
      width: 280px;
      height: 240px;
      margin: 0 20px;
      padding: 32px;
      background: #ffffff;
      border: 1px solid #ebedf0;
      border-radius: 8px;
      box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      img {
        width: 90px;
        height: 90px;
      }
      .type-text {
        margin-top: 24px;
        margin-bottom: 16px;
        font-size: 20px;
        font-weight: 700;
        color: #303233;
      }
      .gray-text {
        color: #797c7f;
        font-size: 14px;
      }
    }
  }
}
</style>