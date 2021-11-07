interface IIntegralLogResponse {
  pageInfo: string;
  items: IIntegralLogItemData[];
}

interface IIntegralLogItemData {
  // 流水 ID
  id: number;
  // 交易后余额
  balacneAfter: number;
  // 积分类型
  pointType: number;
  // 流水金额
  dealAmount: number;
  // 交易类型
  dealType: 1 | 2 | 3;
  // 交易描述
  dealDesc: string;
  // 交易时间戳，秒
  dealTime: number;
}

// note: 积分交易
interface IIntegralExchangeListItemData {
  orderId: number; // 订单ID
  orderAmount: number; // 订单总金额
  payAmount: number; // 支付总额
  orderTime: number; // 兑换时间戳
  orderStatus: number;

  // 商品列表（历史快照）
  goodsList: {
    goodsSnapshotId: number; // 商品历史快照ID
    goodsId: number; // 原商品ID
    goodsType: number; // 类型：1 AMS礼包单 2 CDKey
    goodsName: string;
    desc: string;
    actUrl: string;
    cover: string; // 列表小图
  }[];

  // 交易状态消息
  dealMsg: string;

  // 发货地址（或者游戏区服）
  addr: {
    type: number;
    info: string;
  };
  // 物流
  logistics: {
    type: number; // 类型
    expressName: string;
    expressId: string; // 快递单号
    statusTxt: string; // 当前状态
  };
}

interface IIntegralGoodsListItemData {
  goodsId: number; // 商品ID
  goodsType: number; // 商品类型 1 礼包单 2 CDKey
  goodSubType: string; // 子类型
  goodsName: string;
  cover: string; // 列表小图
  price: number; // 兑换所需积分
  stock: number; // 库存
  tips: string;
  orderWeight: number;
  limitText: string;
  stockoutText: string;
  dealSuccessText: string;
  dealFailText: string;
  // 商品状态码
  // 10 正常可兑换
  // 20 已下架
  // 40 即将发售
  // 80 库存不足
  // 81 用户日限
  // 82 用户总限
  // 83 用户周限
  // 84 用户月限
  showStatus: 10 | 20 | 40 | 80 | 81 | 82 | 83 | 84;
  userBuyLimitType: number; // 用户限量：类型
  userBuyCount: number; // 用户限量：已购买的数量
  userBuyLimit: number; // 用户限量：限制的总数量

  siteLimitType: 1 | 0; // 站点限量：类型(0、不限量 1日限)
  siteSellCount: number; // 站点限量：已售卖数量
  siteLimitNum: number; // 站点限量：总数
  beginTime: string;
  endTime: string;
  createdAt: string;
}

interface IIntegralGoodsListResponse {
  items: IIntegralGoodsListItemData[];
  pageInfo: string;
}

/**
 * note: 积分站接口
 */
interface IIntegralUserProfile {
  nickname: string; // 用户名
  openid: string;
  headimg: string;
  pointAmount: number; // 积分总额（累积赚取积分总数）
  pointBalance: number; // 积分余额（兑换礼品会扣积分）
  levelTitle: string; // 等级title
  levelId: number; // 等级ID
}

interface ITaskListItemData {
  // 按钮文案
  btnTxt: string;
  cdTimeSec: number;
  // 该参数已废弃
  chances: number;
  icon: string;
  // 刷新周期， 任务次数限制计数器，
  limitCounter: {
    total: number; // 总共可以执行的次数(总数)
    value: number; // 已经执行的次数(当前)
  };
  //
  orderWeight: number;
  // 积分金额
  pointAmount: number;
  position: number;
  // 任务描述
  taskDesc: string;
  // 任务 id
  taskId: number;
  // 任务名字
  taskName: string;
  taskScheme: {
    // 0 : 表示前端无需操作
    // 1 : 点击按钮立刻调用做任务接口， 2： 点击按钮跳转外链，在跳转之前先调用任务接口， 3： 点击按钮直接跳转第三方外链（不调用做任务接口）
    // 4： 点击按钮弹窗（公号事件），5： 点击按钮跳转外链，在第三方页面停留， 此时 scheme  的值为url， 第三方页面需要的参数在param里，7： 查看邀请码
    action: 0 | 1 | 2 | 3 | 4 | 5 | 7;
    // 1 永久 2 任务未完成时可执行
    actionType: 1 | 2;
    param: {
      timeOnPage: number;
    };
    scheme: string;
  };
  // 任务状态： 1 未完成，2 已完成，3 待领取
  taskStatus: 1 | 2 | 3;
  taskSubType: number;
  // 1 手动任务，2 第三方任务，4 微信事件任务，8，微社区事件，16，网页事件，32，游戏内事件
  taskType: 1 | 2 | 4 | 8 | 16 | 32;
}

interface IIntegralTaskAwardResData {
  prize: {
    orderId: number;
    goodsId: number;
    dealMsg: string;
    status: number;
    havePrize: number;
    point: number;
  };
  task: ITaskListItemData;
}
