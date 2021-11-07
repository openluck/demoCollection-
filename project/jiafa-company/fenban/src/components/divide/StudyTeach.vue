<template>
  <div class="teach">
    <!-- class="item-teach" -->
    <div
      :class="
        teachClass.isShowColor ? 'item-teach item-teachHigh' : 'item-teach'
      "
      :style="teachClass.isInScopeOfTeach ? borderStyle : ''"
    >
      <div class="teach-left" :class="garyBg ? 'gray' : ''" :style="techStyle">
        <div
          v-if="!teachClass.isMerge && !noSetColor"
          class="label2"
          @click="handleOpenSettingColor"
          :style="{ backgroundColor: `${teachClass.color}` }"
        ></div>
        <div @click="filterTeachClass">{{ teachClass.teachClassName }}</div>
      </div>
      <div
        class="teach-center"
        :class="garyBg ? 'gray' : ''"
        :style="
          teachClass.isMerge ? 'background-color: #aaaaaa !important;' : ''
        "
      >
        {{ teachClass.teachClassNum }}人{{
          teachClass.insertClassNum > 0
            ? `/ ${teachClass.insertClassNum} 人`
            : ""
        }}
      </div>

      <div class="teach-right" v-if="study">
        <a
          v-if="!teachClass.isMerge"
          @click="mergeClass(teachClass.teachClassName)"
          :class="teachClass.teachClassNum === 0 ? 'nodb' : ''"
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
        <a @click="studyViewTeachList(teachClass.isMerge)" v-if="isStuList"
          >查看</a
        >
      </div>
      <div class="teach-right" v-else>
        <a @click="viewTeachList">查看</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "StudyTeach",
  props: {
    teachClass: {
      type: Object,
      require: true,
      default: () => ({}),
    },
    adminClassInfo: {
      type: Object,
      require: true,
      default: () => ({}),
    },
    garyBg: {
      type: Boolean,
      require: false,
      default: false,
    },
    study: {
      type: Boolean,
      require: false,
      default: false,
    },
    adminClassId: {
      type: String,
      require: true,
      default: () => "",
    },
    noSetColor: {
      type: Boolean,
      require: true,
      default: true,
    },
  },
  inject: ["getBaseClassData", "markClass"],
  data() {
    return {
      visible: false,
      borderStyle: {
        border: "1px dashed red",
      },
    };
  },
  computed: {
    ...mapState("adminClass", ["isStuList", "divideclassType"]),
    techStyle() {
      let style = {};
      if (this.teachClass.isMerge) {
        style.background = "#aaa !important;";
      }
      if (this.teachClass.isShowColor) {
        // style.border = `1px solid ${this.teachClass.markColor}`;
        // style.backgroundColor = `${this.teachClass.markBgColor}`;
      }
      return style;
    },
  },
  mounted() {},
  methods: {
    ...mapActions("adminClass", ["getSaveData"]),
    ...mapMutations("adminClass", [
      "setStudyPersonListStatus",
      "setSettingColorModalVisble",
    ]),
    // 点击设置颜色modal
    handleOpenSettingColor({ groupId }) {
      const parameter = {
        visible: true,
        params: {
          groupId,
          teachClassId: this.teachClass.teachClassId,
        },
      };
      this.setSettingColorModalVisble(parameter);
    },
    // 过滤教学班
    filterTeachClass() {
      if (this.noSetColor) {
        return;
      }
      console.log(1233);
      let name = this.teachClass.teachClassName.substring(0, 2);
      if (!this.teachClass.isMerge) {
        this.markClass(name);
      }
    },
    // 查看 选考 的班级人员列表
    viewTeachList() {
      // 查看 是合并班级的人员列表
      this.$store.commit("adminClass/setTeachPersonModalStatus", true);
      this.$store.commit("adminClass/setTeachClassData", this.teachClass);
    },

    // 查看 学考 的班级人员信息
    studyViewTeachList(isMerge) {
      this.teachClass = Object.assign(this.teachClass, {
        adminClassId: this.adminClassId,
      });
      if (isMerge) {
        // 已经 合并 的班级
        this.setStudyPersonListStatus(true);
        this.$store.commit(
          "adminClass/setStudyTeachClassData",
          this.teachClass
        );
      } else {
        // 没有 合并 的班级
        this.viewTeachList();
      }
    },
    // 合并班级事件
    mergeClass(teachClassName) {
      if(this.teachClass.teachClassNum !== 0) {
        this.$store.commit("adminClass/setMergeClassModalStatus", true);
        let data = {
          classId: this.teachClass.teachClassId,
          // classId: this.adminClassInfo.adminClassId,
        };
        this.$store.commit("adminClass/setMergeClassInfo", data);
        this.$store.commit("adminClass/setTeachClassName", teachClassName); 
      }
    },

    // 取消合并
    async cancelMergeClass() {
      try {
        const params = {
          teachClassId: this.teachClass.teachClassId,
          adminClassId: this.adminClassInfo.adminClassId,
        };
        const res = await this.$api.adminClass.cancelMergeTeachClass(params);
        if (res.code === "200") {
          this.$message.success(res.message,5);
          // 查询刷新
          this.getBaseClassData();
          this.getSaveData();
        } else {
          this.$message.error(res.message,5);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
</script>

<style scoped lang="less">
.gray {
  // background-color: #028090 !important;
  // color: white;
  background-color: #aaaaaa !important;
}
.teach {
  .item-teach {
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
      position: relative;
      .label2 {
        height: 10px;
        width: 10px;
        line-height: 20px;
        border-radius: 50%;
        background-color: white;
        border: 1px solid #ccc;
        position: absolute;
        cursor: pointer;
      }
    }
    .teach-center {
      // width: 65px;
      width: 95px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      border: 1px solid #e3e5e6;
    }
    .teach-right {
      width: 130px;
      border: 1px solid #e3e5e6;
      border-left: 0;
      span {
        color: #1ba4b3;
      }
      .hb {
        width: 300px;
        height: 300px;
        border: 1px solid #1ba4b3;
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
  .item-teachGray {
    border: 1px solid #d4d4d4;
    background-color: #8282822b;
    .teach-left {
      background-color: #8282822b;
    }
  }
  .nodb {
    color: #aaaaaa;
  }
}
</style>
