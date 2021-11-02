<!--
 * @Description: 课表单个格子组件
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-05 16:13:42
 * @LastEditors: cb
 * @LastEditTime: 2021-09-28 15:25:12
-->
<template>
  <div
    class="cb-t-cell"
    @click="clickCell"
    :class="{'cell-adjustable-class':isAdjustable}"
  >
    <!-- 授课 -->
    <div
      class="cb-t-sk"
      v-if="row.lesSortType === '1'"
    >
      <div
        class="cb-t-les"
        v-if="row[week].lesList.length>0"
      >
        <div class="cb-t-les-sub">
          <span
            v-if="filterValue.sub"
            :title="row[week].lesList[0].subjectName"
          >{{row[week].lesList[0].subjectName}}</span>
        </div>
        <div
          v-if="filterValue.tea"
          class="cb-t-les-info"
          :title="row[week].lesList[0].teacherName"
        >{{row[week].lesList[0].teacherName}}</div>
        <div
          v-if="filterValue.place"
          class="cb-t-les-info"
          :title="row[week].lesList[0].placeName"
        >{{row[week].lesList[0].placeName}}</div>
        <span
          v-if="filterValue.class"
          class="cb-t-les-info"
          :title="(row[week].lesList[0].className) + (row[week].lesList[0].stuNum ? '/'+row[week].lesList[0].stuNum+'人' : '')"
        >
          {{row[week].lesList[0].className}}
          {{row[week].lesList[0].stuNum ? '/'+row[week].lesList[0].stuNum+'人' : ''}}
        </span>
        <div
          v-if="filterValue.time"
          class="cb-t-les-info"
          :title="row[week].lesList[0].lesTime"
        >{{row[week].lesList[0].lesTime}}</div>
        <div class="cb-t-les-check">
          <a-checkbox
            v-if="row[week].lesList.length === 1"
            v-show="hasCheckbox"
            v-model="row[week].lesList[0].isSelect"
          ></a-checkbox>

          <a-popover
            v-else
            arrowPointAtCenter
            trigger="click"
            :getPopupContainer="
                triggerNode => {
                  return triggerNode.parentNode;
                }"
            overlayClassName="cb-t-les-m-container"
          >
            <template #content>
              <div class>
                <div class="title">
                  <span>{{slotDay[i]}}</span>
                  <span>{{filertWeek(week)}}</span>
                  <span>{{row.diffNoonName}}</span>
                  <span>{{row.lesSortName}}</span>
                </div>
                <div class="container">
                  <div
                    class="cb-c-td"
                    v-for="(item,index) in row[week].lesList"
                    :key="index"
                  >
                    <div class="cb-t-les-sub">
                      <span
                        v-if="filterValue.sub"
                        :title="item.subjectName"
                      >{{item.subjectName}}</span>
                    </div>
                    <div
                      v-if="filterValue.tea"
                      class="cb-t-les-info"
                      :title="item.teacherName"
                    >{{item.teacherName}}</div>
                    <div
                      v-if="filterValue.place"
                      class="cb-t-les-info"
                      :title="item.placeName"
                    >{{item.placeName}}</div>
                    <div
                      v-if="filterValue.class"
                      class="cb-t-les-info"
                      :title="item.className+item.stuNum ? '/'+item.stuNum+'人' : ''"
                    >
                      {{item.className}}
                      {{item.stuNum ? '/'+item.stuNum+'人' : ''}}
                    </div>
                    <div
                      v-if="filterValue.time"
                      class="cb-t-les-info"
                      :title="item.lesTime"
                    >{{item.lesTime}}</div>
                    <div class="cb-t-les-check">
                      <a-checkbox
                        v-model="item.isSelect"
                        v-show="hasCheckbox"
                      ></a-checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <a-button
              class="cb-t-les-more"
              size="small"
              @click="more($event)"
              type="primary"
            >更多</a-button>
          </a-popover>
        </div>
      </div>
    </div>
    <!-- 非授课 -->
    <div
      v-else
      class="cb-cell-fsk"
    >
      <div v-if="row[week]">{{row[week].lesRemark}}</div>
    </div>
  </div>
</template>
 
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "",
  props: {
    row: {},
    filterValue: {
      type: Object
    }, //过滤对象
    week: {
      type: String
    },
    slotDay: {
      type: Array
    },
    i: {
      type: Number
    },
    hasCheckbox: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  watch: {},
  data() {
    return {
      isActive: false
    };
  },
  computed: {
    ...mapState("timetableAdjust", ["isEditType"]),
    isAdjustable() {
      return this.isEditType
        ? this.row[this.week].isReplaceable === "1"
        : false;
    }
  },
  mounted() {
    // console.log(this.row);
  },
  methods: {
    ...mapMutations("timetableAdjust", [
      "setCurSelectLes",
      "setHasSelectedLes"
    ]),
    clickCell() {
      this.row.lesIdList = [];
      //只有是编辑状态或非编辑但有课堂数据情况下才向lesIdList添加值
      if (this.isEditType || this.row[this.week].lesList.length) {
        this.row.lesIdList.push(this.week);
      }

      this.isActive = true;
      this.setCurSelectLes({ lesSort: this.row.lesSortIndex, week: this.week });
      //在非编辑状态保存选中课程（用于跨周调换课）
      if (!this.isEditType) {
        this.setHasSelectedLes({
          lesSortIndex: this.row.teachLesSortOptIndex,
          weekSort: this.week,
          curLesCell: this.row[this.week]
        });
      }
    },
    more(e) {
      e.stopPropagation()
    },
    filertWeek(item) {
      switch (item) {
        case "lesMon":
          return "周一";
        case "lesTue":
          return "周二";
        case "lesWed":
          return "周三";
        case "lesThu":
          return "周四";
        case "lesFri":
          return "周五";
        case "lesSat":
          return "周六";
        case "lesSun":
          return "周日";
      }
    }
  }
};
</script>
 
<style scoped lang = "less">
.cell-adjustable-class {
  height: 100%;
  background: rgba(42, 191, 142, 0.1);
}
/* .cb-t-les-info {
  background: burlywood;
  width: 100%;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: -80px;
} */
</style>