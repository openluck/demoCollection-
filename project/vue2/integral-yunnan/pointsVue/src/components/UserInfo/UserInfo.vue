<template>
  <div class="user-info">
    <div class="info-table">
      <div class="btn">
        <a-button type="primary" @click="send"> 赠送积分 </a-button>
      </div>
      <!-- <a-table :columns="columns" :data-source="dataSource" :pagination="false">
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table> -->
      <div class="table">
        <p class="table-title">
          <span>用户名</span>
          <span>年龄</span>
          <span>生日</span>
          <span>地址</span>
          <span>车型</span>
          <span>会员等级</span>
          <span>账号余额</span>
        </p>
        <p class="table-title p2">
          <span>{{ dataSource[0].username }}</span>
          <span>{{ dataSource[0].age }}</span>
          <span>{{ dataSource[0].birthday }}</span>
          <span>{{ dataSource[0].address }}</span>
          <span>{{ dataSource[0].carband }}</span>
          <span>{{ dataSource[0].vipgrade }}</span>
          <span>{{ dataSource[0].outpointes }}</span>
        </p>
      </div>
    </div>
    <div id="main" style="width: 90%; height: 400px"></div>
    <div id="main2" style="width: 90%; height: 400px"></div>
  </div>
</template>

<script>
const columns = [
  {
    title: "用户名",
    dataIndex: "username",
    key: "name",
    scopedSlots: { customRender: "name" },
    align: "center",
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age",
    width: 80,
    align: "center",
  },
  {
    title: "生日",
    dataIndex: "birthday",
    key: "birthday",
    align: "center",
  },
  {
    title: "地址",
    dataIndex: "address",
    key: "address 1",
    ellipsis: true,
    align: "center",
  },
  {
    title: "车型",
    dataIndex: "carband",
    key: "carband",
    align: "center",
  },
  {
    title: "会员等级",
    dataIndex: "vipgrade",
    key: "vipgrade",
    align: "center",
  },
  {
    title: "账户余额",
    dataIndex: "userbalance",
    key: "userbalance",
    align: "center",
  },
];
export default {
  name: "UserInfo",
  data() {
    return {
      columns,
      dataSource: [], // 表格数据
      userName: "",
      userAdName: "",
    };
  },
  mounted() {
    setTimeout(() => {
      this.userName = JSON.parse(sessionStorage.getItem("userIfon")).username;
      this.userAdName = JSON.parse(
        sessionStorage.getItem("userIfon")
      ).adusername;
      this.getUserInfo();
      this.getAdUserInfo();
      this.drawChart();
    }, 500);
  },
  methods: {
    // 用户信息
    getUserInfo() {
      this.$http({
        method: "post",
        url: this.$util.baseUrl + "users/userinfo",
        data: {
          username: this.userName,
        },
      }).then((res) => {
        if (res.data.code === "200") {
          this.dataSource = res.data.data;
          console.log(this.dataSource);
        }
      });
    },
    // 企业信息
    getAdUserInfo() {
      this.$http({
        method: "post",
        url: this.$util.baseUrl + "users/userinfo",
        data: {
          username: this.userAdName,
        },
      }).then((res) => {
        if (res.data.code === "200") {
          this.dataSource = res.data.data;
          console.log(this.dataSource);
        }
      });
    },
    drawChart() {
      // 使用刚指定的配置项和数据显示图表。
      setTimeout(() => {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById("main"));
        let myChart2 = this.$echarts.init(document.getElementById("main2"));
        // 指定图表的配置项和数据
        let option = {
          title: {
            text: "积分明细",
            // subtext: "纯属虚构",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
          },
          series: [
            {
              name: "积分明细",
              type: "pie",
              radius: "50%",
              data: [
                { value: this.dataSource[0].getpointes, name: "积分获得" },
                { value: this.dataSource[0].outpointes, name: "积分转出" },
                { value: this.dataSource[0].sendpointes, name: "赠送积分" },
                { value: this.dataSource[0].oilpointes, name: "加油积分" },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
        let zxOption = {
          // 折线图
          xAxis: {
            type: "category",
            name: "等级",
            data: ["一级", "二级", "三级", "四级", "五级", "六级", "七级"],
          },
          yAxis: {
            type: "value",
             name: "积分数",
          },
          series: [
            {
              data: [100, 150, 167, 250],
              type: "line",
            },
          ],
        };
        myChart.setOption(option);
        myChart2.setOption(zxOption);
      }, 500);
    },
    send() {
      this.$router.push("/send");
    },
  },
};
</script>
<style lang="less" scoped>
.user-info {
  .info-table {
    // display: flex;
  }
  #main {
    margin-top: 30px;
  }
  .btn {
    margin-bottom: 30px;
  }
  .table-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-top: 10px;
    box-sizing: border-box;
    span {
      flex: 1;
      text-align: center;
    }
  }
  .p2 {
    border-top: 1px solid #000;
  }
  .table {
    border: 1px solid #000;
  }
}
</style>

