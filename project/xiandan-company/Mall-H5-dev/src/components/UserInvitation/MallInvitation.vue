<template>
    <div>
        <div class="wait-scroll-loading" v-if="wait">
            <van-loading color="#09bb07" :size="25"/>
        </div>
        <div v-else>
            <activity-code v-if="activityData.code === 1"/>
            <invite-friends v-else :code="activityData.code"/>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Loading } from 'vant';
    import QrCode from './QrCode'
    import ActivityCode from './ActivityCode.vue';
    import InviteFriends from './InviteFriends';

    Vue.use(Loading);

    export default {
        name: 'mallInvitation',
        components: {
            QrCode,
            ActivityCode,
            InviteFriends
        },
        data() {
            return {
                activityData: {},
                wait: true
            }
        },
        created() {
            this.activity();
        },
        methods: {
            activity() {
                this.$http.get('/api/events/invite').then(response => {
                    this.activityData = response.data
                    this.wait = false
                })
            }
        }
    }
</script>

<style >

</style>
