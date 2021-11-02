<!--
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-25 09:02:01
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-22 16:57:16
-->
<template>
  <div class="personal-list">
    <a-modal
      v-model="visible"
      :destroyOnClose="true"
      :closable="false"
      :width="630"
      :title="modalTitle"
    >
      <div slot="footer" style="text-align: center">
        <a-button style="margin-right: 16px" @click="handleCancel"
          >取消</a-button
        >
        <a-button
          :disabled="mergeClassList.length === 0"
          type="primary"
          @click="handleOk"
          >确定</a-button
        >
      </div>
      <div class="item-hb" v-if="mergeClassList.length">
        <div
          class="hb-teach"
          v-for="classItem in mergeClassList"
          :key="classItem.teachClassId"
          :style="{ borderLeft: `3px solid ${classItem.color}` }"
        >
          <div class="teach-left">
            <div class="teach-name">
              {{ classItem.teachClassName }}({{ classItem.personNum }}人)
            </div>
            <div class="teach-com">
              <div
                class="teach-com-item"
                v-for="comItem in classItem.combinationList"
                :key="comItem.combinationId"
              >
                {{ comItem.combinationName }}
              </div>
            </div>
            <!-- <div class="teach-num">
              <div
                class="teach-num-item"
                v-for="comItem in classItem.combinationList"
                :key="comItem.combinationId"
              >
                {{ comItem.personNum }}人
              </div>
            </div> -->
            <div class="teach-content">
              <div
                class="teach-content-item"
                v-for="comItem in classItem.combinationList"
                :key="comItem.combinationId"
              >
                <div class="item-num">
                  进入{{ $store.state.adminClass.teachClassName }}人数：
                  {{ comItem.insertNum || 0 }} 人
                  <a-divider type="vertical" />
                  <a @click="addPerson(classItem, comItem)">选择人员</a>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="teach-content">
            <div
              class="teach-content-item"
              v-for="comItem in classItem.combinationList"
              :key="comItem.combinationId"
            >
              <div class="item-num">
                出去搭班： {{ comItem.insertNum || 0 }} 人
                <a-divider type="vertical" />
                <a @click="addPerson(classItem, comItem)">选择人员</a>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <a-empty
        v-else
        style="margin-bottom: 20px"
        image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
        :image-style="{ height: '60px' }"
      >
        <span slot="description">暂无数据</span>
      </a-empty>
      <a-modal
        title="提示"
        :width="600"
        :closable="false"
        :visible="noticeVisble"
        @ok="noticeOk"
        @cancel="noticeCancel"
        :maskClosable="false"
        :destroyOnClose="true"
        :keyboard="false"
      >
        <div class="noticeContent">{{ noticeContent }}！确定忽略冲突吗？</div>
      </a-modal>
    </a-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      // visible: true,
      mergeClassList: [],
      inputDisabled: false,
      insertStu: 0,
      noticeVisble: false,
      noticeContent: "",
      noticeData: {},
      color: "green",
    };
  },
  computed: {
    visible() {
      return true;
    },
    modalTitle() {
      return `${this.$store.state.adminClass.teachClassName}可合并的班级列表`;
    },
    mergeClass() {
      return this.$store.state.adminClass.mergeClassList;
    },
  },
  watch: {
    mergeClass(val) {
      this.mergeClassList = this.mergeClass;
    },
  },
  created() {
    let data = this.$store.state.adminClass.mergeClassInfo;
    this.$store.dispatch("adminClass/getKHBTeachClassList", data).then(() => {
      this.mergeClassList = this.mergeClass;
    });
  },
  mounted() {},
  methods: {
    ...mapActions("adminClass", ["getSaveData"]),
    // 处理数据
    dealList(list, info) {
      const mergeClassList = this.mergeClassList.map((item) => {
        if (item.teachClassId === info.classId) {
          item.combinationList.map((comItem) => {
            if (comItem.combinationId === info.combinationId) {
              comItem.stuList = list;
              comItem.insertNum = comItem.stuList.length;
            }
            return comItem;
          });
        }
        return item;
      });
      this.$store.commit("adminClass/setMergeClassList", mergeClassList);
    },
    /**
     * @desc:处理选中项,合并为selectedList
     * @author: xutao
     * @param {*} classItem
     * @param {*} comItem
     * @return {*}
     */
    dealSelectedList() {
      let selectedList = [];
      this.mergeClassList.map((classItem) => {
        classItem.combinationList.map((comItem) => {
          if (comItem.stuList) {
            selectedList.push(...comItem.stuList);
          }
        });
      });
      return selectedList;
    },
    // 添加人员按钮
    addPerson(classItem, comItem) {
      // 处理当前组合已经选中的人员
      let selectedList = this.dealSelectedList();
      let comInfo = {
        combinationId: comItem.combinationId,
        list: selectedList,
      };
      this.$store.commit("adminClassCy/setStuSelectInMergeList", comInfo);
      //向人员选择弹窗传递数据，并打开弹窗
      const data = {
        classId: classItem.teachClassId,
        combinationId: comItem.combinationId,
        combinationName: comItem.combinationName,
        combinationNum: comItem.personNum,
        stuList: comItem.stuList ? [...comItem.stuList] : [],
      };
      this.$store.commit("adminClass/setStuListInMergeInfo", data);
      this.$store.commit("adminClass/setStuListInMergeStatus", true);
    },
    // 处理请求数据
    dealObj(a, b) {
      let obj = JSON.parse(a);
      obj.map((item) => {
        delete item.teachClassName;
        item.combinationList.map((comItem) => {
          delete comItem.combinationName;
          delete comItem.personNum;
        });
      });
      let list = { list: obj };
      let resData = Object.assign({}, JSON.parse(b), list);
      return resData;
    },
    // 模态框-确定
    handleOk() {
      let data = this.dealObj(
        JSON.stringify(this.mergeClassList),
        JSON.stringify(this.$store.state.adminClass.mergeClassInfo)
      );
      this.mergeTeachClass(data);
    },
    //合并班级接口
    mergeTeachClass(data) {
      this.$api.adminClass.mergeTeachClass(data).then((res) => {
        if (res.code === "200") {
          this.$store.commit("adminClass/setMergeClassModalStatus", false);
          this.$message.success("班级合并成功！", 5);
          this.$store.commit("adminClassCy/clearStuSelectInMergeList", []);
          const mergeClassList = [];
          this.$store.commit("adminClass/setMergeClassList", mergeClassList);
          // 刷新数据
          this.$emit("getBaseClassData");
          this.getSaveData();
        } else if (res.code === "201") {
          this.noticeData = Object.assign({}, data);
          this.noticeContent = res.message;
          this.noticeVisble = true;
        } else {
          console.log(res.message);
          // this.$message.error(res.message, 5);
        }
      });
    },
    // 模态框-取消事件
    handleCancel() {
      this.$store.commit("adminClass/setMergeClassModalStatus", false);
      const mergeClassList = [];
      this.$store.commit("adminClass/setMergeClassList", mergeClassList);
      this.$store.commit("adminClassCy/clearStuSelectInMergeList", []);
    },
    //提示取消
    noticeCancel() {
      this.noticeVisble = false;
      this.noticeData = {};
      this.noticeContent = "";
    },
    // 提示确认
    noticeOk() {
      let dataInType = { type: "1", ...this.noticeData };
      this.mergeTeachClass(dataInType);
      this.noticeVisble = false;
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-modal-body {
  padding: 20px 20px 0 20px;
}
/deep/.ant-modal-footer {
  // text-align: center;
}
/deep/.ant-input-number {
  width: 75px;
}
/deep/.ant-input {
  width: 75px;
}
.noticeContent {
  max-height: 450px;
  overflow-y: auto;
  margin: 0 16px 16px 16px;
}
.item-hb {
  max-height: 500px;
  overflow-y: auto;
  // width: 450px;
  padding: 2px;
  display: flex;
  flex-direction: column;
  .hb-teach {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 16px;
    .teach-left {
      width: 95%;
      border: 1px solid #d4d6d9;
      border-radius: 3%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      text-align: center;

      .teach-name {
        height: 100%;
        width: 140px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-right: 1px solid #d4d6d9;
      }
      .teach-num-item {
        height: 60px;
        line-height: 60px;
        width: 85px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        text-align: center;
        border-bottom: 1px solid #d4d6d9;
        &:last-child {
          border: none;
        }
      }
      .teach-com-item {
        height: 60px;
        line-height: 60px;
        width: 120px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        text-align: center;
        border-bottom: 1px solid #d4d6d9;
        // border-right: 1px solid #d4d6d9;
        &:last-child {
          border-bottom: none;
        }
      }
      .teach-content-item {
        height: 60px;
        line-height: 60px;
        width: 270px;
        // display: flex;
        // flex-direction: row;
        // justify-content: space-around;
        text-align: center;
        border-bottom: 1px solid #d4d6d9;
        &:last-child {
          border-bottom: none;
        }
        .item-num {
          width: 270px;
        }
      }
    }
    // .teach-content {
    //   border: 1px solid #d4d6d9;
    //   border-radius: 3%;
    //   margin-left: 5px;
    //   margin-right: 16px;
    //   .teach-content-item {
    //     height: 60px;
    //     line-height: 60px;
    //     width: 210px;
    //     display: flex;
    //     flex-direction: row;
    //     justify-content: space-around;
    //     text-align: center;
    //     border-bottom: 1px solid #d4d6d9;
    //     &:last-child {
    //       border-bottom: none;
    //     }
    //     .item-num {
    //       width: 210px;
    //     }
    //   }
    // }
  }
}
</style>
