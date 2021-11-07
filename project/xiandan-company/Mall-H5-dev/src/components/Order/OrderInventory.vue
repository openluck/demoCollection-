<template>
    <div>
        <div class="order-inventory-commodity" v-for="good in goods" :key="good.id"
             @click="$router.push({name:'commodity',params:{'hashid':(good.id?good.id:good.commodity_id)}})">
            <div class="order-inventory-img">
                <img :src="good.commodity_img" alt="">
            </div>
            <div class="order-inventory-title">
                <p>{{good.commodity_name}}</p>
                <p style="margin-top: 5px">
                    <van-tag round color="#F10D0D" size="medium">{{good.commodity_country || good.commodity_country_name}}</van-tag>
                    <van-tag round color="#FF6C00" size="medium">{{good.source|storageMode}}</van-tag>
                </p>
                <p><span><label>数量：</label><label>{{good.cart_num || good.buy_number}}</label></span>
                    <span><label>单价：</label><label>&yen;{{good.commodity_current_price | transformPrice}}</label></span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Tag } from 'vant';

    Vue.use(Tag);

    export default {
        name: 'orderInventory',
        props: ['goods']
    }
</script>

<style type="text/scss">
    .order-inventory-commodity {
        width: 100%;
        height: 122px;
        padding: 16px;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;

        .order-inventory-img {
            width: 90px;
            height: 90px;
            border: 1px solid #D3D7D9;
            box-sizing: border-box;
            border-radius: 8px;
            overflow: hidden;

            img {
                width: 90px;
                height: 90px;
            }
        }

        .order-inventory-title {
            width: calc(100% - 132px);
            position: absolute;
            box-sizing: border-box;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);

            p:nth-of-type(1) {
                font-size: 14px;
                color: #313233;
                font-weight: bold;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                text-decoration: none;
                line-height: 1.4em;
                height: 2.5em;
                overflow: hidden;
            }

            p:nth-of-type(3) {
                font-size: 12px;
                color: #636566;
                float: right;
                margin-top: 12px;

                & > span:nth-of-type(1) {
                    label:nth-of-type(2) {
                        color: #313233;
                    }
                }

                & > span:nth-of-type(2) {
                    margin-left: 15px;

                    label:nth-of-type(2) {
                        color: #F10D0D;
                        font-size: 14px !important;
                    }
                }
            }
        }
    }
</style>
