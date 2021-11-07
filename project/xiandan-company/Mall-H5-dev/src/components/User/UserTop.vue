<template>
    <div class="salt-egg-top">
        <!--//{{user.salt_eggs}}-->
        <slot name="title"/>
        <p>{{value}}<span>{{type === 0 ? '颗' : '元'}}</span></p>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<script>
    export default {
        name: 'UserTop',
        props: ['value', 'type']
    }
</script>

<style  type="text/scss">
    .salt-egg-top {
        margin-top: 16px;
        border-radius: 16px;
        padding-bottom: 30px;
        overflow: hidden;
        position: relative;
    p{
        margin-left: 24px;
    }
    div{
        position: absolute;
    }
    p:nth-of-type(1){
        color: #FEFEFE;
        font-size: 18px;
        padding-top: 30px;
        font-weight: bold;
    }
    p:nth-of-type(2){
        margin-top: 19px;
        font-size: 51px;
        color: white;
        font-weight: bold;
    span{
        font-size: 18px;
    }
    }
    div:nth-of-type(1){
        width: 64px;
        height: 64px;
        border-radius: 32px;
        top: -27px;
        left: -22px;

    }
    div:nth-of-type(2){
        width: 46px;
        height: 46px;
        border-radius: 32px;
        top: -14px;
        right: 95px;
    }
    div:nth-of-type(3){
        width: 80px;
        height: 80px;
        border-radius: 100px;
        top: -14px;
        right: -15px;
    }
    div:nth-of-type(4){
        width: 40px;
        height: 40px;
        border-radius: 100px;
        top: 30px;
        left: 110px;
    }
    div:nth-of-type(5){
        width: 73px;
        height: 73px;
        border-radius: 100px;
        top: 121px;
        left: 22px;
    }
    div:nth-of-type(6){
        width: 73px;
        height: 73px;
        border-radius: 100px;
        top: 132px;
        left: 219px;
    }
    }
</style>
