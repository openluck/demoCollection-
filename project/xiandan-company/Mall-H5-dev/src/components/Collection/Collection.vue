<template>
    <div>
        <van-list class="collection-container"
                  v-model="isLoading"
                  :finished="loadFinished"
                  finished-text="没有更多收藏商品了···"
                  @load="fetchList"
                  v-if="!isEmpty">
            <div class="collection-list" v-for="(item,index) in list" :key="index" :class="{slide:slideShow}">
                <div class="collection-top">
                    <p class="tags">
                        <van-tag round color="#F10D0D" size="medium">{{item.commodity_country ? item.commodity_country : '未知'}}</van-tag>
                        <van-tag round color="#FF6C00" size="medium">{{item.source|storageMode}}</van-tag>
                    </p>
                    <p class="cancel-collect" @click="cancelCollection1(item.id,index)">取消收藏</p>
                </div>
                <div class="collection-bottom"
                     @click="$router.push({name:'commodity',params:{hashid:item.commodity_id}})">
                    <div class="collection-img">
                        <img :src="item.commodity_img">
                    </div>
                    <div class="collection-title">
                        <div>{{item.commodity_name}}</div>
                        <div><span>¥{{item.commodity_current_price}}</span><span><span>剩余：</span><span>{{item.commodity_stock_number}}</span></span>
                        </div>
                    </div>
                </div>
            </div>

        </van-list>

        <empty-data :is-show="{empty:true, center:'no', stroll:false}"
                    class="no-collection"
                    :style="{height: screenHeight + 'px'}"
                    v-else>
            <svg class="icon" aria-hidden="true" slot="img">
                <use xlink:href="#icon-zanwushoucang"/>
            </svg>
            <h4 slot="header">暂无收藏,快去转转</h4>
        </empty-data>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/collection.scss';
    import Vue from 'vue'
    import { Toast, Loading, List, Dialog, Tag } from 'vant';
    import EmptyData from '../Commodity/CommodityEmpty';
    import swipeCell from 'vue-swipe-cell';

    Vue.use(Loading).use(swipeCell).use(Toast).use(List).use(Tag);

    export default {
        data() {
            return {
                list: [],
                isLoading: false,
                isEmpty: false,
                loadFinished: false,
                current_page: 0, // eslint-disable-line camelcase
                slideShow: false,
                screenHeight: window.innerHeight - 32
            }
        },
        components: {
            EmptyData
        },
        created() {
        },
        methods: {
            fetchList() {
                this.isLoading = true;
                this.current_page += 1; // eslint-disable-line camelcase
                this.$http.get(`/api/user/favorites?type=0&page=${this.current_page}`).then(response => {
                    this.isLoading = false;
                    this.current_page = response.data.meta.current_page; // eslint-disable-line camelcase
                    this.isEmpty = response.data.meta.total === 0;
                    this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                    if (response.data.code === 0) {
                        this.$set(this.$data, 'list', this.list.concat(response.data.data));
                    } else {
                        console.log('获取商品收藏列表失败！')
                    }
                })
            },
            // 取消收藏功能
            cancelCollection1: function (id, index) {
                Dialog.confirm({ message: '确定要取消收藏?' }).then(action => {
                    if (action === 'confirm') {
                        Toast.loading({
                            message: '加载中...',
                            forbidClick: true
                        });
                        this.$http.delete(`api/user/favorites/${id}`).then(response => {
                            Toast.clear()
                            this.$delete(this.list, index);
                            this.isLoading = false;
                            this.loadFinished = false;
                            this.current_page = 0; // eslint-disable-line camelcase
                            this.$set(this.$data, 'list', []);
                            this.fetchList();
                            Toast(response.data.message);
                        })
                    }
                });
            }
        }
    }
</script>

<style>

</style>
