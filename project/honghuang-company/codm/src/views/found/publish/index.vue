<template>
  <div class="publish-page">
    <!-- 发布按钮 -->
    <div class="total-title">
      <span>发布动态</span>
      <!-- 发布成功之后，加on 类名 -->
      <span
        v-report="'dynamic.release'"
        :class="`publish-btn ${content || uploadImgs.length > 0 ? 'on': ''}`"
        @click.stop="submitDynamic"
      ><i>发布</i></span>
    </div>
    <!-- 发布页面 -->
    <div class="art-all">
      <div class="write-bock">
        <textarea
          v-model="content"
          class="public-area"
          placeholder="快说说今天的新鲜事吧..."
          @touchmove.stop
        />
        <i class="horn1 horn" />
        <i class="horn2 horn" />
        <i class="horn3 horn" />
        <i class="horn4 horn" />
        <!-- 选择完的话题，最多4个吧 -->
        <ul
          v-if="topicList.length > 0"
          class="seled-topic"
        >
          <li
            v-for="item in topicList"
            :key="item.topicid"
          >
            <span>#</span>
            <span class="topic-tit">{{ item.name }}</span>
            <img
              :src="convertImgExt('found/close-topic.png')"
              @click.stop="handleDeleteTopicIcon"
            >
            <span>、</span>
          </li>
        </ul>
      </div>
      <div class="sec-sed">
        <div
          v-if="uploadImgs.length < imgMax"
          v-report="'dynamic.choose-photo'"
          class="sel-img"
        >
          <img
            :src="convertImgExt('found/img-icon.png')"
          >
          <span>选择图片</span>
          <i class="horn1 horn" />
          <i class="horn2 horn" />
          <i class="horn3 horn" />
          <i class="horn4 horn" />
          <input
            ref="inputRef"
            type="file"
            accept="image/*"
            :disabled="uploadImgs.length >= imgMax"
            @change="selectImages"
          >
        </div>
        <div
          v-if="topicList.length < 1"
          v-report="'dynamic.add-topic'"
          class="add-ht"
          @click.stop="handleAddTopic"
        >
          <!-- <span class="jh"></span> -->
          <img
            class="jh"
            :src="convertImgExt('found/mes-icon.png')"
          >
          <span>添加话题</span>
          <i class="horn1 horn" />
          <i class="horn2 horn" />
          <i class="horn3 horn" />
          <i class="horn4 horn" />
        </div>
      </div>
      <ul
        v-if="uploadImgs.length > 0"
        class="image-list"
      >
        <li
          v-for="(item, index) in uploadImgs"
          :key="item.url"
          class="item"
        >
          <span
            v-if="!item.online"
            class="uploading-box"
          >
            <img
              :src="item.url"
              class="disabled"
            >
            <i class="mark" />
            <span
              class="loading-box"
              @click.stop="reUpload(index)"
            >
              <img
                v-if="item.error"
                class="reupload-icon"
                :src="convertImgExt('reupload-icon.png')"
              >
              <img
                v-else
                src="@/assets/img/loading-small.gif"
                class="loading"
              >
              <strong>{{ item.error ? '重新上传' : '上传中' }}</strong>
            </span>
          </span>
          <img
            v-else
            :src="item.online"
          >
          <img
            class="close-icon"
            :src="convertImgExt('found/del-img.png')"
            @click.stop="deleteImage(index)"
          >
          <i class="horn1 horn" />
          <i class="horn2 horn" />
          <i class="horn3 horn" />
          <i class="horn4 horn" />
        </li>
      </ul>
    </div>
    <!--  -->
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import 'styles/mixin.less';

