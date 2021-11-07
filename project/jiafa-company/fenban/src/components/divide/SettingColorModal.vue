<!--
 * @Descripttion: 颜色设置modal
 * @version: v1.00
 * @Author: WuQiao
 * @Date: 2021-5-17 14:09:57
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-24 15:08:04
-->
<template>
  <div class="setting-color-modal">
    <a-modal
      class="modal"
      v-model="settingColorModalVisble"
      title="标记颜色"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="tips">选择一个颜色：</div>
      <ul class="color-wrap">
        <!-- style="pointer-events:none;" -->
        <li
          class="color-item"
          :style="{ background: item.color }"
          v-for="item in colorList"
          :key="item.id"
          @click="() => handleSettingColor(item)"
        >
          <a-icon
            v-if="item.checked"
            type="check"
            style="color: white; font-size: 20px"
          />
        </li>
      </ul>
    </a-modal>
  </div>
</template>
 
<script>
import { mapMutations, mapState } from "vuex";
const colorList = [];
const colorArr = [
  "#F27979",
  "#FAA264",
  "#EED452",
  "#9CD661",
  "#9B9BEE",
  "#C37CE6",
  "#EC81C9",
  "#E5989B",
  "#69306D",
  "#FF206E",
  "#720026",
  "#7161EF"
];
for (let index = 0; index < colorArr.length; index++) {
  colorList.push({
    id: colorArr[index],
    color: colorArr[index],
    checked: false
  });
}
export default {
  name: "SettingColorModal",
  components: {},
  props: {},
  data() {
    return {
      colorList,
      color: ""
    };
  },
  computed: {
    ...mapState("adminClass", ["setColorPayload"]),
    settingColorModalVisble: {
      get() {
        return this.$store.state.adminClass.settingColorModalVisble;
      },
      set(newVal) {
        this.$store.state.adminClass.settingColorModalVisble = newVal;
      }
    }
  },
  watch: {
    "setColorPayload.params.curColor"(val) {
      this.colorList.forEach((item) => {
        if (item.color === val) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    }
  },
  mounted() {},
  methods: {
    ...mapMutations("adminClass", [
      "setSettingColorModalVisble",
      "setSaveColor"
    ]),
    handleOk() {
      const {
        color,
        setSettingColorModalVisble,
        setSaveColor,
        saveSettingColor
      } = this;
      const result = this.colorList.some((item) => item.checked);
      const parameter = {
        visible: true
      };
      // result
      //   ? (() => {
      setSettingColorModalVisble(parameter);
      setSaveColor(color);
      saveSettingColor();
      //   })()
      // : this.$message.warn("请选择一种颜色！");
    },
    handleCancel() {
      const { setSettingColorModalVisble } = this;
      const parameter = {
        visible: false
      };
      setSettingColorModalVisble(parameter);
    },
    // 点击颜色块
    handleSettingColor({ id }) {
      const colorSele = id === this.color ? "" : id;
      this.color = colorSele;
      this.colorList.forEach((item) => {
        if (item.id === id) {
          item.checked = !item.checked;
        } else {
          item.checked = false;
        }
      });
    },
    // 保存颜色
    async saveSettingColor() {
      try {
        const {
          setColorPayload: {
            params: { groupId, teachClassId }
          }
        } = this;
        const { color } = this;
        const params = { groupId, teachClassId, color };
        const res = await this.$api.chooseExam.saveSettingColor(params);

        if (res.code === "200") {
          this.$message.success("保存成功！", 5);
          this.$emit("getBaseClassData");
          const parameter = {
            visible: false
          };
          this.setSettingColorModalVisble(parameter);
        } else {
          this.$message.error("保存失败！" + res.message,5);
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
</script>
 
<style scoped lang="less">
.modal {
  .tips {
    margin-bottom: 15px;
  }
  .color-wrap {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .color-item {
      list-style: none;
      cursor: pointer;
      width: 65px;
      height: 65px;
      border-radius: 50%;
      margin-left: 10px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>