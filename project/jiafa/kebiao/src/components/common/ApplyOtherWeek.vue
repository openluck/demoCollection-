<!--
 * @Description: 调整记录弹窗
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-13 16:14:02
 * @LastEditors: went
 * @LastEditTime: 2021-10-18 13:50:33
-->
<template>
  <div class>
    <global-modal
      :visible="applyWeekVisible"
      :title="applyWeekTitle"
      :width="640"
      :defaultBtn="false"
      @cancel="handleCancel"
    >
      <div class="cb-record">
        <div class="cb-record-tit">
          <a-checkbox
            style="width: 129px;"
            @change="(e) => checkAll(e, 0)"
            :checked="all"
          >全部</a-checkbox>
          <a-checkbox
            style="width: 129px;"
            @change="(e) => checkAll(e, 1)"
            :checked="two"
          >全部双周</a-checkbox>
          <a-checkbox
            @change="(e) => checkAll(e, 2)"
            :checked="one"
          >全部单周</a-checkbox>
        </div>
        <a-checkbox-group
          v-model="value"
          @change="onChange"
          class="cb-record-item"
        >
          <a-row>
            <a-col
              :title="item.label"
              :span="6"
              v-for="(item,index) in options"
              :key="index"
            >
              <a-checkbox
                :title="item.label"
                :disabled='item.value === iwCurTeachWeek.teachWeekId ? true : false'
                style="width: 120px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                :value="item.value"
              >{{item.label}}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>

      <template #selfBtn>
        <a-button
          type="default"
          @click="handleCancel"
        >取消</a-button>
        <a-button
          type="primary"
          :loading="requestLoading"
          @click="applyOtherWeek"
        >确定</a-button>
      </template>
    </global-modal>
  </div>
</template>
 
<script>
import GlobalModal from "@/components/common/GlobalModal";
import { mapState } from 'vuex'
export default {
  name: "",
  components: { GlobalModal },
  data() {
    return {
      applyWeekVisible: false,
      applyWeekTitle: "将本周课表应用到其他周次",
      selectedWeek: [],
      options: [],
      value: [],
      exParam: {},
      all: false,
      one: false,
      two: false,
      resTips: "",
      weekTextList: [],
      requestLoading: false
    };
  },
  computed: {
    ...mapState("timetableAdjust", [
      "iwCurTeachWeek"
    ])
  },
  mounted() {
    this.transformWeek(JSON.parse(sessionStorage.getItem("teachWeekList")));
  },
  methods: {
    showModal() {
      this.applyWeekVisible = true;
    },
    transformWeek(defaultList) {
      if (defaultList) {
        defaultList.forEach(item => {
          let obj = {};
          obj.label = item.teachWeekName;
          obj.value = item.teachWeekId;
          this.options.push(obj);
        });
      }
    },
    // 选择周次
    checkAll(e, type) {
      this.value = [];
      if (e.target.checked) {
        switch (type) {
          case 0:
            this.all = true;
            this.one = true;
            this.two = true;
            this.options.map(item => {
              if (item.value !== this.iwCurTeachWeek.teachWeekId) {
                this.value.push(item.value);
              }
            });
            break;
          case 1:
            this.all = false;
            this.one = false;
            this.two = true;
            this.options.map((item, index) => {
              if (index % 2 !== 0 && item.value !== this.iwCurTeachWeek.teachWeekId) {
                this.value.push(item.value);
              }
            });
            break;
          case 2:
            this.all = false;
            this.one = true;
            this.two = false;
            this.options.map((item, index) => {
              if (index % 2 === 0 && item.value !== this.iwCurTeachWeek.teachWeekId) {
                this.value.push(item.value);
              }
            });
            break;
          default:
            break;
        }
      } else {
        switch (type) {
          case 0:
            this.all = false;
            this.one = false;
            this.two = false;
            break;
          case 1:
            this.all = false;
            this.two = false;
            if (this.one) {
              this.options.map((item, index) => {
                if (index % 2 === 0) {
                  this.value.push(item.value);
                }
              });
            }
            break;
          case 2:
            this.all = false;
            this.one = false;
            if (this.two) {
              this.options.map((item, index) => {
                if (index % 2 !== 0) {
                  this.value.push(item.value);
                }
              });
            }
            break;
          default:
            break;
        }
      }
      this.selectedWeek = [...this.value];
    },
    onChange(val) {
      this.teachWeekName = val;
      this.selectedWeek = [...val];
    },
    initExParam(params) {
      this.exParam = params;
    },
    async applyOtherWeek() {
      this.requestLoading = true

      const res = await this.$api.common.applyOtherWeek({
        ...this.exParam,
        applyWeek: this.selectedWeek
      });
      try {
        if (res.code === "200") {
          this.applyWeekVisible = false;
          this.weekTextList = res.data.weekTextList.join(", ");
          if (res.data.succes) {
            this.resTips = "成功将本周课表应用于以下周次：";
            this.showSuccess();
          } else {
            this.resTips = "以下周次存在冲突, 不能将本周课表应用于以下周次：";
            this.showWarning();
          }
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.log('err', error);
      } finally {
        this.requestLoading = false
        this.value = []
        this.selectedWeek = [];
        this.all = false;
        this.one = false;
        this.two = false;
      }
    },
    handleCancel() {
      this.applyWeekVisible = false
      this.value = []
      this.selectedWeek = [];
      this.all = false;
      this.one = false;
      this.two = false;
    },
    showSuccess() {
      this.$success({
        title: `${this.resTips}`,
        content: `${this.weekTextList}`,
        okText: "知道了",
        onOk() { }
      });
    },
    showWarning() {
      this.$warning({
        title: `${this.resTips}`,
        content: `${this.weekTextList}`,
        okText: "知道了",
        onOk() { }
      });
    }
  }
};
</script>
 
<style scoped lang = "less">
.cb-record {
  padding: 20px 30px;
  .cb-record-tit {
    width: 100%;
    height: 38px;
    line-height: 38px;
    margin-left: 16px;
  }
  .cb-record-item {
    width: 100%;
    padding: 14px 16px;
    background-color: #fafbfc;
  }
  .wt-resweek-list {
    margin-top: 20px;
    .wt-resweek-item {
      display: inline-block;
      width: 16%;
      height: 32px;
      line-height: 32px;
    }
  }
}
.cb-empty {
  padding: 20px;
}
</style>