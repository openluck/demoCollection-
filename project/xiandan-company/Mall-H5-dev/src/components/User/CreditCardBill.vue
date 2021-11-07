<template>
    <van-panel title="信用卡还款" desc="为闲蛋商城会员提供免费信用卡还款服务，仅收取支付手续费。手续费：6.1‰;还款日:支付订单后的下一个工作日（不包含周六日）">
        <van-form @submit="onSubmit" validate-first ref="form">
            <van-field
                    v-model="name"
                    name="name"
                    label="账户名"
                    :readonly=true
                    :rules="[{ required: true, message: '账户名不能为空' }]"
            />
            <van-field
                    v-model="bankAccount"
                    required
                    name="bank_account"
                    label="账号"
                    :maxlength="23"
                    :formatter="formatterBankCard"
                    :error="bankNumberError.length > 0"
                    :error-message="bankNumberError"
                    placeholder="请输入银行账号"
                    :rules="[{ required: true, message: '银行账号不能为空' }]"
            />
            <van-field
                    v-model="bankName"
                    name="bank_name"
                    label="银行名称"
                    :readonly=true
                    :rules="[{ required: true, message: '银行名称不能为空' }]"
            />
            <van-field
                    v-model="amount"
                    type="number"
                    name="amount"
                    required
                    label="还款金额"
                    placeholder="请输入需要还款的金额"
                    :rules="[
                        { required: true, message: '还款金额不能为空' },
                        { validator: this.phoneAmount, message: '还款金额不小于0.01元' }]"
            />
            <van-field
                    v-model="fee"
                    type="number"
                    name="fee"
                    label="手续费"
                    :readonly=true
                    :rules="[{ required: true, message: '手续费不能为空' }]"
            />
            <van-field
                    v-model="total"
                    type="number"
                    name="total"
                    label="支付金额"
                    :readonly=true
                    :rules="[{ required: true, message: '支付金额不能为空' }]"
            />
            <van-field
                    v-model="date"
                    name="amount"
                    label="预计还款日期"
                    :readonly=true
            />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                    提交
                </van-button>
            </div>
            <div style="margin: 16px;">
                <van-button round block type="primary" @click="onShowHistory">
                    历史记录
                </van-button>
            </div>
        </van-form>
    </van-panel>
</template>

<script>
    import Vue from 'vue';
    import { Form, Field, Button, Panel, Toast, Dialog } from 'vant';
    import { formatDate } from '../../common/js/date'
    import { closeWindow } from '../../common/js/tools'
    import { nextWorkingDate } from '../../common/js/WorkingDay'

    let BankInfo = require('bankcardinfo')
    let lastTimer;

    Vue.use(Form).use(Field).use(Button).use(Panel);
    export default {
            name: 'CreditCardBill',
        data() {
            return {
                name: '',
                bankName: '',
                bankAccount: '',
                date: '',
                bankNumberError: '',
                amount: '',
                fee: '',
                total: ''
            }
        },
        computed: {
            user() {
                return this.$store.state.user
            }
        },
        watch: {
            bankAccount: function (val) {
                if (val === undefined || val.length === 0) {
                    this.bankNumberError = ''
                    return
                }
                lastTimer && clearTimeout(lastTimer)
                lastTimer = setTimeout(() => {
                    BankInfo.getBankBin(val.replace(/\D/g, '')).then((data) => {
                        if (data.cardType !== 'CC') {
                            this.bankNumberError = '该卡号不是信用卡账号'
                        } else {
                            this.bankNumberError = ''
                            this.bankName = data.bankName
                        }
                    }).catch(err => {
                        let str = err.split(',')[0]
                        this.bankNumberError = str.split(':')[1]
                    })
                }, 500)

            },
            amount: function (val) {
                this.$http.get('api/user/bill/pricing', {
                    params: {
                        amount: val
                    }
                }).then(resp => {
                    if (resp.data.code === 0) {
                        this.fee = resp.data.message.fee
                        this.total = resp.data.message.total
                    }
                })
            }
        },
        mounted() {
            if (this.user.is_auth !== 2) {
                Dialog.confirm({
                    message: '您的账号未实名认证，不能使用此功能！',
                    confirmButtonText: '前往认证',
                    cancelButtonText: '关闭窗口'
                }).then(() => {
                    this.$router.push({ name: 'userauth' })
                }).catch(err => {
                    closeWindow()
                })
                return
            }

            this.name = this.$store.state.user.name
            this.bankAccount = this.$route.query.bankAccount
            this.date = formatDate(nextWorkingDate(), 'yyyy-MM-dd')
            this.$http.get('/api/user/auth').then(response => {
                this.name = response.data.message.name
            });
        },
        methods: {
            onSubmit: function () {
                Toast.loading({
                    message: '请求中...',
                    forbidClick: true
                });
                this.$http.post('api/user/bill', {
                        name: this.name,
                        amount: this.amount,
                        bank_name: this.bankName,
                        bank_account: this.bankAccount.replace(/\D/g, '')
                }).then(resp => {
                    Toast.clear();
                    if (resp.data.code === 0) {
                        this.$set(this.$data, {
                            name: '',
                            bankName: '',
                            bankNumber: '',
                            date: '',
                            bankNumberError: '',
                            amount: '',
                            fee: '',
                            total: ''
                        }) //清除数据

                        Dialog.confirm({
                            title: '已提交',
                            message: '您的还款信息已成功提交，支付完成后下一个工作日即可完成还款。',
                            confirmButtonText: '立即付款',
                            cancelButtonText: '关闭窗口'
                        }).then(() => {
                            // on confirm
                            this.$router.push({
                                name: 'CreditCardBillDetail',
                                params: { 'hashid': resp.data.message.id }
                            })
                        }).catch(() => {
                            // on cancel
                            closeWindow()
                        });

                    } else {
                        Toast.fail(resp.data.message)
                    }
                }).catch(err => {
                    Toast.clear()
                    Toast.fail('网络异常！')
                })
            },
            formatterBankCard: function (value) {
                value = value.replace(/\D/g, '')
                return value.replace(/(\d{4})(?=\d)/g, '$1 ')
            },
            phoneAmount(val) {
                return val >= 0.01//不小于1分钱
            },
            onShowHistory(){
                this.$router.push({name: 'CreditCardHistory'})
            }
        }
    }
</script>

<style scoped>

</style>
