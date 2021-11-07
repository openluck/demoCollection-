<template>
    <div>
      <home></home>
    </div>
</template>

<script>
    import WebHead from './pc/WebHead'
    import WebFooter from './pc/WebFooter'
    import $ from 'jquery'
    import raffle from './pc/raffle';
    import home from './pc/home';

    export default {
        name: 'Index',
        data() {
            return {
            }
        },
        components: {
            WebHead,
            WebFooter,
            raffle,
            home,
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll);
        },
        watch: {
            top(val) {
                if (val < 200) {
                    this.action = 0;
                } else {
                    this.action = ''
                }
            }
        },
        methods: {
            handleScroll() {
                this.top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            },
            nav(index) {
                this.screenTop('.roll', index, 300);
            },
            screenTop(ele, index, speed) {
                if (!speed) speed = 300;
                if (!ele) {
                    $('html,body').animate({ scrollTop: 0 }, speed);
                } else {
                    if (ele.length > 0) $('html,body').animate({ scrollTop: $(ele).eq(index).offset().top }, speed);
                }
                return false;
            }
        }
    }
</script>

<style scoped>

</style>
