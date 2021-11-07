<template>
    <div class="body" :style="{minHeight:this.clientHeight}">
        <div class="box">
            <p v-for="(item,index) of text">{{item}}</p>
        </div>
        <div class="wait-scroll-loading" v-if="wait">
            <van-loading type="spinner" color="#09bb07" :size="25"/>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { Loading } from 'vant';

    Vue.use(Loading)

    export default {
        name: 'ActivityRules',
        data() {
            return {
                clientHeight: '1000px',
                wait: true,
                text: ''
            }
        },
        created() {
            this.clientHeight = `${document.documentElement.clientHeight}px`;
            this.getUserData();
        },
        methods: {
            getUserData() {
                this.$http.get('/api/events/invite').then(res => {
                    // console.log(res);
                    // if (res.data.code == 2 || res.data.code == 0) {
                    //     this.$router.push({ path: 'mallInvitation' });
                    // } else {
                    let text = res.data.message.invitation.desc;
                    text = text.split('\r\n');
                    let arr = [];
                    for (let i of text) {
                        if (i !== '') {
                            arr.push(i);
                        }
                    }
                    // console.log(arr);
                    this.text = arr;
                    // }
                    this.wait = false;
                }).catch(err => {
                    vConsole.log(err)
                })
            }
        }
    }
</script>

<style  type="text/scss">
    .body {
        background: #F13232;
        overflow: hidden;
        zoom: 1;

        .box {
            overflow: hidden;
            zoom: 1;
            margin: 20px auto;
            width: 80%;
            border-radius: 20px;
            background: white;
            text-align: center;

            p {
                margin: 10px;
                font-size: 12px;
            }

            p:first-child {
                font-size: 16px;
            }
        }
    }
</style>
