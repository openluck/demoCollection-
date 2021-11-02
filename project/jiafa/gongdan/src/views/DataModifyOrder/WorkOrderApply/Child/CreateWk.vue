<template>
  <div class="create-wk">
    <a-modal class="create-wk-modal" v-model="visible" title="添加工单" :destroyOnClose="true" >
      <template slot="footer">
        <div class="footer">
          <a-button key="submit" type="primary" @click="handleOk">
            <a-icon type="check" />确定
          </a-button>
          <a-button key="back" @click="handleCancel"> <a-icon type="close" />取消 </a-button>
        </div>
      </template>
      <div class="info">
        <div class="title">
          即将添加工单编号为
          <span v-if="newWkId" style="margin-left:10px;">{{ newWkId }}</span>
          的工单，请确定是否添加？
        </div>
        
        <a-spin v-if="!newWkId" style="margin-left:10px;">
          <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
        </a-spin>
      </div>
      <!-- <div class="remarks">
        <label for="remarks">工单备注：</label>
        <a-textarea
          v-model="remarks"
          id="remarks"
          placeholder="请输入工单备注"
          :auto-size="{ minRows: 4, maxRows: 4 }"
        />
      </div> -->
    </a-modal>
  </div>
</template>
 
<script>
/**
 * @description 发起新建工单
 * @date 2020-12-9 13:45:34
 */
export default {
  name: "CreateWk",
  components: {},
  data() {
    return {
      wkId: "",
      visible: false,
      newWkId:null  //新建的工单号
    };
  },
  computed: {},
  mounted() {},
  methods: {
    showModal() {
      this.visible = true;
      this.getNewWorkOrder();
    },
    // 新建
    handleOk() {
      // 调用接口
      if(!this.newWkId){
        this.$message.warn("工单号不可为空！")
        return
      }
      this.createWorkOrder();
      this.visible = false;
    },
    // 取消
    handleCancel() {
      this.visible = false;
    },
    // 获取新建工单号
    async getNewWorkOrder(){
      try {
        const res = await this.$api.WorkOrderApply.getNewWorkOrder({});
        if (res.code === "200") {
          this.newWkId = res.data.wkId;
        } else {
          this.$message.error("获取工单号失败！" + res.message);
        }
      } catch (error) {
        // console.error(error);
      }
    },
    // 新建工单
    async createWorkOrder(){
      const wkId = this.newWkId;
      try {
        const res = await this.$api.WorkOrderApply.createWorkOrder({wkId});
        if (res.code === "200") {
          this.$message.success("添加成功！");
          // 新建工单成功后调用一下工单列表接口
          this.$emit("getWorkOrderList");

          // wkId 为工单号 '2021012501028'
          // id 为工单id '92bfc04e7861646ab911b0d7e2e1884b'
          // 所有与工单操作有关的都需要 id 
          // 需求：新建工单成功之后，直接跳转至录入界面
          const id = res.data.id;
          sessionStorage.setItem("examineePageType", "add");
          sessionStorage.setItem("wkPageType", "edit");
          console.log('examineePageType', sessionStorage.getItem('examineePageType'));
          sessionStorage.setItem("id", id);
          this.$router.push({
            path: "/WorkOrderApply/ExamineeAlterAndCheck",
          });
        } else {
          this.$message.error("获取工单号失败！" + res.message);
        }
      } catch (error) {
        // console.error(error);
      }
    }
  },
};
</script>
 
<style scoped lang="less">
.create-wk-modal {
  .info{
    text-align: center;
    font-size: 16px;
  }
  .remarks{
    margin-top: 20px;
    display: flex;
    align-items: flex-start;
    textarea{
      width: 350px;
      margin-left: 20px;
    }
  }
  /deep/.ant-modal-footer {
    border: 0;
    .footer{
      display: flex;
      justify-content: space-evenly;
      padding: 0 60px;
      &>button{
        width: 140px;
      }
    }
    padding-bottom: 20px;
    .ant-btn:first-child{
      // margin-right: 20px;
    }
  }
}
.create-wk {

}
</style>