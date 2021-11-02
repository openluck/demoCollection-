<template>
  <div class="student">
    <div class="stuSwper">
      选 课 走 班 管 理 系 统<span class="stuKG"></span>让 高 考 选 课 不 迷 茫
    </div>
    <div class="stuName">
      <div class="stuTit">高考选课</div>
      <a-button type="primary" @click="history"> 查看历史选课</a-button>
    </div>
    <template v-if="!noActivity">
    <div class="stuDown">
      <div class="stuDownL">
        <img src="../../assets/img01.png" alt="" />
        <div class="stuDownLName">
          <div class="tit">{{ courseGroupName }}</div>
          <div>选课模式 ：<span>组合选课</span></div>
          <div>选课时间 ：{{ startDate }} - {{ endDate }}</div>
        </div>
      </div>
      <div class="stuDownC"></div>
      <div class="stuDownR">
        <div class="stuDownRTit">{{ dowmCont }}</div>
        <div class="stuDownRp">
          <p>
            距结束仅剩 ：<span>{{ day }}</span
            >天 <span>{{ hour }}</span
            >时<span>{{ min }}</span
            >分<span>{{ second }}</span
            >秒
          </p>
        </div>
      </div>
    </div>
    <div class="stuSubject">
      <a-tabs type="card">
        <a-tab-pane key="1" tab=" 一志愿">
          <div class="stuSubCon">
            <div class="stuSubZuhe">
              <div class="subTabv">组合筛选 ：</div>
              <div class="subCheckbox">
                <Checkbox
                  v-for="item in subjectNameList"
                  :checkIdList="checkIdList"
                  :item="item"
                  @delSub="delSub"
                  @handChange="filterSub"
                  :key="item.SubjectId"
                ></Checkbox>
              </div>
            </div>
            <div class="openZuhe">
              <div class="subTabv">开放组合 ：</div>
              <div class="openZuheCon">
                <!-- 循环 -->

                <a-radio-group v-model="radioValue" @change="onChangeOpen">
                  <a-radio
                    v-for="item in courseGroupItemList"
                    :name="item.courseGroupItemName"
                    :key="item.courseGroupItemId"
                    :value="item.courseGroupItemId"
                  >
                    {{ item.courseGroupItemName }}
                    <div class="yixuan">{{ item.number }}人已选
                    <span v-if="examinationId" style="margin-left:5px;"> 总分：{{ item.totalScore }} </span>
                    <span v-if="examinationId" style="margin-left:5px;"> 排名：{{ item.ranking }} </span>
                    </div>
                  </a-radio>
                </a-radio-group>
              </div>
            </div>
            <div class="mine">
              <div class="subTabv">我的组合 ：</div>
              <div class="mineSub">{{ mineSubName }}</div>
            </div>
            <div class="commitBtn">
              <a-button :loading="loading"  v-if="!isNoneTime" @click="saveStudent" type="primary">
                <svg-icon
                  icon-class="icon-tijiao"
                  :scale="0.8"
                  style="margin-right: 5px"
                ></svg-icon>
                提交
              </a-button>
              <a-button v-else :disabled="true" type="primary">
                选课时间已过
              </a-button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    </template>
    <a-empty v-else class="empty" description="暂无选课活动">
      
    </a-empty>
    <!-- <h1 >暂无选课活动</h1> -->
    <a-modal
      v-model="visible"
      class="hisStyle"
      title="选课历史纪录"
      :footer="null"
    >
      <div v-if="historyList">
        <!-- 循环 -->
        <div class="hisItem" v-for="(item, index) in historyList" :key="index">
          <div class="hisTit">{{ item.courseGroupName }}</div>
          <div class="hisTime">
            开始时间：{{ filterT(item.startDate) }} <span></span> 结束时间：{{
              filterT(item.endDate)
            }}
          </div>
          <div v-if="item.sectionList.length != 0" class="hisSub">
            {{
              item.sectionList ? item.sectionList[0].voluntaryName : ""
            }}：<span>{{
              item.sectionList ? item.sectionList[0].courseGroupItemName : ""
            }}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <a-empty />
      </div>
    </a-modal>
  </div>
