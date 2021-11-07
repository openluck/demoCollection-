<template>
    <div>
        <empty-data :is-show="empty"/>
        <commodity-list :list="data"/>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/attribute.scss';
    import Vue from 'vue';
    import { Toast } from 'vant';
    import EmptyData from '../Commodity/CommodityEmpty.vue';
    import CommodityList from '../Commodity/CommodityList.vue';

    Vue.use(Toast);

    export default {
        props: {
            sortKey: {
                type: String,
                default: 'timeDown'
            }
        },
        components: {
            EmptyData, CommodityList
        },
        watch: {
            sortKey: function () {
                this.fetchCommodities();
            }
        },
        data() {
            return {
                data: [],
                empty: false
            }
        },
        created() {
            this.fetchCommodities();
        },
        methods: {
            fetchCommodities: function () {
                Toast.loading({
                    message: '加载中...',
                    forbidClick: true
                });
                this.$http.get('/api/commodities/category', {
                    params: {
                        // eslint-disable-next-line camelcase
                        category_id: this.$route.params.hashid,
                        sort: this.sortKey
                    }
                }).then(response => {
                    this.$set(this.$data, 'data', response.data.data);
                    this.$nextTick(() => {
                        Toast.clear()
                        this.empty = this.data.length === 0;
                    });
                });
            }
        }
    }
</script>
