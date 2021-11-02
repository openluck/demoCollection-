<!--
 * @Descripttion: 编辑时间节次方案
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-10 14:20:19
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-30 17:04:34
-->
<template>
  <div
    class="yqy-edit-time-plan"
    ref="yqy-edit-time-plan"
  >
    <header class="back common-title">
      <div class="back-left">
        <!-- <a-icon type="left-circle" style="fontSize:22px;color:#929599;margin-right:10px"/> -->
        <svg-icon
          icon-class="lesSort_back"
          style="fontSize:22px;margin-right: 10px;vertical-align: middle"
          @click.native="toPage('/LesSortManage/TimePlan')"
        >
        </svg-icon>
        <span>{{onlyShow?'查看':form.timePlanId?'编辑':'创建'}}节次时间方案</span>
      </div>
      <div class="back-right">
        <template v-if="!onlyShow">
          <a-button @click="toPage('/LesSortManage/TimePlan')">取消</a-button>
          <a-button
            type="primary"
            :loading="btnLoading"
            @click="save()"
          >保存</a-button>
        </template>
        <a-button
          v-else
          @click="toPage('/LesSortManage/TimePlan')"
        >返回</a-button>
      </div>
    </header>

    <div
      class="content"
      v-loading="loading"
    >
      <div class="content-left">
        <a-form-model
          class="form"
          ref="form"
          :model="form"
          :rules="rules"
          layout="inline"
        >
          <a-form-model-item
            label="方案名称"
            prop="timePlanName"
            ref="timePlanName"
          >
            <InputSuffix
              v-model.trim="form.timePlanName"
              placeholder="请输入方案名称"
              @blurEvent="$refs.timePlanName.onFieldBlur()"
              :disabled="onlyShow"
              :limit="25"
            />
          </a-form-model-item>
          <a-form-model-item
            label="重复周期"
            prop="dateList"
            ref="dateList"
          >
            <a-range-picker
              v-model="form.dateList"
              format="MM-DD"
              style="width:280px;z-index:9"
              :disabled="onlyShow"
              valueFormat="MM-DD"
              :getCalendarContainer="(v) => v.parentNode"
            >
              <template v-slot:suffixIcon>
                <svg-icon
                  icon-class="menu_2"
                  style="margin-top: -8px;width: 16px;"
                />
              </template>
            </a-range-picker>
          </a-form-model-item>
        </a-form-model>

        <!-- 节次列表 -->
        <div class="list">
          <div
            class="list-item"
            v-for="(item) in showLesSortIndex"
            :key="item.lesSortIndex"
          >
            <span class="index">{{item.lesSortIndex}}</span>
            <div class="name-box box">
              <span class="box-title">节次名</span>
              <span
                class="box-text"
                :title="item.lesSortName"
              >{{item.lesSortName}}</span>
            </div>
            <div class="type-box box">
              <span class="box-title">类型</span>
              <!-- <span class="box-text">{{item.lesSortType==="0"?"非授课":"授课"}}</span> -->
              <span
                v-if="item.lesSortType==='1'"
                class="box-text"
                :title="`授课(${item.lesType==='0'?'非自习':'自习'})`"
              >授课 ({{item.lesType==="0"?"非自习":"自习"}})</span>
              <span
                v-else-if="item.lesSortType==='0'"
                class="box-text"
                :title="`非授课`"
              >非授课</span>
            </div>
            <div class="show-box box">
              <span class="box-title">所属时段</span>
              <span
                class="box-text"
                :title="item.belongDiffNoonName"
              >{{item.belongDiffNoonName}}</span>
            </div>
            <div
              class="time-box box"
              :class="onlyShow?'time-text-box':''"
            >
              <span class="box-title">起止时间 <span
                  v-if="conflictArr.includes(item.lesSortIndex)"
                  class="conflict-item"
                >时间冲突</span> </span>
              <div class="box-text">
                <template v-if="!onlyShow">
                  <a-time-picker
                    v-model="item.startTime"
                    format="HH:mm"
                    valueFormat="HH:mm:ss"
                    placeholder="-- : --"
                    :getPopupContainer="(v) => v.parentNode"
                  >
                    <template v-slot:suffixIcon>
                      <svg-icon
                        icon-class="lesSort_time"
                        style="color:#2ABF8E;width:14px;height:14px;"
                      />
                    </template>
                  </a-time-picker>~
                  <a-time-picker
                    v-model="item.endTime"
                    format="HH:mm"
                    valueFormat="HH:mm"
                    placeholder="-- : --"
                    :getPopupContainer="(v) => v.parentNode"
                  >
                    <template v-slot:suffixIcon>
                      <svg-icon
                        icon-class="lesSort_time"
                        style="color:#2ABF8E;width:14px;height:14px;"
                      />
                    </template>
                  </a-time-picker>
                </template>
                <span v-else>{{formatTime(item.startTime)}} ~
                  {{formatTime(item.endTime)}}</span>
              </div>
            </div>
            <div class="spacing-box box">
              <span class="box-title">时间跨度</span>
              <span class="box-text">
                {{computedHoursMins(item.startTime,item.endTime).h+"时"+computedHoursMins(item.startTime,item.endTime).m+"分"}}
                <!-- {{computedHoursMins(item.startTime,item.endTime).m}} 分钟 -->
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 应用对象 -->
      <div
        class="content-right"
        v-loading="treeLoading"
      >
        <span class="content-right-title">选择应用对象</span>
        <div
          class="all-sec"
          v-if="form.timePlanType === '1'"
        >全学段</div>
        <div
          v-else-if="form.timePlanType === '2'"
          class="grade"
        >
          <a-radio-group
            v-model="form.timePlanDimension"
            @change="changeApplyDimension"
            :disabled="onlyShow"
          >
            <a-radio value="2-1">年级</a-radio>
            <a-radio value="2-2">班级</a-radio>
          </a-radio-group>
          <a-tree
            v-if="classTree.length"
            v-model="applyList"
            checkable
            :selectable="false"
            :tree-data="classTree"
            :showLine="true"
            :load-data="onLoadData"
            @check="checkNode"
            :disabled="onlyShow"
            :autoExpandParent="true"
            :defaultExpandAll="true"
          />
        </div>
        <div
          v-else-if="form.timePlanType === '3'"
          class="building"
        >
          <a-radio-group
            v-model="form.timePlanDimension"
            @change="changeApplyDimension"
            :disabled="onlyShow"
          >
            <a-radio value="3-1">楼栋</a-radio>
            <a-radio value="3-2">楼层</a-radio>
            <a-radio value="3-3">房间</a-radio>
          </a-radio-group>
          <a-tree
            v-if="palceRoomTree.length"
            v-model="applyList"
            checkable
            :selectable="false"
            :tree-data="palceRoomTree"
            :showLine="true"
            :showIcon="false"
            @check="checkNode"
            :disabled="onlyShow"
            :defaultExpandedKeys="openNode"
            :replaceFields="{children:'children', title:'buildingName', key:'buildingId' }"
          >
            <!-- <div slot="switcherIcon" slot-scope="t">{{t}}</div> -->
            <!-- <a-icon slot="switcherIcon" type="form" /> -->
            <!-- <a-icon slot="ok" type="form" /> -->
            <template #switcherIcon>
              <a-icon type="caret-down" />
            </template>
            <!-- <a-icon slot="icon" type="carry-out" /> -->
          </a-tree>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import InputSuffix from "@/components/InputSuffix";
