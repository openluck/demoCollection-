<!--
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-07-21 15:31:47
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-30 15:01:27
-->
<template>
  <div
    class="yqy-lesSort-setting"
    ref="yqy-lesSort-setting"
  >
    <h3 class="title">节次设置</h3>
    <div class="filter">
      <a-select
        style="width: 120px"
        v-model="secId"
        :options="secList"
        @change="changeCurSec"
      >
      </a-select>
      <div class="button-box">
        <a-button
          type="primary"
          @click="toAdd"
        >
          <svg-icon
            icon-class="com_add"
            style="width:14px;margin-right: 8px"
          />创建节次方案
        </a-button>

      </div>
    </div>

    <a-table
      class="table"
      :columns="columns"
      :data-source="lesSortPlanList"
      :rowKey="(row) => row.lesSortPlanId"
      :pagination="false"
      :loading='tableLoading'
    >
      <template v-slot:timePlanTypeName="text">
        <span>{{text?text:"--"}}</span>
      </template>
      <template v-slot:actions="text,row">
        <div class="actions-box">
          <a-button
            v-if="row.enable === '1'"
            type="link"
            @click="toEdit(row)"
          >
            <svg-icon icon-class="com_edit" />
            编辑
          </a-button>
          <a-button
            v-if="row.enable === '1'"
            type="link"
            @click="setTime(row)"
          >
            <svg-icon icon-class="lesSort_time" />
            设置时间
          </a-button>
          <a-button
            v-if="row.enable === '0'"
            type="link"
            @click="setTime(row)"
          >
            <svg-icon icon-class="lesSort_time" />
            查看时间
          </a-button>
          <a-button
            type="link"
            @click="previewPlan(row.lesSortPlanId)"
          >
            <svg-icon
              icon-class="lesSort_eye"
              style="fontSize:14px"
            />

            <!-- <a-icon type="eye" style="fontWeigth:700;fontSize:14px"/> -->
            预览
          </a-button>
          <a-button
            v-if="row.enable === '1'"
            type="link"
            @click="delPlan(row)"
          >
            <svg-icon icon-class="com_delete" />
            删除
          </a-button>
        </div>

      </template>
    </a-table>
  </div>
</template>
<script>

const columns = [
  {
    title: '节次方案名称',
    dataIndex: 'lesSortPlanName',
    ellipsis: true,
    key: 'lesSortPlanName'
  },
  {
    title: '节次时间方案使用维度',
    dataIndex: 'timePlanTypeName',
    key: 'timePlanTypeName',
    scopedSlots: { customRender: 'timePlanTypeName' }

  },
  {
    title: '更新时间',
    dataIndex: 'updateDate',
    key: 'updateDate'
  },
  {
    title: '操作',
    key: 'actions',
    width: 392,
    scopedSlots: { customRender: 'actions' }
  }
];
export default {
  components: {},
  data() {
    return {
      columns,
      lesSortPlanList: [],
      tableLoading: false,
      secId: null,
      secList: []
    };
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.secList = sessionStorage.getItem('secList') ? JSON.parse(sessionStorage.getItem('secList')).map(i => ({ ...i, value: i.secId, label: i.secName })) : [];

    const secId = this.$store.state.lesSort.curSec.secId
    if (secId) {
      this.secId = secId
    } else {
      this.secId = this.secList[0].value;
      this.$store.commit('lesSort/changeCurSec', { secId: this.secList[0].value, secName: this.secList[0].label })
    }

    this.getLesSortPlanList({ secId: this.secId })
  },
  updated() {
    // console.log("updated");
  },

  methods: {
    toPage(url) {
      this.$router.push(url)
    },
    toAdd() {
      this.$store.commit('lesSort/changeLesSortPlanId', null)
      this.$store.commit('lesSort/changeTempLesSortPlanName', '')
      this.$store.commit('lesSort/changeTempDiffNoonRangeList', [])
      this.toPage('/LesSortManage/EditLesSortItem')
    },
    toEdit({ lesSortPlanId, lesSortPlanName }) {
      this.$store.commit('lesSort/changeLesSortPlanId', lesSortPlanId)
      this.$store.commit('lesSort/changeTempLesSortPlanName', lesSortPlanName)
      this.toPage('/LesSortManage/EditLesSortItem')
    },
    changeCurSec(value, option) {
      // console.log("inin123", option);
      this.$store.commit('lesSort/changeCurSec', { secId: value, secName: option.componentOptions.children[0].text })
      this.getLesSortPlanList({ secId: this.secId })
    },

    setTime(row) {
      // console.log();
      this.$store.commit('lesSort/changeLesSortPlanId', row.lesSortPlanId)
      this.$store.commit('lesSort/changeTimePlanType', row.timePlanType)
      this.toPage('/LesSortManage/TimePlan')
    },
    previewPlan(lesSortPlanId) {
      this.$store.commit('lesSort/changeLesSortPlanId', lesSortPlanId)
      this.toPage('/LesSortManage/PreviewLesSortPlan')
    },

    delPlan({ lesSortPlanId }) {
      const { secId } = this;
      this.$confirm({
        title: "确定删除该节次方案吗？",
        content: "删除节次方案后对应的课表（包含历史课表）也将被删",
        icon: () => <svg-icon class="anticon" icon-class="com_warn" style="fontSize:20px" />,
        onOk: async () => {
          const res = await this.delLesSortPlan({ lesSortPlanId, secId })
          if (res) {
            this.getLesSortPlanList({ secId: this.secId })
          }
        }
      })
    },


    //获取节次方案列表
    async getLesSortPlanList(data) {
      this.tableLoading = true
      try {
        const res = await this.$api.lesSortSetting.getLesSortPlanList(data);
        if (res.code === "200" && res.result) {
          if (res.data) {
            this.lesSortPlanList = res.data;
            this.$store.commit('lesSort/changeLesSortPlanList', res.data)
          }
        } else {
          this.lesSortPlanList = [];
          this.$message.warn(res.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.tableLoading = false;
      }
    },

    //删除节次方案
    async delLesSortPlan(data) {
      try {
        const res = await this.$api.lesSortSetting.delLesSortPlan(data);
        if (res.code === "200" && res.result) {
          this.$message.success("删除成功")
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
};
</script>

<style scoped lang="less">
.yqy-lesSort-setting {
  padding: 24px;
  height: 100%;
  .title {
    margin: 0;
    padding: 0;
    font-size: 18px;
    color: #303233;
    margin-bottom: 18px;
    line-height: 16px;
  }

  .filter {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    .button-box {
      .ant-btn + .ant-btn {
        margin-left: 16px;
      }
    }
  }

  .table {
    .svg-icon {
      font-size: 12px;
      margin-right: 6px;
    }
    .actions-box {
      width: 360px;
      text-align: center;
    }
    .ant-btn-link {
      color: #797c7f;
      &:hover {
        color: @primary-color;
      }
    }
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
    /deep/.ant-table-thead .ant-table-row-cell-last {
      padding-left: 40px;
    }
  }

  .ant-btn-danger {
    background-color: #f28955;
    border-color: #f28955;
  }

  .ant-btn + .ant-btn {
    margin: 0;
  }

  /deep/.ant-table-thead > tr > th,
  /deep/.ant-table-tbody > tr > td {
    padding: 16px;
  }

  /deep/.ant-table-tbody .ant-table-row-cell-break-word {
    background-color: #fff;
  }
}
</style>
