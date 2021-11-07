<template>
    <div>
        <van-list v-model="isLoading"
                  :finished="loadFinished"
                  finished-text="没有更多商品了:)"
                  @load="loadMore" v-if="!empty">
            <commodity-list :code="list"/>
        </van-list>
        <empty-data :is-show="{empty:true, stroll:true}" v-else/>

    </div>
</template>

<script>
    'use strict';
    import '@/sass/attribute.scss';
    import Vue from 'vue';
    import { List } from 'vant';
    import CommodityList from '../Countries/CommodityList'
    import EmptyData from '../Commodity/CommodityEmpty';

    Vue.use(List)

    export default {
        data() {
            return {
                list: [],
                empty: false,
                current_page: 0, // eslint-disable-line camelcase
                isLoading: false,
                loadFinished: false
            }
        },
        props: {
            sortKey: {
                type: String,
                default: 'soldDown'
            }
        },
        components: {
            EmptyData,
            CommodityList
        },
        watch: {
            sortKey: function () {
                this.initialization();
                this.fetchCommodities();
            }
        },
        created() {
        },
        methods: {
            fetchCommodities: function () {
                this.current_page += 1;// eslint-disable-line camelcase
                this.$http.get(`/api/commodities/${this.$route.params.hashid.toUpperCase()}`, {
                    params: {
                        sort: this.sortKey,
                        page: this.current_page // eslint-disable-line camelcase
                    }
                }).then(response => {
                    this.list = this.list.concat(response.data.data);
                    this.empty = response.data.meta.total === 0;
                    this.current_page = response.data.meta.current_page; // eslint-disable-line camelcase
                    this.isLoading = false;
                    this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                });
            },
            loadMore() {
                this.fetchCommodities();
            },
            // 初始化数据
            initialization() {
                this.current_page = 0; // eslint-disable-line camelcase
                this.$set(this.$data.list, 'table', []);
                this.isLoading = false;
                this.loadFinished = false;
            }
        }
    }
</script>
