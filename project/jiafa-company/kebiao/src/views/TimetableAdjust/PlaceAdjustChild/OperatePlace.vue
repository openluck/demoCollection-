<!--
 * @Description: 场所调整弹窗
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-17 14:36:35
 * @LastEditors: cb
 * @LastEditTime: 2021-09-28 15:24:22
-->
<!--
 * @Description: 
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-17 10:27:45
 * @LastEditors: cb
 * @LastEditTime: 2021-08-17 14:19:27
-->
<template>
  <div class="">
    <global-modal
      :visible="OperatePlaceVisible"
      :title="entTitle"
      :width="680"
      :defaultBtn="false"
      @cancel="OperatePlaceVisible = false"
    >
      <div class="cb-modal-content">
        <a-form-model ref="searchData" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="可调整场所">
            <a-tree-select
              style="width:240px;"
              v-model="placeId"
              :replace-fields="replaceFields"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeDataTemp"
              placeholder="请选择场所"
              @change="treeChange"
            />
          </a-form-model-item>
          <a-form-model-item label="应用到其他周次">
            <div class="cb-record">
              <div class="cb-record-tit">
                <a-checkbox
                  style="width: 91px"
                  @change="(e) => checkAll(e, 0)"
                  :checked="all"
                  >全部</a-checkbox
                >
                <a-checkbox
                  style="width: 91px"
                  @change="(e) => checkAll(e, 1)"
                  :checked="two"
                  >全部双周</a-checkbox
                >
                <a-checkbox @change="(e) => checkAll(e, 2)" :checked="one"
                  >全部单周</a-checkbox
                >
              </div>
              <a-checkbox-group v-model="value" @change="onChange" class="cb-record-item">
                <a-row>
                  <a-col
                    :title="item.label"
                    :span="6"
                    v-for="(item, index) in options"
                    :key="index"
                  >
                    <a-checkbox
                      :title="item.label"
                      :disabled='item.value === teachWeekId ? true : false'
                      style="
                        width: 120px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      "
                      :value="item.value"
                      >{{ item.label }}</a-checkbox
                    >
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </div>
          </a-form-model-item>
        </a-form-model>
      </div>
      <template #selfBtn>
        <div style="text-align: center">
          <a-button style="margin-right: 15px" @click="cancel"> 取消 </a-button>
          <a-button type="primary" @click="handOk">确定</a-button>
        </div>        
      </template>

    </global-modal>
  </div>
</template>

<script>
import GlobalModal from "@/components/common/GlobalModal";
export default {
  name: "",
  components: { GlobalModal },
  data() {
    return {
      OperatePlaceVisible: false,
      entTitle: "场所调整",
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      treeDataTemp: [],
      replaceFields: {
        key: "buildingId",
        title: "buildingName",
        value: "buildingId"
      },
      selectedWeek: [],
      options: [],
      value: [],
      exParam: {},
      all: false,
      one: false,
      two: false,
      resTips: "",
      weekTextList: [],

      placeId: "",
      teachWeekId: "",
      lesIdList: [],
      placeName: ""
    };
  },
  computed: {},
  mounted() {
    this.transformWeek(JSON.parse(sessionStorage.getItem("teachWeekList")));
  },
  methods: {
    showModal(arr, placeId, teachWeekId) {
      this.placeId = ''      
      this.value = []
      this.all = false
      this.one = false
      this.two = false
      this.value.push(teachWeekId)
      this.teachWeekId = teachWeekId;
      this.lesIdList = arr;
      this.OperatePlaceVisible = true;
      this.getAdjustPlaceList(arr, teachWeekId);
    },
    transformWeek(defaultList) {
      if (defaultList) {
        defaultList.forEach((item) => {
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
            this.options.map((item) => {
              this.value.push(item.value);
            });
            break;
          case 1:
            this.all = false;
            this.one = false;
            this.two = true;
            this.options.map((item, index) => {
              if (index % 2 !== 0) {
                this.value.push(item.value);
              }
            });
            break;
          case 2:
            this.all = false;
            this.one = true;
            this.two = false;
            this.options.map((item, index) => {
              if (index % 2 === 0) {
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
      if (!this.value.includes(this.teachWeekId)) {
         this.value.push(this.teachWeekId)
      }
      this.selectedWeek = [...this.value];
    },
    onChange(val) {
      this.teachWeekName = val;
      this.selectedWeek = [...val];
    },
    treeChange(value, label) {
      this.placeName = label[0];
    },
    handOk() {
      if (this.placeId === "") {
        this.$message.warning("请先选择场所！");
      } else {
        this.operatePlaceAdjust();
      }
    },
    cancel() {
      this.OperatePlaceVisible = false
    },
    getArrayObj(data) {
      for (var i in data) {
        if (data[i].children.length !== 0) {
          data[i].disabled = true;
        }
        this.getArrayObj(data[i].children);
      }
      return data;
    },
    // 场所调整操作
    async operatePlaceAdjust() {
      let data = {
        placeId: this.placeId,
        placeName: this.placeName,
        lesIdList: this.lesIdList,
        applyWeek: this.value
      };
      let res = await this.$api.placeAdjust.operatePlaceAdjust(data);
      if (res.code === "200" && res.result) {
        this.OperatePlaceVisible = false;
        this.$emit("init");
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
    },
    // 获取可调整场所
    async getAdjustPlaceList(arr, teachWeekId) {
      const data = {
        lesIdList: arr,
        teachWeekId: teachWeekId
      };
      const res = await this.$api.placeAdjust.getAdjustPlaceList(data);
      if (res.code === "200" && res.result) {
        this.treeDataTemp = this.getArrayObj([res.data]);
        // this.treeDataTemp=[res.data]
        console.log(this.treeDataTemp);
      } else {
        this.$message.warning(res.message);
      }
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

<style scoped lang="less">
.cb-modal-content {
  padding: 32px 54px 16px;
  .ant-form-item {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    margin-bottom: 16px;
    vertical-align: top;
  }
  .cb-record {
    // padding: 20px 30px;
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
}
</style>
