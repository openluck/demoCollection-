<template>
    <div class="popup" :style="{height: height + 'px'}">
        <ul>
            <li v-for="(item,index) in this.$t('navigation.nav')" :key="index" @click="selection(index)" ref="top">
                {{item}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'Popup',
        data() {
            return {
                height: window.innerHeight
            }
        },
        methods: {
            selection(index) {
                if (index === 5) {
                    location.href = '/mall';
                } else if (index === 7) {
                    if (this.$i18n.locale == 'zh') {
                        this.$i18n.locale = 'en'
                        this.$refs.top[index].innerHTML = 'LANGUAGE'
                    } else {
                        this.$i18n.locale = 'zh'
                        this.$refs.top[index].innerHTML = '切换语言'
                    }
                } else {
                    this.$emit('slide', index > 5 ? (index - 1) : index);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .popup {
        position: absolute;
        width: 100%;
        background: #F8F8F8;
        position: absolute;
        top: 0px;
        left: 0px;

        ul {
            margin-top: 50px;

            li {
                text-align: center;
                line-height: 50px;
            }
        }
    }
</style>
