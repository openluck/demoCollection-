<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-05-08 16:26:31
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-23 09:39:14
-->

<template>
  <!-- 行政班级 -->
  <div class="admin-class">
    <a-card :style="adminClassItem.isInScopeOfAdmin ? cardStyle : ''">
      <!-- title和标题 -->
      <template slot="extra">
        <a v-if="isStuList" @click="viewPersonList">
          <a-icon type="user" />查看人员名单
        </a>
        <a-divider
          type="vertical"
          v-if="isStuList && divideclassType === '1'"
        />
        <!-- 行政班级删除按钮及提示 -->
        <a-popconfirm
          v-if="divideclassType === '1'"
          title="你确定要删除该行政班级吗？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="delAdminClass"
        >
          <a style="color: #ff3366"> <a-icon type="delete" />删除 </a>
        </a-popconfirm>
      </template>
      <!-- 行政班级名称 及班级总人数  是否存在冲突 -->
      <template slot="title">
        <span>{{ adminClassItem.adminClassName }}</span>
        <span>总人数{{ adminClassItem.adminClassInfo.classTotal }}</span>
        <span>
          [男{{ adminClassItem.adminClassInfo.boy }}，女{{
            adminClassItem.adminClassInfo.girl
          }}人]
        </span>
        <span
          class="add-person"
          v-if="divideclassType === '1'"
          @click="addAdminPerson"
        >
          添加人员
        </span>

        <!-- {{adminClassItem.isConflict}} -->
        <a-tag
          color="red"
          v-if="adminClassItem.isConflict"
          @click="debounceOpenNotification(adminClassItem.conflictContent)"
        >
          <!-- @click="openNotification(adminClassItem.conflictContent)" -->
          存在冲突
        </a-tag>
      </template>
      <!-- 内容 -->
      <div class="admin-item">
        <!-- 组合 -->
        <div class="admin-item-com">
          <combination
            v-for="item in adminClassItem.combinationList"
            :key="item.combinationId"
            :adminClassId="adminClassItem.adminClassId"
            :adminClassInfo="adminClassInfo"
            :combination="item"
            :groupId="groupId"
            :type="item.type"
          />
        </div>
        <div class="in-tech-class">
          <span v-html="text"></span>
          <!-- 教学班 -->
          <div class="admin-item-teach">
            <!-- 选考下学生所在教学班：-->
            <template v-if="divideclassType === '1'">
              <teach
                v-for="item in adminClassItem.chTeachClassList"
                :adminClassId="adminClassItem.adminClassId"
                :key="item.teachClassId"
                :teachClass="item"
                :adminClassInfo="adminClassInfo"
                :giveColor="giveColorAll"
              />
            </template>
            <!-- 学考 下 学生所在选考教学班 -->
            <template v-if="divideclassType === '2'">
              <StudyTeach
                v-for="item in adminClassItem.chTeachClassList"
                :adminClassId="adminClassItem.adminClassId"
                :key="item.teachClassId"
                :teachClass="item"
                :adminClassInfo="adminClassInfo"
                garyBg
                noSetColor
              />
            </template>
          </div>
        </div>
        <!-- 学考 下 学生所在学考教学班 -->
        <div v-if="divideclassType === '2'" class="in-stu-class">
          <span>
            学生所在
            <span style="color: #1ba4b3; font-weight: 600; margin: 0 3px"
              >学考</span
            >教学班：
          </span>
          <div class="admin-item-teach">
            <StudyTeach
              v-for="item in adminClassItem.stTeachClassList"
              :adminClassId="adminClassItem.adminClassId"
              :key="item.teachClassId"
              :teachClass="item"
              :adminClassInfo="adminClassInfo"
              study
              :noSetColor="false"
            />
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import combination from "@/components/divide/combination";
import teach from "@/components/divide/teach";
import StudyTeach from "@/components/divide/StudyTeach";
import { mapActions, mapState } from "vuex";
import { debounce } from "@/Utils/util";
export default {
  name: "",
  components: { combination, teach, StudyTeach },
  props: ["adminClass", "groupId", "giveColor"],
  data() {
    return {
      adminClassItem: {},
      adminClassInfo: {},
      giveColorAll: "",
      cardStyle: {
        border: "1px dashed red",
      },
    };
  },
  inject: ["getBaseClassData"],
  created() {
    this.adminClassItem = this.adminClass;
    this.adminClassInfo = Object.assign({}, this.adminClass.adminClassInfo, {
      adminClassId: this.adminClass.adminClassId,
      adminClassName: this.adminClass.adminClassName,
    });
    // this.getPersonList()
  },
  watch: {
    adminClass() {
      // console.log(this.adminClass);
      this.adminClassItem = this.adminClass;
    },
    giveColor() {
      this.giveColorAll = this.giveColor;
    },
  },
  computed: {
    ...mapState("adminClass", ["divideclassType", "isStuList"]),
    text() {
      return this.divideclassType === "1"
        ? "学生所在教学班："
        : this.divideclassType === "2"
        ? '<span>学生所在<span style="color:#1BA4B3;font-weight: 600;margin:0 3px;">选考</span>教学班：</span>'
        : "";
    },
  },
  mounted() {},

  methods: {
    ...mapActions("adminClass", ["getSaveData"]),
    // ...mapMutations(['onAdminClassStatus', 'changeAdminClassData']),
    // 查看人员名单
    viewPersonList() {
      // let data = { groupId: '1', adminClassId: this.adminClassItem.adminClassId, search: '', current: 1, pageSize: 20 }
      this.$store.commit("adminClass/onAdminClassStatus", true);
      this.$store.commit(
        "adminClass/changeAdminClassData",
        this.adminClassItem
      );
      // this.$store.dispatch('adminClass/getPersonList', data)
      //   this.onAdminClassStatus(true)
      //   this.changeAdminClassData(this.adminClassItem)
    },
    // 删除行政班级
    async delAdminClass() {
      let data = {
        adminClassId: this.adminClassItem.adminClassId,
      };
      const res = await this.$api.adminClass.delAdminClass(data);
      if (res.code === "200") {
        this.$message.success(res.message, 5);
        // 调用获取分组和行政班级接口
        this.getBaseClassData();
        this.getSaveData();
      } else {
        this.$message.error("删除失败", 5);
      }
    },

    // debounceOpenNotification: debounce() {
    //   function(){
    //     this.openNotification()
    //   },
    //   2000,
    //   true
    // },
    debounceOpenNotification: debounce(
      function (content) {
        this.openNotification(content);
      },
      700,
      true
    ),
    openNotification(content) {
      const newList = content.map((item) => {
        return <div>{item}</div>;
      });
      this.$notification.warning({
        message: "班级人员冲突",
        description: (h) => {
          return h("div", newList);
        },
        style: {
          width: "400px",
          marginLeft: `-35px`,
          marginTop: `125px`,
          backgroundColor: "#FFFBE6",
        },
        duration: 5,
      });
    },
    // 行政班添加人员
    addAdminPerson() {
      console.log(
        "this.adminClassItem.adminClassId",
        this.adminClassItem.adminClassId
      );
      this.$parent.addAdminClass(this.adminClassItem.adminClassId);
    },
  },
};
</script>

