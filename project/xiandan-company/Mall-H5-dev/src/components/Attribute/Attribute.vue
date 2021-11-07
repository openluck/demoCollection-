<template>
    <div>
        <div id="sequence-container">
            <ul>
                <li v-for="(item, index) in top"
                    @click="sortOrder(index)"
                    :class="{'active' : topActive === index}">
                    {{item}}
                    <p v-if="index<2"/>
                </li>
                <van-icon class-prefix="iconfont" name="yuanjiaojuxingkaobei4" :class="{rotate:ranking}"/>
            </ul>
            <div class="price-ranking" v-show="ranking">
                <p :class="{priceAction:sortKey === 'priceUp'}" @click="sortByPrice('priceUp')">由低到高</p>
                <p :class="{priceAction:sortKey === 'priceDown'}" @click="sortByPrice('priceDown')">由高到低</p>
            </div>
        </div>
        <router-view :sort-key="sortKey"/>
    </div>
</template>

<script>
    import '@/sass/attribute.scss';
    import Vue from 'vue'
    import { Icon } from 'vant'

    Vue.use(Icon)

    export default {
        data() {
            return {
                sortKey: 'timeDown',
                commodities: '',
                top: ['新品', '畅销', '价格'],
                topActive: 0,
                ranking: false
            }
        },
        components: {},
        watch: {
            'sortKey': function (sortKey) {
                this.$emit('passValue', sortKey)
            }
        },
        methods: {
            sortByPrice(value) {
                if (value === 'priceUp' && this.sortKey !== 'priceUp') {
                    this.$set(this.$data, 'sortKey', 'priceUp');
                } else if (value === 'priceDown' && this.sortKey !== 'priceDown') {
                    this.$set(this.$data, 'sortKey', 'priceDown');
                }
                this.ranking = false;
            },
            sortOrder(index) {
                this.topActive = index;
                this.ranking = false;
                if (index === 0 && this.sortKey !== 'timeDown') {
                    this.$set(this.$data, 'sortKey', 'timeDown');
                } else if (index === 1 && this.sortKey !== 'soldDown') {
                    this.$set(this.$data, 'sortKey', 'soldDown');
                } else if (index === 2) {
                    this.ranking = !this.ranking
                }
            }
        }
    }
</script>

<style  type="text/scss">
    #sequence-container {
        width: 100%;

        ul {
            width: 100%;
            margin: 0;
            height: 44px;
            line-height: 44px;
            box-sizing: border-box;
            list-style-type: none;
            display: flex;
            justify-content: center;
            position: relative;
            background: white;

            li {
                width: 33.33333%;
                cursor: pointer;
                display: inline-block;
                font-size: 14px;
                height: 44px;
                line-height: 44px;
                text-align: center;
                position: relative;

                &.active {
                    background: #F8FAFC;
                    font-weight: bold;
                }

                p {
                    display: inline-block;
                    width: 1px;
                    height: 20px;
                    background: #636566;
                    margin-top: 12px;
                    position: absolute;
                    right: 0;
                }
            }

            .iconfont {
                position: absolute;
                right: 9.5%;
                /*top: 40%;*/
                font-size: 5px;
            }

            .rotate {
                transform: rotate(90deg);
                transition: all ease 0.5s;
            }
        }

        .price-ranking {
            width: 100%;
            background: #F8FAFC;
            text-align: center;
            height: 85px;
            font-size: 14px;
            color: #636566;

            p {
                height: 42px;
                line-height: 42px;
            }

            p:nth-of-type(1) {
                border-bottom: 1px solid #DEE0E3;
                border-top: 1px solid #DEE0E3;
            }

            p:nth-of-type(2) {
                border-bottom: 1px solid #DEE0E3;
            }

            .priceAction {
                color: #313233;
                font-weight: bold;
            }
        }
    }
</style>
