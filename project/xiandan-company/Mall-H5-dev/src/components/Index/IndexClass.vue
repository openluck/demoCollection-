<template>
    <van-swipe :autoplay="0" :height="200" indicator-color="white" v-if="topics.length > 8">
        <van-swipe-item v-for="i in pageCount" :key="i">
            <div class="index-class">
                <div @click="linkList(topic.id)" v-for="topic in pageData(i - 1)" :key="topic.id">
                    <p>
                        <img slot="icon" :src="topic.topic_img">
                        <span>{{topic.topic_title}}</span>
                    </p>
                </div>
            </div>
        </van-swipe-item>
    </van-swipe>
    <div class="index-class" v-else>
        <div @click="linkList(topic.id)" v-for="topic in topics" :key="topic.id">
            <p>
                <img slot="icon" :src="topic.topic_img">
                <span>{{topic.topic_title}}</span>
            </p>
        </div>
    </div>
</template>

<script>
    'use strict';

    import Vue from 'vue'
    import { Swipe, SwipeItem } from 'vant';

    Vue.use(Swipe).use(SwipeItem);

    export default {
        name: 'IndexClass',
        data() {
            return {
                topics: ''
            };
        },
        created() {
            this.fetchTopic();
        },
        computed: {
            pageCount() {
                return Math.floor(this.topics.length / 8) + (this.topics.length % 8 > 0 ? 1 : 0);
            }
        },
        methods: {
            fetchTopic: function () {
                this.$http.get('/api/topics').then(response => {
                    this.topics = response.data;
                });
            },
            pageData(page) {
                let start = page * 8
                let end = Math.min(start + 8, this.topics.length)
                return this.topics.slice(start, end)
            },
            linkList(val) {
                this.$router.push({
                    name: 'topic', params: { hashid: val }
                })
            }
        }
    };
</script>

<style type="text/scss">
    .index-class {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        /*height: 90px;*/

        div {
            margin-top: 20px;
            width: 25%;
            min-width: 25%;
            height: 70px;
            text-align: center;
            display: flex;
            justify-content: center;

            p {
                border-radius: 50%;
                margin: 0px auto;
                height: 50px;
                width: 50px;

                img {
                    width: 50px;
                }
            }

            span {
                display: block;
                margin-top: 6px;
                color: #313233;
                font-size: 14px;
                font-family: PingFang-SC-Bold;
                font-weight: bold;
            }
        }
    }
</style>
