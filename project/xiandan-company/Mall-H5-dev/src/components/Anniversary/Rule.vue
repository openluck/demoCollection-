<template>
  <div class="rule">
    <img :src="bar" alt="img" class="bar-img"/>
    <div class="rule-list first">
      <div class="rule-title">《闲蛋商城一周年活动规则》</div>
      <div class="title">
        <span>/////</span>
        <div>活动时间</div>
        <span>/////</span>
      </div>
      <p>
        <span>1.</span>
        本期活动时间为2020年6月1日 00:00:00 — 6月7日 23:59:59。(本期活动结束后，闲蛋商城将根据实际活动情况，在闲蛋电商公众号公布新的活动时间和具体活动规则)
      </p>
      <div class="title">
        <span>/////</span>
        <div>活动内容</div>
        <span>/////</span>
      </div>
      <p>
        <span>1.</span>
        本期活动时间为2020年6月1日 00:00:00 — 6月7日 23:59:59。(本期活动结束后，闲蛋商城将根据实际活动情况，在闲蛋电商公众号公布新的活动时间和具体活动规则)
      </p>
      <p>
        <span>2.</span>
        活动期间，闲蛋商城会员可通过使用活动链接、微信、朋友圈等途径，将活动页面分享给好友，并邀请好友助力获得助力分值，助力好友需注册成为闲蛋商城会员并点击助力链接，即助力成功。
      </p>
      <p>
        <span>3.</span>
        活动期间闲蛋商城会员可根据助力分值兑换相应奖品，同一用户奖品只能兑换一次，助力分值和兑换的奖品可在活动页面进行查看。
      </p>
      <p>
        <span>4.</span>
        同一用户，只能为同一助力邀请助力一次。
      </p>
      <div class="line">
        <img :src="line" alt="img"/>
        <img :src="line" alt="img"/>
      </div>
    </div>
    <div class="rule-list">
      <div class="title">
        <span>/////</span>
        <div>活动奖品</div>
        <span>/////</span>
      </div>
      <p>
        <span>第一关：</span>
        3分，可兑换5元闲蛋红包，新用户助力得1分，老用户助力得1分。
      </p>
      <p>
        <span>第二关：</span>
        7分，可兑换大创美白精华30ml一瓶，新用户助力得2分，老用户助力得1分。
      </p>
      <p>
        <span>第三关：</span>
        25分，可兑换OPERA薏仁水500ml一瓶，新用户助力得3分，老用户助力得1分。
      </p>
      <p>
        <span>第四关：</span>
        46分，可兑换SANA豆乳水乳一套，新用户助力得3分，老用户助力得1分。
      </p>
      <p>
        <span>第五关：</span>
        150分，可兑换安耐晒小金瓶防晒霜90ml一瓶，新用户助力得4分，老用户助力得1分。
      </p>
      <p>
        <span>第六关：</span>
        500分，可兑换500元现金红包，新用户助力得5分，老用户助力得1分。
      </p>
      <p>
        <span>第七关：</span>
        1300分，可兑换1000元现金红包，新用户助力得6分，老用户助力得1分。
      </p>
      <div class="line">
        <img :src="line" alt="img"/>
        <img :src="line" alt="img"/>
      </div>
    </div>
    <div class="rule-list">
      <div class="title">
        <span>/////</span>
        <div>参与资格</div>
        <span>/////</span>
      </div>
      <p>
        <span>1.</span>
        参与活动者需为闲蛋商城注册会员
      </p>
      <p>
        <span>2.</span>
        兑换奖品必须完成闲蛋商城实名认证，避免虚假交易、作弊、恶意套取等行为
      </p>
      <p>
        <span>3.</span>
        如用户出现违规行为( 如虚假交易、作弊、恶意套取现金、刷信等)，闲蛋商城将撤销用户的活动参与资格，并有权撤销违规奖励，回收用户已经获得的奖品，必要时追究法律责任
      </p>
      <p>
        <span>4.</span>
        同一微信号、身份证、手机号、手机设备，符合以上任一条件，均视为同一用户
      </p>
      <p>
        <span>5.</span>
        本活动最终解释权归闲蛋电商所有
      </p>
      <div class="title">
        <span>/////</span>
        <div>其他说明</div>
        <span>/////</span>
      </div>
      <p>
        <span>1.</span>
        本次活动奖品，均由闲蛋商城出资提供，用户无需承担任何费用（实物奖品需中奖用户在闲蛋商城下单支付0.01元），所有实物奖品均包邮寄出。
      </p>
      <p>
        <span>2.</span>
        活动结束后，中奖名单将在闲蛋电商公众号公布，工作人员将在活动结束后5个工作日内联系中奖者，确认邮寄信息。
      </p>
    </div>
  </div>
</template>

<script>
'use strict';

import bar from '../../../images/icon/bar.png';
import line from '../../../images/icon/line.png';

export default {
  name: "rule",
  data() {
    return {
      bar,
      line,
    }
  },
}
</script>

<style scoped type="text/scss">
.rule{
  background:rgba(255,212,178,1);
  padding: 18px 5px;
  .bar-img{
    width: 100%;
  }
  .rule-list{
    /*position: relative;*/
    z-index: 3;
    background: #ffffff;
    padding: 16px;
    margin: 12px 7px 0 7px;
    border-radius: 6px;
    .rule-title{
      color:rgba(242,104,53,1);
      font-size: 18px;
      text-align: center;
      font-weight: bold;
    }
    .title{
      display: flex;
      justify-content: center;
      font-size:13px;
      font-family:Alibaba PuHuiTi;
      font-weight:400;
      color:rgba(242,104,53,1);
      margin: 15px 0 10px 0;
      div{
        font-size: 16px;
        margin: -2px 6px 0 6px;
        font-weight: bold;
      }
    }
    p{
      font-size:13px;
      font-family:PingFang SC;
      font-weight:800;
      color:#333333;
      line-height:28px;
      span{
        color: #F26835;
      }
    }
    .line{
      position: absolute;
      display: flex;
      justify-content: space-between;
      width: calc(100% - 50px);
      margin-top: -5px;
      z-index:5;
      img{
        width: 12px;
        display: block;
        height: 57px;
      }
    }
  }
  .first{
    position: relative;
    z-index:3;
    margin: -17px 7px 0px 7px;
    border-radius:0px 0px 12px 12px;
    padding: 30px 16px 16px 16px;
  }
}
</style>