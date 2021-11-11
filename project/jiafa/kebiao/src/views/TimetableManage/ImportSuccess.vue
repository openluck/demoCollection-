<!--
 * @Author: ylc
 * @Date: 2021-08-16 17:38:33
 * @LastEditTime: 2021-10-12 10:05:08
 * @LastEditors: ylc
 * @Description: 导入成功
 * @FilePath: \Web\src\views\TimetableManage\ImportSuccess.vue
-->

<template>
  <div class="ylc-confirm-content">
    <div class="ylc-confirm-head">导入结果</div>
    <div class="ylc-confirm-body">
      <div class="ylc-confirm-box"
        v-if="res.checkPass">
        <div class="ylc-confirm-area">
          <svg-icon icon-class="35"
            style="
              color: #23bf71;
              width: 32px;
              height: 32px;
              position: relative;
              top: 5px;
              right: 12px;
            " />
          数据导入成功
        </div>
        <div style="text-align: center">
          <a-button class="ylc-confirm-btn"
            @click="goBack">返回课表导入列表</a-button>
        </div>
      </div>
      <div v-else>
        <div class="ylc-error-box">
          <div class="ylc-error-area">
            <svg-icon icon-class="imp_error"
              style="
                color: #23bf71;
                width: 32px;
                height: 32px;
                position: relative;
                top: 5px;
                right: 12px;
              " />
            数据导入失败
          </div>
        </div>
        <div style="text-align: center; margin-top: 32px">
          <a-button class="ylc-error-btn-back"
            @click="goBack">返回课表导入列表</a-button>
          <a-button class="ylc-error-btn"
            @click="report">重新导入数据</a-button>
        </div>
        <div class="ylc-error-alert"
          v-if="res.illegalCheckTypes.length > 0">
          <div style="display: flex; height: 48px; line-height: 48px">
            <div style="font-size: 18px; color: #3a3b3d; font-weight: bold">
              导入数据报错
            </div>
            <div style="margin-left: 25px">
              <a @click="onload">
                <svg-icon icon-class="com_load"
                  style="width: 12px; height: 14px; margin-right: 3px" />下载课表导入提示文档
              </a>
            </div>
          </div>
          <div class="ylc-error-list"
            v-if="res.illegalCheckTypes !== null && res.illegalCheckTypes.length > 0">
            <div class="ylc-error-item"
              v-for="(item, index) in res.illegalCheckTypes !== null ? res.illegalCheckTypes:[]"
              :key="item"
              :title="item">
              <div>
                <span style="font-size: 20px; font-weight: bold">{{ index + 1 }}.</span>
                <span style="margin-left: 10px">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
        <section style="margin-top: 35px">
          <div style="display: flex; height: 48px; line-height: 48px">
            <div style="font-size: 18px; color: #3a3b3d; font-weight: bold">
              导入数据冲突
            </div>
            <div style="margin-left: 25px">
              <a @click="dataConflict">
                <svg-icon icon-class="com_load"
                  style="width: 12px; height: 14px; margin-right: 3px" />下载冲突数据文档
              </a>
            </div>
          </div>
        </section>
        <div class="ylc-table-list">
          <div class="ylc-table-item"
            v-for="(item,index) in res.normalListPage.list"
            :key="index">
            <div style="display:flex;">
              <div class="ylc-table-item-title">{{index+1}}组</div>
              <div class="ylc-table-item-description">{{item.description}}</div>
            </div>
            <div v-for="(i,k) in item.children"
              :key="k"
              style="margin-top:16px;">
              <a-table class="msg-table"
                :columns="dataColumns"
                :data-source="i.children"
                :pagination="false"
                :rowKey="(row,idx) => idx">
                <template v-slot:isImportData="text">
                  {{ text == "0" ? "已存在数据" : "导入数据" }}
                </template>
              </a-table>
            </div>
          </div>
        </div>
        <div>
          <a-table class="msg-table"
            :columns="teacherColumns"
            :data-source="res.teacherList"
            :pagination="false"
            :rowKey="(row,index) => index">
          </a-table>
        </div>
        <div class="more-load"
          v-if="isMoreLoad"
          @click="scrollLoadMore">
          <span>查看更多</span>
        </div>
        <div class="more-load"
          v-if="loadLastText">到底啦</div>
      </div>
    </div>
  </div>
</template>

