<template>
    <div v-if="plates.length > 0" class="activity">
        <router-link tag="div"
                     :key="plate.id"
                     :to="{name: 'plate', params: { hashid: plate.id } }"
                     v-for="plate in plates">
            <img alt='img' :src="plate.plate_img" class="activity-img">
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'IndexActivity',
        data() {
            return {
                plates: []
            }
        },
        mounted() {
            this.$http.get('/api/plates').then(response => {
                this.plates = response.data;
            });
        }
    }
</script>

<style>
    .activity {
        padding: 20px 12px 12px 12px;
    }

    .activity-img {
        width: 100%;
        height: auto;
    }
</style>
