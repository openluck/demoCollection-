<template>
    <div class="panel">
        <index-search/>
        <index-banner/>
        <index-class/>
        <index-activity/>
        <index-recommend>
            <span slot="title">闲蛋推荐</span>
        </index-recommend>
        <index-list/>
    </div>
</template>

<script>
    'use strict';
    import IndexBanner from './Index/IndexBanner'
    import IndexSearch from './Index/IndexSearch'
    import IndexClass from './Index/IndexClass'
    import IndexActivity from './Index/IndexActivity'
    import IndexRecommend from './Index/IndexRecommend'
    import IndexList from './Index/IndexList'

    export default {
        components: {
            IndexActivity,
            IndexBanner,
            IndexSearch,
            IndexClass,
            IndexRecommend,
            IndexList
        }
    }
</script>