.publish-page {
  .mx-size(100%);
  // padding-top: 0.2rem;
  // overflow-y: scroll;
  box-sizing: border-box;
  padding: 0 0.24rem 0 0.2rem;

  .total-title {
    .mx-size(100%, 0.77rem);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    span {
      color: #fff;
      font-size: 0.26rem;
      text-align: center;
    }

    .publish-btn {
      color: d1d1d1;
      font-size: 0.22rem;
      text-align: center;
      position: absolute;
      right: 0;
      top: (-0.35/2) rem;
      transform: translateY((-0.35/2) rem);
      padding: 0.08rem;

      &.on {
        color: #000;
        // border-radius: 4px;

        i {
          background: #ffed57;
        }
      }

      i {
        display: inline-block;
        .mx-size(1rem, 0.35rem);
        background: #9a9a9a;
        font-style: normal;
        padding: 0.05rem;
      }
    }
  }

  .art-all {
    .mx-size(100%, calc(100vh - 0.92rem));
    // padding: 0.15rem;
    box-sizing: border-box;
    // border: 0.01rem solid #404651;
    margin-top: 0.15rem;
    overflow-y: scroll;
    padding-bottom: 0.2rem;
    overflow-x: hidden;

    .write-bock {
      .mx-size(100%, 2.2rem);
      position: relative;
      background-color: #2a313b;
      .mx-horn(0.05rem, #a3a7ad);
      border: 1px solid #464f5b;
      box-sizing: border-box;

      textarea {
        .mx-size(100%, 70%);
        border: 0;
        outline: none;
        color: #ddd;
        background-color: #2a313b;

        font-size: 0.2rem;
        padding: 0.2rem 0.2rem 0;
        box-sizing: border-box;
        resize: none;

        &::-webkit-input-placeholder {
          color: #fff;
        }
      }

      .seled-topic {
        display: flex;
        color: #ffed57;
        font-size: 0.22rem;
        padding: 0 0.2rem;
        align-items: center;

        li {
          display: flex;
          align-items: center;

          img {
            .mx-size(0.24rem);
            margin-left: 0.05rem;
          }
        }
      }
    }

    .sec-sed {
      .mx-size(100%, auto);
      display: flex;
      margin-top: 0.08rem;

      .sel-img {
        .mx-size(2.26rem, 0.77rem);
        background: #2b333d;
        margin-right: 0.15rem;
        color: #ddd;
        font-size: 0.22rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .mx-horn(0.05rem, #a3a7ad);

        span {
          margin-left: 0.13rem;
        }

        input {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          .mx-size(100%);
          opacity: 0;
        }
      }

      img {
        .mx-size(0.48rem, 0.44rem);
      }

      .add-ht {
        position: relative;
        .mx-horn(0.05rem, #a3a7ad);
        color: #ddd;
        font-size: 0.22rem;
        display: flex;
        justify-content: center;
        align-items: center;
        .mx-size(2.26rem, 0.77rem);
        background-color: #2a313b;

        .jh {
          // font-size: 0.4rem;
          display: inline-block;
          // background: url(./asserts/img/found/mes-icon.png);
          .mx-size(0.58rem);
        }

        span {
          margin-left: 0.05rem;
        }
      }
    }
  }
}

.image-list {
  display: flex;
  margin-top: 0.25rem;
  flex-wrap: wrap;
  .mx-size(100%, auto);

  li.item {
    // .mx-size(1.6rem);
    .mx-size(12.6%, 1.6rem);
    border: 1px solid #464f5b;
    position: relative;
    margin-right: 0.15rem;
    margin-bottom: 0.1rem;
    .mx-horn(0.05rem, #a3a7ad);

    .uploading-box {
      .mx-size(100%);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;

      .loading-box {
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .reupload-icon {
          .mx-size(0.6rem);
          position: unset;
        }
      }

      .loading {
        .mx-size(0.8rem);
        top: 50%;
        left: 50%;
        transform: translate(-0.4rem, -0.4rem);
        z-index: 4;
      }
    }

    .mark {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 4px;
      .mx-size(100%);
      background: rgba(0, 0, 0, 0.5);
    }

    img {
      .mx-size(100%);
      position: absolute;
      top: 0;
      left: 0;
    }

    .close-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      left: auto;
      top: auto;
      z-index: 30;
      .mx-size(0.25rem);
    }
  }

  strong {
    font-size: 0.24rem;
    color: #fff;
  }

  .close-icon {
    .mx-size(0.16rem);
  }
}

.talk-con-box {
  display: flex;
  .mx-size(100%, 12%);
  .mx-horn(0.05rem, #fff);
  margin-top: 0.16rem;
  margin-bottom: 0.16rem;
}
</style>