</template>

<script>
import Checkbox from "../../components/Checkbox";
export default {
  components: {
    Checkbox,
  },
  data() {
    return {
      day: "0",
      hour: "00",
      min: "00",
      second: "00",
      dowmCont: "选课进行中",
      openValue: "1",
      visible: false,
      historyList: [], //历史记录列表
      courseGroupId: "", //活动id
      courseGroupName: "", //活动名称
      subjectNameList: [], //科目列表
      activityName: "", //科目名称
      startDate: "",
      endDate: "",
      courseGroupItemList: [], //开放组合list
      courseGroupItemListItem: [],
      studentSelectionsList: [], //我的志愿
      mineSubName: "",
      checkIdList: [],
      radioValue: "",
      isNoneTime: false, //true:没时间   ：false：还有
      timer: null, 
      noActivity: true, //false:有选课活动   true:有选课活动
      loading: false,
    };
  },
  created() {
    this.countTime();
  },
  mounted() {
    this.getStudent();
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    // 倒计时
    countTime(item) {
      // console.log("doajishi");
      // 获取当前时间
      let date = new Date();
      let now = date.getTime();
      // 设置截止时间
      let endDate = new Date(this.endDate); // 需要倒计时的日期
      let end = endDate.getTime();
      // 时间差
      let leftTime = end - now;
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // 天
        this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        // 时
        let h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        this.hour = h < 10 ? "0" + h : h;
        // 分
        let m = Math.floor((leftTime / 1000 / 60) % 60);
        this.min = m < 10 ? "0" + m : m;
        // 秒
        let s = Math.floor((leftTime / 1000) % 60);
        this.second = s < 10 ? "0" + s : s;
      } else {
        this.day = 0;
        this.hour = "00";
        this.min = "00";
        this.second = "00";
      }
      // 等于0的时候不调用
      if (
        Number(this.hour) === 0 &&
        Number(this.day) === 0 &&
        Number(this.min) === 0 &&
        Number(this.second) === 0
      ) {
        this.isNoneTime = true;
        this.dowmCont = "选课已结束";
        return "";
      } else {
        // 递归每秒调用countTime方法，显示动态时间效果,
        this.dowmCont = "选课进行中";
        this.isNoneTime = false;
        this.timer = setTimeout(this.countTime, 1000);
      }
    },
    filterT(text) {
      if (text) {
        return text.replace("T", " ");
      }
    },
    history() {
      this.visible = true;
      this.getSectionHistoryList();
    },
    onChangeOpen(e) {
      // console.log(e.target.value);
      this.studentSelectionsList = [];
      this.courseGroupItemListItem.forEach((item) => {
        if (item.courseGroupItemId === e.target.value) {
          this.studentSelectionsList.push(item);
          this.mineSubName = item.courseGroupItemName;
        }
      });
    },
    filterSub(id) {
      // this.radioValue = "";
      // this.mineSubName = "";
      // this.studentSelectionsList = [];
      this.checkIdList.push(id);
      this.filterItem();
    },
    delSub(id) {
      // this.radioValue = "";
      // this.mineSubName = "";
      // this.studentSelectionsList = [];
      for (let i = 0; i < this.checkIdList.length; i++) {
        const element = this.checkIdList[i];
        if (element === id) {
          this.checkIdList.splice(i, 1);
        }
      }
      this.filterItemDel();
    },
    filterItem() {
      for (let index = 0; index < this.checkIdList.length; index++) {
        const element = this.checkIdList[index];
        this.courseGroupItemList = this.courseGroupItemList.filter((item) =>
          item.courseGroupItemNum.match(element)
        );
      }
    },
    filterItemDel() {
      let arr = [...this.courseGroupItemListItem];
      for (let index = 0; index < this.checkIdList.length; index++) {
        const element = this.checkIdList[index];
        arr = arr.filter((item) => item.courseGroupItemNum.match(element));
      }
      this.courseGroupItemList = arr;
    },
    //请求
    //获取活动页
    async getStudent() {
      try {
        const res = await this.$api.student.getStudent();
        if (res.code === 200) {
           this.noActivity = false
          // if (
          //   // !res.data.courseGroups &&
          //   // !res.data.courseGroupItemList &&
          //   // !res.data.studentSelectionsList
          //   !res.data.courseGroupItemList
          // ) {
          //   this.noActivity = true
          //   this.$message.error(res.message);
          //   return;
          // }
          this.subjectNameList = JSON.parse(
            res.data.courseGroups.particCourses
          );
          // this.courseGroupItemList = []
          // this.studentSelectionsList = []
          this.courseGroupItemList = res.data.courseGroupItemList;
          this.courseGroupItemListItem = res.data.courseGroupItemList;
          this.studentSelectionsList = res.data.studentSelectionsList;
          this.courseGroupId = res.data.courseGroups.courseGroupId;
          this.examinationId = res.data.courseGroups.examinationId;
          this.courseGroupName = res.data.courseGroups.courseGroupName;
          this.startDate = res.data.courseGroups.startDate.replace("T", " ");
          this.endDate = res.data.courseGroups.endDate.replace("T", " ");
          this.countTime(this.endDate);
          if (res.data.studentSelectionsList.length) {
            this.radioValue =
              res.data.studentSelectionsList[0].courseGroupItemId;
            this.studentSelectionsList.push({
              courseGroupItemId:
                res.data.studentSelectionsList[0].courseGroupItemId,
              courseGroupItemName:
                res.data.studentSelectionsList[0].courseGroupItemName,
            });
            this.mineSubName =
              res.data.studentSelectionsList[0].courseGroupItemName;
          }
        } else {
          this.noActivity = true
          this.$message.error(res.message);
        }
      } catch (error) {
        // this.$message.error("请求失败！" + error);
      }
    },
    //保存
    async saveStudent() {
      if (this.studentSelectionsList.length === 0) {
        this.$message.error("请选择开放组合！");
        return;
      }
      this.loading = true
      let data = {
        courseGroupId: this.courseGroupId,
        studentSelectionsList: [
          {
            courseGroupItemId: this.studentSelectionsList[0].courseGroupItemId,
            voluntary: 1,
          },
        ],
      };
      try {
        const res = await this.$api.student.saveStudent(data);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.checkIdList = [];
          this.subjectNameList = [];
          this.mineSubName = ''
          this.radioValue = ''
          this.getStudent();
          clearTimeout(this.timer)
          this.timer = null
          this.loading = false
        } else {
          this.$message.error(res.message);
          this.loading = false
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
        this.loading = false
      }
    },
    //获取历史选课记录
    async getSectionHistoryList() {
      try {
        const res = await this.$api.student.getSectionHistoryList();
        if (res.code === 200) {
          this.historyList = res.data;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.error("请求失败！" + error);
      }
    },
  },
};
</script>

