<template>
    <div class="order-title">
        <span></span>
        <span>你可能还喜欢</span>
        <span></span>
    </div>
</template>

<script>
    export default {
        name: 'orderTitle'
    }
</script>

<style  type="text/scss">
    .order-title{
        width: 100%;
        margin: auto;
        text-align: center;
        position: relative;
        span:nth-of-type(1),span:nth-of-type(3){
            width: 12px;
            height: 2px;
            background: #F75108;
            display: inline-block;
            position: relative;
            top: -4px;
        }
        span:nth-of-type(2){
            color: #F75108;
            font-size: 14px;
            font-weight: bold;
            margin: 0 3px;
        }
    }
</style>
