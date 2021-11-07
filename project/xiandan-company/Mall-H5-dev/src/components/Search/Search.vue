<template>
    <div class="search-container">
        <div class="search-bar">
            <van-icon class="search-bar-left" name="arrow-left" @click="onCancel"/>
            <van-search class="search-bar-right"
                        placeholder="搜索闲蛋商品"
                        v-model="searchText"
                        show-action
                        shape="round"
                        @search="searchRequest">
                <van-button slot="action"
                            type="default"
                            size="small"
                            :disabled="searchText.length === 0"
                            @click="searchRequest"
                            round>搜索</van-button>
            </van-search>
        </div>
        <history-search v-if="historyShow" @historyValue="goods" :parentValue="searchValue"/>
        <attribute class="classification" @passValue="pass" v-show="commodityShow && list.table.length>0"/>
        <van-list v-if="commodityShow"
                  @load="loadMore"
                  v-model="isLoading"
                  :finished="loadFinished"
                  :error="loadError"
                  finished-text="没有更多搜索商品了:)"
                  error-text="没有搜索到您需要的商品:("
                  immediate-check>
            <commodity-list :code="list"
                            class="search-list"
                            :class="{rowDisplay:mode === 1}"/>
        </van-list>
        <empty-data :is-show="{empty:isEmpty && !historyShow, stroll:false}"
                    :style="{height: screenHeight + 'px'}" class="no-search">
            <van-icon class-prefix="iconfont" name="tubiao11" slot="img"/>
            <h4 slot="header" style="color: #636566">搜索无数据</h4>
        </empty-data>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/search.scss';
    import Vue from 'vue';
    import { List, Icon, Search, Button } from 'vant';
    import Attribute from '@/components/Attribute/Attribute';
    import HistorySearch from '@/components/Search/HistorySearch';
    import EmptyData from '../Commodity/CommodityEmpty';
    import CommodityList from '@/components/Countries/CommodityList'

    Vue.use(List).use(Icon).use(Search).use(Button)

    export default {
        data() {
            return {
                list: {
                    table: [],
                    msg: 'all'
                },
                searchText: '',
                current_page: 0, // eslint-disable-line camelcase
                last_page: 0, // eslint-disable-line camelcase
                orders: [],
                isLoading: false,
                isEmpty: false,
                loadFinished: false,
                loadError: false,
                dataMsgFormSon: null,
                commodityShow: false,
                historyShow: true,
                searchValue: '',
                delete: false,
                mode: 0,
                classArr: ['shu', 'tu'],
                isFirstEnter: false,
                back: false,
                screenHeight: window.innerHeight - 76
            }
        },
        components: {
            Attribute,
            HistorySearch,
            EmptyData,
            CommodityList
        },
        watch: {
            'searchText': function (val) {
                if (val === '') {
                    this.list.table = [];
                    this.commodityShow = false;
                    this.historyShow = true;
                    this.loadFinished = false;
                    this.delete = false;
                } else {
                    this.delete = true;
                }
            },
            'searchValue': function (val) {
                if (val.value == null || val.value.location === 0) {
                    this.searchValue = false;
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.name === 'index') {
                to.meta.isBack = true;
                to.meta.keepAlive = false
            } else if (from.name === 'commodity') {
                to.meta.keepAlive = true
            }
            next();
        },
        created() {
            this.$set(this.$data, 'searchValue', JSON.parse(localStorage.getItem('cmts') || '[]'));
            this.isFirstEnter = true;
        },
        activated() {
            if (this.$route.meta.isBack || this.isFirstEnter) {
                this.searchText = '';
                this.initialization();
            }
            this.$route.meta.isBack = false;
            this.isFirstEnter = false;
        },
        methods: {
            // 排序传值
            pass(data) {
                this.dataMsgFormSon = data;
                this.initialization();
                this.isLoading = true
                this.loadPageData();
            },
            // 历史和热门搜索
            goods(data) {
                this.searchText = data;
                this.historyShow = false;
                this.searchRequest();
            },
            // 搜索
            searchRequest() {
                this.historyShow = false;
                this.initialization();
                if (this.searchText.length > 0) {
                    let localList = [];
                    if (localStorage.getItem('cmts')) {
                        localList = JSON.parse(localStorage.getItem('cmts'));
                    }
                    const index = localList.indexOf(this.searchText)
                    if (index !== -1) {
                        localList.splice(index, 1);
                    }
                    localList.unshift(this.searchText);
                    if (localList.length > 15) {
                        localList.pop();
                    }
                    localStorage.setItem('cmts', JSON.stringify(localList));
                    this.$set(this.$data, 'searchValue', localList);
                    this.loadPageData();
                    this.commodityShow = true;
                }
            },
            onCancel() {
                this.$router.go(-1);
            },
            // 分页
            loadPageData: function () {
                this.current_page += 1; // eslint-disable-line camelcase
                this.$http.get('/api/commodities/search', {
                    params: {
                        keys: this.searchText,
                        sort: this.dataMsgFormSon,
                        page: this.current_page
                    }
                }).then(response => {
                    this.isLoading = false;
                    this.isEmpty = response.data.meta.total === 0;
                    this.list.table = this.list.table.concat(response.data.data);
                    this.loadError = response.data.meta.total === 0;
                    this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                    this.current_page = response.data.meta.current_page;// eslint-disable-line camelcase
                    this.last_page = response.data.meta.last_page;// eslint-disable-line camelcase
                });
            },
            // 加载分页数据
            loadMore() {
                this.loadPageData();
            },
            // 初始化数据
            initialization() {
                this.current_page = 0; // eslint-disable-line camelcase
                this.$set(this.$data.list, 'table', []);
                this.isLoading = false;
                this.isEmpty = false;
                this.loadFinished = false;
            },
            // 删除收搜索val
            deleteVal() {
                this.searchText = '';
            },
            // 改变排列方式
            arrangement() {
                this.mode++;
                this.mode = this.mode % 2;
            }
        },
        mounted() {
            if (this.searchText == null || this.searchText.length === 0) {
                this.isLoading = false;
            }
        },
        directives: {
            'focus': {
                inserted: function (el) {
                    el.focus()
                }
            }
        }
    }
</script>

<style type="text/scss">
    .no-search {
        width: calc(100% - 32px) !important;
        background: white;
        margin-top: 16px;
        margin-left: 16px;
        border-radius: 16px;
    }
</style>
