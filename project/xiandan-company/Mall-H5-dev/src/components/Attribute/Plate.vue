<template>
    <div>
        <van-list v-model="isLoading"
                  :finished="loadFinished"
                  finished-text="没有更多商品了:)"
                  @load="loadMore" v-if="!empty">
            <commodity-list :code="data"/>
        </van-list>
        <empty-data :is-show="{empty:true, stroll:true}" v-else/>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/attribute.scss'
    import Vue from 'vue'
    import { Toast, List } from 'vant'
    import EmptyData from '../Commodity/CommodityEmpty'
    import CommodityList from '../Countries/CommodityList'

    Vue.use(Toast).use(List)

    export default {
        props: {
            sortKey: {
                type: String,
                default: ''
            }
        },
        components: {
            EmptyData, CommodityList
        },
        watch: {
            sortKey: function () {
                this.initialization();
                this.fetchCommodities();
            }
        },
        data() {
            return {
                data: [],
                empty: false,
                current_page: 0, // eslint-disable-line camelcase
                isLoading: false,
                loadFinished: false
            }
        },
        created() {
        },
        methods: {
            fetchCommodities: function () {
                this.current_page += 1;// eslint-disable-line camelcase
                this.$http.get('/api/commodities/plate', {
                    params: {
                        plate_id: this.$route.params.hashid, // eslint-disable-line camelcase
                        page: this.current_page, // eslint-disable-line camelcase
                        sort: this.sortKey
                    }
                }).then(response => {
                    this.data = this.data.concat(response.data.data);
                    this.empty = response.data.meta.total === 0;
                    this.current_page = response.data.meta.current_page; // eslint-disable-line camelcase
                    this.isLoading = false;
                    this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                });
            },
            loadMore: function () {
                this.fetchCommodities()
            },
            // 初始化数据
            initialization() {
                this.current_page = 0; // eslint-disable-line camelcase
                this.$data.data = [];
                this.isLoading = false;
                this.loadFinished = false;
            }
        }
    }
</script>
