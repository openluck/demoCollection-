<template>
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
        <van-cell
                v-for="item in list"
                :key="item.refs_no"
                :value="'¥'+item.amount"
                :label="item.bank_account"
                :title="item.bank_name"
                :to="{name:'CreditCardBillDetail', params: { 'hashid': item.id }}"
                is-link />
    </van-list>
</template>

<script>
    import Vue from 'vue';
    import { List, Cell, Toast } from 'vant';

    Vue.use(List).use(Cell).use(Toast);

    export default {
        name: 'CreditCardHistory',
        data() {
            return {
                loading: false,
                finished: false,
                page: 0,
                list: []
            }
        },
        methods: {
            onLoad() {
                this.$http.get('/api/user/bill', {
                    params: {
                        page: this.page + 1
                    }
                }).then(resp => {
                    this.loading = false
                    this.list = this.list.concat(resp.data.data);
                    this.finished = resp.data.last_page <= resp.data.current_page;
                    this.page = resp.data.current_page;// eslint-disable-line camelcase
                }).catch(err => {
                    this.loading = false
                    Toast.fail('加载数据失败！')
                })
            }
        }
    }
</script>

<style scoped>

</style>
