<template>
    <div class="panel">
        <div class="wait-scroll-loading" v-if="waiting">
            <van-loading type="spinner" color="#09bb07" :size="25"/>
        </div>
        <van-tabs v-model="selected"
                  line-width="18"
                  line-height="2"
                  @change="countryChanged" sticky v-else>
            <van-tab v-for="item in topics"
                     :key="item.code"
                     :name="item.code"
                     :title="item.name">
            </van-tab>
            <van-list v-model="isLoading"
                      :finished="loadFinished"
                      @load="loadPageData"
                      finished-text="没有更多商品信息了:)"
                      :immediate-check="false"
                      v-if="!isEmpty">
                <commodity-list :code="list"/>
            </van-list>
        </van-tabs>
        <empty-data :is-show="{empty: true, stroll:true}"
                    class="no-goods"
                    v-if="isEmpty">
            <svg class="icon" aria-hidden="true" slot="img">
                <use xlink:href="#icon-tubiao6"/>
            </svg>
            <h4 slot="header">商品上架中，敬请期待...</h4>
        </empty-data>
    </div>
</template>
<script>
    'use strict';
    import Vue from 'vue';
    import {List, Loading, Tab, Tabs} from 'vant';
    import CommodityList from './Countries/CommodityList'
    import EmptyData from './Commodity/CommodityEmpty';

    Vue.use(List).use(Loading).use(Tab).use(Tabs);

    export default {
        data() {
            return {
                topics: [],
                msg: 'all',
                current_page: 0, // eslint-disable-line camelcase
                selected: 0,
                waiting: true,
                isLoading: false,
                isEmpty: false,
                loadFinished: false,
                list: {
                    table: [],
                    msg: 'all'
                }
            }
        },
        components: {
            EmptyData,
            CommodityList
        },
        created() {
            this.fetchTopic();
        },
        methods: {
            countryChanged(name) {
                this.list.msg = name
                this.initialization();
                this.isLoading = true
                this.loadPageData();
            },
            fetchTopic: function () {
                this.$http.get('/api/countries').then(response => {
                    this.topics = response.data;
                    const all = {code: 'all', name: '全部'};
                    this.topics.unshift(all);
                    this.initialization();
                    this.isLoading = true;
                    this.waiting = false;
                    this.loadPageData();
                });
            },
            loadPageData: function () {
                this.current_page += 1; // eslint-disable-line camelcase
                this.$http.get(`/api/commodities/${this.list.msg === 'all' ? this.list.msg : 'country'}`, {
                    params: {
                        code: this.list.msg,
                        page: this.current_page // eslint-disable-line camelcase
                    }
                }).then(response => {
                    this.isLoading = false;
                    this.isEmpty = response.data.meta.total === 0;
                    this.list.table = this.list.table.concat(response.data.data);
                    this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                    this.current_page = response.data.meta.current_page;// eslint-disable-line camelcase
                });
            },
            initialization() {
                this.current_page = 0; // eslint-disable-line camelcase
                this.isLoading = false;
                this.loadFinished = false;
                this.$set(this.list, 'table', []);

            }
        }
    }
</script>

<style type="text/scss">
    .panel {
        margin-bottom: 50px;

        .no-goods {
            margin-top: -56px !important;
        }
    }

</style>
