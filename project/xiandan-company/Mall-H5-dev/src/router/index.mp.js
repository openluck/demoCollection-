import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '@/components/Index';
import Countries from '@/components/Countries';
import CommodityDetail from '@/components/Commodity/CommodityDetail';
import Cart from '@/components/Cart';
import UserCenter from '@/components/UserCenter';
import UserAuth from '@/components/Auth/UserAuth';
import RedPacket from '@/components/User/RedPack';
import SaltEgg from '@/components/User/SaltEgg';
import Attribute from '@/components/Attribute/Attribute';
import Topic from '@/components/Attribute/Topic';
import Plate from '@/components/Attribute/Plate';
import Category from '@/components/Attribute/Category';
import AddressList from '@/components/Address/AddressList';
import AddressAdd from '@/components/Address/AddressAdd';
import AddressEdit from '@/components/Address/AddressEdit';
import OrderSettle from '@/components/Order/OrderSettle';
import OrderList from '@/components/Order/OrderList';
import OrderDetail from '@/components/Order/OrderDetail';
import OrderPay from '@/components/Order/OrderPay';
import Suggestion from '@/components/Suggestion/Suggestion';
import Login from '@/components/Login';
import MallInvitation from '@/components/UserInvitation/MallInvitation';
import QrCode from '@/components/UserInvitation/QrCode';
import ActivityCode from '@/components/UserInvitation/ActivityCode';
import Coupon from '@/components/User/Coupon';
import Search from '@/components/Search/Search';
import Collection from '@/components/Collection/Collection';
import LuckDraw from '@/components/LuckDraw/LuckDraw';
import Distribution from '@/components/Distribution/Distribution';
import NationalActivity from '@/components/UserInvitation/NationalActivities/national';
import NationalActivityRules from '@/components/UserInvitation/NationalActivities/ActivityRules';
import NationalActivityInvitedList from '@/components/UserInvitation/NationalActivities/InvitedList';
import NationalActivityPoster from '@/components/UserInvitation/NationalActivities/poster';
// 周年活动
import Anniversary from '@/components/Anniversary/Anniversary';
import Integral from '@/components/Anniversary/Integral';
import Rule from '@/components/Anniversary/Rule';
import Invited from '@/components/Anniversary/Invited';
import HelpedList from '@/components/Anniversary/HelpedList';
import ConversionPrize from "@/components/Anniversary/ConversionPrize";
import Member from '@/components/User/Member';
import MemberRule from "@/components/User/MemberRule";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/index',
      component: Index,
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/countries',
      name: 'countries',
      component: Countries,
      meta: {
        keepAlive: true,
        isBack: false,
      },
    },
    {
      path: '/:hashid/commodity',
      name: 'commodity',
      component: CommodityDetail,
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
    },
    {
      path: '/usercenter',
      name: 'usercenter',
      component: UserCenter,
    },
    {
      path: '/user/auth',
      name: 'userauth',
      component: UserAuth,
    },
    {
      path: '/user/member',
      name: 'member',
      components: Member,
    },
    {
      path: '/user/member_rule',
      name: 'member_rule',
      components: MemberRule,
    },
    {
      path: '/user/redpack',
      name: 'redpack',
      component: RedPacket,
    },
    {
      path: '/user/saltegg',
      name: 'saltegg',
      component: SaltEgg,
    },
    {
      path: '/attr/:hashid',
      name: 'attribute',
      component: Attribute,
      children: [
        {
          path: 'topic',
          name: 'topic',
          component: Topic,
        },
        {
          path: 'plate',
          name: 'plate',
          component: Plate,
        },
        {
          path: 'category',
          name: 'category-list',
          component: Category,
        },
      ],
    },
    {
      path: '/address',
      name: 'address',
      component: AddressList,
    },
    {
      path: '/address/add',
      name: 'add-address',
      component: AddressAdd,
    },
    {
      path: '/address/:hashid/edit',
      name: 'edit-address',
      component: AddressEdit,
    },
    {
      path: '/:from/:commodities/ordersettle',
      name: 'order-settle',
      component: OrderSettle,
    },
    {
      path: '/:type/orderlist',
      name: 'order-list',
      component: OrderList,
    },
    {
      path: '/:hashid/orderdetail',
      name: 'order-detail',
      component: OrderDetail,
    },
    {
      path: '/:hashid/orderpay',
      name: 'orderpay',
      component: OrderPay,
    },
    {
      path: '/suggestion',
      name: 'suggestion',
      component: Suggestion,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/mallInvitation',
      name: 'mallInvitation',
      // component: lazyImport('national', 'UserInvitation/NationalActivities/national')
      component: MallInvitation,
    },
    {
      path: '/qrCode',
      name: 'qrCode',
      component: QrCode,
    },
    {
      path: '/activityCode',
      name: 'activityCode',
      component: ActivityCode,
    },
    {
      path: '/:type/coupon',
      name: 'coupon',
      component: Coupon,
    },

    {
      path: '/search',
      name: 'search',
      component: Search,
      meta: {
        keepAlive: true,
        isBack: false,
      },
    },
    {
      path: '/collection',
      name: 'collection',
      component: Collection,
    },
    {
      path: '/luckDraw',
      name: 'luckDraw',
      component: LuckDraw,
    },
    {
      path: '/distribution',
      name: 'distribution',
      component: Distribution,
    },

    // 国庆活动页面
    {
      path: '/national',
      name: 'national',
      // component: lazyImport('mallInvitation', 'UserInvitation/MallInvitation')
      component: NationalActivity,
    },
    // 活动规则
    {
      path: '/activityrules',
      name: 'activityrules',
      component: NationalActivityRules,
    },
    // 被邀请人列表
    {
      path: '/invitedlist',
      name: 'invitedlist',
      component: NationalActivityInvitedList,
    },
    // 海报页面
    {
      path: '/poster',
      name: 'poster',
      component: NationalActivityPoster,
    },
    // 周年活动
    {
      path: '/anniversary',
      name: 'anniversary',
      component: Anniversary,
    },
    {
      path: '/anniversary/integral',
      name: 'integral',
      component: Integral,
    },
    {
      path: '/anniversary/rule',
      name: 'rule',
      component: Rule,
    },
    {
      path: '/anniversary/invited/:code',
      name: 'invited',
      component: Invited,
    },
    {
      path: '/anniversary/list',
      name: 'helpedlist',
      component: HelpedList,
    },
    {
      path: '/anniversary/conversionprize/:index',
      name: 'conversionprize',
      component: ConversionPrize,
    },
  ],
});

export default router;
