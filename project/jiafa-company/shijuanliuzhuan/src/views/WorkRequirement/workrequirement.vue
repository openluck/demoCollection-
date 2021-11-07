<style scoped lang="less">
#work .ant-btn {
  padding: 0 10px;
}

#work .ant-btn-primary {
  background-color: #398fe6;
  border-color: #398fe6;
}

#work {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #ebf0f5;
  display: flex;
  flex-direction: column;
}

.work {
  padding: 0 14px;
  background-color: white;
  width: 100%;
  height: calc(49vh - 12px);
  margin-bottom: 20px;
}

.work1 {
  padding: 0 14px;
  background-color: white;
  width: 100%;
  height: 100%;
  /* flex-grow: 1; */
  height: calc(49vh - 12px);
  /* margin-bottom: 20px; */
}

.work_title {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #3687d9;
  font-weight: 600;
}

.work_container {
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.work_item {
  width: 49%;
  height: 100%;
  border: 1px dashed #c4c8cc;
}

.work_inspect {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #c4c8cc;
  font-size: 12px;
  font-weight: 600;
  color: #5c6166;
}

.work_timer {
  width: 100%;
  height: calc(100% - 32px);
  padding: 10px;
  overflow-x: hidden;
  overflow-y: auto;
}

.addtimer {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.work_input {
  width: 100%;
  height: 94%;
  overflow: hidden;
  padding: 5px;
  /* z-index: 999; */
}

.work_inputin {
  width: 100%;
  /* height: 91%; */
  border: 0;
}

.work_inspect_con {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 0 10px;
  font-size: 14px;
  color: #45494d;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 10px;
}

.work_inspecmint {
  margin-left: 20px;
}

.timer_picker {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.time_pick {
  display: flex;
  align-items: center;
  margin: 10px 0;
  /* justify-content: space-around; */
}

a-time-picker {
  width: 300px;
}

.atag {
  width: 180px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  justify-content: center;
  margin-bottom: 20px;
  margin-left: 10px;
  float: left;
}

.atag1 {
  width: 99%;
  max-width: 807px;
  /* height: 40px; */
  padding: 0 8px;
  line-height: 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 10px;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.marginl10 {
  margin-left: 10px;
}

.font14 {
  font-size: 14px;
}

.work_addcontainei {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.work_additem {
  width: 90%;
  /* margin-bottom: 10px; */
  /* height: 40px; */
}

.text_items {
  width: 100%;
  height: 80%;
  /* padding: 10px; */
  overflow-x: hidden;
  overflow-y: auto;
}

.item_text {
  width: 95%;
  word-wrap: break-word;
  word-break: normal;
  display: inline-block;
  /* overflow: auto; */
}

.delete_pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  /* background-color: #ced3d9; */
  /* color: #f2f6fa; */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 22px;
}

.work-note {
  margin-top: 20px;
  padding: 0 14px;
  background-color: white;
  width: 100%;
  height: 100%;

  .work_title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #3687d9;
    font-weight: 600;
  }

  .work_wrap {
    width: 100%;

    .work_top {
      display: flex;
      padding-top: 35px;
      border-bottom: 1px dashed #d9d9d9;

      .work_left {
        margin-left: 10px;
      }

      .work_right {
        margin-left: 25px;

        .row {
          display: flex;
          align-items: center;
          height: 56px;

          .time-setting {
            margin-left: 28px;
          }

          .add-reduce {
            display: flex;
            align-items: center;
            margin-left: 28px;

            button {
              height: 32px;
              width: 38px;
              border: 1px solid #d9d9d9;
              outline: none;
              background-color: transparent;
              cursor: pointer;

              &:focus {
                box-shadow: 0px 0px 6px 0px #7ebfff;
              }
            }

            input {
              height: 32px;
              width: 80px;
              text-align: center;
              border: 1px solid #d9d9d9;
              border-left: 0;
              border-right: 0;
              outline: none;
              background-color: transparent;
            }
          }

          .tips {
            margin-left: 18px;
            padding: 0 10px;
            height: 30px;
            display: flex;
            align-items: center;
            background-color: #f2f6fa;
            border-radius: 4px;
            position: relative;
            font-size: 14px;
            color: #a1a1a2;
          }
        }
      }
    }

    .work_bottom {
      display: flex;
      padding-top: 35px;

      .work_left {
        margin-left: 10px;
      }

      .work_right {
        margin-left: 25px;
        margin-bottom: 20px;

        .row {
          min-height: 120px;
          margin-top: 10px;

          &:first-child {
            margin-top: 0px;
          }

          .inpt {
            margin-top: 10px;
            display: flex;
            align-items: flex-end;

            textarea {
              min-height: 80px;
              width: 580px;
              padding-left: 5px;
            }
          }
        }
      }
    }
  }

  .work_border {
    border: 1px dashed #c4c8cc;
  }
}
</style>
<template>
  <div id="work">
    <!-- <div class="work">
      <div class="work_title">
        值班在岗检查设置
        <a-button type="primary" @click="commintTT" class="work_inspecmint">
          <a-icon type="check" />保存
        </a-button>
      </div>
      <div class="work_container">
        <div class="work_item">
          <div class="work_inspect">检查时间</div>
          <div class="work_timer">
            <div class="addtimer">
              <div class="marginl10 font14">检查开始时间：</div>
              <a-time-picker
                :disabledHours="disabledHoursS"
                :disabledMinutes="disabledMinutesS"
                :disabledSeconds="disabledSecondS"
                class="marginl10"
                placeholder="请选择~"
                v-model="startTime"
              >
                <a-icon type="calendar" />
              </a-time-picker>
              <div class="marginl10 font14">检查结束时间：</div>
              <a-time-picker
                :disabledHours="disabledHoursE"
                :disabledMinutes="disabledMinutesE"
                :disabledSeconds="disabledSecondE"
                @change="PstartTime"
                class="marginl10"
                placeholder="请选择~"
                v-model="endTime"
              >
                <a-icon type="calendar" />
              </a-time-picker>
              <a-button class="marginl10" style=" width: 84px;" @click="addTime" block>
                <icon-font type="icontianjia" />添加
              </a-button>
            </div>

            <a-tag class="atag" v-for="(item ,index) in inspectionTime" :key="index">
              {{item.startTime+'-'+item.endTime}} &nbsp;
              <icon-font style="font-size:16px" type="iconshanchu" @click="closeTag(index)" />
            </a-tag>
          </div>
        </div>
        <div class="work_item">
          <div class="work_inspect">检查要求</div>
          <div class="work_input">
            <div class="work_addcontainei">
              <a-input class="work_additem" v-model="text" placeholder="请输入检查要求~" />
              <a-button class="marginl10" @click="addText" style=" width: 84px;" block>
                <icon-font type="icontianjia" />添加
              </a-button>
            </div>
            <div class="text_items">
              <div class="atag1" v-for="(item ,index) in this.checkItems" :key="index">
                <div class="item_text">{{index+1}}.{{item.text}}</div>
                <div class="delete_pic">
                  &nbsp;
                  <icon-font style="font-size:16px" type="iconshanchu" @click="delateText(index)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div class="work1">
      <div class="work_title">
        押运检查设置
        <a-button type="primary" @click="getChangeT" class="work_inspecmint">
          <a-icon type="check" />
          保存
        </a-button>
      </div>
      <div class="work_container">
        <div class="work_item">
          <div class="work_inspect">检查时间间隔</div>
          <div class="work_inspect_con">
            <a-radio-group
              style="
                height: 32px;
                width: 100%;
                display: flex;
                align-items: center;
              "
              :value="reportType"
              @change="reportTypeToChange"
            >
              <a-radio :value="'1'"> 整点上报 </a-radio>
              <a-radio :value="'0'">
                <span class="check-time">检查时间间隔&nbsp;</span>
                <a-select
                  style="width: 120px"
                  defaultValue="30"
                  :value="escortTime"
                  @change="handleChange"
                  v-show="reportType == '0'"
                >
                  <a-select-option :value="30">30min</a-select-option>
                  <a-select-option :value="60">60min</a-select-option>
                  <a-select-option :value="120">2h</a-select-option>
                </a-select>
              </a-radio>
            </a-radio-group>
            <div style="margin: 10px 0">上报延时(分钟)：</div>
            <a-input-number
              id="inputNumber"
              :value="limitTime"
              @change="changeNumer"
              :min="min"
              :max="maxNumber"
            />
          </div>
          <!-- 允许 -->
          <div style="margin-left: 10px; display: flex">
            <label for="">app创建任务：</label>
            <a-checkbox :checked="appAddTask" @change="onAppAddTaskChange"
              >允许
            </a-checkbox>
            <!-- <span style="font-size:14px;margin-left:20px;color:#9933FF">勾选后，押运员APP端将无法自行创建押运任务</span> -->
          </div>
        </div>
        <div class="work_item">
          <div class="work_inspect">检查要求</div>

          <div class="work_input">
            <div class="work_addcontainei">
              <a-input
                class="work_additem"
                v-model="textBtom"
                placeholder="请输入检查要求~"
              />
              <a-button
                class="marginl10"
                @click="addTextBtom"
                style="width: 84px"
                block
              >
                <icon-font type="icontianjia" />
                添加
              </a-button>
            </div>
            <div class="text_items">
              <div
                class="atag1"
                v-for="(item, index) in checkItemsbotm"
                :key="index"
              >
                <div class="item_text">{{ index + 1 }}. {{ item.text }}</div>
                <div class="delete_pic">
                  &nbsp;
                  <icon-font
                    style="font-size: 16px"
                    type="iconshanchu"
                    @click="delateTextBtom(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 短信提醒设置 -->
    <!-- <div class="work-note">
      <div class="work_title">
        短信提醒设置
        <a-button type="primary" @click="saveNote" class="work_inspecmint">
          <a-icon type="check" />保存
        </a-button>
      </div>
      <div class="work_wrap work_border">
        <div class="work_top">
          <div class="work_left">事件设置：</div>
          <div class="work_right">
            <div class="row">
              <a-checkbox v-model="type1">制卷需求超时未上报</a-checkbox>
              <div class="time-setting">
                <label for="">超时时间设置：</label>
                <a-date-picker
                  placeholder="请设置超时时间"
                  style="width:280px;"
                  format="YYYY-MM-DD HH:mm:ss"
                  :disabled-date="disabledDate"
                  :disabled-time="disabledDateTime"
                  :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                  v-model="dateline"
                />
              </div>
            </div>
            <div class="row">
              <a-checkbox v-model="type2">制卷需求超时未审核</a-checkbox>
              <div class="add-reduce">
                <button @click="reduceOvertime">－</button>
                <input type="number" v-model="overtime">
                <button @click="addOvertime">＋</button>
                <span style="margin-left:15px;color:#A1A1A2">min</span>
              </div>
              <div class="tips"><a-icon type="exclamation-circle" style="margin-right:5px;"/>说明：全部下级完成需求上报后开始计算，{{overtime}}分钟未审核即发送</div>
            </div>
            <div class="row">
              <a-checkbox v-model="type3">制卷需求退回</a-checkbox>
              <div class="tips"><a-icon type="exclamation-circle" style="margin-right:5px;"/>说明：实时发送</div>
            </div>
            <div class="row">
              <a-checkbox v-model="type4">监考人员抽调</a-checkbox>
              <div class="tips"><a-icon type="exclamation-circle" style="margin-right:5px;"/>说明：生成押运任务后并确定押运人员后，发送通知给押运员</div>
            </div>
          </div>
        </div>
        <div class="work_bottom">
          <div class="work_left">短信内容：</div>
          <div class="work_right">
            <div v-if="type1" class="row">
              制卷需求超时未上报：
              <div class="inpt">
                <a-textarea v-model="message1" :maxLength= 70 />
                <span style="margin-left:5px">{{message1Length}}/70</span>
              </div>
            </div>
            <div v-if="type2"  class="row">
              制卷需求超时未审核：
              <div class="inpt">
                <a-textarea v-model="message2" :maxLength= 70 />
                <span style="margin-left:5px">{{message2Length}}/70</span>
              </div>
            </div>
            <div v-if="type3"  class="row">
              制卷需求退回：
              <div class="inpt">
                <a-textarea v-model="message3" :maxLength= 70 />
                <span style="margin-left:5px">{{message3Length}}/70</span>
              </div>
            </div>
            <div v-if="type4"  class="row">
              监考人员抽调：
              <div class="inpt" >
                <a-textarea v-model="message4" :maxLength= 70 />
                <span style="margin-left:5px">{{message4Length}}/70</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapActions, mapState, mapMutations } = createNamespacedHelpers(
  "workRequireMent"
);
import Vue from "vue";
import {
  Button,
  Icon,
  Input,
  Select,
  Modal,
  TimePicker,
  Tag,
  message,
  InputNumber,
} from "ant-design-vue";

Vue.prototype.$message = message;
import moment from "moment";

Vue.use(Input).use(Select).use(InputNumber);
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1814330_pl18gus56wg.js",
});
export default {
  components: {
    AButton: Button,
    AIcon: Icon,
    AModal: Modal,
    ATimePicker: TimePicker,
    ATag: Tag,
    IconFont,
  },
  data() {
    return {
      timeList: [], //时间数组
      startTime: "", //添加开始时间
      endTime: "", //添加结束时间
      // checkItems:[],//检查要求数组
      text: "",
      textBtom: "",
      value: "",
      min: 1,
      midChangeValue: "",
      defaultValue: null,
      islatt: false,
      // appAddTask: false,
      type1: false,
      type2: false,
      type3: false,
      type4: false,
      dateline: "",
      overtime: 0,
      message1:
        "本考区考试制卷需求超时未上报，请登陆管理平台上报考区制卷需求。",
      message2: "下级制卷需求已经上报完成，请及时登陆管理平台完成审核。",
      message3:
        "您的提交的制卷需求被上级退回，请及时登陆管理平台修改后再次提交。",
      message4:
        "[姓名]老师，您被选为[考试计划名]考试的监考人员，监考时间为[MM-DD-MM-DD]，监考考点：[考点名称]",
    };
  },
  created() {
    this.getDutyCheckConfAsync();
    this.getEscortCheckConfAsync();
    this.getSmsSettings();
  },
  mounted() {
  },
  computed: {
    ...mapState([
      "appAddTask",
      "inspectionTime",
      "checkItems",
      "escortTime",
      "limitTime",
      "checkItemsbotm",
      "maxNumber",
      "reportType",
    ]),
    message1Length() {
      return this.message1.trim().length;
    },
    message2Length() {
      return this.message2.trim().length;
    },
    message3Length() {
      return this.message3.trim().length;
    },
    message4Length() {
      return this.message4.trim().length;
    },
  },
  methods: {
    ...mapActions([
      "getDutyCheckConfAsync",
      "updateDutyCheckConfAsync",
      "getEscortCheckConfAsync",
      "updateEscortCheckConfAsync",
    ]),
    ...mapMutations([
      "addTimeItems",
      "addCheckItems",
      "delateTimeItem",
      "delateCheckItems",
      "getMaxNumber",
      "changeLimitTime",
      "addCheckItemsBtom",
      "delateCheckItemsBtom",
      "appAddTaskChange",
      "reportTypeChange",
    ]),
    moment,
    // 保存短信提醒设置
    saveNote() {
      let settings = [];
      const {
        type1,
        dateline,
        message1,
        type2,
        overtime,
        message2,
        type3,
        message3,
        type4,
        message4,
      } = this;
      // 选择的type1
      let obj1 = {
        type: "1",
        switch: type1 ? "1" : "0",
        dateline: dateline,
        message: message1,
        name: "制卷需求超时未上报",
        remark: "",
      };
      settings.push(obj1);
      // 选择的type2
      let obj2 = {
        type: "2",
        switch: type2 ? "1" : "0",
        overtime,
        message: message2,
        name: "制卷需求超时未审核",
        remark: "全部下级完成需求上报后开始计算，N分钟未审核即发送",
      };
      settings.push(obj2);
      // 选择的type3
      let obj3 = {
        type: "3",
        switch: type3 ? "1" : "0",
        message: message3,
        name: "制卷需求退回",
        remark: "实时发送",
      };
      settings.push(obj3);
      // 选择的type4
      let obj4 = {
        type: "4",
        switch: type4 ? "1" : "0",
        message: message4,
        name: "监考人员抽调",
        remark: "生成押运任务后并确定押运人员后，发送通知给押运员",
      };
      settings.push(obj4);
      if (type1 && !dateline) {
        return this.$message.warn("请设置超时时间！");
      }
      this.saveSmsSettings(settings);
    },
    reportTypeToChange(e) {
      this.getMaxNumber(60);
      this.reportTypeChange(e.target.value);
    },
    // 减少
    reduceOvertime() {
      if (this.overtime < 1) {
        return;
      }
      this.overtime--;
    },
    // 增加
    addOvertime() {
      this.overtime++;
    },
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    // 获取押运任务短信设置
    async getSmsSettings() {
      try {
        const res = await this.$api.workRequireMent.getSmsSettings();
        console.log(res);
        if (res.result) {
          const { data } = res;
          data.map((item) => {
            // 制卷需求超时未上报
            if (item.type == "1") {
              this.type1 = item.switch == "1" ? true : false;
              this.dateline = item.dateline;
              this.message1 = item.message;
            }
            if (item.type == "2") {
              this.type2 = item.switch == "1" ? true : false;
              this.overtime = item.overtime;
              this.message2 = item.message;
            }
            if (item.type == "3") {
              this.type3 = item.switch == "1" ? true : false;
              this.message3 = item.message;
              console.log(this.type3);
            }
            if (item.type == "4") {
              this.type4 = item.switch == "1" ? true : false;
              this.message4 = item.message;
            }
          });
        }
      } catch (error) {}
    },
    // 添加/更新押运任务短信设置
    async saveSmsSettings(data) {
      try {
        const res = await this.$api.workRequireMent.saveSmsSettings({
          settings: data,
        });
        console.log(res);
        if (res.result) {
          this.$message.success("保存成功！");
        } else {
          this.$message.error("保存失败！" + res.message);
        }
      } catch (error) {}
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf("day");
    },

    disabledDateTime() {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    },
    disabledHoursE(value) {
      if (this.startTime != "") {
        let i = moment(this.startTime).format("HH");
        // this.defaultValue=moment(this.startTime)
        let arr = [];
        for (let index = 0; index < i; index++) {
          arr.push(index);
        }
        return arr;
      }
    },
    disabledMinutesE(selectedHour) {
      if (this.startTime != "") {
        let i = moment(this.startTime).format("mm");
        let j = moment(this.startTime).format("HH");
        let arr = [];
        for (let index = 0; index < i; index++) {
          arr.push(index);
        }
        if (selectedHour > j) {
          return;
        }
        return arr;
      }
    },
    disabledSecondE(selectedHour, selectedMinute) {
      if (this.startTime != "") {
        let i = moment(this.startTime).format("ss");
        let k = moment(this.startTime).format("mm");
        let j = moment(this.startTime).format("HH");
        let arr = [];
        for (let index = 0; index <= i; index++) {
          arr.push(index);
        }
        if (selectedHour > j) {
          return;
        } else if (selectedHour == j && selectedMinute > k) {
          return;
        } else if (selectedHour == j && selectedMinute == k) {
          return arr;
        }
      }
    },
    disabledHoursS(value) {
      if (this.endTime != "") {
        let i = moment(this.endTime).format("HH");
        let arr = [];
        for (let index = 24; index > i; index--) {
          arr.push(index);
        }
        return arr;
      }
    },
    disabledMinutesS(selectedHour) {
      // console.log(selectedHour)
      if (this.endTime != "") {
        let i = moment(this.endTime).format("mm");
        let j = moment(this.endTime).format("HH");
        let arr = [];
        for (let index = 60; index > i; index--) {
          arr.push(index);
        }
        if (selectedHour < j) {
          return;
        }
        return arr;
      }
    },
    disabledSecondS(selectedHour, selectedMinute) {
      //  console.log(selectedHour,selectedMinute)
      if (this.endTime != "") {
        let i = moment(this.endTime).format("ss");
        let j = moment(this.endTime).format("HH");
        let k = moment(this.endTime).format("mm");
        let arr = [];
        for (let index = 60; index >= i; index--) {
          arr.push(index);
        }
        if (selectedHour < j) {
          return;
        } else if (selectedHour == j && selectedMinute < k) {
          return;
        } else if (selectedHour == j && selectedMinute == k) {
          return arr;
        }
      }
    },
    PstartTime(time, timeString) {
      this.islatt = false;
      // console.log(123,time, timeString)
      if (time < this.startTime) {
        // console.log(234)
        this.islatt = true;
      }
    },
    addTime() {
      // console.log(this.startTime, this.endTime);
      if (this.startTime == "") {
        this.$message.error("请先选择开始时间再添加~");
      } else if (this.endTime == "") {
        this.$message.error("请先选择结束时间再添加~");
      } else if (this.islatt == true) {
        this.$message.error("结束时间不能小于开始时间~");
      } else {
        let i = moment(this.startTime).format("HH:mm:ss");
        let j = moment(this.endTime).format("HH:mm:ss");
        let tep = {
          startTime: i,
          endTime: j,
        };
        this.addTimeItems(tep);
        this.startTime = "";
        this.endTime = "";
      }
    },
    closeTag(e) {
      // console.log(e);
      this.delateTimeItem(e);
    },
    addText() {
      if (this.text == "") {
        this.$message.error("请先输入检查要求再添加~");
      } else {
        let tep = {
          text: this.text,
          id: "",
        };
        this.addCheckItems(tep);
        this.text = "";
      }
    },
    delateText(e) {
      this.delateCheckItems(e);
    },
    commintTT() {
      this.updateDutyCheckConfAsync();
    },
    changeNumer(value) {
      // console.log(value)
      this.changeLimitTime(value);
    },
    handleChange(value) {
      this.midChangeValue = value;
      this.getMaxNumber(value);
    },
    // app创建任务：
    onAppAddTaskChange(e) {
      let checked = e.target.checked;
      this.appAddTaskChange(checked);
    },
    addTextBtom() {
      if (this.textBtom == "") {
        this.$message.error("请先输入检查要求再添加~");
      } else {
        let tep = {
          text: this.textBtom,
          id: "",
        };
        this.addCheckItemsBtom(tep);
        this.textBtom = "";
      }
    },
    delateTextBtom(e) {
      this.delateCheckItemsBtom(e);
    },
    getChangeT() {
      this.updateEscortCheckConfAsync();
    },
  },
};
</script>

<style lang="less" scoped>
#work {
  background: white;
}
/deep/ .ant-radio-wrapper {
  display: inline-flex;
  align-items: center;
}
/deep/ .ant-radio-wrapper span {
  display: inline-block;
}
/deep/ .ant-radio-wrapper .check-time {
  display: inline-flex;
  align-items: center;
  height: 32px;
}
</style>