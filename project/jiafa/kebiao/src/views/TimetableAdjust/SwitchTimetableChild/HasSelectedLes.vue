<!--
 * @Desc: 跨周调换课已选择课程小窗组件
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-13 13:32:36
 * @LastEditors: went
 * @LastEditTime: 2021-09-22 10:20:26
-->
<template>
  <div class="wt-has-selected-les">
    <div class="wt-pannel">
      <div
        v-if="pannelHide"
        @click="pannelHide = false"
      >
        <img
          class="wt-pannel-left"
          src="@assets/img/pannel-left.png"
          alt
        />
      </div>

      <template v-else>
        <div @click="pannelHide = true">
          <img
            class="wt-pannel-right"
            src="@assets/img/pannel-right.png"
            alt
          />
        </div>

        <div class="wt-pannel-inner">
          已选择课程
          <div class="wt-pannel-content">
            <div class="wt-pannel-content-item wt-pannel-subjectName">
              <span v-if="showItem.sub">{{selectedLesList&&selectedLesList.subjectName}}</span>
            </div>
            <div
              v-if="showItem.tea"
              class="wt-pannel-content-item"
            >{{selectedLesList&&selectedLesList.teacherName}}</div>
            <div
              v-if="showItem.place"
              class="wt-pannel-content-item"
            >{{selectedLesList&&selectedLesList.placeName}}</div>
            <div
              v-if="showItem.class"
              class="wt-pannel-content-item"
            >
              {{selectedLesList&&selectedLesList.className}}
              {{selectedLesList&&selectedLesList.stuNum ? '/'+selectedLesList.stuNum+'人' : ''}}
            </div>
            <div
              v-if="showItem.time"
              class="wt-pannel-content-item"
            >{{selectedLesList&&selectedLesList.lesTime}}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
 
<script>
import { mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      pannelHide: true,
      showItem: {
        sub: false,
        place: false,
        tea: false,
        class: false,
        time: false
      }
    };
  },
  computed: {
    ...mapState("timetableAdjust", ["hasSelectedLes"]),
    selectedLesList() {
      return this.hasSelectedLes.curLesCell.lesList && this.hasSelectedLes.curLesCell.lesList[0]
    }
  },
  mounted() {
    this.pannelHide = false
  },
  methods: {
    filterText(showItem) {
      this.showItem = {
        sub: false,
        place: false,
        tea: false,
        class: false,
        time: false
      };
      for (let i = 0; i < showItem.length; i++) {
        const element = showItem[i];
        switch (element) {
          case "1":
            this.showItem.sub = true;
            break;
          case "2":
            this.showItem.place = true;
            break;
          case "3":
            this.showItem.tea = true;
            break;
          case "4":
            this.showItem.class = true;
            break;
          case "5":
            this.showItem.time = true;
            break;
        }
      }
    }
  }
};
</script>
 
<style scoped lang = "less">
.wt-has-selected-les {
  z-index: 10;
  .wt-pannel {
    width: 232px;
    height: 192px;
    position: relative;
    .wt-pannel-right {
      position: absolute;
      left: -36px;
      top: 64px;
      width: 48px;
      height: 72px;
    }
    .wt-pannel-left {
      position: absolute;
      right: -12px;
      top: 70px;
      width: 48px;
      height: 72px;
    }
    .wt-pannel-inner {
      width: 232px;
      height: 192px;
      opacity: 1;
      padding: 16px 20px;
      background: #ffffff;
      color: #616366;
      font-size: 14px;
      border-radius: 4px 0px 0px 4px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
      .wt-pannel-content {
        width: 185px;
        height: 121px;
        opacity: 1;
        background: rgba(255, 129, 87, 0.2);
        border: 3px solid #f67246;
        margin: 10px 0;
        padding: 10px;

        .wt-pannel-content-item {
          font-size: 14px;
          color: #616366;
        }
        .wt-pannel-subjectName {
          font-size: 16px;
          color: #000000;
        }
      }
    }
  }
}
</style>