export default {
  name: "",
  components: { InputSuffix },
  data() {
    return {
      onlyShow: true, //false:可编辑  true:仅查看
      loading: false,
      treeLoading: false,
      btnLoading: false,
      secList: [],
      placeTree: [],
      treeData: [],
      applyList: [],
      applyNameList: [],
      lesSortList: [],
      form: {
        timePlanId: null,
        timePlanName: "",
        startDate: "00:00:00",
        endDate: "00:00:00",
        timePlanType: null,
        timePlanDimension: null,
        dateList: []
      },
      rules: {
        // timePlanName: [{ required: true, message: "" }],
        // dateList: [{ required: true, message: "" }],
      },
      conflictArr: [], //冲突项id数组
      hasRequestList: [],

      openNodeKeys: [],
      originLesSortList: [],
      originData: {},

      teachTimeChange: false, //授课节次项时间发生变化
      noTeachTimeChange: false //非授课节次项时间发生变化
    };
  },
  computed: {
    curSec() {
      return this.$store.state.lesSort.curSec;
    },
    timePlanList() {
      return this.$store.state.lesSort.timePlanList;
    },
    showLesSortIndex() {
      const arr = [...this.lesSortList];
      arr.sort((a, b) => a.lesSortIndex - b.lesSortIndex);
      return arr;
    },
    flatPlaceTree() {
      let arr = this.flatList(this.placeTree)
      return arr
    },
    openNode() {
      if (this.applyList.length) {
        this.findParents(this.applyList, this.flatPlaceTree)
        // console.log(this.openNodeKeys, this.classTree);
        return this.openNodeKeys
      } else {
        const arr = this.findFirst(this.palceRoomTree)
        return arr
      }
    },
    classTree() {
      switch (this.form.timePlanDimension) {
        case "2-1":
          return this.secList.map((item) => {
            const children = item.children.map((i) => ({
              ...i,
              isLeaf: true,
              children: []
            }));
            return { ...item, children, checkable: false };
          });
        case "2-2":
          return this.secList.map((item) => {
            const children = item.children.map((i) => ({
              ...i,
              isLeaf: false,
              checkable: false,
              children: i.children ? i.children : [],
              secId: item.secId
            }));
            return { ...item, children, checkable: false };
          });
        default:
          return [];
      }
    },
    palceRoomTree() {
      switch (this.form.timePlanDimension) {
        case "3-1":
          return this.dealTreeNode(this.placeTree, 2);
        case "3-2":
          return this.dealTreeNode(this.placeTree, 3);
        case "3-3":
          return this.dealTreeNode(this.placeTree, 4);
        default:
          return [];
      }
    }
  },
  watch: {
    "form.timePlanType"(val) {
      switch (val) {
        case "2":
          this.getBasicList();
          break;
        case "3":
          // this.getPlaceTree();
          // if (this.$store.state.lesSort.placeTree.length) {
          //   this.placeTree = this.$store.state.lesSort.placeTree
          // } else {
          this.getAllPlaceTree();
          // }
          break;
        default:
          this.applyList = [this.curSec.secId];
          this.applyNameList = [this.curSec.secName];
          break;
      }
    }
  },
  created() {
    const timePlanId = this.$store.state.lesSort.timePlanId;
    timePlanId ? (this.form.timePlanId = timePlanId) : null;
    const dis = this.$store.state.lesSort.dis;
    this.onlyShow = dis !== "t";
  },
  mounted() {
    if (this.form.timePlanId) {
      //编辑
      this.getTimePlanInfo(this.form.timePlanId);
    } else {
      //新增
      this.form.timePlanType = this.$store.state.lesSort.timePlanType;
      this.form.timePlanDimension = this.form.timePlanType + "-1";
      this.getLesSortPlanInfo({
        secId: this.curSec.secId,
        lesSortPlanId: this.$store.state.lesSort.lesSortPlanId
      });
    }
  },
  methods: {
    toPage(url) {
      this.$router.push(url);
    },
    findParents(idList, treeList) {
      if (!idList.length) {
        this.openNodeKeys = []
        return
      }
      let arr = [...idList];
      let temp = [] //存放最近一级父级id list
      for (let i = 0, j = treeList.length; i < j; i++) {
        let index = arr.indexOf(treeList[i].buildingId)
        if (index > -1) {
          arr.splice(index, 1)
          if (treeList[i].parentId) {
            temp.push(treeList[i].parentId)
            this.openNodeKeys.push(treeList[i].parentId)
          } else {
            return this.openNodeKeys
          }
          if (!arr.length) {
            break;
          }
        }
      }
      this.findParents(temp, treeList)
    },
    findFirst(tree, list = []) {
      list.push(tree[0].buildingId)
      if (tree[0].children && tree[0].children instanceof Array && tree[0].children.length) {
        this.findFirst(tree[0].children, list)
      }

      return list
    },
    /**
     * @description: 树结构扁平化
     * @param {*} list 树结构
     * @param {*} arr 不传
     * @return {*}
     * @author: 
     */
    flatList(list, arr = []) {
      for (let i of list) {
        arr.push(i);
        if (i.children && i.children instanceof Array && i.children.length > 0) {
          this.flatList(i.children, arr)
        }
      }
      return arr
    },
    /**
     * @description: 处理树结构数据
     * @param {*} data 树结构数据
     * @param {*} type 处理到层级的 type
     * @return {*}
     * @author:
     */
    dealTreeNode(data, type) {
      return data.map((item) => {
        let children = [];
        if (item.children) {
          if (item.children.length > 0) {
            children = this.dealTreeNode(item.children, type);
          }
        }

        if (item.buildingType < type) {
          // return { ...item, children, isLeaf: false, checkable: false } //强制设置isLeaf
          return { ...item, children, checkable: false, disableCheckbox: true }; //isLeaf 用item自带
        } else if (item.buildingType - 0 === type - 0) {
          return {
            ...item,
            children: [],
            isLeaf: true,
            checkable: true
            // slots: { icon: 'meh' }
            // scopedSlots: { switcherIcon: 'ok' }
          };
        } else {
          return { ...item, children: [] };
        }
      });
    },

    changeApplyDimension() {
      this.applyList = [];
    },

    checkNode(checkedKeys, { checkedNodes }) {
      console.log(checkedKeys);
      console.log(checkedNodes);
      this.applyNameList = checkedNodes.map((i) => {
        return i.data.props.title;
      });
    },

    async onLoadData({ dataRef }) {
      const { key, gradeId, secId, buildingType, buildingId } = dataRef;
      if (gradeId) {
        //如果是年级
        const children = await this.getClassByGrade({ gradeId, secId });
        this.pushChildren(this.secList, key, children, "2");
        this.secList = [...this.secList];
      } else if (buildingType - 0 === 3) {
        //如果是楼层
        const children = await this.getClassroom({ buildingId: buildingId });
        this.pushChildren(this.placeTree, buildingId, children, "3");
        this.placeTree = [...this.placeTree];
      }
    },

    formatTime(str) {
      if (str) {
        return str.slice(0, 5);
      } else {
        return "--";
      }
    },

    /**
     * @description: 向树结构添加异步获取的数据，给场所树中的楼层添加请求回来的教室数据
     * @param {*} data 树结构数据
     * @param {*} targetKey 欲添加的节点的key
     * @param {*} children  欲添加的数据
     * @param {*} type  "2"年级班级树    "3"场所树
     * @return {*}
     * @author: yqy
     */
    pushChildren(data, targetKey, children, type) {
      for (let item of data) {
        if (item.key === targetKey) {
          item.children = children;
          // return
        } else {
          if (type === "2" && !item.classId) {
            this.pushChildren(item.children, targetKey, children, type);
          } else if (type === "3" && item.buildingType < 3) {
            this.pushChildren(item.children, targetKey, children, type);
          }
        }
      }
    },

    arrayEquals(array1, array2) {
      return (
        array1.length === array2.length &&
        array1.every((i) => array2.includes(i))
      );
    },
    judgeTimeChange(orgList, newList) {
      for (let i = 0, j = orgList.length; i < j; i++) {
        if (
          orgList[i].startTime !== newList[i].startTime ||
          orgList[i].endTime !== newList[i].endTime
        ) {
          if (orgList[i].lesSortType === "1") {
            this.teachTimeChange = true
            return true
          } else {
            this.noTeachTimeChange = true
          }
          // return true; //某个授课节次时间改变了
        }
      }
      return false;
    },

    async save() {
      let timeResult = true;
      let nameResult = true;
      let dataResult = true;
      let applyReslut = true;
      if (!this.lesSortList.every((i) => i.startTime && i.endTime)) {
        timeResult = false;
      }
      if (!this.form.timePlanName) {
        nameResult = false;
      }
      if (!this.form.dateList.length) {
        dataResult = false;
      }
      const { applyList, applyNameList, lesSortList } = this;
      if (!applyList.length) {
        applyReslut = false;
      }
      //判断名称是否重复
      const repeatName = this.timePlanList.some(i => i.timePlanName === this.form.timePlanName && (this.form.timePlanId ? i.timePlanId !== this.form.timePlanId : true))
      if (timeResult && nameResult && dataResult && applyReslut && !repeatName) {
        const {
          timePlanName,
          timePlanType,
          timePlanDimension,
          dateList,
          timePlanId
        } = this.form;
        const { lesSortPlanId } = this.$store.state.lesSort;
        let conflictArr = [];
        const arr = lesSortList
          .map((i) => ({
            lesSortIndex: i.lesSortIndex,
            startTime: i.startTime.slice(0, 5),
            endTime: i.endTime.slice(0, 5)
          }))
          .filter((i) => i.startTime || i.endTime);
        const stanArr = arr.filter((i) => i.startTime || i.endTime);

        for (let i = 0, j = arr.length; i < j; i++) {
          if (arr[i].startTime === arr[i].endTime) {
            conflictArr.push(arr[i].lesSortIndex);
            continue
          }
          for (let x = i + 1, y = stanArr.length; x < y; x++) {
            if (!this.inRange(stanArr[x], arr[i])) {
              conflictArr.push(stanArr[x].lesSortIndex);
              conflictArr.push(arr[i].lesSortIndex);
            }
          }
        }
        this.conflictArr = conflictArr;
        if (conflictArr.length) {
          return;
        }

        let result;
        if (timePlanId) {
          //编辑
          let applyChange = false;
          let dateChange = false;
          let timeChange = false;
          if (!this.arrayEquals(this.originData.applyList, applyList)) {
            applyChange = true;
          }
          if (
            !this.arrayEquals(
              [this.originData.startDate, this.originData.endDate],
              dateList
            )
          ) {
            dateChange = true;
          }
          timeChange = this.judgeTimeChange(this.originLesSortList, lesSortList);
          // if (applyChange || dateChange || timeChange) {
          this.$confirm({
            // title: (applyChange || dateChange || timeChange) ? `${timeChange ? "授课节次项时间 " : ""}${dateChange ? "重复周期 " : ""
            //   }${applyChange ? "应用对象 " : ""
            //   }修改后对应的课表将被删除，确定继续修改？` : "修改时间方案后对应使用的课表也会发生变化，确定继续修改吗？",
            title: () => {
              if (applyChange || dateChange || timeChange) {
                return <span>{timeChange ? "授课节次项时间" : ""}{dateChange ? "重复周期" : ""}{applyChange ? "应用对象" : ""}修改后对应的课表将被<span style="color:#F64646">删除</span>，确定继续修改？</span>
              } else {
                return <span>修改时间方案后对应使用的课表也会发生变化，确定继续修改吗？</span>
              }
            },
            onOk: async () => {
              let result1 = await this.updateTimePlan({
                timePlanId,
                timePlanType,
                timePlanDimension,
                timePlanName: timePlanName,
                startDate: "1972-" + dateList[0],
                endDate: "1972-" + dateList[1],
                //应后端需求拼上1972的年份
                applyList,
                applyNameList,
                lesSortList: arr
              });
              if (result1) {
                this.toPage("/LesSortManage/TimePlan");
              }
            }
          });
        } else {
          result = await this.addTimePlan({
            lesSortPlanId,
            timePlanType,
            timePlanDimension,
            timePlanName: timePlanName,
            startDate: "1972-" + dateList[0],
            endDate: "1972-" + dateList[1],
            applyList,
            applyNameList,
            lesSortList: arr
          });
        }
        if (result) {
          this.toPage("/LesSortManage/TimePlan");
        }
      } else {
        this.$error({
          title: <span style={{ color: '#F25555', fontSize: "16px" }}> {this.form.timePlanId ? '修改' : "创建"}失败</span >,
          content: () => {
            return (<div>
              {!nameResult ? <div style={{ fontSize: '14px', color: "#303233" }}>请填写方案名称</div> : ""}
              {repeatName ? <div style={{ fontSize: '14px', color: "#303233" }}>方案名称重复</div> : ""}
              {!dataResult ? <div style={{ fontSize: '14px', color: "#303233" }}>请选择重复周期</div> : ""}
              {!timeResult ? <div style={{ fontSize: '14px', color: "#303233" }}>请完善节次项时间</div> : ""}
              {!applyReslut ? <div style={{ fontSize: '14px', color: "#303233" }}>请选择应用对象</div> : ""}
            </div>
            )
          }
        });
      }
    },

    /**
     * @description: 根据开始时间，结束时间计算时间跨度
     * @param {*} sTime 开始时间
     * @param {*} eTime 结束时间
     * @return {*} {h:小时跨度,m:分钟跨度}
     * @author: 
     */
    computedHoursMins(sTime, eTime) {
      if (!(sTime && eTime)) {
        return { h: "-", m: "-" };
      }
      let sH = sTime.split(":")[0] - 0; //取小时分钟数，并转化成数字
      let sM = sTime.split(":")[1] - 0;
      let eH = eTime.split(":")[0] - 0;
      let eM = eTime.split(":")[1] - 0;
      let rH, rM;
      if (eM < sM) {
        rM = eM - sM + 60;
        rH = eH - sH - 1;
      } else {
        rM = eM - sM;
        rH = eH - sH;
      }
      rH < 0 ? (rH += 24) : null; //计算结果若小时数小于0 ，则不上24小时
      return { h: rH < 10 ? "0" + rH : rH, m: rM < 10 ? "0" + rM : rM };
    },

    /**
     * @description: 判断 item 和 targetTime 是否有交叉
     * @param {*} item
     * @param {*} targetTime
     * @return {*}
     * @author:
     */
    inRange(item, targetTime) {
      // let { startTime, endTime } = item;
      let startTime = item.startTime.slice(0, 5); //.slice(0, 5) 去掉秒钟数
      let endTime = item.endTime.slice(0, 5);
      let tarStart = targetTime.startTime.slice(0, 5);
      let tarEnd = targetTime.endTime.slice(0, 5);
      if (startTime === tarStart || endTime === tarEnd) {
        return false
      }
      if (startTime < tarStart && tarStart < endTime) {
        return false;
      } else if (startTime < tarEnd && tarEnd < endTime) {
        return false;
      } else if (tarStart < startTime && startTime < tarEnd) {
        return false;
      } else if (tarStart < endTime && endTime < tarEnd) {
        return false;
      }
      return true;
    },

    /**
     * @description: 给场所树中每个节点添加 key 和 title
     * @param {*} data 场所树数据
     * @return {*} 处理好的场所树
     * @author: yqy
     */
    createTreeData(data) {
      return data.map((item) => {
        if (item.children) {
          if (item.children.length > 0) {
            const children = this.createTreeData(item.children);
            return {
              ...item,
              children,
              key: item.buildingId,
              title: item.buildingName
            };
          }
        }
        return {
          ...item,
          children: [],
          key: item.buildingId,
          title: item.buildingName
        };
      });
    },

    //获取时间方案详情
    async getTimePlanInfo(timePlanId) {
      this.loading = true;
      try {
        const res = await this.$api.timePlan.getTimePlanInfo({ timePlanId });
        if (res.code === "200" && res.result) {
          if (res.data) {
            const {
              lesSortList,
              applyList,
              applyNameList,
              timePlanId,
              timePlanName,
              timePlanType,
              timePlanDimension,
              startDate,
              endDate
            } = res.data;
            this.lesSortList = lesSortList;
            this.applyList = applyList;
            this.applyNameList = applyNameList;
            this.form = { timePlanId, timePlanName, timePlanType, timePlanDimension, startDate, endDate, dateList: [startDate, endDate] }
            this.originData = { applyList, startDate, endDate };
            this.originLesSortList = lesSortList
              .sort((a, b) => a.lesSortIndex - b.lesSortIndex)
              .map((i) => ({ ...i }));
          }
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.loading = false;
      }
    },

    //新增时间方案
    async addTimePlan(data) {
      this.btnLoading = true;
      try {
        const res = await this.$api.timePlan.addTimePlan(data);
        if (res.code === "200" && res.result) {
          if (res.data) {
            this.$message.success("创建成功");
            return true;
          }
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.btnLoading = false;
      }
    },

    //修改时间方案
    async updateTimePlan(data) {
      this.btnLoading = true;
      try {
        const res = await this.$api.timePlan.updateTimePlan(data);
        if (res.code === "200" && res.result) {
          if (res.data) {
            this.$message.success("修改成功");
            return true;
          }
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.btnLoading = false;
      }
    },

    //获取节次方案详情，节次项数据
    async getLesSortPlanInfo(data) {
      this.loading = true;
      try {
        const res = await this.$api.lesSortSetting.getLesSortPlanInfo(data);
        if (res.code === "200" && res.result) {
          if (res.data) {
            this.lesSortList = res.data.lesSortList;
          }
        } else {
          this.$message.warn(res.message);
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.loading = false;
      }
    },

    //获取年级
    async getBasicList() {
      this.treeLoading = true;
      try {
        const res = await this.$api.common.getBasicList();
        if (res.code === "200") {
          //筛选当前学段下的年级并且生成树结构需要的数据类型
          const arr = res.data.secList
            .filter((i) => i.secId === this.curSec.secId)
            .map((item) => {
              item.children = item.gradeList || item.children;
              const children = item.children.map((i) => ({
                ...i,
                title: i.gradeName,
                key: i.gradeId,
                children: []
              }));
              return {
                ...item,
                title: item.secName,
                key: item.secId,
                children
              };
            });
          this.secList = arr;
        } else {
          this.secList = [];
          this.$message.warn("获取数据失败");
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.treeLoading = false;
      }
    },

    //获取班级
    async getClassByGrade(data) {
      try {
        const res = await this.$api.common.getClassByGrade(data);
        if (res.code === "200" && res.result) {
          return res.data.map((i) => ({
            ...i,
            key: i.classId,
            title: i.className,
            isLeaf: true
          }));
        } else {
          this.$message.warn("获取数据失败");
          return [];
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.treeLoading = false;
      }
    },

    //获取场所树 到楼层
    async getPlaceTree() {
      this.treeLoading = true;
      try {
        const res = await this.$api.common.getPlaceTree();
        if (res.code === "200" && res.result) {
          // this.placeTree = this.createTreeData(res.data)
          this.placeTree = this.createTreeData([res.data]);
        } else {
          this.placeTree = [];
          this.$message.warn("获取数据失败");
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.treeLoading = false;
      }
    },
    //获取场所树 到楼层
    async getAllPlaceTree() {
      this.treeLoading = true;
      try {
        const res = await this.$api.common.getAllPlaceTree();
        if (res.code === "200" && res.result) {
          // this.placeTree = this.createTreeData(res.data)
          this.placeTree = [res.data];
          this.$store.commit("lesSort/changePlaceTree", [res.data])
          // this.$store.commit("lesSort/changePlaceTree", [res.data])
        } else {
          this.placeTree = [];
          this.$message.warn("获取数据失败");
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.treeLoading = false;
      }
    },

    //根据楼层获取教室
    async getClassroom(data) {
      try {
        const res = await this.$api.common.getClassroom(data);
        if (res.code === "200" && res.result) {
          return res.data.map((i) => ({
            ...i,
            key: i.classroomId,
            title: i.classroomName
          }));
        } else {
          this.$message.warn("获取数据失败");
          return [];
        }
      } catch (error) {
        this.$message.warn(error);
      } finally {
        this.treeLoading = false;
      }
    }
  }
};
</script>
 
<style scoped lang = "less">
.yqy-edit-time-plan {
  height: calc(100vh - 115px);
  position: relative;
  .back {
    height: 56px;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6e8eb;
    .back-left {
      span {
        color: #303233;
        font-size: 18px;
        vertical-align: middle;
      }
    }
  }

  .content {
    height: calc(100% - 56px);
    display: flex;
    .content-left {
      padding: 24px;
      width: 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      padding-right: 0;
      padding-bottom: 0;
    }

    .content-right {
      /* width: 415px; */
      width: 27%;
      max-width: 440px;
      min-width: 340px;
      overflow-y: auto;
      padding: 24px;
      border-left: 1px solid #e6e8eb;
      display: flex;
      flex-direction: column;
      .all-sec {
        /* width: 336px; */
        height: 48px;
        font-size: 18px;
        color: #303233;
        line-height: 48px;
        text-align: center;
        background: #fafbfc;
      }
      .content-right-title {
        display: inline-block;
        color: #303233;
        font-size: 16px;
        margin-bottom: 24px;
        &::before {
          display: inline-block;
          margin-right: 4px;
          color: #f5222d;
          font-size: 14px;
          content: "*";
        }
      }
      /deep/.ant-tree-title {
        width: 180px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .form {
      padding-right: 24px;
      margin-bottom: 16px;
      .ant-input-affix-wrapper {
        width: 430px;
      }
    }
    .list {
      height: 0;
      overflow-y: auto;
      flex-grow: 1;
      padding-right: 24px;
      padding-bottom: 8px;
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 64px;
        margin-bottom: 16px;
        border: 1px solid #eceef0;
        padding: 0 24px;
        padding-right: 0;
        background: #fafbfc;
        .index {
          display: inline-block;
          width: 32px;
          height: 32px;
          margin-right: 7%;
          /* margin-right: 72px; */
          background: #eaf9f4;
          border: 2px solid #2abf8e;
          border-radius: 50%;
          font-size: 16px;
          color: @primary-color;
          text-align: center;
          line-height: 28px;
        }
        .box {
          display: flex;
          flex-direction: column;
          margin-right: 16px;
          /* outline: 1px solid red; */
        }
        .box-title {
          color: #aaaeb2;
          font-size: 14px;
        }
        .box-text {
          position: relative;
          color: #494b4d;
          font-size: 16px;
          height: 24px;
        }
        .name-box,
        .type-box,
        .show-box {
          width: 0;
          flex-grow: 1;
          .box-text {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .type-box {
          min-width: 60px;
          flex-grow: 1;
        }
        .spacing-box {
          width: 80px;
        }
        .time-box {
          width: 180px;
          .ant-time-picker {
            width: 70px;
          }
          /deep/.ant-time-picker-input {
            cursor: pointer;
            border: 0;
            padding: 0;
            background-color: #fafbfc;
            font-size: 16px;
            color: #494b4d;
          }
          /deep/.ant-time-picker-icon,
          /deep/.ant-time-picker-clear {
            right: 5px;
          }
        }
        .time-text-box {
          width: 120px;
        }
        .ant-btn-link {
          color: #616366;
          font-size: 14px;
        }
        .svg-icon.disable {
          color: #aaaeb2;
          cursor: not-allowed;
        }
        .conflict-item {
          color: red;
        }
      }
    }

    .building {
      height: 0;
      flex-grow: 1;
    }

    /deep/.ant-calendar-year-select {
      display: none;
    }
    /deep/.ant-time-picker-panel-inner {
      width: 100px;
    }
    /deep/.ant-time-picker-panel-select {
      width: 50px;
    }
    /deep/.ant-form-item-label label::before {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      content: "*";
    }
    /deep/.ant-calendar-month-panel-year-select {
      display: none;
    }
  }
}
</style>