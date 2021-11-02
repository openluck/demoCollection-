<!--
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-30 16:43:41
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-28 11:55:45
-->

<template>
  <div class="add-group">
    <a-modal
      title="新建行政班级"
      :width="760"
      :visible="addClassVisible"
      :destroyOnClose="true"
      @cancel="onClose"
      :confirmLoading="newConfirmLoading"
    >
      <div slot="footer">
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" @click="onAdd" :loading="addGLoading"
          >确定</a-button
        >
      </div>
      <div
        class="subject-wrap"
        :class="isStuList ? 'subject-wrap-isStuList' : 'subject-wrap-unStuList'"
      >
        <!-- 选择人员Item组件 -->
        <AddClassSubClass
          v-for="item in combinationList"
          :key="item.combinationId"
          :combination="item"
          @showChildrenDrawer="showChildrenDrawer"
          @handleInputValue="handleInputValue"
        />
      </div>

      <!-- 人员选择弹窗 -->
      <a-modal
        :width="1100"
        :closable="false"
        :visible="childrenDrawer"
        @ok="onCloseChild"
        @cancel="onChildrenDrawerClose"
        :maskClosable="false"
        :destroyOnClose="true"
        :keyboard="false"
      >
        <ChooseStu
          :combination="combination"
          :groupId="groupId"
          @handleChooseStuNum="handleChooseStuNum"
        />
      </a-modal>
      <!-- 冲突提示弹窗 -->
      <a-modal
        title="提示"
        :width="360"
        :closable="false"
        :visible="noticeVisble"
        @ok="noticeOk"
        @cancel="noticeCancel"
        :maskClosable="false"
        :destroyOnClose="true"
        :keyboard="false"
        :confirmLoading="noticeComfirmLoading"
      >
        <span style="margin-left: 20px"
          >{{ noticeContent }}！确定忽略冲突吗？</span
        >
      </a-modal>
    </a-modal>
  </div>
</template>

<script>
/**
 * @description 添加分组抽屉
 * @date 2021-4-1 13:28:49
 */
import AddClassSubClass from "@/components/divide/AddClassSubClass";
import ChooseStu from "./addClass/ChooseStu";
import { mapState } from "vuex";
export default {
  name: "AddGroup",
  components: { AddClassSubClass, ChooseStu },
  props: {
    combinationList: {
      type: Array,
      require: true,
      default: () => ({}),
    },
    groupId: {
      type: String,
      require: true,
      default: "",
    },
    addClassVisible: {
      type: Boolean,
      require: true,
      default: false,
    },
    adminClassId: {
      type: String,
      require: true,
      default: "",
    },
  },
  data() {
    return {
      childrenDrawer: false,
      combination: [],
      insertStu: 0,
      insertStuList: [],
      addGLoading: false,
      noticeVisble: false,
      noticeContent: "",
      noticeData: {},
      noticeComfirmLoading: false,
      newConfirmLoading: false,
    };
  },
  computed: {
    ...mapState("adminClass", ["isStuList"]),
  },
  mounted() {},
  updated() {},
  methods: {
    handleInputValue() {},
    showDrawer() {
      this.visible = true;
    },
    // 关闭弹窗
    onClose() {
      this.$emit("closeAddClassVisible");
    },
    // 添加行政班级确认按钮
    onAdd() {
      let comListCopy = JSON.parse(JSON.stringify(this.combinationList));
      let list = comListCopy.filter((item) => item.insertStu);
      list.map((item) => {
        item.personNum = item.insertStu;
        item.personList = item.insertStuList ? item.insertStuList : [];
        delete item.insertStu;
        delete item.insertStuList;
        delete item.combinationName;
        delete item.combinationNum;
      });
      let data = {
        havePersonList: this.$store.state.adminClass.isStuList,
        groupId: this.groupId,
        personList: list,
        classId: this.adminClassId,
      };
      if (list.length) {
        this.addAdminClass(data);
      } else {
        this.$message.error("请选择人员！", 5);
        // this.onClose()
      }
    },
    // 添加行政班级接口
    async addAdminClass(data) {
      this.addGLoading = true;
      this.newConfirmLoading = true;
      let res = await this.$api.adminClass.addAdminClass(data);
      if (res.code === "200") {
        this.$message.success(res.message, 5);
        this.onClose();
        this.$parent.getSaveData();
        this.$emit("getBaseClassData");
        this.addGLoading = false;
        this.newConfirmLoading = false;
      } else if (res.code === "201") {
        this.noticeContent = res.message;
        this.noticeVisble = true;
        this.noticeData = Object.assign({}, data);
      } else {
        this.$message.error(res.message, 5);
        this.addGLoading = false;
        this.newConfirmLoading = false;
      }
    },
    noticeCancel() {
      this.addGLoading = false;
      this.noticeVisble = false;
      this.noticeData = {};
      this.noticeContent = "";
    },
    noticeOk() {
      this.noticeComfirmLoading = true;
      let dataInType = { type: "1", ...this.noticeData };
      this.addAdminClass(dataInType);
      this.noticeVisble = false;
    },
    // 初始化insertStu
    reset() {
      this.insertStu = 0;
    },
    showChildrenDrawer(combination) {
      // this.reset();
      this.combination = combination;
      this.childrenDrawer = true;
    },
    onChildrenDrawerClose() {
      this.childrenDrawer = false;
    },
    // 人员选择确定事件
    onCloseChild() {
      this.childrenDrawer = false;
      this.mapCombinationList();
    },
    // 保存组合内选择了的人数，前端缓存。 子组件emit
    mapCombinationList() {
      const {
        combination: { combinationId },
        combinationList,
        insertStu,
        insertStuList,
      } = this;
      const obj = { combinationId, combinationList, insertStu, insertStuList };
      this.$emit("saveComListByChooseStuEvent", obj);
      // this.insertStuList = [];
      // 将上次选择的数据清除
      Object.assign(this, {
        combinationId: "",
        insertStu: "",
        insertStuList: [],
      });
    },
    // 接收ChooseStu子组件传递的选择人员的数据。
    handleChooseStuNum(data) {
      let type = Object.prototype.toString.call(data).slice(8, -1);
      // let type = typeof data;
      if (type === "Number") {
        this.insertStu = data;
      } else if (type === "String") {
        this.insertStu = 0;
      } else if (type === "Array") {
        this.insertStu = data.length;
        this.insertStuList = data;
      }
      // 进入的人数
      // type === "Number"
      //   ? (this.insertStu = data)
      //   : type === "Array" //选择的人员
      //   ? ((this.insertStu = data.length), (this.insertStuList = data))
      //   : "";
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-modal-body {
  padding: 24px 10px;
}
.subject-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.subject-wrap-isStuList {
  &::after {
    height: 0;
    width: 20%;
    content: "";
    min-width: 345px;
  }
}
.subject-wrap-unStuList {
  &::after {
    height: 0;
    width: 20%;
    content: "";
    min-width: 315px;
  }
}
</style>
