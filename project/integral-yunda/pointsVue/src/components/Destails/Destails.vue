<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-05-17 14:02:45
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-05-17 16:19:13
-->
<template>
  <div class="details">
    <div class="goods">
      <div class="left">
        <img :src="goodsimg" alt="" />
      </div>
      <div class="rihgt">
        <h3 class="title">{{ goodList[0].goodsname }}</h3>
        <p class="title2">
          价格：<span>{{ goodList[0].money }}</span> 兑换积分：<span>{{
            goodList[0].pointe
          }}</span>
        </p>
        <p class="title3">
          <span>配送方式：快递邮寄</span>
          <span>每月限兑数量：{{ goodList[0].pointe }}个</span>
        </p>
        <div class="dh">
          <a-radio-group class="radio-group" v-model="value">
            <a-radio :style="radioStyle" :value="1">
              纯积分支付：<span>100</span>
            </a-radio>
            <a-radio :style="radioStyle" :value="2">
              混合支付：<span>
                <a-input-number id="inputNumber" v-model="invalue" />
                100积分</span
              >
            </a-radio>
            <a-radio :style="radioStyle" :value="3">
              纯现金支付<span>￥100</span>
            </a-radio>
          </a-radio-group>
        </div>
        <div class="btn">
          <a-button class="btn1" type="danger" @click="cart">
            加入购物车
          </a-button>
          <a-button type="primary" @click="buy"> 立即兑换 </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      goodId: "",
      goodList: [],
      value: 1,
      invalue: 1,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      goodsimg: "",
    };
  },
  mounted() {
    this.goodId = parseInt(this.$route.query.id);
    this.getDetails();
  },
  methods: {
    getDetails() {
      this.$http({
        method: "post",
        url: this.$util.baseUrl + "users/goodDetails",
        data: {
          imgId: this.goodId,
        },
      }).then((res) => {
        console.log(res.data);
        if (res.data.code === "200") {
          this.goodList = res.data.data;
          this.goodsimg = this.goodList[0].goodsimg;
        } else {
          this.$message.error(red.data.mess);
        }
      });
    },
    // onChange(e) {
    //   console.log("radio checked", e.target.value);
    // },
    cart() {
      this.$message.success(`${this.goodList[0].goodsname}加入购物车`);
    },
    buy() {
      this.$message.success(`${this.goodList[0].goodsname}兑换成功`);
    },
  },
};
</script>

<style lang="less" scoped>
.details {
  .goods {
    display: flex;
    justify-content: space-evenly;
    .left {
      width: 400px;
      height: 400px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .rihgt {
      font-size: 16px;

      .title {
        font-size: 20px;
        font-weight: bold;
      }

      .title2 {
        margin-top: 20px;
        span {
          color: red;
          margin-right: 30px;
        }
      }
      .title3 {
        margin-top: 20px;
        span {
          margin-right: 30px;
        }
      }
      .dh {
        margin-top: 20px;
        .radio-group {
          span {
            color: red;
            margin-left: 20px;
          }
        }
      }
      .btn {
        margin-top: 20px;
        .btn1 {
          margin-right: 30px;
        }
      }
    }
  }
}
</style>