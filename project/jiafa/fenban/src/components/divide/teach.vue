<template>
  <div class="teach">
    <!-- class="item-teach" -->
    <div
      :class="
        teachClass.isShowColor ? 'item-teach item-teachHigh' : 'item-teach'
      "
      :style="teachClass.isInScopeOfTeach ? borderStyle : ''"
    >
      <!-- <div
        class="backTop"
        v-if="giveColorAll === 'chTeachClassList' && !teachClass.isShowColor"
      ></div> -->
      <div class="teach-left" :class="teachClass.isMerge ? 'gray' : ''">
        <!-- :style="colorCom" -->
        <div
          v-if="!teachClass.isMerge"
          class="label2"
          @click="handleOpenSettingColor"
          :style="{ backgroundColor: `${teachClass.color}` }"
        ></div>
        <div @click="filterTeachClass">{{ teachClass.teachClassName }}</div>
      </div>
      <div class="teach-center">
        {{ teachClass.teachClassNum }}人{{teachClass.insertClassNum > 0? `/ ${teachClass.insertClassNum} 人`: ""}}
      </div>
      <div class="teach-right">
        <a
          v-if="!teachClass.isMerge"
          @click="mergeClass(teachClass.teachClassName)"
          :class="teachClass.teachClassNum === 0 ? 'nodb': ''"
          >搭班设置</a
        >
        <a-popconfirm
          v-else
          title="你确定要取消该班级合并吗？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="cancelMergeClass"
        >
          <a>取消合并</a>
        </a-popconfirm>

        <a-divider type="vertical" v-if="isStuList" />
        <a @click="viewTeachList(teachClass.isMerge)" v-if="isStuList">查看</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
/**
 * teachClass
 *      isMerge:是否被搭班出去：true被搭班出去 false未
 *      isShowColor：是否进行选中高亮：true高亮 false未
 */
export default {
  name: "",
  components: {},
  props: ["teachClass", "adminClassInfo", "adminClassId", "giveColor"],
  inject: ["getBaseClassData", "markClass"],
  data() {
    return {
      visible: false,
      giveColorAll: "",
      borderStyle: {
        border: "1px dashed red"
      }
    };
  },
  computed: {
    ...mapState("adminClass", ["isStuList", "divideclassType"]),
    colorCom() {
      let color = {};
      // console.log(this.giveColor, "wnag");
      if (this.teachClass.isShowColor) {
        color = {
          border: `1px solid ${this.teachClass.markColor}`,
          backgroundColor: `${this.teachClass.markBgColor}`
        };
      }
      return color;
    }
  },
  watch: {
    giveColor() {
      this.giveColorAll = this.giveColor;
    }
  },
  mounted() {},
  methods: {
    ...mapActions("adminClass", ["getSaveData"]),
    ...mapMutations("adminClass", ["setSettingColorModalVisble"]),
    // 打开颜色选择弹窗
    // 点击设置颜色modal
    handleOpenSettingColor() {
      const parameter = {
        visible: true,
        params: {
          groupId: "",
          teachClassId: this.teachClass.teachClassId,
          curColor: this.teachClass.color
        }
      };
      this.setSettingColorModalVisble(parameter);
    },
    // 过滤教学班
    filterTeachClass() {
      let name = this.teachClass.teachClassName.substring(0, 2);
      if (!this.teachClass.isMerge) {
        this.markClass(name);
      }
    },
    // 查看 班级人员列表
    viewTeachList(isMerge) {
      if (isMerge) {
        // 查看 是合并班级的人员列表
        this.teachClass = Object.assign(this.teachClass, {
          adminClassId: this.adminClassId
        });
        this.$store.commit("adminClass/setStudyPersonListStatus", true);
        this.$store.commit(
          "adminClass/setStudyTeachClassData",
          this.teachClass
        );
      } else {
        // 查看 没有合并班级的人员列表
        this.$store.commit("adminClass/setTeachPersonModalStatus", true);
        this.$store.commit("adminClass/setTeachClassData", this.teachClass);
      }
    },
    // 合并班级事件
    mergeClass(teachClassName) {
      if(this.teachClass.teachClassNum !== 0) {
        this.$store.commit("adminClass/setMergeClassModalStatus", true);
      let data = {
        classId: this.teachClass.teachClassId
        // classId: this.adminClassInfo.adminClassId,
      };
      this.$store.commit("adminClass/setMergeClassInfo", data);
      this.$store.commit("adminClass/setTeachClassName", teachClassName);
      }
    },
    // 取消合并
    async cancelMergeClass() {
      let data = {
        teachClassId: this.teachClass.teachClassId,
        adminClassId: this.adminClassInfo.adminClassId
      };
      let res = await this.$api.adminClass.cancelMergeTeachClass(data);
      if (res.code === "200") {
        this.$message.success(res.message,5);
        // 查询刷新
        this.getBaseClassData();
        this.getSaveData();
      } else {
        this.$message.error(res.message,5);
      }
    }
  }
};
</script>

<style scoped lang="less">
.gray {
  background-color: #aaaaaa !important;
  // color: white;
}
.teach {
  .item-teach {
    position: relative;
    display: flex;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin: 16px 16px 0 0;
    .teach-left {
      width: 100px;
      border: 1px solid #e3e5e6;
      border-right: none;
      border-radius: 5% 0 0 5%;
      background-color: #f7f9fa;
      display: flex;
      justify-content: center;
      position: relative;
      .label2 {
        height: 10px;
        width: 10px;
        line-height: 20px;
        border-radius: 50%;
        background-color: white;
        border: 1px solid #ccc;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
      }
      .label {
        font-size: 8px;
        line-height: 20px;
        // background:orange;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        text-indent: 0;
        width: 0;
        border-top: 20px solid rgb(223, 71, 71);
        border-right: 20px solid transparent;
      }
    }
    .teach-center {
      // width: 65px;
      width: 95px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      border: 1px solid #e3e5e6;
      border-right: none;
    }
    .teach-right {
      width: 130px;
      border: 1px solid #e3e5e6;
      span {
        color: #1ba4b3;
      }
      .hb {
        width: 300px;
        height: 300px;
        border: 1px solid #1ba4b3;
      }
    }
    .backTop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #0000004a;
      + .teach-left {
        background-color: #0000004a;
        border-color: #a1a3a3;
      }
    }
  }
  .item-teachHigh {
    border: 1px solid rgb(242, 121, 121);
    background-color: rgba(242, 121, 121, 0.1);
    .teach-left {
      background-color: rgba(242, 121, 121, 0.1);
    }
  }
  // .item-teachGray {
  //   border: 1px solid #d4d4d4;
  //   background-color: #8282822b;
  //   .teach-left {
  //     background-color: #f3d2d22b;
  //   }
  // }
  .nodb {
    color: #aaaaaa;
  }
}
</style>
