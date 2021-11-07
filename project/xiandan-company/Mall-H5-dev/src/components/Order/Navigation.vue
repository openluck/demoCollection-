<template>
    <div class="category-top">
        <div class="category-box">
            <p :class="{'category-action':activeIndex == index}" v-for="(top,index) in navigation.top" :key="index"
            @click="returnData(index)">
            {{top}}
            <span class="category-line"/>
            </p>
        </div>
    </div>
</template>

<script>
    'use strict';
    export default {
        data() {
            return {
                activeIndex: 0
            }
        },
        props: ['navigation'],
        created() {
            this.activeIndex = this.navigation.action
        },
        methods: {
            returnData(val) {
                this.activeIndex = val;
                this.$emit('selected', this.activeIndex);
            }
        }
    }
</script>

<style  type="text/scss">
    .category-top {
        width: 100%;
        height: 44px;
        background: #FFFFFF;
        padding: 0px 16px;
        box-sizing: border-box;

        .category-box {
            width: 100%;
            height: 44px;
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;

            p {
                color: #636566;
                font-size: 14px;
                line-height: 44px;
                margin-right: 50px;
            }

            p:last-of-type {
                margin-right: 0px !important;
            }

            .category-action {
                color: #313233;
                font-weight: bold;
                font-size: 15px !important;

                .category-line {
                    width: 18px;
                    height: 2px;
                    background: #F10D0D;
                    display: block;
                    position: relative;
                    top: -10px;
                    margin: auto;
                }
            }
        }
    }
</style>
