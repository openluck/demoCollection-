<template>
    <div class="red-packet-wrapper">
        <user-top :type="1" :value="user.red_pack | transformPrice" class="userTop">
            <p slot="title">红包余额</p>
        </user-top>
        <van-list v-if="!isEmpty"
                  @load="loadPageData"
                  :finished="loadFinished"
                  finished-text="没有更多记录了:)"
                  v-model="isLoading">
            <div class="red-packet-bottom">
                <p>闲蛋记录</p>
                <div v-for="packet in redPackets" :key="packet.id">
                    <p>
                        <span>{{packet.desc}}</span>
                        <span>{{packet.created_at}}</span>
                    </p>
                    <p>
                        {{packet.value | SignNumberFloat}}
                    </p>
                </div>
            </div>
        </van-list>
        <empty-data :is-show="{empty:isEmpty, center:'no', stroll:false}"
                    class="red-packet-empty"
                    v-bind:style="{height: screenHeight + 'px'}" v-else>
            <van-icon class-prefix="iconfont" name="hongbao1" slot="img"/>
            <h4 slot="header">还没有红包记录哦</h4>
            <p slot="explain">多参与闲蛋商城活动，可以获得闲蛋红包哦</p>
        </empty-data>
    </div>
</template>

<script>
    'use strict';
    import '../../sass/RedPacket.scss'
    import Vue from 'vue'
    import { List, Icon } from 'vant';
    import UserTop from './UserTop'
    import EmptyData from '../Commodity/CommodityEmpty';

    Vue.use(List).use(Icon);

    export default {
        name: 'Redpack',
        data() {
            return {
                current_page: 0, // eslint-disable-line camelcase
                redPackets: [],
                loadFinished: false,
                isEmpty: false,
                isLoading: false,
                screenHeight: window.innerHeight - 205
            }
        },
        components: {
            UserTop,
            EmptyData
        },
        computed: {
            user: function () {
                return this.$store.state.user;
            }
        },
        created() {
            // this.loadPageData();
        },
        methods: {
            loadPageData: function () {
                this.current_page += 1; // eslint-disable-line camelcase
                this.$http.get(`/api/redpack/record?page=${this.current_page}`)
                    .then(response => {
                        this.isLoading = false;
                        this.isEmpty = response.data.meta.total === 0
                        this.redPackets = this.redPackets.concat(response.data.data);
                        this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                        this.current_page = response.data.meta.current_page;// eslint-disable-line camelcase
                    });
            }
        }
    }
</script>

<style type="text/scss">
    .red-packet-bottom {
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
