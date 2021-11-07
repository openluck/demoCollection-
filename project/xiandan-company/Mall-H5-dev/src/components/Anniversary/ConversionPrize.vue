<template>
  <div class="conversion-prize">
    <img :src="bar" alt="img" class="bar-img"/>
    <div class="container">
      <div class="title">
        <span>/////</span>
        <div>兑换奖励</div>
        <span>//////</span>
      </div>
      <p class="tips">
        实物兑换奖励需要填写您的
        <span>收货信息</span>
      </p>
      <div class="info-title">联系方式</div>
      <div class="name">
        <span>姓名</span>
        <input type="text" v-model="name" placeholder="收货人姓名"/>
      </div>
      <div class="phone">
        <span>电话</span>
        <input type="text" v-model="phone" placeholder="收货人手机号"/>
      </div>
      <div class="info-title">收货地址</div>
      <div class="area">
        <span>地区</span>
        <div :class="{'area-text':true,'font-black': this.area !== ''}"
              v-on:click="isShow = true"
        >
          {{this.area === "" ? "选择省/市/区" : this.area}}
          <span class="iconfont iconfont-yuanjiaojuxingkaobei invited-icon"/>
        </div>
      </div>
      <div class="address">
<!--        <span class="address-title">详细地址</span>-->
        <textarea type="text" placeholder="请填写详细地址" v-model="address" class="address-area"/>
      </div>
      <p class="tips-text">**您可在 闲蛋商城-我的闲蛋-全部订单 查看已兑换的实物奖品。</p>
      <button class="submit" v-on:click="submit">提交</button>
    </div>
    <van-overlay :show="isShow" z-index="10" v-on:click="isShow = false">
      <div class="area-list" v-on:click.stop="">
        <van-area :area-list="areaList"
                  v-on:confirm="getArea"
                  v-on:cancel="cancel"
        />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import bar from '../../../images/icon/bar.png';
import Vue from 'vue';
import {Area, Overlay, Toast} from 'vant';
import areaList from '@/common/js/area';

Vue.use(Area).use(Overlay).use(Toast);

export default {
  name: "conversionprize",
  data() {
    return {
      bar,
      areaList,
      index: 0,
      isShow: false,
      name: "",
      phone: "",
      area: "",
      province: "",
      city: "",
      district: "",
      address: "",
    }
  },
  created() {
    this.index = this.$route.params.index;
  },
  methods: {
    getArea(e) {

      if (e[0].name === e[1].name) {
        this.area = e[0].name + "/" + e[2].name;
      } else {
        this.area = e[0].name + "/" + e[1].name + "/" + e[2].name;
      }
      this.province = e[0].name;
      this.city = e[1].name;
      this.district = e[2].name;
      this.isShow = false;
    },
    cancel(e) {
      this.isShow = false;
    },
    submit() {
      if (this.name === "") {
        Toast("请填写收货人姓名");
        return;
      }
      if (!(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone))) {
        Toast("请填写正确的联系电话");
        return;
      }
      if (this.province === "" || this.city === "" || this.district === "") {
        Toast("请选择城市");
        return;
      }
      if (this.address === "") {
        Toast("请填写详细地址");
        return;
      }
      const url = "/api/events/2020/anniversary/redeem";
      const data = {
        index: this.index,
        name: this.name,
        phone: this.phone,
        province: this.province,
        city: this.city,
        district: this.district,
        address: this.address,
      }
      this.$http.post(url, data)
        .then((res) => {
          if (res.data.code < 0) {
            Toast(res.data.message);
          } else {
            Toast("兑换成功");
            this.$store.commit('updateSuccess', true);
            if (res.data.message.order_id) {
              this.$router.replace({
                name: 'orderpay',
                params: {'hashid': res.data.message.order_id}
              });
            }
          }
        })
        .catch((err) => {
          Toast("兑换失败，请稍后重试");
          setTimeout(() => {
            this.$router.back();
          }, 2000)
        })
    }
  }
}
</script>

<style scoped type="text/scss">
  .conversion-prize {
    min-height: 100vh;
    background: rgba(255, 212, 178, 1);
    padding: 18px 5px;
    box-sizing: border-box;

    .bar-img {
      width: 100%;
    }

    .container {
      background: #ffffff;
      position: relative;
      z-index: 3;
      margin: -20px 7px 0 7px;
      border-radius: 0 0 6px 6px;
      padding: 30px 10px;

      .title {
        display: flex;
        justify-content: center;
        font-size: 13px;
        font-family: Alibaba PuHuiTi;
        font-weight: 400;
        color: rgba(242, 104, 53, 1);

        div {
          font-size: 18px;
          font-weight: 800;
          margin: -2.5px 9px 0 9px;
        }
      }

      .tips {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        margin-top: 12px;
        text-align: center;

        span {
          color: #F26835;
        }
      }

      .info-title {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        padding-top: 18px;
      }

      .name, .phone, .area, {
        display: flex;
        padding: 16px 12px;
        background: rgba(245, 245, 245, 1);
        border-radius: 4px;
        font-size: 14px;
        font-family: PingFang SC;
        color: rgba(51, 51, 51, 1);
        box-sizing: border-box;
        margin-top: 10px;

        span {
          display: block;
          margin-right: 24px;
        }

        input {
          display: block;
          background: none;
          border: none;
          outline: none;
          width: calc(100% - 75px);
        }
      }

      .area {
        /*justify-content: space-between;*/

        .area-text {
          font-size: 14px;
          width: calc(100% - 75px);
          box-sizing: border-box;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(153, 153, 153, 1);
          display: flex;
          justify-content: space-between;

          .iconfont {
            margin-right: 0;
            font-size: 12px;
            display: block;
            margin-top: 3px;
          }
        }
        .font-black{
          color: #333333;
        }
      }

      .address {
        margin-top: 10px;
        background: rgba(245, 245, 245, 1);
        border-radius: 4px;
        padding: 12px;
        box-sizing: border-box;

        .address-title {
          font-size: 14px;
          font-family: PingFang SC;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 12px;
        }

        .address-area {
          border: none;
          background: none;
          outline: none;
          width: 100%;
          display: block;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          resize: none;
        }
      }

      .tips-text{
        font-size: 12px;
        margin: 10px 0;
        /*color: ;*/
      }

      .submit {
        outline: none;
        border: none;
        display: block;
        margin: 30px auto 0 auto;
        background: rgba(240, 94, 45, 1);
        border-radius: 6px;
        padding: 11px 58px;
        color: #ffffff;
      }
    }

    .area-list {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>