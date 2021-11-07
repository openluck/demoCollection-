<template>
    <div class="panel">
        <div class="cart-top" v-if="carts.length>0">
            <p><span>购物车：</span><span>{{cartNum}}</span></p>
            <p @click="edit = !edit">{{edit ? '完成' : '编辑'}}</p>
        </div>
        <div class="cart-container" v-if="!noCommodity">
            <router-link tag="div"
                         class="cart-wrap"
                         :key="cart.id"
                         :to="{name:'commodity',params:{hashid:cart.commodity_id}}"
                         v-for="(cart, index) in carts">
                <van-tag class="cart-tag-source" mark color="#FF6C00" size="medium">{{cart.source|storageMode}}
                </van-tag>
                <div class="cart-left" :class="cart.selected ? 'selected' : '' "
                     @click.prevent="toggleSelect(cart)"></div>
                <div class="cart-img">
                    <img :src="cart.image"/>
                </div>
                <div class="cart-right">
                    <p>
                        <span class="warehouse">{{cart.warehouse}}</span>
                    </p>
                    <p>{{cart.title}}</p>
                    <p v-show="cart.country">进口国：{{cart.country}}</p>
                    <div class="cart-num">
                        <span>&yen;{{cart.price | transformPrice}}</span>
                        <div class="commodity-num" @click="(e)=>{e.preventDefault()}">
                            <van-stepper :value="cart.count"
                                         :min="1"
                                         :name="index"
                                         async-change
                                         @change="onChange"
                                         disable-input/>
                            <!--                            <van-icon class-prefix="iconfont" name="jian1" @click.prevent="minusClick(cart)"/>-->
                            <!--                            <input type="tel" v-bind:value="cart.count" disabled>-->
                            <!--                            <van-icon class-prefix="iconfont" name="jia1" @click.prevent="plusClick(cart)"/>-->
                        </div>
                    </div>
                </div>
            </router-link>
            <div class="check-container" v-if="carts.length>0">
                <div>
                    <div class="select-all-btn" @click="selectAll(carts)">
                        <van-icon class-prefix="iconfont" name="yuanjiaojuxingkaobei1" color="#F75108"
                                  v-if="selectedAll"/>
                    </div>
                    <span>全选</span>
                </div>
                <van-button color="#F10D0D"
                            class="to-pay-btn"
                            @click="edit ? editDel(cart) : toSettle()"
                            :disabled="totalPrice === 0">{{edit ? '删除' : '结算'}}
                </van-button>
                <div class="total-result" v-if="!edit">
                    <p class="total-price"><span>总计：</span><span>&yen;{{totalPrice | transformPrice}}</span></p>
                    <p>（不含运费）</p>
                </div>
            </div>
        </div>
        <transition>
            <empty-data :is-show="{empty:noCommodity, stroll:true}">
                <van-icon class-prefix="iconfont" name="tubiao3" slot="img"/>
                <h4 slot="header">空空如也，需要添点东西...</h4>
            </empty-data>
        </transition>
    </div>
</template>

