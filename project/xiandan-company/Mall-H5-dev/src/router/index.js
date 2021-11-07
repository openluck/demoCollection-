'use strict';
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function lazyImport(chunk, path) {
    return () => import(/* webpackChunkName: "view-[chunk]" */ `@/components/${path}`)
}

const router = new VueRouter({
    mode: 'history',
    base: '/mall/',
    routes: [
        {
            path: '/',
            redirect: {
                name: 'index'
            }
        },
        {
            path: '/home',
            name: 'home',
            redirect: {
                name: 'index'
            }
        },
        {
            path: '/index',
            name: 'index',
            component: lazyImport('index', 'Index'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/main',
            redirect: {
                name: 'main',
                params: {hashid: 'index'}
            }
        },
        {
            path: '/main/:hashid',
            name: 'main',
            component: lazyImport('main', 'Main')
        },
        {
            path: '/countries',
            name: 'countries',
            component: lazyImport('category', 'Countries'),
            meta: {
                keepAlive: true,
                isBack: false
            }
        },
        {
            path: '/:hashid/commodity',
            name: 'commodity',
            component: lazyImport('commodity', 'Commodity/CommodityDetail')
        },
        {
            path: '/:hashid/tag',
            name: 'tag',
            component: lazyImport('commodity', 'Attribute/Tag')
        },
        {
            path: '/cart',
            name: 'cart',
            component: lazyImport('cart', 'Cart')
        },
        {
            path: '/usercenter',
            name: 'usercenter',
            component: lazyImport('usercenter', 'UserCenter')
        },
        {
            path: '/user/auth',
            name: 'userauth',
            component: lazyImport('userauth', 'Auth/UserAuth')
        },
        // vip会员页面
        {
            path: '/user/member',
            name: 'member',
            component: lazyImport('member','User/Member')
        },
        {
            path: '/user/member_rule',
            name: 'member_rule',
            component: lazyImport('member_rule', 'User/MemberRule'),
        },
        {
            path: '/user/redpack',
            name: 'redpack',
            component: lazyImport('redpack', 'User/RedPack')
        },
        {
            path: '/user/saltegg',
            name: 'saltegg',
            component: lazyImport('saltegg', 'User/SaltEgg')
        },
        {
            path: '/attr/:hashid',
            name: 'attribute',
            component: lazyImport('attribute', 'Attribute/Attribute'),
            children: [
                {
                    path: 'topic',
                    name: 'topic',
                    component: lazyImport('topic', 'Attribute/Topic')
                },
                {
                    path: 'plate',
                    name: 'plate',
                    component: lazyImport('plate', 'Attribute/Plate')
                },
                {
                    path: 'category',
                    name: 'category-list',
                    component: lazyImport('category-list', 'Attribute/Category')
                }
            ]
        },
        {
            path: '/address',
            name: 'address',
            component: lazyImport('address', 'Address/AddressList')
        },
        {
            path: '/address/add',
            name: 'add-address',
            component: lazyImport('add-address', 'Address/AddressAdd')
        },
        {
            path: '/address/:hashid/edit',
            name: 'edit-address',
            component: lazyImport('edit-address', 'Address/AddressEdit')
        },
        {
            path: '/address/:hashid/choose',
            name: 'choose-address',
            component: lazyImport('choose-address', 'Address/AddressChoose')
        },
        {
            path: '/address/:hashid/auth',
            name: 'auth-address',
            component: lazyImport('auth-address', 'Address/AddressAuth')
        },
        {
            path: '/:from/:commodities/ordersettle',
            name: 'order-settle',
            component: lazyImport('order-settle', 'Order/OrderSettle')
        },
        {
            path: '/:type/orderlist',
            name: 'order-list',
            component: lazyImport('order-list', 'Order/OrderList')
        },
        {
            path: '/:hashid/orderdetail',
            name: 'order-detail',
            component: lazyImport('order-detail', 'Order/OrderDetail')
        },
        {
            path: '/tracking',
            name: 'Tracking',
            component: lazyImport('tracking', 'Order/Tracking')
        },
        {
            path: '/:hashid/orderpay',
            name: 'orderpay',
            component: lazyImport('orderpay', 'Order/OrderPay')
        },
        {
            path: '/suggestion',
            name: 'suggestion',
            component: lazyImport('suggestion', 'Suggestion/Suggestion')
        },
        {
            path: '/login',
            name: 'login',
            component: lazyImport('login', 'Login')
        },
        {
            path: '/mallInvitation',
            name: 'mallInvitation',
            // component: lazyImport('national', 'UserInvitation/NationalActivities/national')
            component: lazyImport('mallInvitation', 'UserInvitation/MallInvitation')
        },
        {
            path: '/qrCode',
            name: 'qrCode',
            component: lazyImport('qrCode', 'UserInvitation/QrCode')
        },
        {
            path: '/activityCode',
            name: 'activityCode',
            component: lazyImport('activityCode', 'UserInvitation/ActivityCode')
        },
        {
            path: '/:type/coupon',
            name: 'coupon',
            component: lazyImport('coupon', 'User/Coupon')
        },

        {
            path: '/search',
            name: 'search',
            component: lazyImport('search', 'Search/Search'),
            meta: {
                keepAlive: true,
                isBack: false
            }
        },
        {
            path: '/collection',
            name: 'collection',
            component: lazyImport('collection', 'Collection/Collection')
        },
        {
            path: '/luckDraw',
            name: 'luckDraw',
            component: lazyImport('luckDraw', 'LuckDraw/LuckDraw')
        },
        {
            path: '/distribution',
            name: 'distribution',
            component: lazyImport('distribution', 'Distribution/Distribution')
        },

        // 国庆活动页面
        {
            path: '/national',
            name: 'national',
            // component: lazyImport('mallInvitation', 'UserInvitation/MallInvitation')
            component: lazyImport('national', 'UserInvitation/NationalActivities/national')
        },
        // 活动规则
        {
            path: '/activityrules',
            name: 'activityrules',
            component: lazyImport('activityrules', 'UserInvitation/NationalActivities/ActivityRules')
        },
        // 被邀请人列表
        {
            path: '/invitedlist',
            name: 'invitedlist',
            component: lazyImport('invitedlist', 'UserInvitation/NationalActivities/InvitedList')
        },
        // 海报页面
        {
            path: '/poster',
            name: 'poster',
            component: lazyImport('poster', 'UserInvitation/NationalActivities/poster')
        },
        //信用卡还款
        {
            path: '/user/bill',
            name: 'CreditCardBill',
            component: lazyImport('CreditCardBill', 'User/CreditCardBill')
        },
        //还款详情
        {
            path: '/user/bill/:hashid/detail',
            name: 'CreditCardBillDetail',
            component: lazyImport('CreditCardBillDetail', 'User/CreditCardBillDetail')
        },
        {
            path: '/user/bill/list',
            name: 'CreditCardHistory',
            component: lazyImport('CreditCardHistory', 'User/CreditCardHistory')
        },
        //周年活动
        {
            path: '/anniversary',
            name: 'anniversary',
            component: lazyImport('anniversary', 'Anniversary/Anniversary')
        },
        // 周年活动积分页面
        {
            path: '/anniversary/integral',
            name: 'integral',
            component: lazyImport('integral','Anniversary/Integral')
        },
        // 周年活动规则页面
        {
            path: '/anniversary/rule',
            name: 'rule',
            component: lazyImport('rule', 'Anniversary/Rule')
        },
        // 好友助力页面
        {
            path: '/anniversary/invited/:code',
            name: 'invited',
            component: lazyImport('invited', 'Anniversary/Invited')
        },
        // 助力的人页面
        {
            path: '/anniversary/list',
            name: 'helpedlist',
            component: lazyImport('helpedlist', 'Anniversary/HelpedList')
        },
        // 收货人信息页面，兑换实物商品
        {
            path: '/anniversary/conversionprize/:index',
            name: 'conversionprize',
            component: lazyImport('conversionprize', 'Anniversary/ConversionPrize')
        }


    ]
})

export default router;
