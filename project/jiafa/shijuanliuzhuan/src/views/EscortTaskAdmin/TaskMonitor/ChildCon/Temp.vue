<template>
    <div class="temp">
        当前浏览器不支持音视频通话。请使用Chrome谷歌浏览器
    </div>
</template>

<script>
export default {
    methods:{
        leaveRoom(){
            console.log(123);
            
        }
    }
}
</script>

<style>
    .temp{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>