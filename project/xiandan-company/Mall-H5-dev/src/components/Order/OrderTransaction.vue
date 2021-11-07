<template>
    <div style="background: transparent">
        <div class="order-detailed">
            <p><span>商品金额</span><span>¥{{payment.amount || payment.commodity_amount | transformPrice}}</span></p>
            <div class="order-line-2"></div>
            <p><span>运费</span><span><label style="color:#F10D0D;"><span v-if="payment.freight">+</span>¥{{payment.freight===0?0:payment.freight||payment.freight_amount | transformPrice}}</label></span>
            </p>
            <div class="order-line-2"></div>
            <p><span>税费</span><span><label style="color:#F10D0D;"><span v-if="payment.tax || payment.total_tax">+</span>¥{{payment.tax ===0?0.00:Math.round(payment.tax*100)/100||payment.total_tax | transformPrice}}</label></span>
            </p>
            <div class="order-line-2" v-if="payment.coupon===0 ? 0: payment.coupon||payment.discount_details.coupon"></div>
            <p class="order-salt-egg" v-if="payment.coupon===0? 0: payment.coupon||payment.discount_details.coupon">
                <span>优惠券</span><span style="color:#F10D0D;">-¥{{payment.coupon===0 ? 0: payment.coupon||payment.discount_details.coupon | transformPrice}}</span>
            </p>
            <div class="order-line-2"
                 v-if="payment.salteggs===0 ? 0 : payment.salteggs||payment.discount_details.score"></div>
            <p class="order-salt-egg"
               v-if="payment.salteggs===0 ? 0: payment.salteggs||payment.discount_details.score">
                <span>咸蛋</span><span style="color:#F10D0D;">-¥{{payment.salteggs===0 ? 0: payment.salteggs||payment.discount_details.score | transformPrice}}</span>
            </p>
            <div class="order-line-2"
                 v-if="payment.redpack===0 ? 0: payment.redpack||payment.discount_details.redpack"></div>
            <p class="order-salt-egg"
               v-if="payment.redpack===0 ? 0: payment.redpack||payment.discount_details.redpack">
                <span>红包</span><span style="color:#F10D0D;">-¥{{payment.redpack===0 ? 0: payment.redpack||payment.discount_details.redpack | transformPrice}}</span>
            </p>
            <div class="order-line-2" v-if="payment.order_amount"></div>
            <p class="order-salt-egg" v-if="payment.order_amount"><span>总价</span><span style="color: #F10D0D">¥{{payment.order_amount | transformPrice}}</span>
            </p>
            <div class="order-line-2" v-if="payment.vip_discount"></div>
            <p class="order-salt-egg" v-if="payment.vip_discount">
                <span>VIP专享9.5折</span>
                <span style="color: #F10D0D">-¥{{payment.vip_discount | transformPrice}}</span>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'OrderTransaction',
        props: ['payment'],
        computed: {
            user() {
                return this.$store.state.user
            }
        },
    }
</script>

<style  type="text/scss">
    .order-discount, .order-detailed {
        padding: 16px 16px;
        box-sizing: border-box;

        p {
            line-height: 14px;
            height: 14px;
            overflow: hidden;

            span:nth-of-type(1) {
                font-size: 14px;
            }

            & > span:nth-of-type(2) {
                color: #636566;
                font-size: 12px;
                float: right;

                .iconfont {
                    font-size: 10px;
                    position: relative;
                    top: -2px;
                    margin-left: 8px;
                }
            }
        }

        .order-line {
            width: 100%;
            height: 1px;
            background: #F0F3F5;
        }

        .order-line:nth-of-type(1) {
            margin-top: 10px;
        }
    }

    .order-detailed {
        background: white !important;
        border-radius: 16px;

        p {
            span:nth-of-type(2) {
                color: #313233;
                font-weight: bold;
            }
        }

        .order-line-2 {
            width: 100%;
            height: 1px;
            background: #F0F3F5;
            margin: 10px 0;
        }
    }
</style>