<style scoped lang="less">
.isInscope {
  /deep/.ant-card-bordered {
    border: 1px dashed red;
  }
}
.admin-class {
  margin-bottom: 8px;
  cursor: pointer;

  /deep/.ant-card-head {
    .ant-card-head-wrapper {
      .ant-card-head-title {
        padding: 8px 0 !important;
        .add-person {
          cursor: pointer;
          border: 1px solid #1ba4b3;
          font-size: 14px;
          text-align: center;
          display: inline-block;
          width: 74px;
          height: 24px;
          color: #1ba4b3;
          margin-right: 40px;
        }
        :first-child {
          color: #1ba4b3;
          font-weight: 600;
          font-size: 16px;
        }
        :nth-child(2) {
          margin: 0 8px 0 8px;
          font-size: 14px;
        }
        :nth-child(3) {
          font-size: 14px;
          color: #909599;
        }
        :nth-child(4) {
          margin-left: 30px;
          font-size: 14px;
        }
      }
      /deep/.ant-card-extra {
        padding: 8px 0 !important;
      }
    }
  }
  /deep/.ant-card-body {
    padding: 16px;
    .admin-item {
      .admin-item-com {
        display: flex;
        flex-wrap: wrap;
      }
      .admin-item-teach {
        display: flex;
        flex-wrap: wrap;
      }
      .in-stu-class {
        margin-top: 20px;
      }
    }
  }
}
</style>
