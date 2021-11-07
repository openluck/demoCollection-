<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-28 18:56:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-28 11:11:50
-->
<template>
  <div class="tips-dialog">
    <a-modal
      class="import-course"
      :visible="InputDailogvisible"
      @cancel="CloseInputDialogModel()"
      height="1000"
      title="发布课表"
      destroyOnClose
    >
      <div>
        <!-- <a-select
          mode="multiple"
          v-model="selectData.yearId"
          style="width: 100%"
          placeholder="请选择"
        >
          <a-select-option
            v-for="item in selectData"
            :key="item.viceTeacherId"
            :value="item.viceTeacherId"
            :name="item.viceTeacherName"
            :title="item.viceTeacherName"
          >
            {{ item.viceTeacherName }}
          </a-select-option>
        </a-select> -->
        <a-tree-select
          v-model="selectData.yearId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择"
          allow-clear
          tree-default-expand-all
          @change="(value) => selectTerm(value)"
        >
          <!-- @change="(value, label) => saveMainTeacher(value, record, label, 1)" -->
          <a-tree-select-node
            v-for="item in selectData"
            :key="item.yearId"
            :value="item.yearId"
            :title="item.yearName"
            :disabled="true"
          >
            <!-- :disabled="true" -->
            <a-tree-select-node
              v-for="child in item.terms"
              :key="child.termId"
              :value="child.termId"
              :title="child.termName"
            >
            </a-tree-select-node>
          </a-tree-select-node>
        </a-tree-select>
      </div>
      <template slot="footer">
        <a-button @click="CloseInputDialogModel()">取消</a-button>
        <a-button :loading="bLoading" class="themeBtn" @click="comfirmImport()"
          >确定发布</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    InputDailogvisible: {
      type: Boolean,
      default: false,
    },
    arrLessonIdParent: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectData: [],
      termId: "", // 学年学期id
      bLoading: false,
    };
  },
  methods: {
    CloseInputDialogModel() {
      console.log(this.InputDailogvisible);
      this.$emit("CloseInputDialogModel", this.InputDailogvisible);
    },
    async comfirmImport() {
      if (this.termId === "") {
        this.$message.warning("请选择需要发布的学年学期");
      } else {
        let data = {
          arrLessonId: this.arrLessonIdParent,
          termId: this.termId,
        };
        this.bLoading = true;
        const res = await this.$api.ArrLessonSetting.publishArrLesson(data);
        if (res.code === "200") {
          this.$message.success("发布成功");
          this.CloseInputDialogModel();
          this.$parent.getArrLessonList();
          this.$parent.clearSelect();
          this.bLoading = false;
        } else {
          this.$message.warning(res.message);
        }
      }
    },
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    async getYearTermTree() {
      const res = await this.$api.ArrLessonSetting.getYearTermTree();
      if (res.code === "200") {
        this.selectData = res.data;
      }
    },
    selectTerm(value) {
      // console.log(termId);
      // console.log(value);
      this.termId = value;
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  p {
    margin-left: 10px;
  }
}
</style>