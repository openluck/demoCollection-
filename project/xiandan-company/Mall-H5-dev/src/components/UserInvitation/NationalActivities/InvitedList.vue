<template>
    <div class="body" :style="{minHeight:this.clientHeight}">
        <div class="user-body">
            <p v-if="userList.length === 0" class="no-user">暂无被邀请用户</p>
            <div v-else v-for="(item,index) of userList" class="user-item">
                <img :src="item.avatar === '' ? '/images/img/user_head.png':item.avatar" alt="" class="user-head"/>
                <p>{{item.nickname}}</p>
            </div>
        </div>
        <div class="wait-scroll-loading" v-if="wait">
            <van-loading color="#09bb07" :size="25"/>
        </div>
    </div>
</template>

<script>
    'use strict';

    import Vue from 'vue';
    import { Loading } from 'vant';

    Vue.use(Loading)

    export default {
        name: 'InvitedList',
        data() {
            return {
                clientHeight: '1000px',
                wait: true,
                userList: []
            }
        },
        created() {
            this.clientHeight = `${document.documentElement.clientHeight}px`;
            this.getUserData();
        },
        methods: {
            getUserData() {
                this.$http.get('/api/events/invite').then(res => {
                    // console.log(res.data.message.user_list);
                    // if (res.data.code == 2 || res.data.code == 0) {
                    //     this.$router.push({ path: 'mallInvitation' });
                    // } else {
                    this.userList = res.data.message.user_list;
                    // }
                    this.wait = false;
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style  type="text/scss">
    .body {
        background: #e4393c;
        zoom: 1;
        overflow: hidden;

        .user-body {
            width: 343px;
            min-height: 50px;
            background: #fff;
            border-radius: 20px;
            margin: 10px auto;
            display: flex;
            flex-wrap: wrap;
            padding: 5px;

            .no-user {
                line-height: 50px;
                text-align: center;
            }

            .user-item {
                width: 20%;
                text-align: center;

                .user-head {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    /*border: 1px solid red;*/
                }
            }
        }
    }
</style>
