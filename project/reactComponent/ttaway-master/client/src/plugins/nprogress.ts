import router from "../route"
import NProgress from "nprogress"
// import 'nprogress/nprogress.css' //这个样式必须引入

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})

router.afterEach(() => {
    NProgress.done()
})