<script>
    'use strict';
    import '@/sass/cart.scss';
    import Vue from 'vue';
    import {Toast, Dialog, Icon, Button, Stepper, Tag} from 'vant';
    import EmptyData from './Commodity/CommodityEmpty';

    Vue.use(Toast).use(Icon).use(Button).use(Stepper).use(Tag);

    export default {
        data: () => ({
            carts: [],
            selectedAll: true,
            totalPrice: 0,
            edit: false,
            noCommodity: false
        }),
        mounted() {
            this.fetchCart();
        },
        computed: {
            cartNum() {
                return this.$store.state.cartNum
            },
            shopConfig() {
                return this.$store.state.shopConfig;
            }
        },
        components: {
            EmptyData
        },
        methods: {
            fetchCart: function () {
                Toast.loading({message: '获取中...', forbidClick: true})
                this.$http.get('/api/cart').then(response => {
                    Toast.clear()
                    const data = response.data.message;
                    for (const i in data) {
                        data[i].selected = true;
                    }
                    this.carts = data;
                    this.$store.commit('updateCart', {
                        empty: '=',
                        num: data.length
                    });
                    this.$nextTick(() => {
                        this.calculatePrice();
                        this.noCommodity = response.data.message.length <= 0;
                    });
                });
            },
            minusClick: function (cart) {
                if (cart.count > 1) {
                    cart.count = (parseInt(cart.count) - 1);
                    this.calculatePrice();
                    this.$http.patch(`/api/cart/${cart.id}`, {
                        /* eslint-disable-next-line camelcase */
                        commodity_num: cart.count
                    }).then(response => {
                        Toast({message: response.data.message});
                    })
                }
            },
            onChange: function (value, detail) {
                const oldValue = this.carts[detail.name].count
                if (oldValue === value) return
                this.carts[detail.name].count = value
                this.$http.patch(`/api/cart/${this.carts[detail.name].id}`, {
                    /* eslint-disable-next-line camelcase */
                    commodity_num: value
                }).then(response => {
                    Toast({message: response.data.message});
                    if (response.data.code === 0) {
                        this.calculatePrice();
                    } else {
                        this.carts[detail.name].count = oldValue
                    }
                })
            },
            plusClick: function (cart) {
                cart.count = (parseInt(cart.count) + 1);
                this.$http.patch(`/api/cart/${cart.id}`, {
                    /* eslint-disable-next-line camelcase */
                    commodity_num: cart.count
                }).then(response => {
                    Toast({message: response.data.message});
                    if (response.data.code === 0) {
                        this.calculatePrice();
                    } else {
                        cart.count = (parseInt(cart.count) - 1);
                    }
                })
            },
            toggleSelect: function (cart) {
                cart.selected = !cart.selected;
                if (!cart.selected) {
                    this.selectedAll = false;
                } else {
                    let selected = 0;
                    const count = this.carts.length;
                    for (const i in this.carts) {
                        if (this.carts[i].selected) {
                            selected++;
                        }
                    }
                    if (count === selected) {
                        this.selectedAll = true;
                    }
                }
                this.calculatePrice();
            },
            selectAll: function (carts) {
                this.selectedAll = !this.selectedAll;
                if (this.selectedAll) {
                    for (const i in carts) {
                        carts[i].selected = true;
                    }
                } else {
                    for (const i in carts) {
                        carts[i].selected = false;
                    }
                }
                this.calculatePrice();
            },
            calculatePrice: function () {
                let price = 0;
                this.carts.forEach(value => {
                    if (value.selected) {
                        price += value.price * value.count;
                    }
                });
                this.totalPrice = price;
            },
            toSettle: function () {
                if (!this.shopConfig.config_switch_purchase) {
                    Dialog.alert({message: this.shopConfig.config_switch_tips_purchase})
                        .then(() => {
                        })
                } else {
                    const commodities = this.carts.filter(function (item) {
                        return item.selected
                    }).map(function (item) {
                        return [item.commodity_id, item.count].map(encodeURIComponent).join('=');
                    }).join('&');
                    this.$router.push({name: 'order-settle', params: {from: 'cart', commodities: commodities}});
                }
            },
            editDel() {
                const commodities = this.carts.filter(function (item) {
                    return item.selected
                }).map(function (item) {
                    return [item.id]
                }).join(',');
                Dialog.confirm({message: `您确定要从购物车移除商品吗?`})
                    .then(() => {
                        Toast.loading({message: '删除中...', forbidClick: true})
                        this.$http.delete(`/api/cart/${commodities}`).then(response => {
                            Toast.clear();
                            if (response.data.code === 0) {
                                this.$store.commit('updateCart', {
                                    empty: '-',
                                    num: 1
                                });
                                this.fetchCart();
                                this.calculatePrice();
                            }
                            Toast({
                                message: response.data.message

                            });
                        });
                    });
            }
        }
    }
</script>

<style type="text/scss">
    .v-enter,
    .v-leave-to {
        opacity: 0;
    }

    .v-enter-active,
    .v-leave-active {
        transition: all 1s ease;
    }
</style>
