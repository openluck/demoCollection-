<template>
    <div class="commodity-list-container">
        <router-link tag="div"
                     :key="item.id"
                     :to="{name:'commodity',params:{hashid:item.id}}" v-for="item in list"
                     class="list-data-wrapper">
            <div class="commodity-img">
                <img :src="item.commodity_img" alt="commodity name"/>
            </div>
            <p class="commodity-line"/>
            <div class="data-info-wrapper">
                <p class="title">
                    {{item.commodity_name}}
                </p>
                <p class="price">
                    &yen;{{item.commodity_current_price}}&emsp;<del>&yen;{{item.commodity_original_price}}</del>
                    <span>{{item.source|storageMode}}</span>
                </p>
            </div>
        </router-link>
    </div>

</template>

<script>
    'use strict';
    import '@/sass/attribute.scss';

    export default {
        data() {
            return {}
        },
        props: ['list']
    }
</script>
<style type="text/scss">
    //两个商品并排显示
    #list-data-container .list-data-wrapper {
        display: inline-block;
        width: 46%;
        box-sizing: border-box;
        border-radius: 5px;
        margin: 2%;
    }

    .commodity-img {
        height: 150px !important;
        width: 80%;
        margin: auto;
        overflow: hidden;
    }

    .commodity-line {
        width: 80% !important;
    }

    .data-info-wrapper {
        padding-bottom: 0px !important;
    }

    .title {
        font-size: 13px;
        padding: 0px !important;
        overflow: hidden;
        margin: 5px !important;
        box-sizing: border-box;
        height: 3em;
    }

    .price span {
        display: inline-block;
        background: red;
        color: white !important;
        width: 34px;
        height: 15px;
        text-align: center;
        line-height: 15px;
        border-radius: 10px;
        font-size: 12px;
    }
</style>
