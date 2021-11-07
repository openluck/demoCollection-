<template>
    <div>
        <coupon-top :navigation="topInfo" @selected="transmit"/>
        <div class="coupon-container">
            <van-list v-model="isLoading"
                      :finished="loadFinished"
                      finished-text="没有更多优惠券了:)"
                      @load="loadMore"
                      v-if="!isEmpty">
                <coupon-list @msg="touchBegin"
                             @cancel="clearTimer"
                             :table="table"/>
            </van-list>
            <empty-data :is-show="{empty:true, center:'no', stroll:false}"
                        class="coupon-wu"
                        v-bind:style="{height: screenHeight + 'px'}"
                        v-else>
                <van-icon class-prefix="iconfont" name="tubiao5" slot="img"/>
                <h4 slot="header">暂无优惠券，参加活动吧</h4>
            </empty-data>
        </div>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/coupon.scss';

    import Vue from 'vue';
    import { Toast, Dialog, List } from 'vant';
    import EmptyData from '../Commodity/CommodityEmpty';
    import CouponTop from '../Order/Navigation';
    import Icon from '@/components/_layouts/Icon.vue'
    import CouponList from './CouponList'

    Vue.use(Toast).use(List);

    export default {
        data() {
            return {
                current_page: 0, // eslint-disable-line camelcase
                table: {
                    list: [],
                    selected: this.$route.params.type
                },
                isLoading: false,
                loadFinished: false,
                isEmpty: false,
                list: { available: 0, expired: 0, used: 0 },
                styleShow: true,
                type: ['available', 'used', 'expired'],
                topInfo: {
                    top: ['未使用', '已使用', '已过期'],
                    action: 0
                },
                loop: null,
                screenHeight: window.innerHeight - 44 - 32
            }
        },
        created() {
            this.topInfo.action = this.type.indexOf(this.table.selected)
        },
        watch: {
            'table.selected': function (val) {
                this.$router.replace({
                    name: 'coupon', params: { 'type': val }
                });
                this.initialization();
                this.loadPageData();
            }
        },
        components: {
            EmptyData,
            CouponTop,
            Icon,
            CouponList
        },
        methods: {
            transmit(msg) {
                this.table.selected = this.type[msg];
            },
            loadPageData: function () {
                this.isLoading = true;
                this.current_page += 1; // eslint-disable-line camelcase
                this.$http.get(`/api/coupon/list/${this.table.selected}?page=${this.current_page}`).then(response => {
                    this.isLoading = false;
                    this.table.list = this.table.list.concat(response.data.data);
                    this.isEmpty = response.data.meta.total === 0
                    this.loadFinished = response.data.meta.last_page <= response.data.meta.current_page && response.data.meta.total !== 0;
                    this.current_page = response.data.meta.current_page;// eslint-disable-line camelcase
                });
            },
            //    上拉加载
            loadMore() {
                this.loadPageData();
                this.list = this.$route.query.infoSon;
            },
            // 清空数据
            initialization() {
                this.current_page = 0; // eslint-disable-line camelcase
                this.$set(this.$data.table, 'list', []);
                this.isLoading = false;
                this.loadFinished = false;
            },
            // 删除优惠券
            cancelCoupon: function (index, code) {
                Dialog.confirm({ message: '确定要删除优惠券吗?' }).then(action => {
                    if (action === 'confirm') {
                        Toast.loading({ message: '删除中...', forbidClick: true });
                        this.$http.delete(`/api/${code}/coupon`).then(response => {
                            Toast.clear()
                            if (response.data.code === 0) {
                                this.$delete(this.table.list, index);
                                this.table.list = response.data.message;
                                // eslint-disable-next-line camelcase
                                this.$set(this.$data, 'paginate', { current_page: 0 });
                                this.initialization();
                                this.loadPageData();
                                Toast('优惠券删除成功！');
                            } else {
                                Toast('删除优惠券失败！')
                            }
                        })
                    }
                });
            },
            touchBegin(msg) {
                clearTimeout(this.loop);
                this.loop = setTimeout(() => {
                    this.cancelCoupon(msg[0], msg[1])
                }, 500)
            },
            clearTimer() {
                clearTimeout(this.loop);
            }
        }
    }
</script>

<style  type="text/scss">

</style>