<style lang="less">
.student {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .stuSwper {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("../../assets/banner.png");
    background-size: 100% 100%;
    font-size: 30px;
    font-weight: 600;
    color: white;
    .stuKG {
      width: 4%;
    }
  }
  .stuName {
    width: 100%;
    height: 74px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 0 10px;
    // background-color: #eff3f5;
    .stuTit {
      font-size: 20px;
      font-weight: 600;
    }
  }
  .stuDown {
    width: 100%;
    height: 120px;
    display: flex;
    background-color: #f3f8ff;
    position: relative;
    border-bottom: 1px solid #e4efff;
    .stuDownL {
      width: 65%;
      height: 100%;
      padding-left: 40px;
      display: flex;
      align-items: center;
      img {
        width: 70px;
        height: 75px;
        margin-right: 25px;
      }
      .stuDownLName {
        height: 75px;
        display: flex;
        flex-direction: column;
        div {
          width: 100%;
          height: 33%;
          display: flex;
          align-items: center;
          span {
            width: 60px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            // padding: 5px;
            background-color: #39be7c;
            border-radius: 5px;
            color: white;
          }
        }
        .tit {
          font-size: 16px;
          font-weight: 600;
          color: #333333;
        }
      }
    }
    .stuDownC {
      width: 30px;
      height: 120px;
      border-top: 60px solid transparent;
      border-left: 30px solid #f3f8ff;
      border-bottom: 60px solid transparent;
      position: absolute;
      top: 0;
      left: 65%;
    }
    .stuDownR {
      width: 35%;
      height: 100%;
      background-color: #e2eeff;
      display: flex;
      flex-direction: column;
      .stuDownRTit {
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #2e8ae6;
      }
      .stuDownRp {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        span {
          height: 20px;
          padding: 5px;
          background-color: #2e8ae6;
          color: white;
          border-radius: 5px;
          margin: 5px;
        }
      }
    }
  }
  .stuSubject {
    flex-grow: 1;
    background-color: #f3f8ff;
    padding: 20px;
    .ant-tabs {
      width: 100%;
      height: 100%;
      background-color: white;
      .ant-tabs-nav-scroll {
        background-color: #f3f8ff;
      }
    }
    .stuSubCon {
      width: 100%;
      height: 100%;
      padding: 20px;
      background-color: white;
      .stuSubZuhe {
        width: 100%;
        // height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        .subTabv {
          width: 8%;
          height: 60px;
          display: flex;
          color: #797979;
          justify-content: center;
          font-size: 14px;
          align-items: center;
        }
        .subCheckbox {
          width: 92%;
          // height: 60px;
          // margin-bottom: 20px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
      }
      .openZuhe {
        width: 100%;
        height: 200px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #eceff2;
        .subTabv {
          width: 8%;
          height: 180px;
          display: flex;
          justify-content: center;
          color: #797979;
          font-size: 14px;
          padding-top: 10px;
        }
        .openZuheCon {
          width: 92%;
          height: 180px;
          padding: 10px 10px 10px 0;
          overflow-y: auto;
          display: flex;
          flex-wrap: wrap;
          /* 滚动条 */
          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: #eff3f5;
          }
          /*定义滚动条轨道 内阴影+圆角*/
          &::-webkit-scrollbar-track {
            border-radius: 3px;
            background-color: #eff3f5;
          }
          /*定义滑块 内阴影+圆角*/
          &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: #36b4f3;
          }
          .ant-radio-wrapper {
            margin-right: 40px;
          }
          .yixuan {
            margin-left: 20px;
            color: #8fdab5;
            font-size: 12px;
            margin-top: 10px;
            margin-bottom: 10px;
          }
        }
      }
      .mine {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        margin-top: 30px;
        margin-bottom: 30px;
        .subTabv {
          width: 8%;
          height: 60px;
          display: flex;
          color: #797979;
          font-size: 14px;
          align-items: center;
          justify-content: center;
        }
        .mineSub {
          width: 92%;
          color: #2e8ae6;
        }
      }
    }
  }
  .empty{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
.hisStyle {
  .ant-modal-body {
    height: 360px;
    background-color: #f2f2f2;
    overflow-y: auto;
    /* 滚动条 */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: #eff3f5;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background-color: #eff3f5;
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #36b4f3;
    }
    .hisItem {
      width: 100%;
      padding: 15px;
      margin-bottom: 10px;
      background-color: white;
      border: 1px solid #dadfe6;
      border-radius: 5px;
      .hisTit {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
      }
      .hisTime {
        color: #666666;
        font-size: 14px;
        margin-bottom: 10px;
        span {
          margin-right: 20px;
        }
      }
      .hisSub {
        color: #666666;
        font-size: 14px;
        span {
          margin-left: 10px;
          color: #89bdf1;
        }
      }
    }
  }
}
</style>
