<template>
  <!-- 直方图 -->
  <ul class="data-ul">
    <li class="data-li">
      <span>伤害</span>
      <div class="progress">
        <p class="progress-num" :style="parseNumber(detail.wqszshAd)">
          <i class="progress-i" />
        </p>
      </div>
    </li>
    <li class="data-li">
      <span>射速</span>
      <div class="progress">
        <p class="progress-num" :style="parseNumber(detail.wqszss17)">
          <i class="progress-i" />
        </p>
      </div>
    </li>
    <li class="data-li">
      <span>精准度</span>
      <div class="progress">
        <p class="progress-num" :style="parseNumber(detail.wqszjzD0)">
          <i class="progress-i" />
        </p>
      </div>
    </li>
    <li class="data-li">
      <span>机动性</span>
      <div class="progress">
        <p class="progress-num" :style="parseNumber(detail.wqszydxD9)">
          <i class="progress-i" />
        </p>
      </div>
    </li>
    <li class="data-li">
      <span>射程</span>
      <div class="progress">
        <p class="progress-num" :style="parseNumber(detail.wqszscB6)">
          <i class="progress-i" />
        </p>
      </div>
    </li>
    <li class="data-li">
      <span>控制</span>
      <div class="progress">
        <p class="progress-num" :style="parseNumber(detail.wqszkz60)">
          <i class="progress-i" />
        </p>
      </div>
    </li>
  </ul>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less">
@import 'styles/mixin.less';

.data-ul {
  .mx-size(50%, 100%);

  .data-li {
    // .mx-size(100%, 16%);
    .mx-size(100%, auto);
    display: flex;
    flex-direction: column;

    span {
      color: #fff;
      font-size: 0.16rem;
      text-align: left;
      position: relative;

      &::before {
        content: '';
        width: 0;
        height: 0;
        border-left: 0.05rem solid #fff;
        border-top: 0.03rem solid transparent;
        border-right: 0.05rem solid transparent;
        border-bottom: 0.03rem solid transparent;
        position: absolute;
        left: -0.1rem;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .progress {
      .mx-size(100%, 0.04rem);
      background-color: #29313a;
      position: relative;

      .progress-num {
        .mx-size(100%, 100%);
        background-color: #f9e655;
        position: absolute;
        top: 0;
        left: 0;

        .progress-i {
          .mx-size(0.05rem, 230%);
          background-color: #f9e655;
          position: absolute;
          top: 40%;
          transform: translateY(-50%);
          right: 0;
        }
      }
    }
  }
}
</style>