<script>
import svgIcon from "../../components/common/svgIcon.vue";
const dataColumns = [
  {
    title: "序号",
    dataIndex: "num",
    key: "num",
    width: 40,
    scopedSlots: { customRender: "num" }
  },
  {
    title: "校本课科目",
    dataIndex: "subject",
    key: "subject",
    width: 70,
    ellipsis: true,
    scopedSlots: { customRender: "subject" }
  },
  {
    title: "教师姓名",
    dataIndex: "teacherName",
    key: "teacherName",
    width: 60,
    ellipsis: true,
    scopedSlots: { customRender: "teacherName" }
  },
  {
    title: "班级名称",
    dataIndex: "className",
    key: "className",
    width: 80,
    ellipsis: true,
    scopedSlots: { customRender: "className" }
  },
  {
    title: "星期",
    dataIndex: "weekDay",
    key: "weekDay",
    width: 40,
    ellipsis: true,
    scopedSlots: { customRender: "weekDay" }
  },
  {
    title: "节次",
    dataIndex: "lesSortOptionName",
    key: "lesSortOptionName",
    width: 50,
    ellipsis: true,
    scopedSlots: { customRender: "lesSortOptionName" }
  },
  {
    title: "日期",
    dataIndex: "date",
    key: "date",
    width: 70,
    ellipsis: true,
    scopedSlots: { customRender: "date" }
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    width: 70,
    ellipsis: true,
    scopedSlots: { customRender: "time" }
  },
  {
    title: "楼栋",
    dataIndex: "building",
    key: "building",
    width: 70,
    ellipsis: true,
    scopedSlots: { customRender: "building" }
  },
  {
    title: "场所 ",
    dataIndex: "site",
    key: "site",
    width: 70,
    ellipsis: true,
    scopedSlots: { customRender: "site" }
  },
  {
    title: "场所是否支持同时多个班级上课",
    dataIndex: "isSupportMultSite",
    key: "isSupportMultSite",
    width: 170,
    scopedSlots: { customRender: "isSupportMultSite" }
  },
  {
    title: "是否为导入数据",
    dataIndex: "isImportData",
    key: "isImportData",
    width: 100,
    scopedSlots: { customRender: "isImportData" }
  }
];
const teacherColumns = [
  {
    title: "老师姓名去重编号",
    dataIndex: "nameCode",
    key: "nameCode",
    width: 300,
    ellipsis: true,
    scopedSlots: { customRender: "nameCode" }
  },
  {
    title: "科目",
    dataIndex: "subjectName",
    key: "subjectName",
    width: 100,
    ellipsis: true,
    scopedSlots: { customRender: "subjectName" }
  },
  {
    title: "教师姓名",
    dataIndex: "teacherName",
    key: "teacherName",
    width: 70,
    ellipsis: true,
    scopedSlots: { customRender: "teacherName" }
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    width: 70,
    ellipsis: true,
    scopedSlots: { customRender: "sex" }
  },
  {
    title: "年龄",
    dataIndex: "old",
    key: "old",
    width: 70,
    ellipsis: true,
    scopedSlots: { customRender: "old" }
  },
  {
    title: "证件号",
    dataIndex: "idCard",
    key: "idCard",
    width: 200,
    ellipsis: true,
    scopedSlots: { customRender: "idCard" }
  }
]
export default {
  components: { svgIcon },
  data() {
    return {
      fetchData: {
        result: false
      },
      res: {},
      dataColumns,
      teacherColumns,
      isMoreLoad: true, // 是否显示加载更多
      loadingImg: false, // 加载更多时显示loading图
      loadLastText: false, // 到底了
      totals: null // 用来存放总数量
    };
  },
  created() {
    if (this.$route.query.res) {
      this.res = JSON.parse(this.$route.query.res);
      this.fetchData = JSON.parse(this.$route.query.fetchData)
    }
    this.fetchData.current = this.res.normalListPage.pagination.current
    this.fetchData.pageSize = this.res.normalListPage.pagination.pageSize
    this.fetchData.total = this.res.normalListPage.pagination.total
  },
  mounted() {
    var _this = this;
    window.addEventListener('scroll', function () {
      var scr = document.documentElement.scrollTop || document.body.scrollTop; // 向上滚动的那一部分高度
      var clientHeight = document.documentElement.clientHeight; // 屏幕高度也就是当前设备静态下你所看到的视觉高度
      var scrHeight = document.documentElement.scrollHeight || document.body.scrollHeight; // 整个网页的实际高度，兼容Pc端
      if (scr + clientHeight + 10 >= scrHeight) {
        if (_this.isMoreLoad) { //this.isMoreLoad控制滚动是否加载更多
          _this.fetchData.current = _this.fetchData.current + 1; // 加载更多是definePageNum+1
          _this.scrollLoadMore();
        }
      }
    });
  },
  methods: {
    // 返回列表
    goBack() {
      this.$router.push({
        path: "/TimetableManage/TimetableManage"
      });
    },
    // 下载文档
    onload() {
      if (this.res.illegalTimeTableDataUrl) {
        // window.location.origin + '/oss' + this.res.illegalTimeTableDataUrl)
        window.open(this.res.illegalTimeTableDataUrl)
      }
      if (this.res.illegalPersonRelDataUrl) {
        // window.location.origin + '/oss' + this.res.illegalPersonRelDataUrl
        window.open(this.res.illegalPersonRelDataUrl)
      }
    },
    // 下载数据冲突
    dataConflict() {
      if (this.res.conflictDataUrl) {
        window.open(this.res.conflictDataUrl)
      } else {
        this.$message.warn("无数据冲突")
      }
    },
    // 重新导入数据
    report() {
      this.$router.push({
        path: "/TimetableManage/ImportManually",
        query: {
          ...this.fetchData
        }
      })
    },
    // 查看更多
    scrollLoadMore() {
      // 防止多次加载
      if (this.loadingImg) { return }
      this.loadingImg = true;
      this.getInfoPage()
    },
    // 查询冲突信息分页
    async getInfoPage() {
      const res = await this.$api.TimetableManage.getConflictInfoPage({
        ...this.fetchData
      });
      if (res.code === "200" || res.code === 200) {
        this.res.normalListPage.list.push(...res.data.list)
        this.fetchData.current = res.data.pagination.current
        this.fetchData.pageSize = res.data.pagination.pageSize
        this.fetchData.total = res.data.pagination.total
        if (this.fetchData.total - this.fetchData.current * this.fetchData.pageSize > 0) {
          this.isMoreLoad = true;
        } else {
          this.isMoreLoad = false;
          this.loadLastText = true;
        }
        this.loadingImg = false;
      } else {
        this.$message.error(res.message);
      }
    }
  }
};
</script>

