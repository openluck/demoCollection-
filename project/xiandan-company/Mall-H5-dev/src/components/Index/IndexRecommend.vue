<template>
    <div class="index-recommend">
        <span/>
        <slot name="title"><h4>商品上架中，敬请期待···</h4></slot>
    </div>
</template>

<script>
    export default {
        name: 'Recommend'
    }
</script>

<style type="text/scss">
    .index-recommend {
        width: 100%;
        padding: 0 16px;
        margin: 20px auto auto;
        box-sizing: border-box;

        span:nth-of-type(1) {
            width: 2px;
            height: 15px;
            background: #F10809;
            display: inline-block;
            position: relative;
            top: 1px;
        }

        span:nth-of-type(2) {
            font-size: 15px;
            font-family: PingFang-SC-Bold;
            font-weight: bold;
            display: inline-block;
            box-sizing: border-box;
        }
    }
</style>
