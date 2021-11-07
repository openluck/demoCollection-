<template>
    <div class="salt-egg-container">
        <user-top :type="0" :value="user.salt_eggs">
            <p slot="title">闲蛋积分</p>
        </user-top>
        <empty-data :is-show="{empty:isEmpty, center:'no', stroll:false}"
                    class="egg-empty"
                    v-bind:style="{height: screenHeight + 'px'}"
                    v-if="isEmpty">
            <van-icon class-prefix="iconfont" name="jifen2"/>
            <h4 slot="header">还没有积分记录哦</h4>
            <p slot="explain">多参与闲蛋商城活动，可以获得闲蛋积分哦</p>
        </empty-data>
        <van-list v-model="isLoading"
                  :finished="loadFinished"
                  finished-text="没有更多记录了:)"
                  @load="loadPageData"
                  v-else>
            <div class="salt-egg-bottom">
                <p>闲蛋记录</p>
                <div v-for="record in records" :key="record.id">
                    <p>
                        <span>{{record.description}}</span>
                        <span>{{record.when}}</span>
                    </p>
                    <p>
                        {{record.salt_eggs | SignNumberInt}}颗咸蛋
                    </p>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
    'use strict';
    import '../../sass/saltegg.scss'
    import Vue from 'vue'
    import { Toast, List, Cell, Loading } from 'vant';
    import UserTop from './UserTop'
    import EmptyData from '../Commodity/CommodityEmpty';
    import Icon from '../_layouts/Icon';

    Vue.use(List).use(Toast).use(Cell).use(Loading);

    export default {
        name: 'SaltEgg',
        data() {
            return {
                current_page: 0, // eslint-disable-line camelcase
                records: [],
                loadFinished: false,
                isLoading: false,
                isEmpty: false,
                screenHeight: window.innerHeight - 205
            }
        },
        computed: {
            user: function () {
                return this.$store.state.user;
            }
        },
        components: {
            Icon,
            UserTop,
            EmptyData
        },
        mounted: function () {
            this.$http.get('/api/checkin').then((response) => {
                if (response.data.code === 0) {
                    const data = response.data.message;
                    this.days = data.days;
                    this.checkinable = data.checkinable;
                    this.$store.commit('updateSaltEggs', data.total_salt_eggs);
                } else {
                    Toast({ message: response.data.message });
                }
            }).catch((error) => {
                console.log(error);
            });
        },
        created() {

        },
        methods: {
            loadPageData: function () {
                this.current_page += 1; // eslint-disable-line camelcase
                this.$http.get(`/api/saltegg/record?page=${this.current_page}`)
                    .then(response => {
                        this.isLoading = false;
                        this.records = this.records.concat(response.data.data);
                        this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page;
                        this.isEmpty = response.data.meta.total === 0
                        this.current_page = response.data.meta.current_page;// eslint-disable-line camelcase
                    });
            }
        }
    }
</script>

<style type="text/scss">
    .salt-egg-bottom {
        width: 100%;
        padding: 16px 16px 6px 16px;
        box-sizing: border-box;
        background: white;
        margin-top: 16px;
        border-radius: 16px;
        overflow: auto;

        & > p:nth-of-type(1) {
            width: 100%;
            font-weight: bold;
            margin-bottom: 10px;
        }

        & > div {
            height: 50px;
            position: relative;
            border-top: 1px solid #F0F3F5;

            p:nth-of-type(1) {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                display: inline-block;

                & > span:nth-of-type(1) {
                    font-size: 14px;
                    color: #313233;
                }

                & > span:nth-of-type(2) {
                    display: block;
                    font-size: 12px;
                    color: #636566;
                    margin-top: 5px;

                    span:nth-of-type(2) {
                        margin-left: 5px;
                    }
                }
            }

            p:nth-of-type(2) {
                float: right;
                font-size: 14px;
                line-height: 50px;
            }
        }
    }
</style>
