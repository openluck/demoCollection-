<template>
    <div class="order-address-have">
        <van-icon name="location-o" color="#F10D0D" class="location-icon"/>
        <div>
            <p>
                <slot name="defaulted"></slot>
                <span>{{address.name}}</span>
                <span>{{address.phone}}</span>
            </p>
            <p>{{address.province}}&nbsp;{{address.city}}&nbsp;{{address.district}}&nbsp;{{address.address}}</p>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Icon } from 'vant';

    Vue.use(Icon)

    export default {
        name: 'OrderAddress',
        props: ['address'],
        components: {}
    }
</script>

<style type="text/scss">
    .order-address-have {
        padding: 14px 32px 16px 16px;
        box-sizing: border-box;
        position: relative;

        .location-icon {
            display: inline;
            font-size: 30px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }

        div:nth-of-type(1) {
            margin-left: 40px;

            p:nth-of-type(1) {
                span {
                    font-size: 12px;
                }

                label {
                    padding: 0 8px;
                    background: #F10D0D;
                    border-radius: 10px;
                    color: white;
                    text-align: center;
                    margin-right: 8px;
                    font-size: 12px;
                    vertical-align: middle;
                    line-height: 14px;
                }

                span:nth-of-type(1) {
                    font-size: 13px;
                }

                span:nth-of-type(2) {
                    margin-left: 8px;
                }
            }

            p:nth-of-type(2) {
                font-size: 12px;
                margin-top: 10px;
                line-height: 1.4em;
            }
        }
    }
</style>
