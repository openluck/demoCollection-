<template>
    <form id="suggest-form" @submit.prevent="submitSuggestion()">
        <div class="form-wrapper">
            <title>问题或建议</title>
            <van-field
                    placeholder="请描述您的问题或建议，我们将尽快优化体验，感谢您的反馈。"
                    slot="suggestion"
                    type="textarea"
                    rows="6"
                    v-model="suggestion"/>
        </div>
        <div class="form-wrapper">
            <van-button v-bind:disabled="formDisabled" type="primary" size="large">提交</van-button>
        </div>
    </form>
</template>

<script>
    'use strict';
    import '@/sass/suggestion.scss';
    import Vue from 'vue';
    import { Toast, Field, Button, Dialog } from 'vant';

    Vue.use(Toast).use(Field).use(Button).use(Dialog);

    export default {
        data() {
            return {
                suggestion: '',
                formDisabled: true
            };
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.fromRoute = from;
            })
        },
        watch: {
            suggestion: function (val) {
                this.$set(this.$data, 'formDisabled', val.length === 0);
            }
        },
        methods: {
            submitSuggestion: function () {
                if (this.suggestion.length === 0) {
                    Toast({ message: '内容不能为空！' });
                    return;
                }
                Toast.loading({ message: '加载中...', forbidClick: true })
                this.$http.post('/api/suggestion', { suggestion: this.suggestion }).then(response => {
                    if (response.data.code === 0) {
                        Dialog.alert({ message: '内容已提交' }).then(() => {
                            if (!this.fromRoute.name) {
                               if(!WeixinJSBridge.invoke('closeWindow')){
                                   this.$router.replace({ name: 'home' });
                               }
                            } else {
                                this.$router.back();
                            }
                        });
                    } else {
                        Toast({
                            message: '操作失败'
                        });
                    }
                    Toast.clear();
                });
            }
        }
    };
</script>
