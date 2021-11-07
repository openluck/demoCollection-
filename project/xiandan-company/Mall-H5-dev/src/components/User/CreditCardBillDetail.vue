<template>
    <van-panel title="还款详情"
               desc="为闲蛋商城会员提供免费信用卡还款服务，仅收取支付手续费。手续费：6.1‰;还款日:支付订单后的下一个工作日（不包含周六日）">
        <van-row v-if="isLoading">
            <van-col span="8" offset="8">
                <van-loading size="24px" vertical style="margin: 32px">加载中...</van-loading>
            </van-col>
        </van-row>
        <van-cell-group v-else>
            <van-cell title="处理号" :value="bill.refs_no"/>
            <van-cell title="账户名" :value="bill.name" label="信用卡所属人姓名"/>
            <van-cell title="账号" :value="bill.bank_account.replace(/(\d{4})(?=\d)/g, '$1 ')" label="行用卡卡号"/>
            <van-cell title="银行名称" :value="bill.bank_name" label="账户所属银行名称"/>
            <van-cell title="还款金额" :value="bill.amount + ' 元'" label="银行卡到账金额"/>
            <van-cell title="手续费" :value="bill.fee + ' 元'" label="手续费=还款金额 * 6.1‰"/>
            <van-cell title="总金额" :value="bill.total + ' 元'" label="总金额=还款金额 + 手续费"/>
            <van-cell title="状态" :value="statusMsg" :label="statusTip"/>
            <van-cell title="还款凭证" is-link @click="showReceipt" v-if="bill.receipt != null"/>
        </van-cell-group>
        <div style="margin: 16px;" v-if="!isLoading">
            <van-button round block type="info"
                        :loading="isPaying"
                        loading-text="支付中"
                        @click="onPay"
                        v-if="bill.status === 0">
                支付
            </van-button>
            <van-button round block type="info"
                        :loading="isCanceling"
                        loading-text="取消中"
                        @click="onCancel"
                        v-else-if="bill.status === 1">
                取消
            </van-button>
            <van-button round block type="info"
                        @click="onReCreate"
                        v-else>
                再还一笔
            </van-button>
        </div>
    </van-panel>
</template>

<script>
    import Vue from 'vue';
    import { Loading, Button, Panel, Col, Row, Toast, ImagePreview, Cell, CellGroup } from 'vant';

    Vue.use(Loading).use(Button).use(Panel).use(Col).use(Row).use(Cell).use(CellGroup).use(ImagePreview);

    export default {
        name: 'CreditCardBillDetail',
        data() {
            return {
                isLoading: true,
                isPaying: false,
                isCanceling: false,
                bill: {}
            }
        },
        mounted() {
            this.$http.get(`/api/user/bill/${this.$route.params['hashid']}`).then(resp => {
                if (resp.data.code === 0) {
                    this.bill = resp.data.message
                    this.isLoading = false
                } else {
                    Toast(resp.data.message)
                }

            });
        },
        computed: {
            statusMsg: function () {
                switch (this.bill.status) {
                    case 0:
                        return '未支付'
                    case 1:
                        return '已支付'
                    case 2:
                        return '已取消'
                    case 3:
                        return '已锁定'
                    case 4:
                        return '已还款'
                    case 5:
                        return '已退款'
                    case 6:
                        return '已失效'
                    default:
                        return '未知状态'
                }
            },
            statusTip: function () {
                switch (this.bill.status) {
                    case 0:
                        return '还款记录已创建，请在当天完成支付，超时无效。'
                    case 1:
                        return '支付成功！系统将在支付后一个工作日内完成还款，支付当天允许取消。'
                    case 2:
                        return '您已取消还款，如需还款请重新提交！'
                    case 3:
                        return '系统已锁定状态，如您需要取消还款，可以在公众号内联系客服。'
                    case 4:
                        return '系统已打款，请联系您的信用卡银行查询还款状态。'
                    case 5:
                        return '您的还款未成功，系统已办理退款，详情联系客服。'
                    case 6:
                        return '未及时支付，已失效！'
                    default:
                        return '还款状态错误，请联系客服。'
                }
            }
        },
        methods: {
            onPay: function () {
                this.isPaying = true
                this.$http.get(`/api/user/bill/${this.$route.params['hashid']}/payment`)
                    .then(resp => {
                        if (resp.data.code === 0) {
                            wx.chooseWXPay({
                                timestamp: resp.data.message.timestamp,
                                nonceStr: resp.data.message.nonceStr,
                                package: resp.data.message.package,
                                signType: resp.data.message.signType,
                                paySign: resp.data.message.paySign,
                                success: res => {
                                    this.isPaying = false
                                    this.bill.status = 1
                                    Toast('支付成功！');
                                },
                                cancel: res => {
                                    this.isPaying = false
                                    Toast('微信支付失败！');
                                }

                            });
                        } else {
                            this.isPaying = false
                            Toast(resp.data.message)
                        }

                    }).catch(err => {
                    this.isPaying = false
                    Toast('网络错误！');
                })
            },
            onCancel: function () {
                this.isCanceling = true
                this.$http.get(`/api/user/bill/${this.$route.params['hashid']}/cancel`)
                    .then(resp => {
                        if (resp.data.code === 0) {
                            this.isCanceling = false
                            this.bill.status = 2
                            Toast('已取消！');
                        } else {
                            this.isCanceling = false
                            Toast(resp.data.message)
                        }
                    }).catch(err => {
                    this.isCanceling = false
                    Toast('网络错误！');
                })
            },
            onReCreate: function () {
                this.$router.replace({
                    name: 'CreditCardBill',
                    query: { 'bankAccount': this.bill.bank_account.replace(/(\d{4})(?=\d)/g, '$1 ') }
                })
            },
            showReceipt: function () {
                ImagePreview([this.bill.receipt])
            }
        }
    }
</script>

<style scoped>

</style>
