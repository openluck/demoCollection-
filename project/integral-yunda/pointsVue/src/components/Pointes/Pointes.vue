<template>
  <div class="pointes">
    <div class="user-balance">
      <span>账户余额：{{ userBalance }}</span>
      <span>积分余额：{{ intbalance }}</span>
    </div>
    <div class="goods">
      <ul class="goods-ul">
        <li class="goods-li" v-for="item in goodsList" :key="item.id">
          <a href="javascript:;" @click="goDetails(item.id)">
            <div class="goods-img">
              <img :src="item.goodsimg" alt="" />
            </div>
          </a>
          <span class="goods-name">{{ item.goodsname }}</span>
          <p>
            <span>价格：{{ item.money }}</span>
            <span>兑换积分：{{ item.pointe }}</span>
          </p>
        </li>
        <!-- <li class="goods-li">
          <div class="goods-img">
            <img src="../../assets/img/sp2.png" alt="" />
          </div>
          <span class="goods-name">{{ goods[1].goodName }}</span>
          <p>
            <span>价格：{{ goods[1].money }}</span>
            <span>兑换积分：{{ goods[1].pointes }}</span>
          </p>
        </li>
        <li class="goods-li">
          <div class="goods-img">
            <img src="../../assets/img/sp3.png" alt="" />
          </div>
          <span class="goods-name">{{ goods[2].goodName }}</span>
          <p>
            <span>价格：{{ goods[2].money }}</span>
            <span>兑换积分：{{ goods[2].pointes }}</span>
          </p>
        </li>
        <li class="goods-li">
          <div class="goods-img">
            <img src="../../assets/img/sp4.png" alt="" />
          </div>
          <span class="goods-name">{{ goods[3].goodName }}</span>
          <p>
            <span>价格：{{ goods[3].money }}</span>
            <span>兑换积分：{{ goods[3].pointes }}</span>
          </p>
        </li>
        <li class="goods-li">
          <div class="goods-img">
            <img src="../../assets/img/sp5.png" alt="" />
          </div>
          <span class="goods-name">{{ goods[4].goodName }}</span>
          <p>
            <span>价格：{{ goods[4].money }}</span>
            <span>兑换积分：{{ goods[4].pointes }}</span>
          </p>
        </li>
        <li class="goods-li">
          <div class="goods-img">
            <img src="../../assets/img/sp6.png" alt="" />
          </div>
          <span class="goods-name">{{ goods[5].goodName }}</span>
          <p>
            <span>价格：{{ goods[5].money }}</span>
            <span>兑换积分：{{ goods[5].pointes }}</span>
          </p>
        </li>
        <li class="goods-li">
          <div class="goods-img">
            <img src="../../assets/img/sp7.png" alt="" />
          </div>
          <span class="goods-name">{{ goods[6].goodName }}</span>
          <p>
            <span>价格：{{ goods[6].money }}</span>
            <span>兑换积分：{{ goods[6].pointes }}</span>
          </p>
        </li>
        <li class="goods-li">
          <div class="goods-img">
            <img src="../../assets/img/sp8.png" alt="" />
          </div>
          <span class="goods-name">{{ goods[7].goodName }}</span>
          <p>
            <span>价格：{{ goods[7].money }}</span>
            <span>兑换积分：{{ goods[7].pointes }}</span>
          </p>
        </li>
        <li class="goods-li">
          <div class="goods-img">
            <img src="../../assets/img/sp9.png" alt="" />
          </div>
          <span class="goods-name">{{ goods[8].goodName }}</span>
          <p>
            <span>价格：{{ goods[8].money }}</span>
            <span>兑换积分：{{ goods[8].pointes }}</span>
          </p>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pointes",
  data() {
    return {
      userBalance: "", // 账户余额
      intbalance: "", // 积分余额
      userName: "",
      goodsList: [],
      goodsName: "",
      goodsImg: "",
    };
  },
  mounted() {
    setTimeout(() => {
      this.userName = JSON.parse(sessionStorage.getItem("userIfon")).username;
      this.getUserInfo();
    }, 500);
    this.getGoods();
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
          console.log(res);
          this.userBalance = res.data.data[0].userbalance;
          this.intbalance = res.data.data[0].Intbalance;
        }
      });
    },
    // 商品信息
    getGoods() {
      this.$http({
        method: "get",
        url: this.$util.baseUrl + "users/goods",
      }).then((res) => {
        if (res.data.code === "200") {
          this.goodsList = res.data.data;
          console.log(this.goodsList);
          // console.log(this.goods[0].goodsimg);
          // this.goodsName = res.data.data[0].userbalance;
          // this.intbalance = res.data.data[0].Intbalance;
        }
      });
    },
    // 去商品详情页
    goDetails(id) {
      this.$router.push({
        path: "/destails",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.pointes {
  .user-balance {
    font-size: 18px;
    margin-left: 23px;
    margin-bottom: 22px;
  }
  .goods {
    .goods-ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .goods-li {
        width: 30%;
        height: 300px;
        margin-bottom: 20px;
        .goods-img {
          width: 100%;
          height: 260px;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .goods-name {
          display: block;
          font-size: 18px;
          text-align: center;
        }
        p {
          font-size: 16px;
          display: flex;
          justify-content: space-around;
        }
      }
    }
  }
}
</style>