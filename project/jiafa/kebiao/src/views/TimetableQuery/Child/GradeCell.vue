<!--
 * @Author: ylc
 * @Date: 2021-08-12 09:36:16
 * @LastEditTime: 2021-10-14 14:01:00
 * @LastEditors: ylc
 * @Description: 年级课表单元格
 * @FilePath: \Web\src\views\TimetableQuery\Child\GradeCell.vue
-->
<template>
  <div class="ylc-grade-cell">
    <div v-if="row.lesSortType === '0'"
      class="ylc-grade-list"
      style="min-height:64px;">
      <div class="ylc-grade-item"
        style="width: 100%;height: 64px; line-height: 64px;padding:0;text-align:center;">
        <div>{{ remark }}</div>
      </div>
    </div>
    <div class="ylc-grade-list"
      v-else
      style="min-height: 151px;">
      <!-- {{ maxWidth }} -->
      <div class="ylc-grade-item"
        v-for="(item, index) of value"
        :key="index"
        :class="getClass(index)"
        style="height: 151px;"
        :style="{ 
              width: maxWidth === 1 ? '100%' : maxWidth === 2 ? '49.999%' : '33.333%',
              cursor: item.lesList.length > 0 ? 'pointer' : ''
            }"
        @click="handleLessonDetails(item.lesList.length > 0 ? item.lesList[0].lesId : '')">
        <div v-if="item.lesList.length > 0">
          <!-- <div class="ylc-info-title">
            {{ list.indexOf('科目') !== -1 ? item.lesList[0].subjectName : "" }}
          </div> -->
          <div class="ylc-info-title"
            style="max-width:60%;"
            :title="item.lesList[0].subjectName"
            v-if="list.indexOf('科目') !== -1">
            {{ item.lesList[0].subjectName }}
          </div>
          <div class="ylc-info-title"
            v-else
            style="color: #fff;">
            {{ item.lesList[0].subjectName }}
          </div>
          <div class="ylc-info-content"
            :title="item.lesList[0].teacherName"
            v-show="list.indexOf('教师') !== -1">
            {{ item.lesList[0].teacherName }}
          </div>
          <div class="ylc-info-content"
            :title="item.lesList[0].placeName"
            v-show="list.indexOf('场所') !== -1">
            {{ item.lesList[0].placeName }}
          </div>
          <div class="ylc-info-content"
            :title="getClassCell(item.lesList[0].className, item.lesList[0].stuNum)"
            v-show="list.indexOf('班级') !== -1">
            {{ getClassCell(item.lesList[0].className, item.lesList[0].stuNum) }}
          </div>
          <div class="ylc-info-content"
            :title="item.lesList[0].lesTime"
            v-show="list.indexOf('时间') !== -1">
            {{ item.lesList[0].lesTime }}
          </div>
        </div>
        <a-popover arrowPointAtCenter
          trigger="click"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode;
            }
          "
          overlayClassName="cb-t-les-m-container">
          <template slot="content">
            <div>
              <div class="title">
                <!-- <span>{{ slotDay[i] }}</span> -->
                <span>{{ week }}</span>
                <span>{{ row.diffNoonName }}</span>
                <span>{{ row.lesSortName }}</span>
              </div>
              <div class="container">
                <div class="cb-c-td"
                  style="cursor: pointer"
                  v-for="(inkey, index) in item.lesList"
                  :key="index"
                  @click="handleLessonDetails(inkey.lesId)">
                  <div class="cb-t-les-sub">
                    <span v-show="list.indexOf('科目') !== -1"
                      :title="inkey.subjectName">{{
                      inkey.subjectName
                    }}</span>
                  </div>
                  <div v-show="list.indexOf('教师') !== -1"
                    class="cb-t-les-info"
                    :title="inkey.teacherName">
                    {{ inkey.teacherName }}
                  </div>
                  <div v-show="list.indexOf('场所') !== -1"
                    :title="inkey.placeName"
                    class="cb-t-les-info">
                    {{ inkey.placeName }}
                  </div>
                  <div v-show="list.indexOf('班级') !== -1"
                    :title="getClassCell(inkey.className, inkey.stuNum)"
                    class="cb-t-les-info">
                    {{ getClassCell(inkey.className, inkey.stuNum) }}
                  </div>
                  <div v-show="list.indexOf('时间') !== -1"
                    :title="inkey.lesTime"
                    class="cb-t-les-info">
                    {{ inkey.lesTime }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <a-button class="cb-t-les-more position"
            size="small"
            type="primary"
            @click="
              (e) => {
                e.stopPropagation();
              }
            "
            v-if="item.lesList.length > 1">更多</a-button>
        </a-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: {},
    list: [],
    value: [],
    slotDay: [],
    week: {},
    maxWidth: {
      type: Number,
      default: 1
    },
    maxHeight: {
      type: Number,
      default: 1
    },
    remark: {
      type: String,
      default: ""
    }
  },
  watch: {
    value(val) {
      this.Deal(val)
    }
  },
  created() {
    this.Deal(this.value)
  },
  methods: {
    // 处理格式
    Deal(val) {
      let width = this.maxWidth > 3 ? 3 : this.maxWidth
      let height = this.maxHeight
      let num = width * height
      const a = val.length
      let k = num - a
      this.forDeal(val, k)
    },
    // 循环格式
    forDeal(val, k) {
      for (let i = 0; i < k; i++) {
        val.push({
          lesRemark: "",
          lesList: []
        });
      }
    },
    // 点击每节课
    handleLessonDetails(text) {
      if (text) {
        this.$router.push({
          path: "/TimetableQuery/LessonDetails",
          query: { text: JSON.stringify(text) }
        });
      }
    },
    // 处理border
    getClass(e) {
      console.log(e, this.maxWidth, 'e')
      if (this.maxWidth === 3) {
        return [e % 3 !== 0 ? 'borderLeft' : '', e > 2 ? 'borderTop' : '']
      } else if (this.maxWidth === 2) {
        return [e % 2 !== 0 ? 'borderLeft' : '', e > 1 ? 'borderTop' : '']
      } else {
        return [e % 1 !== 0 ? 'borderLeft' : '', e > 0 ? 'borderTop' : '']
      }
    },
    /**
     * @param {String} a 班级名称
     * @param {String} b 班级人数
     */
    // 调整班级
    getClassCell(a, b) {
      let arr = []
      let inArr = []
      if (!b) {
        b = 0
      }
      if (a.indexOf(";") !== -1) {
        arr = a.split(";")
      } else {
        arr = [a]
      }
      if (b.indexOf(";") !== -1) {
        inArr = b.split(";")
      } else {
        inArr = [b]
      }
      if (arr.length > 1) {
        let str = ""
        arr.map((item, index) => {
          str += item + "/" + inArr[index] + "人;"
        })
        return str
      } else {
        return arr[0] + "/" + inArr[0] + "人"
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ylc-grade-cell {
  width: 100%;
  background: #fff;
  .ylc-grade-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .ylc-grade-item {
      position: relative;
      text-align: left;
      padding: 18px 12px;
      .ylc-info-title {
        font-size: 16px;
        padding-bottom: 5px;
      }
      .ylc-info-content {
        font-size: 14px;
        color: #818385;
        font-weight: 400;
      }
    }
  }
  .position {
    position: absolute;
    top: 13px;
    right: 17px;
  }
  .borderLeft {
    border-left: 1px solid #e6e8eb;
  }
  .borderTop {
    border-top: 1px solid #e6e8eb;
  }
}
</style>
