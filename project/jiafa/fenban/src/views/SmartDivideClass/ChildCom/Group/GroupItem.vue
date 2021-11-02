<!--
 * @Descripttion: 分组
 * @version: v1.00
 * @Author: WuQiao
 * @Date: 2021-3-30 16:09:57
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-09 09:13:08
-->
<template>
  <div class="group-item">
    <div class="group-item-wrap">
      <div
        class="border-btn"
        @click="handleOpenSettingColor(G)"
        :style="{ background: `${G.color ? G.color : '#ffffff'}` }"
      ></div>
      <div class="head">
        <div class="group-name">
          {{ G.groupName }}组{{ G.default ? "（默认）" : "" }}
        </div>
        <div class="group-total">
          剩余未分班人数<span class="num">{{ G.total }}</span
          >人
        </div>
      </div>
      <!-- 科目 -->
      <div class="subject">
        <div
          class="subject-item"
          v-for="item in G.subjectList"
          :key="item.subjectId"
        >
          <SubjectItem dataType="subject" :combination="item" />
        </div>
      </div>
      <!-- 科目组合 -->
      <div
        class="subject-group"
        :style="
          G.combinationList.length > 0 ? 'border-top: 1px dashed #3db2be;' : ''
        "
      >
        <div
          class="subject-group-item"
          v-for="item in G.combinationList"
          :key="item.combinationId"
        >
          <SubjectItem
            dataType="combination"
            :groupId="G.groupId"
            :combination="item"
            :showDel="!G.isDefault"
          />
        </div>
      </div>
      <div class="no-data" v-if="isNoData">组合内人员已经被分配完毕</div>
      <!-- button -->
      <div class="btns" v-if="!G.isDefault && divideclassType === '1'">
        <a-button
          @click="handleOpenEditGroupDrawer(G)"
          :disabled="isNoData"
          style="margin-right: 20px"
        >
          <a-icon type="plus" />编辑分组
        </a-button>
        <a-button ghost @click="showDeleteConfirm(G.groupId)">
          <svg-icon class="op_daoru" icon-class="xuanke_del"></svg-icon>
          删除分组
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import SubjectItem from "@/components/divide/SubjectItem";
import { mapState, mapMutations } from "vuex";
export default {
  name: "GroupItem",
  components: { SubjectItem },
  props: {
    G: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      reqCombinationList: [],
    };
  },
  computed: {
    ...mapState("adminClass", ["divideclassType"]),
    isNoData() {
      // 组合内数据被分配完毕之后展示 提示。
      return !this.G.combinationList.length && !this.G.subjectList.length;
    },
  },
  methods: {
    ...mapMutations("adminClass", ["setSettingColorModalVisble"]),
    // 点击设置颜色modal
    handleOpenSettingColor({ groupId, color }) {
      const parameter = {
        visible: true,
        params: {
          groupId,
          teachClassId: "",
          curColor: color,
        },
      };
      this.setSettingColorModalVisble(parameter);
    },
    // 点击编辑分组
    async handleOpenEditGroupDrawer({ combinationList, groupId }) {
      // 获取编辑分组组合数据
      try {
        const params = { groupId };
        const res = await this.$api.chooseExam.getEditGroupList(params);
        if (res.code === "200") {
          this.reqCombinationList = res.data;
        } else {
          this.$message.error("获取组合列表失败" + res.message,5);
        }
      } catch (error) {
        throw new Error(error);
      }
      const { reqCombinationList } = this;
      const payload = { reqCombinationList, type: "edit", groupId };
      this.$emit("handleOpenAddGropuDrawer", null, payload);
    },
    // 删除分组
    showDeleteConfirm(groupId) {
      this.$confirm({
        title: "你确定要删除该分组吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          this.delGroup(groupId);
        },
      });
    },
    // 删除添加的组内科目组合
    async delGroup(groupId) {
      try {
        const params = { groupId };
        const res = await this.$api.chooseExam.delGroup(params);
        if (res.code === "200") {
          this.$message.success("删除成功！",5);
          this.$emit("getBaseClassData");
        } else {
          this.$message.error("删除失败！" + res.message,5);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
</script>

<style scoped lang="less">
.group-item {
  background-color: #1ba4b3;
  position: relative;
  .border-btn {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
  }
  .group-item-wrap {
    padding: 15px;
    .head {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px dashed #3db2be;
      .group-name {
        color: white;
        font-size: 24px;
        font-weight: 600;
      }
      .group-total {
        color: white;
        .num {
          margin: 0 5px;
          font-style: italic;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
    .subject {
      min-height: 60px;
      margin-top: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &::after {
        height: 0;
        content: "";
        min-width: 151px;
      }
      .subject-item {
        margin-bottom: 10px;
      }
    }
    .subject-group {
      min-height: 60px;
      padding-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &::after {
        height: 0;
        content: "";
        min-width: 151px;
      }
      .subject-group-item {
        margin-bottom: 10px;
      }
    }
    .temp {
      height: 0;
      margin-bottom: 0;
      border: none;
      padding: 0;
    }
    .btns {
      padding-top: 10px;
      border-top: 1px dashed #3db2be;
      text-align: center;
    }
  }
  .no-data {
    text-align: center;
    color: white;
    margin-bottom: 40px;
  }
  .op_daoru {
    margin-bottom: 1px;
    margin-right: 4px;
  }
}
</style>
