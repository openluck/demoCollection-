<!--
 * @Descripttion:设置时段范围弹窗
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-09 13:44:00
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-26 11:25:26
-->
<template>
  <GlobalModal
    :visible="diffNoonRangeModalVisi"
    @cancel="$parent.diffNoonRangeModalVisi = false"
    title="设置节次项时段"
    :width="440"
    :defaultBtn="false"
  >
    <div class="yqy-diffNoon-range-modal">
      <a-button
        class="reset-btn"
        type="link"
        @click="reset"
      >
        <svg-icon
          icon-class="com_delete"
          style="width:14px;margin-right: 8px"
        >
        </svg-icon>
        清空
      </a-button>
      <template v-if="!rangeResult">
        <a-form-model
          class="form"
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="{ span: 7 ,offset: 0}"
          :wrapper-col="{ span: 15 }"
        >
          <a-form-model-item
            class="flex-item"
            label="节次序号范围"
            prop="endIndex"
            ref="endIndex"
            style="margin-bottom: 8px"
          >
            <span
              class="text"
              :title="form.startIndex+' ('+startIndexName+')'"
            >{{form.startIndex+" ("+startIndexName+") "}}</span>
            ~
            <a-select
              v-model="form.endIndex"
              :options="indexList"
              placeholder="请选择节次"
              @blur="$refs.endIndex.onFieldBlur()"
            >
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="所属时段范围"
            prop="diffNoonCode"
            style="margin-bottom: 0px"
          >
            <a-select
              v-model="form.diffNoonCode"
              :options="filterSetedDiffNoonList"
              placeholder="请选择时段"
              @change="changName"
            >
            </a-select>
          </a-form-model-item>

        </a-form-model>
      </template>
      <span v-else>节次项已全部设置时段，需修改时请“清空”时段设置，重新设置！</span>
    </div>
    <template #selfBtn>
      <div style="text-align:center">
        <a-button
          type="default"
          @click="$parent.diffNoonRangeModalVisi = false"
        >取消</a-button>
        <a-button
          type="primary"
          @click="save"
          :loading="btnLoading"
        >确定</a-button>
      </div>

    </template>
  </GlobalModal>
</template>
 
<script>
import GlobalModal from "@/components/common/GlobalModal";

export default {
  name: '',
  components: { GlobalModal },
  props: {
    gNode: {},
    diffNoonRangeModalVisi: {
      type: Boolean,
      require: true
    },
    diffNoonList: {
      type: Array,
      require: true
    },
    diffNoonRangeList: {
      type: Array,
      require: true
    },
    lesSortList: {
      type: Array,
      require: true
    },
    allRanged: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      form: {
        // secId: this.$store.state.lesSort.curSec.secId,
        diffNoonCode: "",
        diffNoonName: "",
        startIndex: 1,
        endIndex: null
      },
      rules: {
        endIndex: [
          { required: true, message: "请选择结束节次" }
        ],
        diffNoonCode: [
          { required: true, message: "请选择时段" }
        ]
      },
      btnLoading: false,
      rangeResult: this.allRanged
    }
  },
  computed: {
    startIndexName() {
      // console.log(this.lesSortList, this.form.startIndex);
      // console.log(this.lesSortList.filter(i => i.lesSortIndex === this.form.startIndex));
      return this.lesSortList.filter(i => i.lesSortIndex === this.form.startIndex)[0].lesSortName
    },
    curSec() {
      return this.$store.state.lesSort.curSec
    },
    indexList() {
      // console.log(this.form.startIndex);
      let arr = []
      for (let i = this.form.startIndex, j = this.lesSortList.length; i <= j; i++) {
        const label = this.rtnName(this.lesSortList, i)
        arr.push({ value: i, label: `${i} (${label})`, title: `${i} (${label})` })
      }
      // console.log("arrrr", arr);
      return arr
    },
    filterSetedDiffNoonList() {
      const arr = this.diffNoonRangeList.map(i => i.diffNoonCode)
      return this.diffNoonList.filter(i => !arr.includes(i.diffNoonCode))
    }
  },
  created() {
    // console.log("diffNoonList", this.diffNoonList);
    // console.log("diffNoonRangeList", this.diffNoonRangeList);
    // console.log("lesSortList", this.lesSortList);
  },
  mounted() {
    // console.log(333, this.diffNoonRangeList, this.diffNoonList);

    if (this.diffNoonRangeList.length) {
      this.form.startIndex = this.diffNoonRangeList[this.diffNoonRangeList.length - 1].endIndex + 1
    } else {
      this.form.startIndex = 1
    }
  },
  methods: {
    rtnName(arr, val) {
      return arr.filter(i => i.lesSortIndex === val)[0].lesSortName
    },
    changName(a, b) {
      this.form.diffNoonName = b.componentOptions.propsData.title;
    },
    save() {
      if (!this.rangeResult) {
        this.$refs.ruleForm.validate(async (res) => {
          if (res) {
            this.$emit("rangeDiffnoon", this.form)
          }
        })
      } else {
        this.$parent.diffNoonRangeModalVisi = false
      }
    },
    reset() {
      this.rangeResult = false;
      this.form.startIndex = 1;
      this.form.endIndex = null;
      this.form.diffNoonCode = '';
      this.$emit("resetDiffnoon")
    }
  }
}
</script>
 
<style scoped lang = "less">
.yqy-diffNoon-range-modal {
  padding: 40px;
  position: relative;
  .reset-btn {
    color: #616366;
    position: absolute;
    top: 10px;
    right: 10px;
    &:hover {
      color: @primary-color;
    }
  }
  .form {
    .flex-item {
      /deep/.ant-form-item-children {
        display: flex;
        align-items: center;
      }
      .ant-select {
        width: 0;
        display: inline-block;
        flex-grow: 1;
        margin-left: 5px;
      }
    }
    .text {
      display: inline-block;
      max-width: 80px;
      margin-right: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>