<style scoped lang="less">
.ylc-confirm-content {
  .ylc-confirm-head {
    height: 64px;
    line-height: 64px;
    border-bottom: 1px solid #e6e8eb;
    font-size: 18px;
    padding-left: 24px;
  }
  .ylc-confirm-body {
    padding: 32px 24px;
    .ylc-confirm-box {
      .ylc-confirm-area {
        background: #f0fdf7;
        color: #23bf71;
        height: 80px;
        line-height: 80px;
        position: relative;
        text-align: center;
        border-radius: 4px;
        border: 1px solid #b2eed0;
        font-size: 18px;
      }
      .ylc-confirm-btn {
        margin: 32px auto 0;
        background-color: #2abf8e;
        color: #fff;
        width: 152px;
      }
    }
    .ylc-error-box {
      background: #fffafa;
      color: #f64646;
      height: 80px;
      line-height: 80px;
      position: relative;
      text-align: center;
      border-radius: 4px;
      border: 1px solid #ffd9d9;
      font-size: 18px;
    }
    .ylc-error-btn-back {
      width: 152px;
    }
    .ylc-error-btn {
      width: 120px;
      margin-left: 16px;
      background: #2abf8e;
      color: #fff;
    }
    .ylc-error-alert {
      margin-top: 40px;
      .ylc-error-list {
        .ylc-error-item {
          margin-top: 21px;
          height: 20px;
          line-height: 20px;
        }
      }
    }
  }
  .ylc-table-list {
    margin-top: 30px;
    .ylc-table-item {
      margin-bottom: 35px;
      .ylc-table-item-title {
        width: 48px;
        height: 32px;
        line-height: 32px;
        color: #4cc29b;
        font-size: 16px;
        text-align: center;
        background: #eaf9f4;
        border-radius: 4px;
        margin-right: 16px;
      }
      .ylc-table-item-description {
        height: 32px;
        line-height: 32px;
        color: #494b4d;
      }
    }
  }
  .more-load {
    text-align: center;
    width: 100%;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
  }
  /deep/ .ant-table-thead > tr > th {
    padding-left: 24px;
  }
  /deep/ .ant-table .ant-table-tbody > tr > td {
    padding-left: 24px;
  }
}
</style>
