<!--
 * @Author: ylc
 * @Date: 2021-08-05 16:23:17
 * @LastEditTime: 2021-10-11 13:52:04
 * @LastEditors: ylc
 * @Description: 课堂组单元格
 * @FilePath: \Web\src\views\TimetableQuery\Child\LesCell.vue
-->
<template>
  <div class="ylc-les-cell"
    :style=" value.lesList.length > 0 ? 'cursor:pointer' : '' ">
    <div v-if="row.lesSortType === '0'"
      style="text-align: left; padding-left: 18px; height: 64px;line-height: 64px;">
      <span>{{ value.lesRemark ? value.lesRemark : "" }}</span>
    </div>
    <div v-else
      class="ylc-les-info"
      style="min-height: 151px;"
      @click="handleLessonDetails(value.lesList[0])">
      <div v-if="value.lesList.length > 0">
        <div class="ylc-info-title"
          style="max-width:60%;"
          :title="value.lesList[0].subjectName"
          v-if="list.indexOf('科目') !== -1">
          {{ value.lesList[0].subjectName }}
        </div>
        <div class="ylc-info-title"
          v-else
          style="color: #fff;">
          {{ value.lesList[0].subjectName }}
        </div>
        <div class="ylc-info-content"
          :title="value.lesList[0].teacherName"
          v-show="list.indexOf('教师') !== -1">
          {{ value.lesList[0].teacherName }}
        </div>
        <div class="ylc-info-content"
          :title="value.lesList[0].placeName"
          v-show="list.indexOf('场所') !== -1">
          {{ value.lesList[0].placeName }}
        </div>
        <div class="ylc-info-content"
          :title="getClass(value.lesList[0].className,value.lesList[0].stuNum)"
          v-show="list.indexOf('班级') !== -1">
          {{ getClass(value.lesList[0].className,value.lesList[0].stuNum) }}
        </div>
        <div class="ylc-info-content"
          :title="value.lesList[0].lesTime"
          v-show="list.indexOf('时间') !== -1">
          {{ value.lesList[0].lesTime }}
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
                  v-for="(inkey, index) in value.lesList"
                  :key="index"
                  @click="handleLessonDetails(inkey)">
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
                    :title="getClass(inkey.className, inkey.stuNum)"
                    class="cb-t-les-info">
                    {{ getClass(inkey.className, inkey.stuNum) }}
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
            v-if="value && value.lesList.length > 1">更多</a-button>
        </a-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    row: {},
    value: {},
    list: [],
    week: {
      type: String,
      default: ""
    }
  },
  methods: {
    // 点击每节课
    handleLessonDetails(text) {
      // this.$message.success(lesId);
      if (text) {
        this.$router.push({
          path: "/TimetableQuery/LessonDetails",
          query: {
            text: JSON.stringify(text.lesId)
          }
        });
      }
    },
    /**
     * @param {String} a 班级名称
     * @param {String} b 班级人数
     */
    // 调整班级
    getClass(a, b) {
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
  },
  created() {
    // console.log(this.value, "value");
  }
};
</script>

<style lang="less" scoped>
.ylc-les-cell {
  // height: 151px;
  position: relative;
  .ylc-les-info {
    text-align: left;
    padding: 18px 12px;
    .ylc-info-title {
      font-size: 16px;
      padding-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ylc-info-content {
      font-size: 14px;
      color: #818385;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .position {
    position: absolute;
    top: 7px;
    right: 5%;
  }
}
</style>