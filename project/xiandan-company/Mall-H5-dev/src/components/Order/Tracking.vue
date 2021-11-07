<template>
    <iframe id="shipping-track"
            frameborder="0"
            :src="this.src"
            :width="this.windowWidth"
            :height="this.windowHeight">
    </iframe>
</template>

<script>
    // import '@/common/js/KDNWidget';

    export default {
        name: 'Tracking',
        data() {
            return {
                windowWidth: '100%',
                windowHeight: '100%',
                src: '#'
            }
        },
        mounted() {
            if (this.$route.query.expCode === 'HTKY') {
                window.location.replace(`https://mp.weixin.qq.com/bizmall/expresslogistics?appid=wx61af89c230ee8c23&orderid=${this.$route.query.expNo}`);
            } else {
                this.src = `https://www.kdniao.com/JSInvoke/MSearchResult.aspx?expCode=${this.$route.query.expCode}&expNo=${this.$route.query.expNo}&sortType=DESC&color=rgb(46,114,251)&backUrl="#"`
                this.windowWidth = window.innerWidth + 'px';
                this.windowHeight = window.innerHeight + 50 + 'px';
            }

            // KDNWidget.run({
            //     serviceType: 'B',
            //     expCode: this.$route.query.expCode,
            //     expNo: this.$route.query.expNo,
            //     showType: 'normal',
            //     container: 'shipping-track'
            // })
        }
    }
</script>

<style type="text/scss">
    #shipping-track {
        position: absolute;
        left: 0;
        top: -50px;
        width: 100%;
        height: calc(100% + 44px);
        border: 0;
    }

</style>
