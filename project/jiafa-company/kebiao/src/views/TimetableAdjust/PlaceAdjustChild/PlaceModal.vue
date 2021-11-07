<!--
 * @Description: 
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-17 10:27:45
 * @LastEditors: cb
 * @LastEditTime: 2021-10-12 13:54:15
-->
<template>
  <div class="">
  <global-modal
      :visible="placeVisible"
      :title="entTitle"
      :width="400"
      :defaultBtn="false"
      :closable='false'
      @cancel="handOk"
    >
      <div class="cb-modal-content">
        <a-form-model
          ref="searchData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="场所">
            <a-tree-select
              show-search
              v-model="placeIdTemp"
              :replace-fields="replaceFields"
               :filterTreeNode="filterOption"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeDataTemp"
              :treeDefaultExpandedKeys='treeDefaultExpandedKeys'
              placeholder="请选择场所"
              :load-data="onLoadData"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
      <template #selfBtn>
        <div style="text-align:center">
          <a-button type="primary" @click="handOk">确定</a-button>
        </div>        
      </template>

    </global-modal>
  </div>
</template>
 
<script>
import { mapState, mapMutations } from "vuex";
import GlobalModal from "@/components/common/GlobalModal";
export default {
  name: '',
  components: { GlobalModal },
  data() {
    return {
      placeVisible: false,
      entTitle: "选择调整场所",
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      placeIdTemp: '',
      treeDataTemp: [],
      replaceFields: {
        key: 'buildingId',
        title: 'buildingName',
        value: 'buildingId'
      },
      treeDefaultExpandedKeys: []
     }
  },
  computed: {
    ...mapState("placeAdjust", ["placeId", 'treeData'])
  },
  mounted() {
  },
  methods: {
    ...mapMutations("placeAdjust", ["setPlace"]),
    showModal() {
      if (this.placeId) {
          this.placeVisible = false
      } else {
        this.placeVisible = true
        this.getPlaceTree()
      }
    },
    filterOption(input, treeNode) {
      return (
        treeNode.componentOptions.propsData.title
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    handOk() {
      // if (this.placeIdTemp === '') {
      //   this.$message.warning('请先选择场所！')
      // } else {
        this.placeVisible = false
        this.setPlace({ placeIdTemp: this.placeIdTemp, treeDataTemp: this.treeDataTemp, treeDefaultExpandedKeys: this.treeDefaultExpandedKeys }
        );
        this.$emit('partObj', this.placeIdTemp)
      // }
    },
    async onLoadData(treeNode, data) {
      console.log(data);
      let item = {}
      if (!data) {
         item = treeNode.dataRef
      } else {
         item = data
      }
      console.log(item);
      if (item.buildingType === 3) {
        const children = await this.getClassroom(item.buildingId)
        this.treeDataTemp = this.getArrayObj(this.treeDataTemp, item.buildingId, children)
        this.treeDataTemp = [...this.treeDataTemp]
      } else {
        
      }
    },
    getArrayObj(data, id, children) {
      for (var i in data) {
        if (data && id && children) {
          if (data[i].buildingId === id) {
            data[i].children = children
          } else {
              this.getArrayObj(data[i].children, id, children);
          }
        } else {
          if (!data[i].isLeaf) {
            data[i].disabled = true
            this.getArrayObj(data[i].children);
          }
        }
      }
      return data
    },
    // 场所树，到楼层
    async getPlaceTree() {
      let res = await this.$api.common.getPlaceTree()
      if (res.code === '200' && res.result) {
        this.treeDataTemp = this.getArrayObj([res.data])
        // console.log(this.treeDataTemp);
        if (this.treeDataTemp[0].children) { //校区
          if (this.treeDataTemp[0].children[0].children) { //楼
            if (this.treeDataTemp[0].children[0].children[0].children) { //楼层
              if (this.treeDataTemp[0].children[0].children[0].children[0].disabled) {
                await this.onLoadData('1', this.treeDataTemp[0].children[0].children[0].children[0])
                this.placeIdTemp = this.treeDataTemp[0].children[0].children[0].children[0].children[0].buildingId
              } else {
                this.placeIdTemp = this.treeDataTemp[0].children[0].children[0].children[0].buildingId
              }
              this.treeDefaultExpandedKeys.push(this.treeDataTemp[0].buildingId, this.treeDataTemp[0].children[0].buildingId, this.treeDataTemp[0].children[0].children[0].buildingId)
            }
          }
        }
      }
    },
    // 根据楼层获取房间
    async getClassroom(value) {
      const data = { buildingId: value };
      const res = await this.$api.common.getClassroom(data);
      if (res.code === '200' && res.result) {
        return res.data.map(i => ({ ...i, buildingId: i.classroomId, isLeaf: true, value: i.classroomId, buildingName: i.classroomName }))
      } else {
        return []
      }
    }
  }
}
</script>
 
<style scoped lang = "less">
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
}
</style>