<template>
  <div class="news">
    <div class="recommendPage">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide
          ><img src="../../assets/img/banner1.jpg" alt=""
        /></swiper-slide>
        <swiper-slide
          ><img src="../../assets/img/banner2.jpg" alt=""
        /></swiper-slide>
        <swiper-slide
          ><img src="../../assets/img/banner3.jpg" alt=""
        /></swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
    <div class="list-con">
      <div class="news-list">
        <h5 class="today-title">今天头条</h5>
        <ul>
          <li v-for="item in newsList" :key="item.id">
            <a href="javascript:;">
              <span class="info">{{ item.info }}</span>
              <span class="time">{{ item.time }}</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="news-list">
        <h5 class="today-title">热点新闻</h5>
        <ul>
          <li v-for="item in hotNewsList" :key="item.id">
            <a href="javascript:;">
              <span class="info">{{ item.info }}</span>
              <span class="time">{{ item.time }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 引入插件
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

export default {
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false,
        },
        // 显示分页
        pagination: {
          el: ".swiper-pagination",
          clickable: true, //允许分页点击跳转
        },
        // 设置点击箭头
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      newsList: [], // 新闻列表
      hotNewsList: [], // 热点列表
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
  },
  mounted() {
    // current swiper instance
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
    console.log("this is current swiper instance object", this.swiper);
    // this.swiper.slideTo(3, 1000, false);
    this.getNewsList();
    this.getHotNews();
  },
  methods: {
    // 获取新闻列表
    getNewsList() {
      this.$http({
        method: "get",
        url: this.$util.baseUrl + "users/todayNews",
      }).then((res) => {
        if (res.data.code === "200") {
          this.newsList = res.data.data;
        } else {
          console.log(res);
        }
      });
    },
    // 获取热点新闻
    getHotNews() {
      this.$http({
        method: "get",
        url: this.$util.baseUrl + "users/hotNews",
      }).then((res) => {
        if (res.data.code === "200") {
          this.hotNewsList = res.data.data;
        } else {
          console.log(res);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.news {
  height: 80vh;
  overflow-y: hidden;
  .recommendPage .swiper-container {
    position: relative;
    width: 100%;
    height: 400px;
  }

  .recommendPage .swiper-container .swiper-slide {
    width: 100%;
    color: #000;
    font-size: 16px;
    text-align: center;
  }

  .list-con {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .news-list {
    font-size: 16px;
    .today-title {
      height: 35px;
      line-height: 35px;
      padding: 1px 10px 20px 20px;
      font-size: 20px;
      background: #fff url("../../assets/img/tit-r.gif") no-repeat;
    }

    .info {
      display: inline-block;
      width: 450px;
    }
    .time {
    }
  }
}
</style>

