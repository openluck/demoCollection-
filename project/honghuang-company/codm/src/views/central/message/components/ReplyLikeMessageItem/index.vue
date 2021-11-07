<template>
  <li class="dz-li">
    <div class="dz-userinfo">
      <div class="user-info-box">
        <div class="dz-usertx">
          <img :src="userAvatar | convertHttps">
        </div>
        <span class="user-name">{{ data.sndName || data.nickName || '匿名用户' }}</span>
        <span class="time">{{ (data.msgTime * 1000) | timeFormat }}</span>
      </div>
      <span
        v-if="type === 'reply'"
        class="comment-item-operate-icon"
        @click.stop="handleJump(data.id)"
      >
        回复
      </span>
    </div>
    <p
      class="dz-tit"
      v-html="content"
    />
    <div
      v-if="data.pic"
      class="dynamic-img"
      @click.stop="handleJump(data.id)"
    >
      <img
        :src="data.pic | convertHttps"
        :big-img="data.pic | convertHttps"
      >
    </div>
    <div
      v-if="data.title || data.dynamicContent || data.replyContent"
      class="dz-conbox"
      @click.stop="handleJump(data.id)"
    >
      <div
        v-if="data.replyContent"
        class="ig-me"
      >
        <span>我：</span>
        <span v-html="formatContent(data.content)" />
      </div>
      <p v-if="data.title || data.dynamicContent">
        {{ data.title || data.dynamicContent }}
      </p>
      <i class="horn1 horn" />
      <i class="horn2 horn" />
      <i class="horn3 horn" />
      <i class="horn4 horn" />
    </div>
    <i class="horn1 horn" />
    <i class="horn2 horn" />
    <i class="horn3 horn" />
    <i class="horn4 horn" />
  </li>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';
@import 'styles/common.less';

.dz-li {
  width: 100%;
  display: inline-block;
  background-color: #2c343f;
  margin-bottom: 0.27rem;
  padding: 0.08rem;
  box-sizing: border-box;
  border: 0.01rem solid #4d5965;
  position: relative;
  .mx-horn(0.1rem, #a3a7ad);

  .dz-userinfo {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .dz-usertx {
      .com-head();

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .dz-usertit {
      color: #c5c5c5;
      font-size: 0.24rem;
      margin-left: 0.1rem;

      span {
        color: #fff;
      }
    }
  }

  .dz-tit {
    font-size: 0.22rem;
    color: #fff;
    text-align: left;
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
  }

  .dz-conbox {
    width: 100%;
    // 修改评论的样式
    height: auto;
    // max-height: 0.72rem;
    background: url(https://gzhcos.qq.com/codm/central/pl-con.png) no-repeat right/cover;
    padding: 0.08rem 0.45rem 0.08rem 0.2rem;
    box-sizing: border-box;
    position: relative;
    .mx-horn(0.05rem, #a3a7ad);
    // line-height: 0.59rem;
    margin-top: 0.1rem;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;

    .ig-me {
      color: #fff;
      font-size: 0.2rem;
    }

    p {
      font-size: 0.18rem;
      text-align: left;
      color: #fff;
      .multi-line(2);
    }
  }

  .dynamic-img {
    width: 1rem;
    height: 1rem;

    img {
      .mx-size(100%);
    }
  }
}

.user-info-box {
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
}

.comment-item-operate-icon {
  color: #fff;
  font-size: 0.2rem;
  padding: 0.1rem 0.3rem;
  display: inline-block;
  border: 0.5px solid rgb(73, 71, 71);
  border-radius: 2px;
}

span.user-name {
  font-size: 0.2rem;
  padding-left: 0.2rem;
}

span.time {
  font-size: 0.2rem;
  padding-left: 0.2rem;
}
</style>
