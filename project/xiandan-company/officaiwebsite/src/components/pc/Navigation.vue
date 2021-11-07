<template>
    <div class="navigation">
        <ul>
            <li v-for="(item,index) in this.$t('navigation.nav')" :key="index"
                :class="{action: mask === index||actionIndex === index }" @click="selection(index)" ref="top">
                {{item}}
                <span></span>
            </li>
        </ul>
        <div class="fadeInLeft animated">
            <p>{{this.$t('navigation.company')}}</p>
            <p><span>{{this.$t('navigation.shopping')}}</span></p>
            <p>{{this.$t('navigation.platform')}}</p>
            <p @click="selection(4)">{{this.$t('navigation.go')}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Navigation',
        data() {
            return {
                actionIndex: 0
            }
        },
        props: ['mask'],
        watch: {
            mask(val) {
                if (val === 0) {
                    this.actionIndex = 0
                }
            }
        },
        methods: {
            selection(index) {
                this.actionIndex = index

                if (index === 5) {
                    location.href = '/shopping';
                } else if (index === 7) {
                    if (this.$i18n.locale == 'zh') {
                        localStorage.lang = 'en';
                        this.$i18n.locale = 'en'
                        this.$refs.top[index].innerHTML = 'LANGUAGE'
                    } else {
                        this.$i18n.locale = 'zh'
                        localStorage.lang = 'zh';
                        this.$refs.top[index].innerHTML = '切换语言'
                    }
                } else {
                    this.$emit('msg', index > 5 ? (index - 1) : index)
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .navigation {
        width: 100%;
        height: 580px;
        background: url("../../assets/img/navigation.png") no-repeat center center;
        background-size: cover;

        ul {
            display: flex;
            justify-content: center;

            li {
                color: white;
                margin-right: 34px;
                height: 48px;
                line-height: 48px;
                position: relative;
                cursor: pointer;
            }

            .action {
                font-weight: bold;

                span {
                    display: inline-block;
                    width: 40px;
                    height: 4px;
                    background: white;
                    position: absolute;
                    bottom: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }

            li:last-of-type {
                margin-right: 0px;
            }
        }

        div {
            p {
                margin: 0px;
            }

            width: calc(100% - 720px);
            margin: auto;
            margin-top: 167px;
            color: white;

            p:nth-of-type(1) {
                font-size: 36px;
            }

            p:nth-of-type(2) {
                font-size: 48px;
                margin-top: 20px;
                position: relative;
                height: 65px;

                span:nth-of-type(2) {
                }
            }

            p:nth-of-type(3) {
                margin-top: 20px;
                font-size: 20px;
            }

            p:nth-of-type(4) {
                width: 140px;
                height: 40px;
                background: #1CA0E6;
                text-align: center;
                line-height: 40px;
                font-size: 14px;
                font-weight: bold;
                margin-top: 30px;
            }
        }
    }
</style>
